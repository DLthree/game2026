/**
 * GeometryWarsRenderer - Full Geometry Wars visual presentation system
 * 
 * Implements all visual layers for Geometry Wars style:
 * - Wireframe/outline geometry rendering
 * - Particle systems (impacts, trails, explosions, pickups)
 * - Deformable background grid
 * - Parallax starfield
 * - Screen-space shockwaves and rings
 * - Camera effects (shake, zoom, time dilation)
 * - Motion trails and afterimages
 * - Additive color blending
 * 
 * All effects are procedural - no sprite assets required.
 */

/**
 * Configuration for Geometry Wars visual effects
 */
export const GeometryWarsConfig = {
  // Master intensity control (0-1, affects all effects)
  intensity: 1.0,
  
  // Individual effect toggles
  wireframeMode: true,
  bloom: true,
  particles: true,
  backgroundGrid: true,
  starfield: true,
  shockwaves: true,
  cameraEffects: true,
  motionTrails: true,
  
  // Wireframe settings
  wireframeLineWidth: 2.0,
  wireframeGlowWidth: 4.0,
  
  // Particle settings
  particleLifetime: 0.5,
  particleSize: 3.0,
  particleCount: 50,
  
  // Grid settings
  gridSize: 40,
  gridDeformRadius: 120,
  gridDeformStrength: 0.6,
  gridColor: '#0066ff',
  
  // Starfield settings
  starCount: 200,
  starLayers: 3,
  
  // Camera settings
  shakeIntensity: 8.0,
  shakeDecay: 0.9,
  
  // Trail settings
  trailLength: 10,
  trailFadeAlpha: 0.15,
};

/**
 * Particle class for various effects
 */
class Particle {
  constructor(x, y, vx, vy, color, size, lifetime, type = 'spark') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.lifetime = lifetime;
    this.maxLifetime = lifetime;
    this.type = type; // 'spark', 'ring', 'trail', 'pickup'
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 5;
  }
  
  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.lifetime -= dt;
    this.rotation += this.rotationSpeed * dt;
    
    // Apply drag
    this.vx *= 0.98;
    this.vy *= 0.98;
    
    return this.lifetime > 0;
  }
  
  getAlpha() {
    return Math.max(0, this.lifetime / this.maxLifetime);
  }
  
  draw(ctx) {
    const alpha = this.getAlpha();
    ctx.globalAlpha = alpha;
    
    if (this.type === 'spark' || this.type === 'trail') {
      // Triangle spark
      ctx.fillStyle = this.color;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.beginPath();
      ctx.moveTo(this.size, 0);
      ctx.lineTo(-this.size / 2, this.size / 2);
      ctx.lineTo(-this.size / 2, -this.size / 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else if (this.type === 'ring') {
      // Expanding ring
      const radius = this.size * (1 - alpha);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.type === 'pickup') {
      // Glitter mote
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
    
    ctx.globalAlpha = 1;
  }
}

/**
 * Shockwave effect
 */
class Shockwave {
  constructor(x, y, maxRadius, color, duration, lineWidth = 3) {
    this.x = x;
    this.y = y;
    this.maxRadius = maxRadius;
    this.color = color;
    this.duration = duration;
    this.elapsed = 0;
    this.lineWidth = lineWidth;
  }
  
  update(dt) {
    this.elapsed += dt;
    return this.elapsed < this.duration;
  }
  
  draw(ctx) {
    const progress = this.elapsed / this.duration;
    const radius = this.maxRadius * progress;
    const alpha = 1 - progress;
    
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth * (1 - progress * 0.5);
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

/**
 * Star for parallax starfield
 */
class Star {
  constructor(x, y, depth, speed, size) {
    this.x = x;
    this.y = y;
    this.depth = depth; // 0-1, affects parallax
    this.speed = speed;
    this.size = size;
    this.brightness = 0.3 + Math.random() * 0.7;
  }
  
  update(dt, cameraX, cameraY) {
    // Parallax based on depth
    this.x -= cameraX * this.depth * 0.05;
    this.y -= cameraY * this.depth * 0.05;
  }
  
  draw(ctx, canvasWidth, canvasHeight) {
    // Wrap around screen
    let x = this.x % canvasWidth;
    let y = this.y % canvasHeight;
    if (x < 0) x += canvasWidth;
    if (y < 0) y += canvasHeight;
    
    const alpha = this.brightness;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - this.size / 2, y - this.size / 2, this.size, this.size);
    ctx.globalAlpha = 1;
  }
}

/**
 * Grid point for deformable background grid
 */
class GridPoint {
  constructor(x, y) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
  }
  
  applyForce(fx, fy) {
    this.vx += fx;
    this.vy += fy;
  }
  
  update(dt) {
    // Apply velocity
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    
    // Spring back to base position
    const dx = this.baseX - this.x;
    const dy = this.baseY - this.y;
    const springForce = 0.1;
    this.vx += dx * springForce;
    this.vy += dy * springForce;
    
    // Damping
    this.vx *= 0.9;
    this.vy *= 0.9;
  }
}

/**
 * Main Geometry Wars Renderer
 */
export class GeometryWarsRenderer {
  constructor(canvas, config = GeometryWarsConfig) {
    this.canvas = canvas;
    this.config = { ...config };
    
    // Particle system
    this.particles = [];
    this.shockwaves = [];
    
    // Background grid
    this.gridPoints = [];
    this.initGrid();
    
    // Starfield
    this.stars = [];
    this.initStarfield();
    
    // Camera effects
    this.cameraShake = { x: 0, y: 0 };
    this.cameraZoom = 1.0;
    this.targetZoom = 1.0;
    this.timeDilation = 1.0;
    
    // Motion trails
    this.entityTrails = new Map(); // entity -> trail frames
    
    // Color palette
    this.colors = {
      player: '#00ff88',
      enemy: '#ff2244',
      projectile: '#ffff00',
      explosion: '#ff8800',
      pickup: '#00ffff',
      shockwave: '#ffffff',
    };
  }
  
  /**
   * Initialize background grid
   */
  initGrid() {
    if (!this.config.backgroundGrid) return;
    
    const gridSize = this.config.gridSize;
    const cols = Math.ceil(this.canvas.width / gridSize) + 1;
    const rows = Math.ceil(this.canvas.height / gridSize) + 1;
    
    this.gridPoints = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(new GridPoint(j * gridSize, i * gridSize));
      }
      this.gridPoints.push(row);
    }
  }
  
  /**
   * Initialize starfield
   */
  initStarfield() {
    if (!this.config.starfield) return;
    
    this.stars = [];
    const layers = this.config.starLayers;
    const starsPerLayer = Math.floor(this.config.starCount / layers);
    
    for (let layer = 0; layer < layers; layer++) {
      const depth = (layer + 1) / layers;
      for (let i = 0; i < starsPerLayer; i++) {
        this.stars.push(new Star(
          Math.random() * this.canvas.width,
          Math.random() * this.canvas.height,
          depth,
          depth * 50,
          1 + depth * 2
        ));
      }
    }
  }
  
  /**
   * Update all effects
   */
  update(dt, game) {
    const scaledDt = dt * this.timeDilation * this.config.intensity;
    
    // Update particles
    this.particles = this.particles.filter(p => p.update(scaledDt));
    
    // Update shockwaves
    this.shockwaves = this.shockwaves.filter(s => s.update(scaledDt));
    
    // Update grid
    if (this.config.backgroundGrid && this.gridPoints.length > 0) {
      for (const row of this.gridPoints) {
        for (const point of row) {
          point.update(scaledDt);
        }
      }
    }
    
    // Update starfield
    if (this.config.starfield) {
      for (const star of this.stars) {
        star.update(scaledDt, this.cameraShake.x, this.cameraShake.y);
      }
    }
    
    // Update camera shake
    this.cameraShake.x *= this.config.shakeDecay;
    this.cameraShake.y *= this.config.shakeDecay;
    
    // Smooth zoom
    this.cameraZoom += (this.targetZoom - this.cameraZoom) * 0.1;
  }
  deformGrid(x, y, strength = 1.0) {
    if (!this.config.backgroundGrid || this.gridPoints.length === 0) return;
    
    const radius = this.config.gridDeformRadius;
    const force = this.config.gridDeformStrength * strength * this.config.intensity;
    
    for (const row of this.gridPoints) {
      for (const point of row) {
        const dx = point.baseX - x;
        const dy = point.baseY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < radius) {
          const falloff = 1 - (dist / radius);
          const pushX = (dx / dist) * force * falloff * 100;
          const pushY = (dy / dist) * force * falloff * 100;
          point.applyForce(pushX, pushY);
        }
      }
    }
  }
  
  /**
   * Add camera shake
   */
  addCameraShake(intensity = 1.0) {
    if (!this.config.cameraEffects) return;
    
    const amount = this.config.shakeIntensity * intensity * this.config.intensity;
    this.cameraShake.x += (Math.random() - 0.5) * amount;
    this.cameraShake.y += (Math.random() - 0.5) * amount;
  }
  
  /**
   * Set camera zoom
   */
  setCameraZoom(zoom) {
    if (!this.config.cameraEffects) return;
    this.targetZoom = zoom;
  }
  
  /**
   * Set time dilation
   */
  setTimeDilation(factor) {
    if (!this.config.cameraEffects) return;
    this.timeDilation = factor;
  }
  
  /**
   * Spawn impact particles
   */
  spawnImpactParticles(x, y, color, count = 10) {
    if (!this.config.particles) return;
    
    const scaledCount = Math.floor(count * this.config.intensity);
    for (let i = 0; i < scaledCount; i++) {
      const angle = (Math.PI * 2 * i) / scaledCount;
      const speed = 100 + Math.random() * 100;
      this.particles.push(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        color,
        this.config.particleSize,
        this.config.particleLifetime,
        'spark'
      ));
    }
  }
  
  /**
   * Spawn explosion particles
   */
  spawnExplosion(x, y, color, count = 20) {
    if (!this.config.particles) return;
    
    this.spawnImpactParticles(x, y, color, count);
    
    // Add expanding ring
    this.particles.push(new Particle(
      x, y, 0, 0,
      color,
      100,
      0.5,
      'ring'
    ));
  }
  
  /**
   * Add shockwave
   */
  addShockwave(x, y, radius = 100, color = '#ffffff', duration = 0.5) {
    if (!this.config.shockwaves) return;
    
    this.shockwaves.push(new Shockwave(x, y, radius * this.config.intensity, color, duration));
  }
  
  /**
   * Add multi-ring shockwave for big events
   */
  addMultiRingShockwave(x, y, rings = 3) {
    if (!this.config.shockwaves) return;
    
    for (let i = 0; i < rings; i++) {
      setTimeout(() => {
        this.addShockwave(x, y, 150 + i * 50, this.colors.shockwave, 0.8);
      }, i * 100);
    }
  }
  
  /**
   * Spawn trail particle
   */
  spawnTrailParticle(x, y, color, size = 3) {
    if (!this.config.motionTrails || !this.config.particles) return;
    
    this.particles.push(new Particle(
      x, y, 0, 0,
      color,
      size,
      0.3,
      'trail'
    ));
  }
  
  /**
   * Draw background grid
   */
  drawGrid(ctx) {
    if (!this.config.backgroundGrid || this.gridPoints.length === 0) return;
    
    ctx.save();
    ctx.strokeStyle = this.config.gridColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3 * this.config.intensity;
    
    const rows = this.gridPoints.length;
    const cols = this.gridPoints[0].length;
    
    // Draw horizontal lines
    for (let i = 0; i < rows; i++) {
      ctx.beginPath();
      for (let j = 0; j < cols; j++) {
        const point = this.gridPoints[i][j];
        if (j === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }
      ctx.stroke();
    }
    
    // Draw vertical lines
    for (let j = 0; j < cols; j++) {
      ctx.beginPath();
      for (let i = 0; i < rows; i++) {
        const point = this.gridPoints[i][j];
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  /**
   * Draw starfield
   */
  drawStarfield(ctx) {
    if (!this.config.starfield) return;
    
    ctx.save();
    for (const star of this.stars) {
      star.draw(ctx, this.canvas.width, this.canvas.height);
    }
    ctx.restore();
  }
  
  /**
   * Draw all particles
   */
  drawParticles(ctx) {
    if (!this.config.particles) return;
    
    ctx.save();
    for (const particle of this.particles) {
      particle.draw(ctx);
    }
    ctx.restore();
  }
  
  /**
   * Draw all shockwaves
   */
  drawShockwaves(ctx) {
    if (!this.config.shockwaves) return;
    
    ctx.save();
    for (const shockwave of this.shockwaves) {
      shockwave.draw(ctx);
    }
    ctx.restore();
  }
  
  /**
   * Draw entity in wireframe mode
   */
  drawEntityWireframe(ctx, entity, color) {
    if (!this.config.wireframeMode) {
      // Fallback to normal rendering
      entity.draw(ctx);
      return;
    }
    
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = this.config.wireframeLineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw outline based on entity type
    // Check for projectiles FIRST (they have both vel and size)
    if (entity.vel !== undefined && entity.distanceTraveled !== undefined) {
      // Triangle (projectile) - must check before size check since projectiles have size too
      const angle = Math.atan2(entity.vel.y, entity.vel.x);
      const size = entity.size || 8;
      
      ctx.beginPath();
      ctx.moveTo(
        entity.pos.x + Math.cos(angle) * size,
        entity.pos.y + Math.sin(angle) * size
      );
      ctx.lineTo(
        entity.pos.x + Math.cos(angle + 2.4) * size,
        entity.pos.y + Math.sin(angle + 2.4) * size
      );
      ctx.lineTo(
        entity.pos.x + Math.cos(angle - 2.4) * size,
        entity.pos.y + Math.sin(angle - 2.4) * size
      );
      ctx.closePath();
      ctx.stroke();
    } else if (entity.radius !== undefined) {
      // Circle (player)
      ctx.beginPath();
      ctx.arc(entity.pos.x, entity.pos.y, entity.radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Add inner detail
      ctx.beginPath();
      ctx.arc(entity.pos.x, entity.pos.y, entity.radius * 0.5, 0, Math.PI * 2);
      ctx.stroke();
    } else if (entity.size !== undefined) {
      // Square (enemy)
      const size = entity.size;
      ctx.beginPath();
      ctx.rect(entity.pos.x - size, entity.pos.y - size, size * 2, size * 2);
      ctx.stroke();
      
      // Add diagonal cross
      ctx.beginPath();
      ctx.moveTo(entity.pos.x - size, entity.pos.y - size);
      ctx.lineTo(entity.pos.x + size, entity.pos.y + size);
      ctx.moveTo(entity.pos.x + size, entity.pos.y - size);
      ctx.lineTo(entity.pos.x - size, entity.pos.y + size);
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  /**
   * Apply camera transform
   */
  applyCameraTransform(ctx) {
    if (!this.config.cameraEffects) return;
    
    // Apply shake
    ctx.translate(this.cameraShake.x, this.cameraShake.y);
    
    // Apply zoom from center
    if (this.cameraZoom !== 1.0) {
      ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      ctx.scale(this.cameraZoom, this.cameraZoom);
      ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
    }
  }
  
  /**
   * Get configuration
   */
  getConfig() {
    return this.config;
  }
  
  /**
   * Update configuration
   */
  updateConfig(updates) {
    Object.assign(this.config, updates);
    
    // Reinitialize if needed
    if ('backgroundGrid' in updates || 'gridSize' in updates) {
      this.initGrid();
    }
    if ('starfield' in updates || 'starCount' in updates) {
      this.initStarfield();
    }
  }
}
