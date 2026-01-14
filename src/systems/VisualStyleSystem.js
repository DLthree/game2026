/**
 * VisualStyleSystem - Manages visual style post-processing effects
 * 
 * This system provides multiple visual styles that can be swapped at runtime.
 * Styles use either Canvas 2D post-processing or WebGL shaders.
 * Core gameplay geometry and logic remain unchanged across styles.
 * 
 * Architecture:
 * - Each style has a post-processing function applied after scene rendering
 * - Styles are isolated and can be added without touching gameplay code
 * - Style switching is instant via enum-based configuration
 */

import { 
  FULLSCREEN_VERTEX_SHADER,
  createShaderProgram,
  setupFullscreenQuad,
  createTextureFromCanvas,
  updateTextureFromCanvas,
  renderFullscreenQuad
} from './ShaderUtils.js';
import { GEOMETRY_WARS_SHADER } from './Shaders.js';
import { GeometryWarsRenderer } from './GeometryWarsRenderer.js';

/**
 * Visual style enum
 * @readonly
 * @enum {number}
 */
export const VisualStyle = {
  GEOMETRY_WARS: 0,
  CLEAN_MINIMAL: 1,
};

/**
 * Style names for display
 * @type {Object.<number, string>}
 */
export const StyleNames = {
  [VisualStyle.GEOMETRY_WARS]: 'Geometry Wars',
  [VisualStyle.CLEAN_MINIMAL]: 'Clean Minimal',
};

/**
 * Configuration for each visual style
 * @type {Object.<number, Object>}
 */
export const StyleConfig = {
  [VisualStyle.GEOMETRY_WARS]: {
    useWebGL: true,             // This style requires WebGL for bloom
    useGeometryWarsRenderer: true, // Enable full Geometry Wars renderer
  },
  
  [VisualStyle.CLEAN_MINIMAL]: {
    contrast: 1.2,              // Color contrast multiplier
    sharpness: true,            // Disable image smoothing
  },
};

/**
 * Visual style system managing post-processing effects
 */
export class VisualStyleSystem {
  /**
   * @param {HTMLCanvasElement} canvas - Main canvas element
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.currentStyle = VisualStyle.GEOMETRY_WARS;
    
    // Create offscreen canvases for post-processing
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCtx = this.offscreenCanvas.getContext('2d');
    
    // Initialize WebGL for shader-based styles
    this.initWebGL();
    
    // Initialize Geometry Wars renderer
    this.geometryWarsRenderer = new GeometryWarsRenderer(canvas);
    
    this.updateCanvasSize();
  }
  
  /**
   * Initialize WebGL context and shader programs
   */
  initWebGL() {
    // Create a separate WebGL canvas for shader-based rendering
    this.glCanvas = document.createElement('canvas');
    this.gl = this.glCanvas.getContext('webgl') || this.glCanvas.getContext('experimental-webgl');
    
    if (!this.gl) {
      console.warn('WebGL not supported, shader styles will be disabled');
      this.webglSupported = false;
      return;
    }
    
    this.webglSupported = true;
    
    // Create shader programs
    this.shaderPrograms = {};
    
    // GEOMETRY_WARS shader
    this.shaderPrograms[VisualStyle.GEOMETRY_WARS] = createShaderProgram(
      this.gl,
      FULLSCREEN_VERTEX_SHADER,
      GEOMETRY_WARS_SHADER
    );
    
    // Setup fullscreen quads for each shader
    this.shaderQuads = {};
    for (const [style, program] of Object.entries(this.shaderPrograms)) {
      if (program) {
        this.shaderQuads[style] = setupFullscreenQuad(this.gl, program);
      }
    }
    
    // Create texture for scene data
    this.sceneTexture = null;
    
    // Store start time for shader animations
    this.startTime = Date.now();
  }
  
  /**
   * Update offscreen canvas sizes to match main canvas
   */
  updateCanvasSize() {
    this.offscreenCanvas.width = this.canvas.width;
    this.offscreenCanvas.height = this.canvas.height;
    
    // Update WebGL canvas size
    if (this.webglSupported && this.glCanvas) {
      this.glCanvas.width = this.canvas.width;
      this.glCanvas.height = this.canvas.height;
      this.gl.viewport(0, 0, this.glCanvas.width, this.glCanvas.height);
    }
    
    // Reinitialize Geometry Wars grid and starfield with new canvas size
    if (this.geometryWarsRenderer) {
      this.geometryWarsRenderer.initGrid();
      this.geometryWarsRenderer.initStarfield();
    }
  }
  
  /**
   * Get current style
   * @returns {number}
   */
  getCurrentStyle() {
    return this.currentStyle;
  }
  
  /**
   * Set current style
   * @param {number} style
   */
  setStyle(style) {
    if (style in StyleConfig) {
      this.currentStyle = style;
    }
  }
  
  /**
   * Toggle between visual styles
   */
  nextStyle() {
    // Toggle between Geometry Wars and Clean Minimal
    if (this.currentStyle === VisualStyle.GEOMETRY_WARS) {
      this.setStyle(VisualStyle.CLEAN_MINIMAL);
    } else {
      this.setStyle(VisualStyle.GEOMETRY_WARS);
    }
  }
  
  /**
   * Get the render context for drawing the scene
   * For WebGL styles, this is the main context (will be transferred to WebGL)
   * For canvas styles, this is the main context
   * @returns {CanvasRenderingContext2D}
   */
  getSceneContext() {
    return this.ctx;
  }
  
  /**
   * Apply post-processing effect based on current style
   * Called after scene is drawn to the scene context
   */
  applyPostProcessing() {
    switch (this.currentStyle) {
      case VisualStyle.GEOMETRY_WARS:
        this.applyGeometryWars();
        break;
      case VisualStyle.CLEAN_MINIMAL:
        this.applyCleanMinimal();
        break;
    }
  }
  
  /**
   * BLOOM_GEOMETRY: Crisp geometry with additive bloom glow
   * 
   * Process:
   * 1. Scene is drawn to offscreen canvas at full resolution
   * 2. Create downscaled bloom layer from bright elements
   * 3. Apply blur filter to bloom layer
   * 4. Composite: sharp scene + additive bloom (multiple passes for stronger glow)
   */
  applyBloomGeometry() {
    const config = StyleConfig[VisualStyle.BLOOM_GEOMETRY];
    
    // Clear main canvas
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw sharp base scene from offscreen
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.drawImage(this.offscreenCanvas, 0, 0);
    
    // Create bloom layer (downscaled)
    this.bloomCtx.clearRect(0, 0, this.bloomCanvas.width, this.bloomCanvas.height);
    this.bloomCtx.imageSmoothingEnabled = true;
    this.bloomCtx.drawImage(
      this.offscreenCanvas,
      0, 0, this.canvas.width, this.canvas.height,
      0, 0, this.bloomCanvas.width, this.bloomCanvas.height
    );
    
    // Apply multiple bloom passes for stronger effect
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'lighter';
    this.ctx.imageSmoothingEnabled = true;
    
    // First bloom pass - large blur
    this.ctx.filter = `blur(${config.blurRadius}px)`;
    this.ctx.globalAlpha = config.bloomStrength;
    this.ctx.drawImage(
      this.bloomCanvas,
      0, 0, this.bloomCanvas.width, this.bloomCanvas.height,
      0, 0, this.canvas.width, this.canvas.height
    );
    
    // Second bloom pass - medium blur for more glow
    this.ctx.filter = `blur(${config.blurRadius / 2}px)`;
    this.ctx.globalAlpha = config.bloomStrength * 0.5;
    this.ctx.drawImage(
      this.bloomCanvas,
      0, 0, this.bloomCanvas.width, this.bloomCanvas.height,
      0, 0, this.canvas.width, this.canvas.height
    );
    
    this.ctx.restore();
  }
  
  /**
   * CLEAN_MINIMAL: High contrast, sharp, no post-processing
   * 
   * Process:
   * - Scene drawn directly to main canvas
   * - Image smoothing disabled for pixel-perfect rendering
   * - No additional effects
   */
  applyCleanMinimal() {
    // Scene is already drawn directly to main canvas
    // No post-processing needed - style is defined by absence of effects
    this.ctx.imageSmoothingEnabled = false;
  }
  
  /**
   * GHOST_TRAILS: Motion trails via alpha-faded frame persistence
   * 
   * Process:
   * 1. Capture current frame to trail history
   * 2. Clear canvas with semi-transparent fill (fade effect)
   * 3. Draw recent trail frames with decreasing alpha
   * 4. Draw current frame on top
   */
  applyGhostTrails() {
    const config = StyleConfig[VisualStyle.GHOST_TRAILS];
    
    // Capture current frame
    const frameCanvas = document.createElement('canvas');
    frameCanvas.width = this.canvas.width;
    frameCanvas.height = this.canvas.height;
    const frameCtx = frameCanvas.getContext('2d');
    frameCtx.drawImage(this.canvas, 0, 0);
    
    // Add to trail history
    this.trailFrames.push(frameCanvas);
    if (this.trailFrames.length > this.maxTrailFrames) {
      this.trailFrames.shift();
    }
    
    // Clear with alpha fade
    this.ctx.fillStyle = `rgba(26, 26, 46, ${config.trailAlpha})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw trail frames with decreasing alpha
    for (let i = 0; i < this.trailFrames.length - 1; i++) {
      const alpha = (i + 1) / this.trailFrames.length * 0.5;
      this.ctx.globalAlpha = alpha;
      this.ctx.drawImage(this.trailFrames[i], 0, 0);
    }
    
    // Draw current frame at full opacity
    this.ctx.globalAlpha = 1;
    if (this.trailFrames.length > 0) {
      this.ctx.drawImage(this.trailFrames[this.trailFrames.length - 1], 0, 0);
    }
  }
  
  /**
   * CRT_ANALOG: Retro CRT monitor effect with scanlines and vignette
   * 
   * Process:
   * 1. Scene drawn to main canvas
   * 2. Apply scanline overlay
   * 3. Apply vignette darkening at edges
   * 4. Add subtle noise for analog feel
   */
  applyCRTAnalog() {
    const config = StyleConfig[VisualStyle.CRT_ANALOG];
    
    // Apply scanlines
    this.ctx.fillStyle = `rgba(0, 0, 0, ${config.scanlineIntensity})`;
    for (let y = 0; y < this.canvas.height; y += config.scanlineCount) {
      this.ctx.fillRect(0, y, this.canvas.width, 1);
    }
    
    // Apply vignette
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 0,
      this.canvas.width / 2, this.canvas.height / 2, this.canvas.width * 0.7
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, `rgba(0, 0, 0, ${config.vignetteStrength})`);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Add noise
    this.ctx.globalAlpha = config.noiseIntensity;
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const brightness = Math.random() * 255;
      this.ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
      this.ctx.fillRect(x, y, 1, 1);
    }
    this.ctx.globalAlpha = 1;
  }
  
  /**
   * Apply WebGL shader-based style
   * 
   * Process:
   * 1. Copy current canvas content to WebGL texture
   * 2. Apply shader to texture
   * 3. Render result back to main canvas
   * 
   * @param {number} style - The shader style to apply
   */
  applyShaderStyle(style) {
    if (!this.webglSupported) {
      console.warn('WebGL not supported, falling back to clean minimal style');
      this.applyCleanMinimal();
      return;
    }
    
    const program = this.shaderPrograms[style];
    const quad = this.shaderQuads[style];
    
    if (!program || !quad) {
      console.warn(`Shader program for style ${style} not available`);
      return;
    }
    
    const gl = this.gl;
    
    // Create or update texture from current canvas
    if (!this.sceneTexture) {
      this.sceneTexture = createTextureFromCanvas(gl, this.canvas);
    } else {
      updateTextureFromCanvas(gl, this.sceneTexture, this.canvas);
    }
    
    // Setup WebGL state
    gl.clearColor(0.1, 0.1, 0.18, 1.0);  // Match background color
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Use shader program
    gl.useProgram(program);
    
    // Bind texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.sceneTexture);
    
    // Set uniforms
    const textureLocation = gl.getUniformLocation(program, 'u_texture');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    
    gl.uniform1i(textureLocation, 0);
    gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);
    gl.uniform1f(timeLocation, (Date.now() - this.startTime) / 1000.0);
    
    // Render fullscreen quad
    renderFullscreenQuad(gl, program, quad);
    
    // Copy WebGL result back to main canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.glCanvas, 0, 0);
  }
  
  /**
   * Clear the scene context
   */
  clearScene() {
    const ctx = this.getSceneContext();
    // Use dark background for all styles, especially Geometry Wars
    if (this.currentStyle === VisualStyle.GEOMETRY_WARS) {
      ctx.fillStyle = '#000000'; // Pure black for Geometry Wars
    } else {
      ctx.fillStyle = '#1a1a2e'; // Dark blue for other styles
    }
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  /**
   * GEOMETRY_WARS: Full Geometry Wars visual style
   * 
   * Applies the complete shader-based bloom effect.
   * The GeometryWarsRenderer handles additional effects like particles, grid, etc.
   */
  applyGeometryWars() {
    // Apply the Geometry Wars shader for bloom
    this.applyShaderStyle(VisualStyle.GEOMETRY_WARS);
  }
  
  /**
   * Get the Geometry Wars renderer for external control
   * @returns {GeometryWarsRenderer}
   */
  getGeometryWarsRenderer() {
    return this.geometryWarsRenderer;
  }
}
