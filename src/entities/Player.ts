import { Circle, Vector2 } from '../types/index.ts';

export class Player implements Circle {
  pos: Vector2;
  vel: Vector2;
  radius: number;
  color: string;

  constructor(x: number, y: number) {
    this.pos = { x, y };
    this.vel = { x: 0, y: 0 };
    this.radius = 15;
    this.color = '#00ff00';
  }

  update(dt: number, canvasWidth: number, canvasHeight: number): void {
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;

    // Keep player in bounds
    this.pos.x = Math.max(this.radius, Math.min(canvasWidth - this.radius, this.pos.x));
    this.pos.y = Math.max(this.radius, Math.min(canvasHeight - this.radius, this.pos.y));
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  reset(x: number, y: number): void {
    this.pos = { x, y };
    this.vel = { x: 0, y: 0 };
  }
}
