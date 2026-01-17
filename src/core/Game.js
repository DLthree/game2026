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

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.enemies = [];
    this.projectiles = [];
    this.currencies = [];
    this.waveBanner = null;
    this.boss = null;
    this.bossSpawned = false;
    
    // Game constants
    this.WAVE_COMPLETE_HEALTH_REWARD = 30;
    this.BULLET_RANGE = 300;
    this.AUTO_SHOOT_RANGE = 250;
    this.AUTO_SHOOT_INTERVAL = 500; // milliseconds
    this.BANNER_BOUNCE_MULTIPLIER = 3.0;
    this.BANNER_BASE_PUSH_FORCE = 100;
    this.CURRENCY_PICKUP_RADIUS = 100;
    
    // Boss rewards
    this.BOSS_GOLD_REWARD = 500;
    this.BOSS_GEM_REWARD = 20;
    
    this.score = 0;
    this.health = 100;
    this.maxHealth = 100;
    this.isGameOver = false;
    this.isPaused = false;
    this.waveCompleteShown = false;
    this.isVictory = false;
    
    this.lastEnemySpawn = 0;
    this.lastShot = 0;
    this.lastTime = 0;

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
    this.bossHealthContainer = document.getElementById('bossHealthContainer');
    this.bossHealthBar = document.getElementById('bossHealthBar');
    this.bossHealthText = document.getElementById('bossHealthText');
    
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
      const maxWidth = 800;
      const maxHeight = 600;
      const scale = Math.min(
        window.innerWidth / maxWidth,
        window.innerHeight / maxHeight,
        1
      );
      this.canvas.width = maxWidth;
      this.canvas.height = maxHeight;
      this.canvas.style.width = `${maxWidth * scale}px`;
      this.canvas.style.height = `${maxHeight * scale}px`;
      
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
    this.boss = null;
    this.bossSpawned = false;
    this.score = 0;
    this.health = this.maxHealth;
    this.isGameOver = false;
    this.isVictory = false;
    this.waveCompleteShown = false;
    this.lastEnemySpawn = 0;
    this.lastShot = 0;
    this.gameOverElement.style.display = 'none';
    
    this.hideBossHealthBar();
    
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
    
    // Check if Geometry Wars mode is active
    const visualStyleSystem = this.renderSystem.getVisualStyleSystem();
    const isGeometryWars = visualStyleSystem.getCurrentStyle() === VisualStyle.GEOMETRY_WARS;
    
    if (isGeometryWars) {
      const gwRenderer = visualStyleSystem.getGeometryWarsRenderer();
      // Deform the background grid at touch point (similar to explosion effect)
      gwRenderer.deformGrid(x, y, 0.6);
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
          this.spawnBoss();
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
    const visualStyleSystem = this.renderSystem.getVisualStyleSystem();
    const isGeometryWars = visualStyleSystem.getCurrentStyle() === VisualStyle.GEOMETRY_WARS;
    if (isGeometryWars) {
      const gwRenderer = visualStyleSystem.getGeometryWarsRenderer();
      gwRenderer.update(dt, this);
    }

    // Update player movement
    const speed = 200;
    const keyboardVel = this.inputSystem.getMovementVelocity(speed);
    const dragVel = this.inputSystem.getDragVelocity(this.player.pos, speed);
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
      
      if (dist > 5) {
        this.player.vel.x = (dx / dist) * speed;
        this.player.vel.y = (dy / dist) * speed;
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
    if (isGeometryWars) {
      const gwRenderer = visualStyleSystem.getGeometryWarsRenderer();
      const moving = Math.abs(this.player.vel.x) > 10 || Math.abs(this.player.vel.y) > 10;
      if (moving && Math.random() < 0.3) {
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
        
        // Handle bomber explosion on contact (no need to call handleEnemyDeath for explosion effect)
        if (enemy.explosionRadius && enemy.explosionDamage) {
          // Bomber explodes on contact, dealing explosion damage
          this.health -= enemy.explosionDamage;
          
          // Visual explosion effect
          if (isGeometryWars) {
            const gwRenderer = visualStyleSystem.getGeometryWarsRenderer();
            gwRenderer.spawnExplosion(enemy.pos.x, enemy.pos.y, '#ff9800', 25);
            gwRenderer.addShockwave(enemy.pos.x, enemy.pos.y, enemy.explosionRadius, '#ff9800', 0.6);
            gwRenderer.addCameraShake(0.7);
          }
        } else {
          // Regular Geometry Wars effects for non-bomber collision
          if (isGeometryWars) {
            const gwRenderer = visualStyleSystem.getGeometryWarsRenderer();
            gwRenderer.spawnImpactParticles(enemy.pos.x, enemy.pos.y, gwRenderer.colors.enemy, 8);
            gwRenderer.addCameraShake(0.5);
            gwRenderer.deformGrid(enemy.pos.x, enemy.pos.y, 0.8);
          }
        }
        
        if (this.health <= 0) {
          this.isGameOver = true;
          this.gameOverElement.style.display = 'block';
        }
      }
    }

    // Update boss if active
    if (this.boss) {
      this.boss.update(dt, this.player.pos);
      
      // Check collision with player
      if (this.collisionSystem.checkPlayerEnemyCollision(this.player, this.boss)) {
        this.health -= this.boss.damage;
        
        // Geometry Wars effects on collision
        if (isGeometryWars) {
          const gwRenderer = visualStyleSystem.getGeometryWarsRenderer();
          gwRenderer.spawnImpactParticles(this.boss.pos.x, this.boss.pos.y, gwRenderer.colors.enemy, 12);
          gwRenderer.addCameraShake(1.0);
          gwRenderer.deformGrid(this.boss.pos.x, this.boss.pos.y, 1.5);
        }
        
        if (this.health <= 0) {
          this.isGameOver = true;
          this.gameOverElement.style.display = 'block';
          this.hideBossHealthBar();
        }
      }
      
      this.updateBossHealthBar();
    }

    // Auto-shoot projectiles (include boss as target)
    if (now - this.lastShot > this.AUTO_SHOOT_INTERVAL && (this.enemies.length > 0 || this.boss)) {
      this.lastShot = now;
      this.shootAtNearestEnemy();
    }

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update(dt);
      
      // Spawn trail particles in Geometry Wars mode
      if (isGeometryWars && Math.random() < 0.5) {
        const gwRenderer = visualStyleSystem.getGeometryWarsRenderer();
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
            this.handleEnemyDeath(enemy, j, isGeometryWars, visualStyleSystem);
          }
          break;
        }
      }
      
      // Check collision with boss
      if (this.boss && this.collisionSystem.checkProjectileEnemyCollision(projectile, this.boss)) {
        const isDead = this.boss.takeDamage();
        this.projectiles.splice(i, 1);
        
        if (isDead) {
          const gwRenderer = isGeometryWars ? visualStyleSystem.getGeometryWarsRenderer() : null;
          this.handleBossDefeat(isGeometryWars, gwRenderer);
        }
        break;
      }
    }

    // Update currencies
    for (let i = this.currencies.length - 1; i >= 0; i--) {
      const currency = this.currencies[i];
      currency.update(dt, this.player.pos, this.CURRENCY_PICKUP_RADIUS);
      
      // Check for pickup by player
      const dx = currency.pos.x - this.player.pos.x;
      const dy = currency.pos.y - this.player.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const pickupRadius = this.player.radius + currency.size;
      
      if (dist < pickupRadius) {
        // Pick up currency and add to score
        this.score += currency.amount;
        
        // Add to skill tree manager if available
        if (window.skillTreeManager) {
          window.skillTreeManager.addCurrency(currency.type, currency.amount);
        }
        
        this.currencies.splice(i, 1);
        continue;
      }
      
      // Remove if expired or out of bounds
      if (currency.isExpired() || currency.isOutOfBounds(this.canvas.width, this.canvas.height)) {
        this.currencies.splice(i, 1);
      }
    }

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
    const side = Math.floor(Math.random() * 4);
    let x, y;

    if (side === 0) {
      x = -20;
      y = Math.random() * this.canvas.height;
    } else if (side === 1) {
      x = this.canvas.width + 20;
      y = Math.random() * this.canvas.height;
    } else if (side === 2) {
      x = Math.random() * this.canvas.width;
      y = -20;
    } else {
      x = Math.random() * this.canvas.width;
      y = this.canvas.height + 20;
    }

    // Pick a random point on screen as initial target for enemy navigation
    const targetX = Math.random() * this.canvas.width;
    const targetY = Math.random() * this.canvas.height;
    const targetPos = { x: targetX, y: targetY };

    // Get enemy type from wave system
    const enemyType = this.waveSystem.getRandomEnemyType();
    this.enemies.push(new Enemy(x, y, enemyType, targetPos));
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
    if (this.boss) {
      const dx = this.boss.pos.x - this.player.pos.x;
      const dy = this.boss.pos.y - this.player.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestEnemy = this.boss;
      }
    }

    // Only shoot if nearest enemy is within range
    if (nearestEnemy && nearestDist <= this.AUTO_SHOOT_RANGE) {
      const dx = nearestEnemy.pos.x - this.player.pos.x;
      const dy = nearestEnemy.pos.y - this.player.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = 300;

      const velX = (dx / dist) * speed;
      const velY = (dy / dist) * speed;

      this.projectiles.push(
        new Projectile(this.player.pos.x, this.player.pos.y, velX, velY, this.BULLET_RANGE)
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
    if (this.boss) {
      this.boss.draw(ctx);
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
    this.boss = null;
    this.bossSpawned = false;
    
    // Restore some health as reward
    this.health = Math.min(this.maxHealth, this.health + this.WAVE_COMPLETE_HEALTH_REWARD);
    
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
    this.boss = null;
    this.bossSpawned = false;
    this.score = 0;
    this.health = this.maxHealth;
    this.isGameOver = false;
    this.isVictory = false;
    this.waveCompleteShown = false;
    this.lastEnemySpawn = 0;
    this.lastShot = 0;
    
    this.hideBossHealthBar();
    this.hideWaveComplete();
    this.waveSystem.restart();
    this.showWaveBanner();
    this.isPaused = false;
  }
  
  spawnBoss() {
    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;
    const wave = this.waveSystem.getCurrentWave();
    const bossScale = wave && wave.bossScale ? wave.bossScale : 1.0;
    this.boss = new Boss(x, y, bossScale);
  }
  
  updateBossHealthBar() {
    if (!this.boss || !this.bossHealthContainer || !this.bossHealthBar || !this.bossHealthText) {
      return;
    }
    
    this.bossHealthContainer.style.display = 'block';
    const healthPercent = this.boss.getHealthPercentage() * 100;
    this.bossHealthBar.style.width = `${healthPercent}%`;
    this.bossHealthText.textContent = `BOSS: ${Math.ceil(this.boss.health)}/${this.boss.maxHealth}`;
  }
  
  hideBossHealthBar() {
    if (this.bossHealthContainer) {
      this.bossHealthContainer.style.display = 'none';
    }
  }
  
  handleBossDefeat(isGeometryWars, gwRenderer) {
    const bossScale = this.boss.difficultyScale;
    
    // Scale rewards based on boss difficulty
    const goldReward = Math.floor(this.BOSS_GOLD_REWARD * bossScale);
    const gemReward = Math.floor(this.BOSS_GEM_REWARD * bossScale);
    
    // Award scaled rewards
    this.currencies.push(new Currency(
      this.boss.pos.x, 
      this.boss.pos.y, 
      goldReward, 
      'gold'
    ));
    
    if (window.skillTreeManager) {
      window.skillTreeManager.addCurrency('gems', gemReward);
    }
    
    // Visual effects (scaled intensity)
    if (isGeometryWars && gwRenderer) {
      const effectScale = Math.min(bossScale * 1.5, 2.0);
      gwRenderer.spawnExplosion(this.boss.pos.x, this.boss.pos.y, gwRenderer.colors.explosion, Math.floor(15 * effectScale));
      gwRenderer.addMultiRingShockwave(this.boss.pos.x, this.boss.pos.y, Math.floor(3 * effectScale));
      gwRenderer.addCameraShake(1.0 * effectScale);
      gwRenderer.deformGrid(this.boss.pos.x, this.boss.pos.y, 1.5 * effectScale);
    }
    
    this.boss = null;
    this.hideBossHealthBar();
    
    // Only trigger victory for final boss (scale = 1.0)
    if (bossScale >= 0.95) {
      this.triggerVictory();
    }
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
  
  handleEnemyDeath(enemy, enemyIndex, isGeometryWars, visualStyleSystem) {
    // Remove enemy from array
    this.enemies.splice(enemyIndex, 1);
    
    // Drop currency
    this.currencies.push(new Currency(enemy.pos.x, enemy.pos.y, 10, 'gold'));
    
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
        
        if (this.health <= 0) {
          this.isGameOver = true;
          this.gameOverElement.style.display = 'block';
        }
      }
      
      // Visual explosion effect (larger than normal)
      if (isGeometryWars) {
        const gwRenderer = visualStyleSystem.getGeometryWarsRenderer();
        gwRenderer.spawnExplosion(enemy.pos.x, enemy.pos.y, '#ff9800', 25);
        gwRenderer.addShockwave(enemy.pos.x, enemy.pos.y, enemy.explosionRadius, '#ff9800', 0.6);
        gwRenderer.addCameraShake(0.5);
      }
    }
    
    // Geometry Wars effects on kill
    if (isGeometryWars) {
      const gwRenderer = visualStyleSystem.getGeometryWarsRenderer();
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
