import { Player, Enemy, Projectile, WaveBanner, Currency, Boss } from '../entities/index.js';
import { InputSystem, CollisionSystem, RenderSystem, VisualStyle, WaveSystem } from '../systems/index.js';

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
    this.BANNER_BOUNCE_MULTIPLIER = 3.0;
    this.BANNER_BASE_PUSH_FORCE = 100;
    this.CURRENCY_PICKUP_RADIUS = 100; // Distance at which currency starts moving towards player
    
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
    this.inputSystem = new InputSystem(canvas, () => this.handleRestart());
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
    
    // Hide boss health bar
    if (this.bossHealthContainer) {
      this.bossHealthContainer.style.display = 'none';
    }
    
    // Restart wave system
    this.waveSystem.restart();
    this.showWaveBanner();
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
    const targetPos = this.inputSystem.getTargetPosition();

    if (targetPos) {
      // Touch/mouse movement
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
      // Keyboard movement
      this.player.vel = keyboardVel;
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
        
        // Geometry Wars effects on collision
        if (isGeometryWars) {
          const gwRenderer = visualStyleSystem.getGeometryWarsRenderer();
          gwRenderer.spawnImpactParticles(enemy.pos.x, enemy.pos.y, gwRenderer.colors.enemy, 8);
          gwRenderer.addCameraShake(0.5);
          gwRenderer.deformGrid(enemy.pos.x, enemy.pos.y, 0.8);
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
          
          // Hide boss health bar
          if (this.bossHealthContainer) {
            this.bossHealthContainer.style.display = 'none';
          }
        }
      }
      
      // Update boss health bar
      if (this.bossHealthContainer && this.bossHealthBar && this.bossHealthText) {
        this.bossHealthContainer.style.display = 'block';
        const healthPercent = this.boss.getHealthPercentage() * 100;
        this.bossHealthBar.style.width = healthPercent + '%';
        this.bossHealthText.textContent = `BOSS: ${Math.ceil(this.boss.health)}/${this.boss.maxHealth}`;
      }
    }

    // Auto-shoot projectiles (include boss as target)
    if (now - this.lastShot > 500 && (this.enemies.length > 0 || this.boss)) {
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
            this.enemies.splice(j, 1);
            
            // Drop currency instead of immediately adding score
            this.currencies.push(new Currency(enemy.pos.x, enemy.pos.y, 10, 'gold'));
            
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
          break;
        }
      }
      
      // Check collision with boss
      if (this.boss && this.collisionSystem.checkProjectileEnemyCollision(projectile, this.boss)) {
        const isDead = this.boss.takeDamage();
        this.projectiles.splice(i, 1);
        
        if (isDead) {
          // Boss defeated! Award big rewards
          this.currencies.push(new Currency(this.boss.pos.x, this.boss.pos.y, 500, 'gold'));
          
          // Add gems and experience if skill tree manager is available
          if (window.skillTreeManager) {
            window.skillTreeManager.addCurrency('gems', 20);
            window.skillTreeManager.addExperience(100);
          }
          
          // Geometry Wars effects on boss kill
          if (isGeometryWars) {
            const gwRenderer = visualStyleSystem.getGeometryWarsRenderer();
            gwRenderer.spawnExplosion(this.boss.pos.x, this.boss.pos.y, gwRenderer.colors.explosion, 30);
            gwRenderer.addMultiRingShockwave(this.boss.pos.x, this.boss.pos.y, 5);
            gwRenderer.addCameraShake(2.0);
            gwRenderer.deformGrid(this.boss.pos.x, this.boss.pos.y, 3.0);
          }
          
          // Remove boss
          this.boss = null;
          
          // Hide boss health bar
          if (this.bossHealthContainer) {
            this.bossHealthContainer.style.display = 'none';
          }
          
          // Trigger victory
          this.triggerVictory();
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
    
    // Draw boss if active
    const ctx = this.canvas.getContext('2d');
    if (this.boss) {
      this.boss.draw(ctx);
    }
    
    // Draw currencies before post-processing
    for (const currency of this.currencies) {
      currency.draw(ctx);
    }
    
    this.renderSystem.applyPostProcessing();
    
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
    
    // Hide boss health bar
    if (this.bossHealthContainer) {
      this.bossHealthContainer.style.display = 'none';
    }
    
    this.hideWaveComplete();
    this.waveSystem.restart();
    this.showWaveBanner();
    this.isPaused = false;
  }
  
  spawnBoss() {
    // Spawn boss in the center of the screen
    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;
    this.boss = new Boss(x, y);
  }
  
  triggerVictory() {
    this.isVictory = true;
    this.isPaused = true;
    
    // Show victory message in game over element
    this.gameOverElement.innerHTML = `
      <div style="color: #FFD700;">VICTORY!</div>
      <div style="font-size: 20px; margin-top: 20px; color: #4CAF50;">Boss Defeated!</div>
      <div style="font-size: 16px; margin-top: 10px; color: #fff;">Final Score: ${this.score}</div>
      <div style="font-size: 16px; margin-top: 5px; color: #FFD700;">+500 Gold, +100 XP, +20 Gems</div>
      <div style="font-size: 16px; margin-top: 10px;">
        <button id="victorySkillTreeButton" style="padding: 10px 20px; margin: 10px; background: #4CAF50; color: #fff; border: 2px solid #2E7D32; border-radius: 5px; font-family: monospace; font-size: 16px; font-weight: bold; cursor: pointer;">Skill Tree</button>
        <button id="victoryRestartButton" style="padding: 10px 20px; margin: 10px; background: #2196F3; color: #fff; border: 2px solid #1565C0; border-radius: 5px; font-family: monospace; font-size: 16px; font-weight: bold; cursor: pointer;">Play Again</button>
      </div>
    `;
    this.gameOverElement.style.display = 'block';
    
    // Add event listeners to new buttons
    const victorySkillTreeButton = document.getElementById('victorySkillTreeButton');
    const victoryRestartButton = document.getElementById('victoryRestartButton');
    
    if (victorySkillTreeButton) {
      victorySkillTreeButton.addEventListener('click', () => {
        const skillTreeContainer = document.getElementById('skillTreeContainer');
        if (skillTreeContainer) {
          skillTreeContainer.classList.add('visible');
        }
      });
    }
    
    if (victoryRestartButton) {
      victoryRestartButton.addEventListener('click', () => {
        this.handleRestart();
      });
    }
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
