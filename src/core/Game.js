import { Player, Enemy, Projectile } from '../entities/index.js';
import { InputSystem, CollisionSystem, RenderSystem } from '../systems/index.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.enemies = [];
    this.projectiles = [];
    
    this.score = 0;
    this.health = 100;
    this.isGameOver = false;
    this.isPaused = false;
    
    this.lastEnemySpawn = 0;
    this.lastShot = 0;
    this.lastTime = 0;

    // Initialize systems
    this.inputSystem = new InputSystem(canvas, () => this.handleRestart());
    this.collisionSystem = new CollisionSystem();
    this.renderSystem = new RenderSystem(canvas);

    // Initialize player
    this.player = new Player(canvas.width / 2, canvas.height / 2);

    // Get UI elements
    this.scoreElement = document.getElementById('score');
    this.healthElement = document.getElementById('health');
    this.gameOverElement = document.getElementById('gameOver');

    // Setup canvas resize
    this.setupResize();
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
    };
    
    resize();
    window.addEventListener('resize', resize);
  }

  handleRestart() {
    if (!this.isGameOver) return;

    this.player.reset(this.canvas.width / 2, this.canvas.height / 2);
    this.enemies = [];
    this.projectiles = [];
    this.score = 0;
    this.health = 100;
    this.isGameOver = false;
    this.lastEnemySpawn = 0;
    this.lastShot = 0;
    this.gameOverElement.style.display = 'none';
  }

  update(dt) {
    if (this.isGameOver || this.isPaused) return;

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

    // Spawn enemies
    const now = Date.now();
    if (now - this.lastEnemySpawn > 1000) {
      this.lastEnemySpawn = now;
      this.spawnEnemy();
    }

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(dt, this.player.pos);

      // Check collision with player
      if (this.collisionSystem.checkPlayerEnemyCollision(this.player, enemy)) {
        this.health -= 10;
        this.enemies.splice(i, 1);
        
        if (this.health <= 0) {
          this.isGameOver = true;
          this.gameOverElement.style.display = 'block';
        }
      }
    }

    // Auto-shoot projectiles
    if (now - this.lastShot > 500 && this.enemies.length > 0) {
      this.lastShot = now;
      this.shootAtNearestEnemy();
    }

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update(dt);

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
            this.score += 10;
          }
          break;
        }
      }
    }

    // Update UI
    this.scoreElement.textContent = this.score.toString();
    this.healthElement.textContent = this.health.toString();
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

    this.enemies.push(new Enemy(x, y));
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

    if (nearestEnemy) {
      const dx = nearestEnemy.pos.x - this.player.pos.x;
      const dy = nearestEnemy.pos.y - this.player.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = 300;

      const velX = (dx / dist) * speed;
      const velY = (dy / dist) * speed;

      this.projectiles.push(
        new Projectile(this.player.pos.x, this.player.pos.y, velX, velY)
      );
    }
  }

  draw() {
    this.renderSystem.clear();
    this.renderSystem.drawPlayer(this.player);
    this.renderSystem.drawEnemies(this.enemies);
    this.renderSystem.drawProjectiles(this.projectiles);
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
