/**
 * EnemySpawner - Handles enemy spawning logic
 */

import { Enemy } from '../entities/index.js';

export class EnemySpawner {
  /**
   * Spawn an enemy at a random position on the edge of the canvas
   * @param {number} canvasWidth - Width of the canvas
   * @param {number} canvasHeight - Height of the canvas
   * @param {Object} enemyType - Enemy type configuration from wave system
   * @returns {Enemy} The spawned enemy
   */
  spawnEnemy(canvasWidth, canvasHeight, enemyType) {
    const side = Math.floor(Math.random() * 4);
    let x, y;

    if (side === 0) {
      x = -20;
      y = Math.random() * canvasHeight;
    } else if (side === 1) {
      x = canvasWidth + 20;
      y = Math.random() * canvasHeight;
    } else if (side === 2) {
      x = Math.random() * canvasWidth;
      y = -20;
    } else {
      x = Math.random() * canvasWidth;
      y = canvasHeight + 20;
    }

    // Pick a random point on screen as initial target for enemy navigation
    const targetX = Math.random() * canvasWidth;
    const targetY = Math.random() * canvasHeight;
    const targetPos = { x: targetX, y: targetY };

    return new Enemy(x, y, enemyType, targetPos);
  }
}
