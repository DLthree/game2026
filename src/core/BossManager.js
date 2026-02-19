/**
 * BossManager - Handles boss spawning, health display, and defeat logic
 */

import { Boss, Currency } from '../entities/index.js';
import { BOSS_GOLD_REWARD, BOSS_GEM_REWARD, BOSS_SHARD_REWARD, BOSS_ORB_REWARD } from '../data/gameConfig.js';

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
    
    // Boss scale thresholds - these correspond to the wave scales:
    // Wave 3 mini-boss: 0.5 scale
    // Wave 6 mid-boss: 0.8 scale  
    // Wave 10 final boss: 1.0 scale
    const FINAL_BOSS_THRESHOLD = 0.95;  // >= 0.95 is considered final boss
    const MID_BOSS_THRESHOLD = 0.7;     // >= 0.7 is considered mid-boss
    
    // Determine rewards based on boss difficulty scale
    // Mini-boss (scale 0.5): 5 gems, 1 shard
    // Mid-boss (scale 0.8): 20 gems, 5 shards
    // Final boss (scale 1.0): 50 gems, 5 shards, 1 orb
    let goldReward = Math.floor(BOSS_GOLD_REWARD * bossScale);
    let gemReward = 0;
    let shardReward = 0;
    let orbReward = 0;
    
    if (bossScale >= FINAL_BOSS_THRESHOLD) {
      // Final boss (Wave 10)
      gemReward = 50;
      shardReward = 5;
      orbReward = 1;
    } else if (bossScale >= MID_BOSS_THRESHOLD) {
      // Mid-boss (Wave 6)
      gemReward = 20;
      shardReward = 5;
    } else {
      // Mini-boss (Wave 3)
      gemReward = 5;
      shardReward = 1;
    }
    
    // Award gold as currency drop
    currencies.push(new Currency(
      this.boss.pos.x, 
      this.boss.pos.y, 
      goldReward, 
      'gold'
    ));
    
    // Award other currencies directly to skill tree
    if (window.skillTreeManager) {
      if (gemReward > 0) {
        window.skillTreeManager.addCurrency('gems', gemReward);
      }
      if (shardReward > 0) {
        window.skillTreeManager.addCurrency('shards', shardReward);
      }
      if (orbReward > 0) {
        window.skillTreeManager.addCurrency('orbs', orbReward);
      }
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
    
    return { victory, goldReward, gemReward, shardReward, orbReward };
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
