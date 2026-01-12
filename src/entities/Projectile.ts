import { Triangle, Vector2 } from '../types/index';

export class Projectile implements Triangle {
  pos: Vector2;
  vel: Vector2;
  size: number;
  color: string;

  constructor(x: number, y: number, velX: number, velY: number) {
    this.pos = { x, y };
    this.vel = { x: velX, y: velY };
    this.size = 8;
    this.color = '#ffff00';
  }

  update(dt: number): void {
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
  }

  draw(ctx: CanvasRenderingContext2D): void {
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

  isOutOfBounds(width: number, height: number): boolean {
    return this.pos.x < 0 || this.pos.x > width || 
           this.pos.y < 0 || this.pos.y > height;
  }
}
