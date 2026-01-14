/**
 * @typedef {import('../types/index.js').Square} Square
 * @typedef {import('../types/index.js').Vector2} Vector2
 */

/**
 * @implements {Square}
 */
export class Enemy {
  constructor(x, y, enemyType = null) {
    this.pos = { x, y };
    this.vel = { x: 0, y: 0 };
    
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
        // Asteroids start with random velocity direction
        const angle = Math.random() * Math.PI * 2;
        this.vel.x = Math.cos(angle) * this.speed;
        this.vel.y = Math.sin(angle) * this.speed;
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
    
    // Other enemy types chase the player
    const dx = targetPos.x - this.pos.x;
    const dy = targetPos.y - this.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    this.vel.x = (dx / dist) * this.speed;
    this.vel.y = (dy / dist) * this.speed;
    
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.pos.x - this.size,
      this.pos.y - this.size,
      this.size * 2,
      this.size * 2
    );
  }

  takeDamage() {
    this.health--;
    return this.health <= 0;
  }
}
