import { Player, Enemy, Projectile } from '../entities/index.js';
import { VisualStyleSystem, VisualStyle } from './VisualStyleSystem.js';

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
    
    // If Geometry Wars mode, draw background layers first
    const ctx = this.visualStyleSystem.getSceneContext();
    if (this.visualStyleSystem.getCurrentStyle() === VisualStyle.GEOMETRY_WARS) {
      const gwRenderer = this.visualStyleSystem.getGeometryWarsRenderer();
      gwRenderer.drawStarfield(ctx);
      gwRenderer.drawGrid(ctx);
    }
  }

  drawPlayer(player) {
    // Get the appropriate context for current style
    const ctx = this.visualStyleSystem.getSceneContext();
    
    // If Geometry Wars mode, use wireframe rendering
    if (this.visualStyleSystem.getCurrentStyle() === VisualStyle.GEOMETRY_WARS) {
      const gwRenderer = this.visualStyleSystem.getGeometryWarsRenderer();
      gwRenderer.drawEntityWireframe(ctx, player, gwRenderer.colors.player);
    } else {
      player.draw(ctx);
    }
  }

  drawEnemies(enemies) {
    const ctx = this.visualStyleSystem.getSceneContext();
    const isGeometryWars = this.visualStyleSystem.getCurrentStyle() === VisualStyle.GEOMETRY_WARS;
    const gwRenderer = isGeometryWars ? this.visualStyleSystem.getGeometryWarsRenderer() : null;
    
    for (const enemy of enemies) {
      if (isGeometryWars) {
        gwRenderer.drawEntityWireframe(ctx, enemy, gwRenderer.colors.enemy);
      } else {
        enemy.draw(ctx);
      }
    }
  }

  drawProjectiles(projectiles) {
    const ctx = this.visualStyleSystem.getSceneContext();
    const isGeometryWars = this.visualStyleSystem.getCurrentStyle() === VisualStyle.GEOMETRY_WARS;
    const gwRenderer = isGeometryWars ? this.visualStyleSystem.getGeometryWarsRenderer() : null;
    
    for (const projectile of projectiles) {
      if (isGeometryWars) {
        gwRenderer.drawEntityWireframe(ctx, projectile, gwRenderer.colors.projectile);
      } else {
        projectile.draw(ctx);
      }
    }
  }
  
  /**
   * Apply post-processing effects based on current visual style
   * Should be called after all entities are drawn
   */
  applyPostProcessing() {
    // If Geometry Wars mode, draw foreground effects before post-processing
    if (this.visualStyleSystem.getCurrentStyle() === VisualStyle.GEOMETRY_WARS) {
      const ctx = this.visualStyleSystem.getSceneContext();
      const gwRenderer = this.visualStyleSystem.getGeometryWarsRenderer();
      gwRenderer.drawParticles(ctx);
      gwRenderer.drawShockwaves(ctx);
    }
    
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
