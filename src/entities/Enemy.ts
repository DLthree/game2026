import { Square, Vector2 } from '../types/index';

export class Enemy implements Square {
  pos: Vector2;
  vel: Vector2;
  size: number;
  color: string;
  health: number;

  constructor(x: number, y: number) {
    this.pos = { x, y };
    this.vel = { x: 0, y: 0 };
    this.size = 15;
    this.color = '#ff0000';
    this.health = 1;
  }

  update(dt: number, targetPos: Vector2): void {
    const dx = targetPos.x - this.pos.x;
    const dy = targetPos.y - this.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    const speed = 50;
    this.vel.x = (dx / dist) * speed;
    this.vel.y = (dy / dist) * speed;
    
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.pos.x - this.size,
      this.pos.y - this.size,
      this.size * 2,
      this.size * 2
    );
  }

  takeDamage(): boolean {
    this.health--;
    return this.health <= 0;
  }
}
