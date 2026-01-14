/**
 * Wave Banner Entity
 * A physics-based banner that displays the wave number
 * and can be knocked around before disappearing
 */

export class WaveBanner {
  constructor(waveNumber, canvasWidth, canvasHeight) {
    this.waveNumber = waveNumber;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    // Constants
    this.INITIAL_VELOCITY_RANGE = 100;
    this.ANGULAR_IMPULSE_DIVISOR = 100;
    
    // Start in center of screen
    this.pos = { 
      x: canvasWidth / 2, 
      y: canvasHeight / 2 
    };
    
    // Initial random velocity for some movement
    this.vel = {
      x: (Math.random() - 0.5) * this.INITIAL_VELOCITY_RANGE,
      y: (Math.random() - 0.5) * this.INITIAL_VELOCITY_RANGE
    };
    
    // Physics properties
    this.mass = 10;
    this.friction = 0.98;
    this.bounceDamping = 0.7;
    
    // Size and appearance
    this.width = 300;
    this.height = 80;
    
    // Lifetime
    this.lifetime = 5.0; // seconds
    this.age = 0;
    
    // Rotation for fun physics
    this.rotation = 0;
    this.angularVelocity = (Math.random() - 0.5) * 2;
  }
  
  /**
   * Apply an impulse force to the banner (for knockback effects)
   */
  applyImpulse(forceX, forceY) {
    this.vel.x += forceX / this.mass;
    this.vel.y += forceY / this.mass;
    this.angularVelocity += (forceX + forceY) / (this.mass * this.ANGULAR_IMPULSE_DIVISOR);
  }
  
  /**
   * Check if a point is inside the banner (for collision detection)
   */
  containsPoint(x, y) {
    // Simple AABB check
    return x >= this.pos.x - this.width / 2 &&
           x <= this.pos.x + this.width / 2 &&
           y >= this.pos.y - this.height / 2 &&
           y <= this.pos.y + this.height / 2;
  }
  
  update(dt) {
    this.age += dt;
    
    // Apply friction
    this.vel.x *= this.friction;
    this.vel.y *= this.friction;
    this.angularVelocity *= this.friction;
    
    // Update position
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
    this.rotation += this.angularVelocity * dt;
    
    // Bounce off walls
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;
    
    if (this.pos.x - halfWidth < 0) {
      this.pos.x = halfWidth;
      this.vel.x = Math.abs(this.vel.x) * this.bounceDamping;
      this.angularVelocity *= -0.8;
    } else if (this.pos.x + halfWidth > this.canvasWidth) {
      this.pos.x = this.canvasWidth - halfWidth;
      this.vel.x = -Math.abs(this.vel.x) * this.bounceDamping;
      this.angularVelocity *= -0.8;
    }
    
    if (this.pos.y - halfHeight < 0) {
      this.pos.y = halfHeight;
      this.vel.y = Math.abs(this.vel.y) * this.bounceDamping;
      this.angularVelocity *= -0.8;
    } else if (this.pos.y + halfHeight > this.canvasHeight) {
      this.pos.y = this.canvasHeight - halfHeight;
      this.vel.y = -Math.abs(this.vel.y) * this.bounceDamping;
      this.angularVelocity *= -0.8;
    }
  }
  
  draw(ctx) {
    ctx.save();
    
    // Calculate opacity fade out in last second
    const fadeStartTime = this.lifetime - 1.0;
    let opacity = 1.0;
    if (this.age > fadeStartTime) {
      opacity = 1.0 - (this.age - fadeStartTime) / 1.0;
    }
    
    // Move to banner position and rotate
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.rotation);
    
    // Draw banner background
    ctx.globalAlpha = opacity * 0.9;
    ctx.fillStyle = '#1a1a1a';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    
    // Rounded rectangle
    const x = -this.width / 2;
    const y = -this.height / 2;
    const radius = 10;
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + this.width - radius, y);
    ctx.quadraticCurveTo(x + this.width, y, x + this.width, y + radius);
    ctx.lineTo(x + this.width, y + this.height - radius);
    ctx.quadraticCurveTo(x + this.width, y + this.height, x + this.width - radius, y + this.height);
    ctx.lineTo(x + radius, y + this.height);
    ctx.quadraticCurveTo(x, y + this.height, x, y + this.height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    ctx.fill();
    ctx.stroke();
    
    // Draw text
    ctx.globalAlpha = opacity;
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`WAVE ${this.waveNumber}`, 0, -5);
    
    // Draw countdown subtitle
    const timeRemaining = Math.ceil(this.lifetime - this.age);
    ctx.font = '16px monospace';
    ctx.fillText(`Starting in ${timeRemaining}...`, 0, 25);
    
    ctx.restore();
  }
  
  isExpired() {
    return this.age >= this.lifetime;
  }
}
