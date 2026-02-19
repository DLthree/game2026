/**
 * Floating Text System
 * Displays damage numbers and currency pickups as floating text
 */

export class FloatingTextSystem {
  constructor() {
    this.texts = [];
  }

  /**
   * Add a floating text
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} text - Text to display
   * @param {string} color - Text color
   * @param {number} duration - How long the text lasts (seconds)
   */
  addText(x, y, text, color = '#FFFFFF', duration = 1.0) {
    this.texts.push({
      x,
      y,
      text,
      color,
      duration,
      age: 0,
      vy: -50 // Velocity upward
    });
  }

  /**
   * Add damage number
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} damage - Damage amount
   */
  addDamage(x, y, damage) {
    this.addText(x, y, `-${Math.ceil(damage)}`, '#FF4444', 0.8);
  }

  /**
   * Add player damage (when hit)
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} damage - Damage amount
   */
  addPlayerDamage(x, y, damage) {
    this.addText(x, y, `-${Math.ceil(damage)}`, '#FF0000', 1.0);
  }

  /**
   * Add currency pickup
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} amount - Currency amount
   * @param {string} type - Currency type
   */
  addCurrency(x, y, amount, type) {
    const colors = {
      'gold': '#FFD700',
      'gems': '#FF69B4',
      'shards': '#6A5ACD',
      'orbs': '#40E0D0',
      'experience': '#00CED1'
    };
    const color = colors[type] || '#FFFFFF';
    this.addText(x, y, `+${amount}`, color, 1.2);
  }

  update(dt) {
    for (let i = this.texts.length - 1; i >= 0; i--) {
      const text = this.texts[i];
      text.age += dt;
      text.y += text.vy * dt;

      if (text.age >= text.duration) {
        this.texts.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const text of this.texts) {
      // Calculate opacity based on age
      const opacity = Math.max(0, 1 - (text.age / text.duration));
      
      ctx.globalAlpha = opacity;
      
      // Draw shadow for better visibility
      ctx.fillStyle = '#000000';
      ctx.fillText(text.text, text.x + 1, text.y + 1);
      
      // Draw main text
      ctx.fillStyle = text.color;
      ctx.fillText(text.text, text.x, text.y);
    }

    ctx.restore();
  }

  clear() {
    this.texts = [];
  }
}
