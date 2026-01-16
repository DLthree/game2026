/**
 * Currency Entity
 * Dropped by enemies and needs to be picked up by the player
 */

// Currency visual constants (matching skillTreeData.js)
const CURRENCY_COLORS = {
  gold: '#FFD700',
  gems: '#FF69B4',
  experience: '#00CED1'
};

const SHAPE_CONSTANTS = {
  STAR_SPIKES: 5,
  STAR_INNER_RADIUS_RATIO: 0.5,
  DIAMOND_WIDTH_RATIO: 0.6,
  ORB_INNER_GLOW_RATIO: 0.6,
  ORB_GLOW_OPACITY: 0.5
};

export class Currency {
  constructor(x, y, amount = 10, type = 'gold') {
    this.pos = { x, y };
    this.vel = { 
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 100 
    };
    this.amount = amount;
    this.type = type;
    this.size = 8;
    this.lifetime = 10.0; // seconds before disappearing
    this.age = 0;
    this.color = CURRENCY_COLORS[type] || '#FFFFFF'; // White fallback for unknown types
    this.friction = 0.95;
    this.magneticPullForce = 400; // Base force for pulling currency towards player
  }

  update(dt, playerPos = null, pickupRadius = 100) {
    this.age += dt;
    
    // Apply magnetic pull towards player if within pickup radius
    if (playerPos) {
      const dx = playerPos.x - this.pos.x;
      const dy = playerPos.y - this.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < pickupRadius && dist > 0) {
        // Magnetic pull strength increases linearly as currency gets closer to player
        // At pickup radius edge: pull = 0, At player center: pull = magneticPullForce
        // Formula: force = magneticPullForce * (1 - distance/radius)
        const pullStrength = this.magneticPullForce * (1 - dist / pickupRadius);
        this.vel.x += (dx / dist) * pullStrength * dt;
        this.vel.y += (dy / dist) * pullStrength * dt;
      }
    }
    
    // Apply friction
    this.vel.x *= this.friction;
    this.vel.y *= this.friction;
    
    // Update position
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
  }

  draw(ctx) {
    // Calculate opacity fade out in last 2 seconds
    let opacity = 1.0;
    const fadeStartTime = this.lifetime - 2.0;
    if (this.age > fadeStartTime) {
      opacity = 1.0 - (this.age - fadeStartTime) / 2.0;
    }
    
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    
    // Delegate to type-specific drawing method
    if (this.type === 'gold') {
      this.drawStar(ctx);
    } else if (this.type === 'gems') {
      this.drawDiamond(ctx);
    } else if (this.type === 'experience') {
      this.drawOrb(ctx, opacity);
    }
    
    ctx.restore();
  }

  drawStar(ctx) {
    const spikes = SHAPE_CONSTANTS.STAR_SPIKES;
    const outerRadius = this.size;
    const innerRadius = this.size * SHAPE_CONSTANTS.STAR_INNER_RADIUS_RATIO;
    
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI / spikes) * i;
      const x = this.pos.x + Math.cos(angle) * radius;
      const y = this.pos.y + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawDiamond(ctx) {
    const width = this.size * SHAPE_CONSTANTS.DIAMOND_WIDTH_RATIO;
    
    ctx.beginPath();
    ctx.moveTo(this.pos.x, this.pos.y - this.size);
    ctx.lineTo(this.pos.x + width, this.pos.y);
    ctx.lineTo(this.pos.x, this.pos.y + this.size);
    ctx.lineTo(this.pos.x - width, this.pos.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawOrb(ctx, opacity) {
    // Draw outer circle
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Add inner glow effect
    const innerRadius = this.size * SHAPE_CONSTANTS.ORB_INNER_GLOW_RATIO;
    ctx.globalAlpha = opacity * SHAPE_CONSTANTS.ORB_GLOW_OPACITY;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, innerRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = opacity;
  }

  isExpired() {
    return this.age >= this.lifetime;
  }

  isOutOfBounds(width, height) {
    const margin = 50;
    return this.pos.x < -margin || this.pos.x > width + margin ||
           this.pos.y < -margin || this.pos.y > height + margin;
  }
}
