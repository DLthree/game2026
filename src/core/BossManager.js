/**
 * BossManager - Handles boss spawning, health display, and defeat logic
 */

import { Boss, Currency } from '../entities/index.js';
import { BOSS_GOLD_REWARD, BOSS_GEM_REWARD } from '../data/gameConfig.js';

export class BossManager {
  constructor(bossHealthContainer, bossHealthBar, bossHealthText) {
    this.bossHealthContainer = bossHealthContainer;
    this.bossHealthBar = bossHealthBar;
    this.bossHealthText = bossHealthText;
    this.boss = null;
  }

  /**
   * Spawn a boss at the center of the canvas
   * @param {number} canvasWidth - Width of the canvas
   * @param {number} canvasHeight - Height of the canvas
   * @param {number} bossScale - Boss difficulty scale from wave system
   */
  spawnBoss(canvasWidth, canvasHeight, bossScale = 1.0) {
    const x = canvasWidth / 2;
    const y = canvasHeight / 2;
    this.boss = new Boss(x, y, bossScale);
  }

  /**
   * Update the boss health bar display
   */
  updateHealthBar() {
    if (!this.boss || !this.bossHealthContainer || !this.bossHealthBar || !this.bossHealthText) {
      return;
    }
    
    this.bossHealthContainer.style.display = 'block';
    const healthPercent = this.boss.getHealthPercentage() * 100;
    this.bossHealthBar.style.width = `${healthPercent}%`;
    this.bossHealthText.textContent = `BOSS: ${Math.ceil(this.boss.health)}/${this.boss.maxHealth}`;
  }

  /**
   * Hide the boss health bar
   */
  hideHealthBar() {
    if (this.bossHealthContainer) {
      this.bossHealthContainer.style.display = 'none';
    }
  }

  /**
   * Handle boss defeat - generate rewards and effects
   * @param {Array} currencies - Array to push currency rewards to
   * @param {boolean} isGeometryWars - Whether Geometry Wars mode is active
   * @param {Object} gwRenderer - Geometry Wars renderer for effects
   * @returns {Object} Result containing victory flag and rewards
   */
  handleBossDefeat(currencies, isGeometryWars, gwRenderer) {
    if (!this.boss) {
      return { victory: false };
    }

    const bossScale = this.boss.difficultyScale;
    
    // Scale rewards based on boss difficulty
    const goldReward = Math.floor(BOSS_GOLD_REWARD * bossScale);
    const gemReward = Math.floor(BOSS_GEM_REWARD * bossScale);
    
    // Award scaled rewards
    currencies.push(new Currency(
      this.boss.pos.x, 
      this.boss.pos.y, 
      goldReward, 
      'gold'
    ));
    
    if (window.skillTreeManager) {
      window.skillTreeManager.addCurrency('gems', gemReward);
    }
    
    // Visual effects (scaled intensity)
    if (isGeometryWars && gwRenderer) {
      const effectScale = Math.min(bossScale * 1.5, 2.0);
      gwRenderer.spawnExplosion(this.boss.pos.x, this.boss.pos.y, gwRenderer.colors.explosion, Math.floor(15 * effectScale));
      gwRenderer.addMultiRingShockwave(this.boss.pos.x, this.boss.pos.y, Math.floor(3 * effectScale));
      gwRenderer.addCameraShake(1.0 * effectScale);
      gwRenderer.deformGrid(this.boss.pos.x, this.boss.pos.y, 1.5 * effectScale);
    }
    
    const victory = bossScale >= 0.95; // Only trigger victory for final boss
    
    this.boss = null;
    this.hideHealthBar();
    
    return { victory, goldReward, gemReward };
  }

  /**
   * Clear the current boss
   */
  clear() {
    this.boss = null;
    this.hideHealthBar();
  }

  /**
   * Get the current boss
   * @returns {Boss|null}
   */
  getBoss() {
    return this.boss;
  }
}
