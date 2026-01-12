/**
 * @typedef {import('../types/index.js').Circle} Circle
 * @typedef {import('../types/index.js').Vector2} Vector2
 */

/**
 * @implements {Circle}
 */
export class Player {
  constructor(x, y) {
    this.pos = { x, y };
    this.vel = { x: 0, y: 0 };
    this.radius = 15;
    this.color = '#00ff00';
  }

  update(dt, canvasWidth, canvasHeight) {
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;

    // Keep player in bounds
    this.pos.x = Math.max(this.radius, Math.min(canvasWidth - this.radius, this.pos.x));
    this.pos.y = Math.max(this.radius, Math.min(canvasHeight - this.radius, this.pos.y));
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  reset(x, y) {
    this.pos = { x, y };
    this.vel = { x: 0, y: 0 };
  }
}
