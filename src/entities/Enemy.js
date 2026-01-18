import { 
  BASE_HEALTH, 
  BASE_SPEED, 
  BASE_SIZE, 
  BASE_DAMAGE,
  ENEMY_TYPES,
  TELEPORTER_COOLDOWN,
  BOMBER_PULSE_FREQUENCY,
  BOMBER_PULSE_SCALE,
  BOMBER_RING_SCALE
} from './EnemyConfig.js';

/**
 * @typedef {import('../types/index.js').Square} Square
 * @typedef {import('../types/index.js').Vector2} Vector2
 */

/**
 * @implements {Square}
 */
export class Enemy {
  constructor(x, y, enemyType = null, targetPos = null) {
    this.pos = { x, y };
    this.vel = { x: 0, y: 0 };
    this.targetPos = targetPos;
    
    // Apply enemy type modifiers
    const typeConfig = enemyType ? ENEMY_TYPES[enemyType.type] || ENEMY_TYPES.basic : ENEMY_TYPES.basic;
    
    this.type = enemyType ? enemyType.type : 'basic';
    this.health = BASE_HEALTH * (enemyType?.healthMultiplier || 1);
    this.maxHealth = this.health;
    this.speed = BASE_SPEED * (enemyType?.speedMultiplier || 1);
    this.damage = BASE_DAMAGE * (enemyType?.damageMultiplier || 1);
    this.size = BASE_SIZE * typeConfig.sizeMultiplier;
    this.color = typeConfig.color;
    this.shape = typeConfig.shape;
    
    // Initialize type-specific properties
    this.splitOnDeath = typeConfig.splitOnDeath || false;
    this.explosionRadius = typeConfig.explosionRadius || 0;
    this.explosionDamage = typeConfig.explosionDamage || 0;
    
    // Initialize behavior timers
    if (typeConfig.hasPulse) {
      this.pulseTimer = 0;
    }
    
    if (typeConfig.canTeleport) {
      this.teleportTimer = Math.random() * 2 + 3;
      this.teleportCooldown = TELEPORTER_COOLDOWN;
      this.fadeAlpha = 1.0;
    }
    
    // Initialize asteroid velocity
    if (typeConfig.hasConstantVelocity) {
      this.initializeAsteroidVelocity(x, y);
    }
  }
  
  initializeAsteroidVelocity(x, y) {
    if (this.targetPos) {
      const dx = this.targetPos.x - x;
      const dy = this.targetPos.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0) {
        this.vel.x = (dx / dist) * this.speed;
        this.vel.y = (dy / dist) * this.speed;
      }
    } else {
      const angle = Math.random() * Math.PI * 2;
      this.vel.x = Math.cos(angle) * this.speed;
      this.vel.y = Math.sin(angle) * this.speed;
    }
  }

  update(dt, targetPos) {
    // Update behavior timers
    this.updateTimers(dt);
    
    // Handle teleporter behavior
    if (this.teleportTimer !== undefined) {
      this.updateTeleporter(dt, targetPos);
    }
    
    // Update movement
    if (this.type === 'asteroid') {
      this.updateAsteroidMovement(dt);
    } else {
      this.updateChaseMovement(dt, targetPos);
    }
  }
  
  updateTimers(dt) {
    if (this.pulseTimer !== undefined) {
      this.pulseTimer += dt;
    }
    
    if (this.teleportTimer !== undefined) {
      this.teleportTimer -= dt;
    }
  }
  
  updateTeleporter(dt, targetPos) {
    if (this.teleportTimer <= 0) {
      this.performTeleport(targetPos);
      this.teleportTimer = this.teleportCooldown + Math.random();
    }
    
    // Update fade effect
    if (this.teleportTimer < 0.3) {
      this.fadeAlpha = this.teleportTimer / 0.3;
    } else if (this.teleportTimer > this.teleportCooldown + 0.7) {
      const fadeInTime = this.teleportTimer - this.teleportCooldown - 0.7;
      this.fadeAlpha = 1.0 - Math.min(fadeInTime / 0.3, 1.0);
    } else {
      this.fadeAlpha = 1.0;
    }
  }
  
  updateAsteroidMovement(dt) {
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
  }
  
  updateChaseMovement(dt, targetPos) {
    const dx = targetPos.x - this.pos.x;
    const dy = targetPos.y - this.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 0) {
      this.vel.x = (dx / dist) * this.speed;
      this.vel.y = (dy / dist) * this.speed;
      
      this.pos.x += this.vel.x * dt;
      this.pos.y += this.vel.y * dt;
    }
  }
  
  performTeleport(targetPos) {
    const dx = targetPos.x - this.pos.x;
    const dy = targetPos.y - this.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 0) {
      const teleportDist = Math.min(100 + Math.random() * 50, dist - 30);
      
      if (teleportDist > 0) {
        this.pos.x += (dx / dist) * teleportDist;
        this.pos.y += (dy / dist) * teleportDist;
      }
    }
  }

  draw(ctx) {
    ctx.save();
    
    if (this.fadeAlpha !== undefined && this.fadeAlpha < 1.0) {
      ctx.globalAlpha = this.fadeAlpha;
    }
    
    ctx.fillStyle = this.color;
    
    switch (this.shape) {
      case 'diamond':
        this.drawDiamond(ctx);
        break;
      case 'circle':
        this.drawCircle(ctx);
        break;
      case 'triangle':
        this.drawTriangle(ctx);
        break;
      default:
        this.drawSquare(ctx);
    }
    
    ctx.restore();
  }
  
  drawDiamond(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.pos.x, this.pos.y - this.size);
    ctx.lineTo(this.pos.x + this.size, this.pos.y);
    ctx.lineTo(this.pos.x, this.pos.y + this.size);
    ctx.lineTo(this.pos.x - this.size, this.pos.y);
    ctx.closePath();
    ctx.fill();
  }
  
  drawCircle(ctx) {
    const pulseValue = this.pulseTimer ? Math.sin(this.pulseTimer * BOMBER_PULSE_FREQUENCY) : 0;
    const pulseScale = 1.0 + pulseValue * BOMBER_PULSE_SCALE;
    const radius = this.size * pulseScale;
    
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    if (this.pulseTimer) {
      const ringScale = 1.0 + pulseValue * BOMBER_RING_SCALE;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.size * ringScale, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  
  drawTriangle(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.pos.x, this.pos.y - this.size);
    ctx.lineTo(this.pos.x + this.size, this.pos.y + this.size);
    ctx.lineTo(this.pos.x - this.size, this.pos.y + this.size);
    ctx.closePath();
    ctx.fill();
  }
  
  drawSquare(ctx) {
    ctx.fillRect(
      this.pos.x - this.size,
      this.pos.y - this.size,
      this.size * 2,
      this.size * 2
    );
  }

  takeDamage() {
    this.health--;
    return this.health <= 0;
  }
}
