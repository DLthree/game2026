import { Player, Enemy, Projectile } from '../entities/index';

export class RenderSystem {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;
  }

  clear(): void {
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawPlayer(player: Player): void {
    player.draw(this.ctx);
  }

  drawEnemies(enemies: Enemy[]): void {
    for (const enemy of enemies) {
      enemy.draw(this.ctx);
    }
  }

  drawProjectiles(projectiles: Projectile[]): void {
    for (const projectile of projectiles) {
      projectile.draw(this.ctx);
    }
  }
}
