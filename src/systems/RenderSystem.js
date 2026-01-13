import { Player, Enemy, Projectile } from '../entities/index.js';
import { VisualStyleSystem } from './VisualStyleSystem.js';

export class RenderSystem {
  constructor(canvas) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;
    
    // Initialize visual style system
    this.visualStyleSystem = new VisualStyleSystem(canvas);
  }

  clear() {
    // Clear the scene context (may be offscreen for some styles)
    this.visualStyleSystem.clearScene();
  }

  drawPlayer(player) {
    // Get the appropriate context for current style
    const ctx = this.visualStyleSystem.getSceneContext();
    player.draw(ctx);
  }

  drawEnemies(enemies) {
    const ctx = this.visualStyleSystem.getSceneContext();
    for (const enemy of enemies) {
      enemy.draw(ctx);
    }
  }

  drawProjectiles(projectiles) {
    const ctx = this.visualStyleSystem.getSceneContext();
    for (const projectile of projectiles) {
      projectile.draw(ctx);
    }
  }
  
  /**
   * Apply post-processing effects based on current visual style
   * Should be called after all entities are drawn
   */
  applyPostProcessing() {
    this.visualStyleSystem.applyPostProcessing();
  }
  
  /**
   * Get the visual style system for external control
   * @returns {VisualStyleSystem}
   */
  getVisualStyleSystem() {
    return this.visualStyleSystem;
  }
  
  /**
   * Update canvas size (called on resize)
   */
  updateCanvasSize() {
    this.visualStyleSystem.updateCanvasSize();
  }
}
