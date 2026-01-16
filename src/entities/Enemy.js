/**
 * @typedef {import('../types/index.js').Square} Square
 * @typedef {import('../types/index.js').Vector2} Vector2
 */

/**
 * @implements {Square}
 */
export class Enemy {
  constructor(x, y, enemyType = null, targetPos = null) {
    this.pos = { x, y };
    this.vel = { x: 0, y: 0 };
    this.targetPos = targetPos; // Optional target position for navigation
    
    // Default values
    const baseHealth = 1;
    const baseSpeed = 50;
    const baseSize = 15;
    const baseDamage = 10;
    
    // Apply enemy type modifiers if provided
    if (enemyType) {
      this.type = enemyType.type;
      this.health = baseHealth * enemyType.healthMultiplier;
      this.maxHealth = this.health;
      this.speed = baseSpeed * enemyType.speedMultiplier;
      this.damage = baseDamage * enemyType.damageMultiplier;
      
      // Visual differences based on type
      if (enemyType.type === 'fast') {
        this.size = baseSize * 0.8;
        this.color = '#ff6600'; // Orange for fast enemies
      } else if (enemyType.type === 'tank') {
        this.size = baseSize * 1.5;
        this.color = '#cc0000'; // Dark red for tanks
      } else if (enemyType.type === 'asteroid') {
        this.size = baseSize * 1.2;
        this.color = '#888888'; // Gray for asteroids
        // Asteroids navigate towards their target position if provided
        if (this.targetPos) {
          const dx = this.targetPos.x - x;
          const dy = this.targetPos.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0) {
            this.vel.x = (dx / dist) * this.speed;
            this.vel.y = (dy / dist) * this.speed;
          }
        } else {
          // Fallback: random velocity direction
          const angle = Math.random() * Math.PI * 2;
          this.vel.x = Math.cos(angle) * this.speed;
          this.vel.y = Math.sin(angle) * this.speed;
        }
      } else if (enemyType.type === 'splitter') {
        this.size = baseSize * 1.1;
        this.color = '#9c27b0'; // Purple for splitters
        this.shape = 'diamond';
        this.splitOnDeath = true;
      } else if (enemyType.type === 'splitter_child') {
        this.size = baseSize * 0.66; // 60% of parent splitter size
        this.color = '#9c27b0'; // Purple for splitter children
        this.shape = 'diamond';
        this.splitOnDeath = false; // Children don't split
      } else if (enemyType.type === 'bomber') {
        this.size = baseSize * 0.9;
        this.color = '#ff9800'; // Orange for bombers
        this.shape = 'circle';
        this.explosionRadius = 80;
        this.explosionDamage = 15;
        this.pulseTimer = 0;
      } else if (enemyType.type === 'teleporter') {
        this.size = baseSize * 0.85;
        this.color = '#00bcd4'; // Cyan for teleporters
        this.shape = 'triangle';
        this.teleportTimer = Math.random() * 2 + 3; // Start with random timer between 3-5s
        this.teleportCooldown = 3.5; // Average cooldown
        this.fadeAlpha = 1.0;
      } else {
        this.size = baseSize;
        this.color = '#ff0000'; // Red for basic
      }
    } else {
      // Legacy: no type specified
      this.type = 'basic';
      this.health = baseHealth;
      this.maxHealth = this.health;
      this.speed = baseSpeed;
      this.damage = baseDamage;
      this.size = baseSize;
      this.color = '#ff0000';
    }
  }

  update(dt, targetPos) {
    // Asteroids don't target the player, they just float with constant velocity
    if (this.type === 'asteroid') {
      this.pos.x += this.vel.x * dt;
      this.pos.y += this.vel.y * dt;
      return;
    }
    
    // Update bomber pulse animation
    if (this.type === 'bomber') {
      this.pulseTimer += dt;
    }
    
    // Handle teleporter behavior
    if (this.type === 'teleporter') {
      this.teleportTimer -= dt;
      
      // Check if it's time to teleport
      if (this.teleportTimer <= 0) {
        this.performTeleport(targetPos);
        this.teleportTimer = this.teleportCooldown + Math.random(); // 3.5-4.5s
      }
      
      // Update fade effect based on timer
      if (this.teleportTimer < 0.3) {
        // Fading out before teleport
        this.fadeAlpha = this.teleportTimer / 0.3;
      } else if (this.teleportTimer > this.teleportCooldown + 0.7) {
        // Fading in after teleport
        const fadeInTime = this.teleportTimer - this.teleportCooldown - 0.7;
        this.fadeAlpha = 1.0 - Math.min(fadeInTime / 0.3, 1.0);
      } else {
        this.fadeAlpha = 1.0;
      }
    }
    
    // Other enemy types chase the player
    const dx = targetPos.x - this.pos.x;
    const dy = targetPos.y - this.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Prevent division by zero when enemy is at exact same position as target
    if (dist > 0) {
      this.vel.x = (dx / dist) * this.speed;
      this.vel.y = (dy / dist) * this.speed;
      
      this.pos.x += this.vel.x * dt;
      this.pos.y += this.vel.y * dt;
    }
  }
  
  performTeleport(targetPos) {
    const dx = targetPos.x - this.pos.x;
    const dy = targetPos.y - this.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 0) {
      // Teleport 100-150 units toward player
      const teleportDist = Math.min(100 + Math.random() * 50, dist - 30);
      
      if (teleportDist > 0) {
        this.pos.x += (dx / dist) * teleportDist;
        this.pos.y += (dy / dist) * teleportDist;
      }
    }
  }

  draw(ctx) {
    ctx.save();
    
    // Apply fade alpha for teleporter
    if (this.type === 'teleporter' && this.fadeAlpha < 1.0) {
      ctx.globalAlpha = this.fadeAlpha;
    }
    
    ctx.fillStyle = this.color;
    
    // Draw based on shape
    if (this.shape === 'diamond') {
      // Draw diamond (splitter)
      ctx.beginPath();
      ctx.moveTo(this.pos.x, this.pos.y - this.size);
      ctx.lineTo(this.pos.x + this.size, this.pos.y);
      ctx.lineTo(this.pos.x, this.pos.y + this.size);
      ctx.lineTo(this.pos.x - this.size, this.pos.y);
      ctx.closePath();
      ctx.fill();
    } else if (this.shape === 'circle') {
      // Draw circle with pulse effect (bomber)
      const pulseValue = this.pulseTimer ? Math.sin(this.pulseTimer * 6) : 0;
      const pulseScale = 1.0 + pulseValue * 0.15;
      const radius = this.size * pulseScale;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pulse ring
      if (this.pulseTimer) {
        const ringScale = 1.0 + pulseValue * 0.3;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size * ringScale, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (this.shape === 'triangle') {
      // Draw triangle (teleporter)
      ctx.beginPath();
      ctx.moveTo(this.pos.x, this.pos.y - this.size);
      ctx.lineTo(this.pos.x + this.size, this.pos.y + this.size);
      ctx.lineTo(this.pos.x - this.size, this.pos.y + this.size);
      ctx.closePath();
      ctx.fill();
    } else {
      // Draw square (default for basic, fast, tank)
      ctx.fillRect(
        this.pos.x - this.size,
        this.pos.y - this.size,
        this.size * 2,
        this.size * 2
      );
    }
    
    ctx.restore();
  }

  takeDamage() {
    this.health--;
    return this.health <= 0;
  }
}
