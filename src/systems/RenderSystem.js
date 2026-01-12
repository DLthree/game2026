import { Player, Enemy, Projectile } from '../entities/index.js';

export class RenderSystem {
  constructor(canvas) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;
  }

  clear() {
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawPlayer(player) {
    player.draw(this.ctx);
  }

  drawEnemies(enemies) {
    for (const enemy of enemies) {
      enemy.draw(this.ctx);
    }
  }

  drawProjectiles(projectiles) {
    for (const projectile of projectiles) {
      projectile.draw(this.ctx);
    }
  }
}
