import { Player, Enemy, Projectile } from '../entities/index';

export class CollisionSystem {
  checkPlayerEnemyCollision(player: Player, enemy: Enemy): boolean {
    const dx = player.pos.x - enemy.pos.x;
    const dy = player.pos.y - enemy.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const collisionDist = player.radius + enemy.size;
    return dist < collisionDist;
  }

  checkProjectileEnemyCollision(projectile: Projectile, enemy: Enemy): boolean {
    const dx = projectile.pos.x - enemy.pos.x;
    const dy = projectile.pos.y - enemy.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < projectile.size + enemy.size;
  }
}
