/**
 * @typedef {import('../types/index.js').Triangle} Triangle
 * @typedef {import('../types/index.js').Vector2} Vector2
 */

/**
 * @implements {Triangle}
 */
export class Projectile {
  constructor(x, y, velX, velY) {
    this.pos = { x, y };
    this.vel = { x: velX, y: velY };
    this.size = 8;
    this.color = '#ffff00';
  }

  update(dt) {
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
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
    ctx.fill();
  }

  isOutOfBounds(width, height) {
    return this.pos.x < 0 || this.pos.x > width || 
           this.pos.y < 0 || this.pos.y > height;
  }
}
