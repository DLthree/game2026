import { Player, Enemy, Projectile, WaveBanner, Currency, Boss } from '../entities/index.js';
import { InputSystem, CollisionSystem, RenderSystem, VisualStyle, WaveSystem } from '../systems/index.js';
import { 
  SPLITTER_MIN_CHILDREN, 
  SPLITTER_MAX_CHILDREN,
  SPLITTER_CHILD_HEALTH_MULTIPLIER,
  SPLITTER_CHILD_SPEED_MULTIPLIER,
  SPLITTER_CHILD_DAMAGE_MULTIPLIER,
  SPLITTER_CHILD_MIN_SPEED,
  SPLITTER_CHILD_MAX_SPEED
} from '../entities/EnemyConfig.js';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER_SPEED,
  PLAYER_START_HEALTH,
  PLAYER_MAX_HEALTH,
  BULLET_RANGE,
  BULLET_SPEED,
  AUTO_SHOOT_RANGE,
  AUTO_SHOOT_INTERVAL,
  WAVE_COMPLETE_HEALTH_REWARD,
  ENEMY_GOLD_DROP,
  BANNER_BOUNCE_MULTIPLIER,
  BANNER_BASE_PUSH_FORCE,
  TAP_MOVE_STOP_DISTANCE,
  MOVEMENT_VELOCITY_THRESHOLD,
  TRAIL_SPAWN_PROBABILITY
} from '../data/gameConfig.js';
import { EnemySpawner } from './EnemySpawner.js';
import { BossManager } from './BossManager.js';
import { CurrencyManager } from './CurrencyManager.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.enemies = [];
    this.projectiles = [];
    this.currencies = [];
    this.waveBanner = null;
    this.bossSpawned = false;
    
    this.score = 0;
    this.health = PLAYER_START_HEALTH;
    this.maxHealth = PLAYER_MAX_HEALTH;
    this.isGameOver = false;
    this.isPaused = false;
    this.waveCompleteShown = false;
    this.isVictory = false;
    
    this.lastEnemySpawn = 0;
    this.lastShot = 0;
    this.lastTime = 0;

    // Initialize managers
    this.enemySpawner = new EnemySpawner();
    this.currencyManager = new CurrencyManager();

    // Initialize systems
    this.inputSystem = new InputSystem(canvas, () => this.handleRestart(), (x, y) => this.handleTouchEffect(x, y));
    this.collisionSystem = new CollisionSystem();
    this.renderSystem = new RenderSystem(canvas);
    this.waveSystem = new WaveSystem();

    // Initialize player
    this.player = new Player(canvas.width / 2, canvas.height / 2);

    // Get UI elements
    this.scoreElement = document.getElementById('score');
    this.healthElement = document.getElementById('health');
    this.gameOverElement = document.getElementById('gameOver');
    this.waveElement = document.getElementById('wave');
    this.waveTimeElement = document.getElementById('waveTime');
    
    // Initialize boss manager with UI elements
    this.bossManager = new BossManager(
      document.getElementById('bossHealthContainer'),
      document.getElementById('bossHealthBar'),
      document.getElementById('bossHealthText')
    );
    
    // Setup event delegation for victory buttons
    this.gameOverElement.addEventListener('click', (e) => {
      if (e.target.id === 'victorySkillTreeButton') {
        const skillTreeContainer = document.getElementById('skillTreeContainer');
        if (skillTreeContainer) {
          skillTreeContainer.classList.add('visible');
        }
      } else if (e.target.id === 'victoryRestartButton') {
        this.handleRestart();
      }
    });

    // Setup canvas resize
    this.setupResize();
    
    // Start with wave banner
    this.showWaveBanner();
  }

  setupResize() {
    const resize = () => {
      const scale = Math.min(
        window.innerWidth / CANVAS_WIDTH,
        window.innerHeight / CANVAS_HEIGHT,
        1
      );
      this.canvas.width = CANVAS_WIDTH;
      this.canvas.height = CANVAS_HEIGHT;
      this.canvas.style.width = `${CANVAS_WIDTH * scale}px`;
      this.canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
      
      // Update render system canvas sizes
      this.renderSystem.updateCanvasSize();
    };
    
    resize();
    window.addEventListener('resize', resize);
  }

  handleRestart() {
    if (!this.isGameOver && !this.isVictory) return;

    this.player.reset(this.canvas.width / 2, this.canvas.height / 2);
    this.enemies = [];
    this.projectiles = [];
    this.currencies = [];
    this.waveBanner = null;
    this.bossManager.clear();
    this.bossSpawned = false;
    this.score = 0;
    this.health = this.maxHealth;
    this.isGameOver = false;
    this.isVictory = false;
    this.waveCompleteShown = false;
    this.lastEnemySpawn = 0;
    this.lastShot = 0;
    this.gameOverElement.style.display = 'none';
    
    this.bossManager.hideHealthBar();
    
    // Restart wave system
    this.waveSystem.restart();
    this.showWaveBanner();
  }
  
  /**
   * Handle touch/click effect by deforming the background grid
   * @param {number} x - X coordinate of the touch/click
   * @param {number} y - Y coordinate of the touch/click
   */
  handleTouchEffect(x, y) {
    // Don't create effects during game over
    if (this.isGameOver) return;
    
    const gwRenderer = this.getGWRenderer();
    if (gwRenderer) {
      // Deform the background grid at touch point (similar to explosion effect)
      gwRenderer.deformGrid(x, y, 0.6);
    }
  }
  
  /**
   * Get the Geometry Wars renderer if the mode is active
   * @returns {Object|null} GeometryWarsRenderer instance or null
   */
  getGWRenderer() {
    const visualStyleSystem = this.renderSystem.getVisualStyleSystem();
    if (visualStyleSystem.getCurrentStyle() === VisualStyle.GEOMETRY_WARS) {
      return visualStyleSystem.getGeometryWarsRenderer();
    }
    return null;
  }
  
  /**
   * Check if player is dead and trigger game over
   */
  checkGameOver() {
    if (this.health <= 0) {
      this.isGameOver = true;
      this.gameOverElement.style.display = 'block';
      return true;
    }
    return false;
  }
  
  /**
   * Create collision impact effects for Geometry Wars mode
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} particleCount - Number of particles
   * @param {number} cameraShake - Camera shake intensity
   * @param {number} gridDeform - Grid deformation amount
   */
  createCollisionEffects(x, y, particleCount = 8, cameraShake = 0.5, gridDeform = 0.8) {
    const gwRenderer = this.getGWRenderer();
    if (gwRenderer) {
      gwRenderer.spawnImpactParticles(x, y, gwRenderer.colors.enemy, particleCount);
      gwRenderer.addCameraShake(cameraShake);
      gwRenderer.deformGrid(x, y, gridDeform);
    }
  }
  
  /**
   * Create explosion effects for Geometry Wars mode
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} color - Explosion color
   * @param {number} radius - Shockwave radius
   * @param {number} particleCount - Number of particles
   * @param {number} cameraShake - Camera shake intensity
   */
  createExplosionEffects(x, y, color, radius, particleCount = 25, cameraShake = 0.7) {
    const gwRenderer = this.getGWRenderer();
    if (gwRenderer) {
      gwRenderer.spawnExplosion(x, y, color, particleCount);
      gwRenderer.addShockwave(x, y, radius, color, 0.6);
      gwRenderer.addCameraShake(cameraShake);
    }
  }
  
  showWaveBanner() {
    const waveNumber = this.waveSystem.getCurrentWaveNumber();
    this.waveBanner = new WaveBanner(waveNumber, this.canvas.width, this.canvas.height);
  }
  
  showWaveComplete() {
    // Show wave complete modal with skill tree
    const waveCompleteElement = document.getElementById('waveComplete');
    waveCompleteElement.classList.add('visible');
    this.isPaused = true;
    this.waveCompleteShown = true;
  }
  
  hideWaveComplete() {
    const waveCompleteElement = document.getElementById('waveComplete');
    waveCompleteElement.classList.remove('visible');
  }

  update(dt) {
    if (this.isGameOver || this.isPaused) return;
    
    // Update wave system
    this.waveSystem.update(dt);
    
    // Update wave banner if active
    if (this.waveBanner) {
      this.waveBanner.update(dt);
      
      // Check for interaction with projectiles (knock banner around)
      for (const projectile of this.projectiles) {
        if (this.waveBanner.containsPoint(projectile.pos.x, projectile.pos.y)) {
          const forceX = projectile.vel.x * 0.5;
          const forceY = projectile.vel.y * 0.5;
          this.waveBanner.applyImpulse(forceX, forceY);
        }
      }
      
      // Remove banner when expired
      if (this.waveBanner.isExpired()) {
        this.waveBanner = null;
        
        // Spawn boss at the start of boss wave
        if (this.waveSystem.isBossWave() && !this.bossSpawned) {
          const wave = this.waveSystem.getCurrentWave();
          const bossScale = wave && wave.bossScale ? wave.bossScale : 1.0;
          this.bossManager.spawnBoss(this.canvas.width, this.canvas.height, bossScale);
          this.bossSpawned = true;
        }
      }
    }
    
    // Check if wave just completed
    if (this.waveSystem.isWaveComplete() && !this.waveCompleteShown) {
      this.showWaveComplete();
      return; // Pause game until player advances
    }

    // Update Geometry Wars renderer if active
    const gwRenderer = this.getGWRenderer();
    if (gwRenderer) {
      gwRenderer.update(dt, this);
    }

    // Update player movement
    const keyboardVel = this.inputSystem.getMovementVelocity(PLAYER_SPEED);
    const dragVel = this.inputSystem.getDragVelocity(this.player.pos, PLAYER_SPEED);
    const targetPos = this.inputSystem.getTargetPosition();

    // Check if keyboard is being used
    const keyboardActive = keyboardVel.x !== 0 || keyboardVel.y !== 0;
    
    if (keyboardActive) {
      // Keyboard input - clear any persisted drag velocity
      this.inputSystem.clearDragVelocity();
      this.player.vel = keyboardVel;
    } else if (dragVel) {
      // Drag input (active or persisted)
      this.player.vel.x = dragVel.x;
      this.player.vel.y = dragVel.y;
      
      // Apply friction when drag is not active (persisted velocity)
      const dragState = this.inputSystem.getDragState();
      if (!dragState.active) {
        this.inputSystem.applyFriction();
      }
    } else if (targetPos) {
      // Touch/mouse movement (old tap-to-move behavior, kept for backward compatibility)
      const dx = targetPos.x - this.player.pos.x;
      const dy = targetPos.y - this.player.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > TAP_MOVE_STOP_DISTANCE) {
        this.player.vel.x = (dx / dist) * PLAYER_SPEED;
        this.player.vel.y = (dy / dist) * PLAYER_SPEED;
      } else {
        this.player.vel.x = 0;
        this.player.vel.y = 0;
      }
    } else {
      // No input - stop
      this.player.vel.x = 0;
      this.player.vel.y = 0;
    }

    this.player.update(dt, this.canvas.width, this.canvas.height);
    
    // Spawn trail particles in Geometry Wars mode
    if (gwRenderer) {
      const moving = Math.abs(this.player.vel.x) > MOVEMENT_VELOCITY_THRESHOLD || 
                     Math.abs(this.player.vel.y) > MOVEMENT_VELOCITY_THRESHOLD;
      if (moving && Math.random() < TRAIL_SPAWN_PROBABILITY) {
        gwRenderer.spawnTrailParticle(this.player.pos.x, this.player.pos.y, gwRenderer.colors.player, 4);
      }
    }

    // Spawn enemies based on wave configuration
    const now = Date.now();
    if (this.waveSystem.shouldSpawnEnemy(now - this.lastEnemySpawn)) {
      this.lastEnemySpawn = now;
      this.spawnEnemy();
    }

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(dt, this.player.pos);

      // Check collision with player
      if (this.collisionSystem.checkPlayerEnemyCollision(this.player, enemy)) {
        this.health -= enemy.damage;
        this.enemies.splice(i, 1);
        
        // Handle bomber explosion on contact
        if (enemy.explosionRadius && enemy.explosionDamage) {
          this.health -= enemy.explosionDamage;
          this.createExplosionEffects(enemy.pos.x, enemy.pos.y, '#ff9800', enemy.explosionRadius, 25, 0.7);
        } else {
          // Regular collision effects
          this.createCollisionEffects(enemy.pos.x, enemy.pos.y, 8, 0.5, 0.8);
        }
        
        this.checkGameOver();
      }
    }

    // Update boss if active
    const boss = this.bossManager.getBoss();
    if (boss) {
      boss.update(dt, this.player.pos);
      
      // Check collision with player
      if (this.collisionSystem.checkPlayerEnemyCollision(this.player, boss)) {
        this.health -= boss.damage;
        this.createCollisionEffects(boss.pos.x, boss.pos.y, 12, 1.0, 1.5);
        
        if (this.checkGameOver()) {
          this.bossManager.hideHealthBar();
        }
      }
      
      this.bossManager.updateHealthBar();
    }

    // Auto-shoot projectiles (include boss as target)
    if (now - this.lastShot > AUTO_SHOOT_INTERVAL && (this.enemies.length > 0 || boss)) {
      this.lastShot = now;
      this.shootAtNearestEnemy();
    }

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update(dt);
      
      // Spawn trail particles in Geometry Wars mode
      if (gwRenderer && Math.random() < 0.5) {
        gwRenderer.spawnTrailParticle(projectile.pos.x, projectile.pos.y, gwRenderer.colors.projectile, 2);
      }

      // Remove if out of bounds
      if (projectile.isOutOfBounds(this.canvas.width, this.canvas.height)) {
        this.projectiles.splice(i, 1);
        continue;
      }

      // Check collision with enemies
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];
        
        if (this.collisionSystem.checkProjectileEnemyCollision(projectile, enemy)) {
          const isDead = enemy.takeDamage();
          this.projectiles.splice(i, 1);
          
          if (isDead) {
            this.handleEnemyDeath(enemy, j);
          }
          break;
        }
      }
      
      // Check collision with boss
      const boss = this.bossManager.getBoss();
      if (boss && this.collisionSystem.checkProjectileEnemyCollision(projectile, boss)) {
        const isDead = boss.takeDamage();
        this.projectiles.splice(i, 1);
        
        if (isDead) {
          const result = this.bossManager.handleBossDefeat(this.currencies, gwRenderer !== null, gwRenderer);
          if (result.victory) {
            this.triggerVictory();
          }
        }
        break;
      }
    }

    // Update currencies
    const pickedUp = this.currencyManager.updateCurrencies(
      this.currencies, 
      dt, 
      this.player.pos, 
      this.player.radius, 
      this.canvas
    );
    this.score += pickedUp;

    // Update UI
    this.scoreElement.textContent = this.score.toString();
    this.healthElement.textContent = Math.max(0, Math.floor(this.health)).toString();
    this.waveElement.textContent = this.waveSystem.getCurrentWaveNumber().toString();
    
    // Show full duration during banner, countdown during active wave
    let timeRemaining;
    if (this.waveSystem.isBannerActive()) {
      const wave = this.waveSystem.getCurrentWave();
      timeRemaining = wave ? wave.duration : 0;
    } else {
      timeRemaining = Math.ceil(this.waveSystem.getWaveTimeRemaining());
    }
    this.waveTimeElement.textContent = timeRemaining.toString();
  }

  spawnEnemy() {
    // Get enemy type from wave system
    const enemyType = this.waveSystem.getRandomEnemyType();
    const enemy = this.enemySpawner.spawnEnemy(this.canvas.width, this.canvas.height, enemyType);
    this.enemies.push(enemy);
  }

  shootAtNearestEnemy() {
    let nearestEnemy = null;
    let nearestDist = Infinity;

    for (const enemy of this.enemies) {
      const dx = enemy.pos.x - this.player.pos.x;
      const dy = enemy.pos.y - this.player.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < nearestDist) {
        nearestDist = dist;
        nearestEnemy = enemy;
      }
    }
    
    // Also check boss as potential target
    const boss = this.bossManager.getBoss();
    if (boss) {
      const dx = boss.pos.x - this.player.pos.x;
      const dy = boss.pos.y - this.player.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestEnemy = boss;
      }
    }

    // Only shoot if nearest enemy is within range
    if (nearestEnemy && nearestDist <= AUTO_SHOOT_RANGE) {
      const dx = nearestEnemy.pos.x - this.player.pos.x;
      const dy = nearestEnemy.pos.y - this.player.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const velX = (dx / dist) * BULLET_SPEED;
      const velY = (dy / dist) * BULLET_SPEED;

      this.projectiles.push(
        new Projectile(this.player.pos.x, this.player.pos.y, velX, velY, BULLET_RANGE)
      );
    }
  }

  draw() {
    this.renderSystem.clear();
    this.renderSystem.drawPlayer(this.player);
    this.renderSystem.drawEnemies(this.enemies);
    this.renderSystem.drawProjectiles(this.projectiles);
    
    // Draw boss and currencies before post-processing
    const ctx = this.canvas.getContext('2d');
    const boss = this.bossManager.getBoss();
    if (boss) {
      boss.draw(ctx);
    }
    
    for (const currency of this.currencies) {
      currency.draw(ctx);
    }
    
    this.renderSystem.applyPostProcessing();
    
    // Draw drag line AFTER post-processing so it appears on top
    // Note: We render directly to main canvas here (not via RenderSystem) because
    // RenderSystem draws to the scene context which gets post-processed. The drag line
    // needs to appear above all post-processing effects.
    const dragState = this.inputSystem.getDragState();
    this.renderSystem.drawDragLine(this.player, dragState, ctx);
    
    // Draw wave banner AFTER post-processing so it appears on top
    if (this.waveBanner) {
      this.waveBanner.draw(ctx);
    }
  }

  
  advanceToNextWave() {
    // Clear enemies and projectiles from previous wave
    this.enemies = [];
    this.projectiles = [];
    this.currencies = [];
    this.bossManager.clear();
    this.bossSpawned = false;
    
    // Restore some health as reward
    this.health = Math.min(this.maxHealth, this.health + WAVE_COMPLETE_HEALTH_REWARD);
    
    // Hide wave complete modal
    this.hideWaveComplete();
    
    // Reset wave complete flag
    this.waveCompleteShown = false;
    
    // Advance wave system
    this.waveSystem.advanceToNextWave();
    
    // Show new wave banner
    this.showWaveBanner();
    
    // Resume game
    this.isPaused = false;
  }
  
  restartFromWave1() {
    // Full restart
    this.player.reset(this.canvas.width / 2, this.canvas.height / 2);
    this.enemies = [];
    this.projectiles = [];
    this.currencies = [];
    this.waveBanner = null;
    this.bossManager.clear();
    this.bossSpawned = false;
    this.score = 0;
    this.health = this.maxHealth;
    this.isGameOver = false;
    this.isVictory = false;
    this.waveCompleteShown = false;
    this.lastEnemySpawn = 0;
    this.lastShot = 0;
    
    this.bossManager.hideHealthBar();
    this.hideWaveComplete();
    this.waveSystem.restart();
    this.showWaveBanner();
    this.isPaused = false;
  }
  
  
  triggerVictory() {
    this.isVictory = true;
    this.isPaused = true;
    
    this.gameOverElement.innerHTML = this.getVictoryHTML();
    this.gameOverElement.style.display = 'block';
  }
  
  getVictoryHTML() {
    return `
      <div style="color: #FFD700;">VICTORY!</div>
      <div style="font-size: 20px; margin-top: 20px; color: #4CAF50;">Boss Defeated!</div>
      <div style="font-size: 16px; margin-top: 10px; color: #fff;">Final Score: ${this.score}</div>
      <div style="font-size: 16px; margin-top: 5px; color: #FFD700;">+500 Gold, +100 XP, +20 Gems</div>
      <div style="font-size: 16px; margin-top: 10px;">
        <button id="victorySkillTreeButton" style="padding: 10px 20px; margin: 10px; background: #4CAF50; color: #fff; border: 2px solid #2E7D32; border-radius: 5px; font-family: monospace; font-size: 16px; font-weight: bold; cursor: pointer;">Skill Tree</button>
        <button id="victoryRestartButton" style="padding: 10px 20px; margin: 10px; background: #2196F3; color: #fff; border: 2px solid #1565C0; border-radius: 5px; font-family: monospace; font-size: 16px; font-weight: bold; cursor: pointer;">Play Again</button>
      </div>
    `;
  }
  
  skipTime(seconds) {
    // Skip forward in time (for debugging)
    if (this.waveSystem.isWaveActive()) {
      this.waveSystem.waveTimer += seconds;
    }
  }
  
  forceNextWave() {
    // Force complete current wave (for debugging)
    if (this.waveSystem.isWaveActive()) {
      const wave = this.waveSystem.getCurrentWave();
      if (wave) {
        this.waveSystem.waveTimer = wave.duration;
      }
    }
  }
  
  handleEnemyDeath(enemy, enemyIndex) {
    // Remove enemy from array
    this.enemies.splice(enemyIndex, 1);
    
    // Drop currency
    this.currencies.push(new Currency(enemy.pos.x, enemy.pos.y, ENEMY_GOLD_DROP, 'gold'));
    
    // Handle splitter enemy - split into smaller enemies
    if (enemy.splitOnDeath) {
      const childCount = SPLITTER_MIN_CHILDREN + Math.floor(Math.random() * (SPLITTER_MAX_CHILDREN - SPLITTER_MIN_CHILDREN + 1));
      
      for (let i = 0; i < childCount; i++) {
        const angle = (Math.PI * 2 / childCount) * i + Math.random() * 0.5;
        const childEnemy = new Enemy(enemy.pos.x, enemy.pos.y, {
          type: 'splitter_child',
          healthMultiplier: SPLITTER_CHILD_HEALTH_MULTIPLIER,
          speedMultiplier: SPLITTER_CHILD_SPEED_MULTIPLIER,
          damageMultiplier: SPLITTER_CHILD_DAMAGE_MULTIPLIER
        });
        
        // Give children random outward velocity
        const speed = SPLITTER_CHILD_MIN_SPEED + Math.random() * (SPLITTER_CHILD_MAX_SPEED - SPLITTER_CHILD_MIN_SPEED);
        childEnemy.vel.x = Math.cos(angle) * speed;
        childEnemy.vel.y = Math.sin(angle) * speed;
        
        this.enemies.push(childEnemy);
      }
    }
    
    // Handle bomber enemy - explosion damage
    if (enemy.explosionRadius && enemy.explosionDamage) {
      const dx = this.player.pos.x - enemy.pos.x;
      const dy = this.player.pos.y - enemy.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < enemy.explosionRadius) {
        this.health -= enemy.explosionDamage;
        this.checkGameOver();
      }
      
      // Visual explosion effect
      this.createExplosionEffects(enemy.pos.x, enemy.pos.y, '#ff9800', enemy.explosionRadius, 25, 0.5);
    }
    
    // Standard kill effects
    const gwRenderer = this.getGWRenderer();
    if (gwRenderer) {
      gwRenderer.spawnExplosion(enemy.pos.x, enemy.pos.y, gwRenderer.colors.explosion, 15);
      gwRenderer.addShockwave(enemy.pos.x, enemy.pos.y, 80, gwRenderer.colors.shockwave, 0.4);
      gwRenderer.addCameraShake(0.3);
      gwRenderer.deformGrid(enemy.pos.x, enemy.pos.y, 1.0);
      
      // Big effects on score milestones
      if (this.score % 100 === 0) {
        gwRenderer.addMultiRingShockwave(enemy.pos.x, enemy.pos.y, 3);
        gwRenderer.addCameraShake(1.0);
      }
    }
  }

  gameLoop = (timestamp) => {
    const dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    if (dt < 0.1) {
      this.update(dt);
    }
    this.draw();

    requestAnimationFrame(this.gameLoop);
  };

  start() {
    requestAnimationFrame(this.gameLoop);
  }
  
  pause() {
    this.isPaused = true;
  }
  
  resume() {
    this.isPaused = false;
  }
}
