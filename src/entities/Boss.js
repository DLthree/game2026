/**
 * @typedef {import('../types/index.js').Vector2} Vector2
 * @typedef {import('../types/index.js').Square} Square
 */

/**
 * Boss Entity - Final boss for Wave 10
 * Features: High health, unique appearance, dash attack pattern
 * @implements {Square}
 */
export class Boss {
  // Boss configuration constants
  static TANK_BASE_HEALTH = 12;
  static HEALTH_MULTIPLIER = 10;
  static BASE_SPEED = 40;
  static DAMAGE = 20;
  static SIZE = 40;
  static COLOR = '#9400D3';
  static DASH_COLOR = '#FF00FF';
  static EYE_COLOR = '#FF0000';
  static EYE_SIZE = 5;
  static EYE_OFFSET_RATIO = 0.3;
  
  // Dash attack constants
  static DASH_COOLDOWN = 3.0;
  static DASH_DURATION = 0.5;
  static DASH_SPEED = 300;
  static DASH_MIN_RANGE = 100;
  static DASH_MAX_RANGE = 400;
  
  constructor(x, y) {
    this.pos = { x, y };
    this.vel = { x: 0, y: 0 };
    
    // Boss properties - 10x tank health
    this.health = Boss.TANK_BASE_HEALTH * Boss.HEALTH_MULTIPLIER;
    this.maxHealth = this.health;
    this.speed = Boss.BASE_SPEED;
    this.damage = Boss.DAMAGE;
    this.size = Boss.SIZE;
    this.color = Boss.COLOR;
    this.type = 'boss';
    this.isBoss = true;
    
    // Dash attack state
    this.dashCooldown = 0;
    this.isDashing = false;
    this.dashTimer = 0;
    this.dashDirection = { x: 0, y: 0 };
  }

  update(dt, targetPos) {
    this.updateDashCooldown(dt);
    
    const { dirX, dirY, dist } = this.calculateDirectionToTarget(targetPos);
    if (dist === 0) return;
    
    if (this.isDashing) {
      this.updateDashMovement(dt);
    } else {
      this.updateNormalMovement(dirX, dirY, dist);
    }
    
    this.updatePosition(dt);
  }
  
  updateDashCooldown(dt) {
    if (this.dashCooldown > 0) {
      this.dashCooldown -= dt;
    }
  }
  
  calculateDirectionToTarget(targetPos) {
    const dx = targetPos.x - this.pos.x;
    const dy = targetPos.y - this.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    return {
      dirX: dist > 0 ? dx / dist : 0,
      dirY: dist > 0 ? dy / dist : 0,
      dist
    };
  }
  
  updateDashMovement(dt) {
    this.dashTimer += dt;
    
    if (this.dashTimer >= Boss.DASH_DURATION) {
      this.endDash();
    } else {
      this.vel.x = this.dashDirection.x * Boss.DASH_SPEED;
      this.vel.y = this.dashDirection.y * Boss.DASH_SPEED;
    }
  }
  
  updateNormalMovement(dirX, dirY, dist) {
    this.vel.x = dirX * this.speed;
    this.vel.y = dirY * this.speed;
    
    if (this.canStartDash(dist)) {
      this.startDash(dirX, dirY);
    }
  }
  
  canStartDash(dist) {
    return this.dashCooldown <= 0 && 
           dist > Boss.DASH_MIN_RANGE && 
           dist < Boss.DASH_MAX_RANGE;
  }
  
  startDash(dirX, dirY) {
    this.isDashing = true;
    this.dashTimer = 0;
    this.dashDirection = { x: dirX, y: dirY };
  }
  
  endDash() {
    this.isDashing = false;
    this.dashTimer = 0;
    this.dashCooldown = Boss.DASH_COOLDOWN;
  }
  
  updatePosition(dt) {
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
  }

  draw(ctx) {
    this.drawBody(ctx);
    this.drawEyes(ctx);
  }
  
  drawBody(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.pos.x, this.pos.y - this.size); // Top
    ctx.lineTo(this.pos.x + this.size, this.pos.y); // Right
    ctx.lineTo(this.pos.x, this.pos.y + this.size); // Bottom
    ctx.lineTo(this.pos.x - this.size, this.pos.y); // Left
    ctx.closePath();
    ctx.fill();
    
    // Add dash glow effect
    if (this.isDashing) {
      ctx.strokeStyle = Boss.DASH_COLOR;
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  }
  
  drawEyes(ctx) {
    ctx.fillStyle = Boss.EYE_COLOR;
    const eyeOffset = this.size * Boss.EYE_OFFSET_RATIO;
    const halfEye = Boss.EYE_SIZE / 2;
    
    // Left eye
    ctx.fillRect(
      this.pos.x - eyeOffset - halfEye, 
      this.pos.y - eyeOffset - halfEye, 
      Boss.EYE_SIZE, 
      Boss.EYE_SIZE
    );
    
    // Right eye
    ctx.fillRect(
      this.pos.x + eyeOffset - halfEye, 
      this.pos.y - eyeOffset - halfEye, 
      Boss.EYE_SIZE, 
      Boss.EYE_SIZE
    );
  }

  takeDamage(amount = 1) {
    this.health -= amount;
    return this.health <= 0;
  }
  
  getHealthPercentage() {
    return this.health / this.maxHealth;
  }
}
