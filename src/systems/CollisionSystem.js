import { Player, Enemy, Projectile } from '../entities/index.js';

export class CollisionSystem {
  checkPlayerEnemyCollision(player, enemy) {
    const dx = player.pos.x - enemy.pos.x;
    const dy = player.pos.y - enemy.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const collisionDist = player.radius + enemy.size;
    return dist < collisionDist;
  }

  checkProjectileEnemyCollision(projectile, enemy) {
    const dx = projectile.pos.x - enemy.pos.x;
    const dy = projectile.pos.y - enemy.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < projectile.size + enemy.size;
  }
}
