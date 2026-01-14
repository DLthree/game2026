/**
 * Currency Entity
 * Dropped by enemies and needs to be picked up by the player
 */

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
    this.color = this.type === 'gold' ? '#FFD700' : '#FF69B4';
    this.friction = 0.95;
  }

  update(dt, playerPos = null, pickupRadius = 100) {
    this.age += dt;
    
    // Apply magnetic pull towards player if within pickup radius
    if (playerPos) {
      const dx = playerPos.x - this.pos.x;
      const dy = playerPos.y - this.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < pickupRadius && dist > 0) {
        // Magnetic pull strength increases as currency gets closer
        const pullStrength = 400 * (1 - dist / pickupRadius);
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
    
    // Draw star shape for currency
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    
    const spikes = 5;
    const outerRadius = this.size;
    const innerRadius = this.size * 0.5;
    
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
    
    ctx.restore();
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
