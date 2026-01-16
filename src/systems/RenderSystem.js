import { Player, Enemy, Projectile } from '../entities/index.js';
import { VisualStyleSystem, VisualStyle } from './VisualStyleSystem.js';
import { InputSystem } from './InputSystem.js';

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
   * Draw drag line from player to current touch position
   * @param {Object} player - Player entity with pos property
   * @param {Object} dragState - Drag state from InputSystem
   * @param {CanvasRenderingContext2D} ctx - Canvas context to draw on
   */
  drawDragLine(player, dragState, ctx) {
    if (!dragState.active || !dragState.currentPos) {
      return;
    }
    
    // Calculate drag vector from player to touch position
    const dx = dragState.currentPos.x - player.pos.x;
    const dy = dragState.currentPos.y - player.pos.y;
    const dragLength = Math.sqrt(dx * dx + dy * dy);
    
    // Only draw if drag exceeds minimum distance
    if (dragLength < InputSystem.MIN_DRAG_DISTANCE) {
      return;
    }
    
    // Draw line from player center to touch position
    ctx.save();
    ctx.strokeStyle = InputSystem.DRAG_LINE_COLOR;
    ctx.lineWidth = InputSystem.DRAG_LINE_WIDTH;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(player.pos.x, player.pos.y);
    ctx.lineTo(dragState.currentPos.x, dragState.currentPos.y);
    ctx.stroke();
    
    // Draw endpoint circle as indicator
    ctx.fillStyle = InputSystem.DRAG_LINE_COLOR;
    ctx.beginPath();
    ctx.arc(
      dragState.currentPos.x, 
      dragState.currentPos.y, 
      InputSystem.DRAG_LINE_ENDPOINT_RADIUS, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
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
