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
    
    // Grid effect constants
    this.GRID_CELL_SIZE = 20; // Size of grid cells in pixels
    
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
  
  drawGridEffects(gridEffects) {
    const ctx = this.visualStyleSystem.getSceneContext();
    
    for (const effect of gridEffects) {
      this.drawGridEffect(ctx, effect);
    }
  }
  
  drawGridEffect(ctx, effect) {
    const alpha = 1 - (effect.age / effect.duration);
    const cellSize = this.GRID_CELL_SIZE;
    const radius = effect.radius;
    
    ctx.save();
    ctx.strokeStyle = `rgba(0, 200, 255, ${alpha * 0.5})`;
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = -radius; x <= radius; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(effect.x + x, effect.y - radius);
      ctx.lineTo(effect.x + x, effect.y + radius);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = -radius; y <= radius; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(effect.x - radius, effect.y + y);
      ctx.lineTo(effect.x + radius, effect.y + y);
      ctx.stroke();
    }
    
    ctx.restore();
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
