/**
 * @typedef {import('../types/index.js').Triangle} Triangle
 * @typedef {import('../types/index.js').Vector2} Vector2
 */

/**
 * @implements {Triangle}
 */
export class Projectile {
  constructor(x, y, velX, velY, range = 300) {
    this.pos = { x, y };
    this.startPos = { x, y };
    this.vel = { x: velX, y: velY };
    this.size = 8;
    this.color = '#ffff00';
    this.range = range;
    this.distanceTraveled = 0;
  }

  update(dt) {
    const dx = this.vel.x * dt;
    const dy = this.vel.y * dt;
    this.pos.x += dx;
    this.pos.y += dy;
    this.distanceTraveled += Math.sqrt(dx * dx + dy * dy);
  }

  draw(ctx) {
    // Draw wireframe triangle
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const angle = Math.atan2(this.vel.y, this.vel.x);
    const size = this.size;
    
    ctx.moveTo(
      this.pos.x + Math.cos(angle) * size,
      this.pos.y + Math.sin(angle) * size
    );
    ctx.lineTo(
      this.pos.x + Math.cos(angle + 2.4) * size,
      this.pos.y + Math.sin(angle + 2.4) * size
    );
    ctx.lineTo(
      this.pos.x + Math.cos(angle - 2.4) * size,
      this.pos.y + Math.sin(angle - 2.4) * size
    );
    
    ctx.closePath();
    ctx.stroke();
  }

  isOutOfBounds(width, height) {
    // Check if exceeded range
    if (this.distanceTraveled >= this.range) {
      return true;
    }
    return this.pos.x < 0 || this.pos.x > width || 
           this.pos.y < 0 || this.pos.y > height;
  }
}
