/**
 * CurrencyManager - Handles currency pickup logic
 */

import { CURRENCY_PICKUP_RADIUS } from '../data/gameConfig.js';

export class CurrencyManager {
  /**
   * Update currencies - handle attraction to player and pickup
   * @param {Array} currencies - Array of currency entities
   * @param {number} dt - Delta time
   * @param {Object} playerPos - Player position {x, y}
   * @param {number} playerRadius - Player collision radius
   * @param {Object} canvas - Canvas object for bounds checking
   * @param {Function} onPickup - Callback when currency is picked up (currency)
   * @returns {Array} Array of picked up currencies {type, amount, x, y}
   */
  updateCurrencies(currencies, dt, playerPos, playerRadius, canvas, onPickup = null) {
    const pickedUp = [];

    for (let i = currencies.length - 1; i >= 0; i--) {
      const currency = currencies[i];
      currency.update(dt, playerPos, CURRENCY_PICKUP_RADIUS);
      
      // Check for pickup by player
      const dx = currency.pos.x - playerPos.x;
      const dy = currency.pos.y - playerPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const pickupRadius = playerRadius + currency.size;
      
      if (dist < pickupRadius) {
        // Store pickup info for floating text
        pickedUp.push({
          type: currency.type,
          amount: currency.amount,
          x: currency.pos.x,
          y: currency.pos.y
        });
        
        // Add to skill tree manager if available
        if (window.skillTreeManager) {
          window.skillTreeManager.addCurrency(currency.type, currency.amount);
        }
        
        // Call callback if provided
        if (onPickup) {
          onPickup(currency);
        }
        
        currencies.splice(i, 1);
        continue;
      }
      
      // Remove if expired or out of bounds
      if (currency.isExpired() || currency.isOutOfBounds(canvas.width, canvas.height)) {
        currencies.splice(i, 1);
      }
    }

    return pickedUp;
  }
}
