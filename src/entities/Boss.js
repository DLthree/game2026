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
  constructor(x, y) {
    this.pos = { x, y };
    this.vel = { x: 0, y: 0 };
    
    // Boss properties - 10x tank health
    // Tank enemy base health is 1, with multipliers applied by wave config
    // Wave 10 tanks would have ~12 health, so boss has 120
    const tankBaseHealth = 12;
    this.health = tankBaseHealth * 10;
    this.maxHealth = this.health;
    this.speed = 40; // Slower than regular enemies
    this.damage = 20; // High damage
    this.size = 40; // Much larger than regular enemies (15 is normal)
    this.color = '#9400D3'; // Dark violet/purple for boss
    this.type = 'boss';
    this.isBoss = true;
    
    // Dash attack behavior
    this.dashCooldown = 0;
    this.dashCooldownMax = 3.0; // Dash every 3 seconds
    this.isDashing = false;
    this.dashDuration = 0.5; // Dash lasts 0.5 seconds
    this.dashTimer = 0;
    this.dashSpeed = 300; // Very fast during dash
    this.dashDirection = { x: 0, y: 0 };
  }

  update(dt, targetPos) {
    // Update dash cooldown
    if (this.dashCooldown > 0) {
      this.dashCooldown -= dt;
    }
    
    // Calculate direction to player
    const dx = targetPos.x - this.pos.x;
    const dy = targetPos.y - this.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist === 0) return;
    
    const dirX = dx / dist;
    const dirY = dy / dist;
    
    if (this.isDashing) {
      // Continue dashing in the same direction
      this.dashTimer += dt;
      
      if (this.dashTimer >= this.dashDuration) {
        // End dash
        this.isDashing = false;
        this.dashTimer = 0;
        this.dashCooldown = this.dashCooldownMax;
      } else {
        // Move at dash speed
        this.vel.x = this.dashDirection.x * this.dashSpeed;
        this.vel.y = this.dashDirection.y * this.dashSpeed;
      }
    } else {
      // Normal movement - chase player slowly
      this.vel.x = dirX * this.speed;
      this.vel.y = dirY * this.speed;
      
      // Check if can start a dash
      if (this.dashCooldown <= 0 && dist > 100 && dist < 400) {
        // Start dash attack
        this.isDashing = true;
        this.dashTimer = 0;
        this.dashDirection = { x: dirX, y: dirY };
      }
    }
    
    // Update position
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
  }

  draw(ctx) {
    // Draw boss as a large diamond/rhombus shape
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.pos.x, this.pos.y - this.size); // Top
    ctx.lineTo(this.pos.x + this.size, this.pos.y); // Right
    ctx.lineTo(this.pos.x, this.pos.y + this.size); // Bottom
    ctx.lineTo(this.pos.x - this.size, this.pos.y); // Left
    ctx.closePath();
    ctx.fill();
    
    // Add a glow effect during dash
    if (this.isDashing) {
      ctx.strokeStyle = '#FF00FF';
      ctx.lineWidth = 4;
      ctx.stroke();
    }
    
    // Draw eyes to make it look menacing
    ctx.fillStyle = '#FF0000';
    const eyeSize = 5;
    const eyeOffset = this.size * 0.3;
    ctx.fillRect(this.pos.x - eyeOffset - eyeSize/2, this.pos.y - eyeOffset - eyeSize/2, eyeSize, eyeSize);
    ctx.fillRect(this.pos.x + eyeOffset - eyeSize/2, this.pos.y - eyeOffset - eyeSize/2, eyeSize, eyeSize);
  }

  takeDamage(amount = 1) {
    this.health -= amount;
    return this.health <= 0;
  }
  
  getHealthPercentage() {
    return this.health / this.maxHealth;
  }
}
