/**
 * Wave System
 * Manages wave progression, timing, and state transitions
 */

import { waveData } from '../data/waveData.js';

export const WaveState = {
  BANNER: 'BANNER',           // Showing wave banner
  ACTIVE: 'ACTIVE',           // Wave in progress
  COMPLETE: 'COMPLETE',       // Wave completed, show skill tree
  GAME_COMPLETE: 'GAME_COMPLETE' // All waves completed
};

export class WaveSystem {
  constructor() {
    this.currentWaveIndex = 0;
    this.state = WaveState.BANNER;
    this.waveTimer = 0;
    this.bannerTimer = 0;
    this.waves = waveData.waves;
  }
  
  /**
   * Get current wave configuration
   */
  getCurrentWave() {
    if (this.currentWaveIndex >= this.waves.length) {
      return null;
    }
    return this.waves[this.currentWaveIndex];
  }
  
  /**
   * Get current wave number (1-indexed for display)
   */
  getCurrentWaveNumber() {
    return this.currentWaveIndex + 1;
  }
  
  /**
   * Check if there are more waves
   */
  hasMoreWaves() {
    return this.currentWaveIndex < this.waves.length;
  }
  
  /**
   * Start the next wave (show banner first)
   */
  startNextWave() {
    if (!this.hasMoreWaves()) {
      this.state = WaveState.GAME_COMPLETE;
      return;
    }
    
    this.state = WaveState.BANNER;
    this.bannerTimer = 0;
    this.waveTimer = 0;
  }
  
  /**
   * Start wave 1 (for restart)
   */
  restart() {
    this.currentWaveIndex = 0;
    this.state = WaveState.BANNER;
    this.bannerTimer = 0;
    this.waveTimer = 0;
  }
  
  /**
   * Update wave system state
   */
  update(dt) {
    const wave = this.getCurrentWave();
    if (!wave) return;
    
    switch (this.state) {
      case WaveState.BANNER:
        this.bannerTimer += dt;
        if (this.bannerTimer >= 5.0) {
          // Banner time expired, start wave
          this.state = WaveState.ACTIVE;
          this.waveTimer = 0;
        }
        break;
        
      case WaveState.ACTIVE:
        this.waveTimer += dt;
        if (this.waveTimer >= wave.duration) {
          // Wave completed
          this.state = WaveState.COMPLETE;
        }
        break;
        
      case WaveState.COMPLETE:
        // Waiting for skill tree to be closed and next wave to start
        break;
        
      case WaveState.GAME_COMPLETE:
        // All waves completed
        break;
    }
  }
  
  /**
   * Called when player closes skill tree and advances to next wave
   */
  advanceToNextWave() {
    this.currentWaveIndex++;
    this.startNextWave();
  }
  
  /**
   * Get remaining time in current wave (seconds)
   */
  getWaveTimeRemaining() {
    const wave = this.getCurrentWave();
    if (!wave || this.state !== WaveState.ACTIVE) {
      return 0;
    }
    return Math.max(0, wave.duration - this.waveTimer);
  }
  
  /**
   * Get banner time remaining (seconds)
   */
  getBannerTimeRemaining() {
    if (this.state !== WaveState.BANNER) {
      return 0;
    }
    return Math.max(0, 5.0 - this.bannerTimer);
  }
  
  /**
   * Check if we should spawn an enemy based on wave parameters
   * @param {number} timeSinceLastSpawn - Time in milliseconds since last enemy spawn
   * @returns {boolean}
   */
  shouldSpawnEnemy(timeSinceLastSpawn) {
    const wave = this.getCurrentWave();
    if (!wave || this.state !== WaveState.ACTIVE) {
      return false;
    }
    return timeSinceLastSpawn >= wave.spawnInterval;
  }
  
  /**
   * Get a random enemy type based on wave configuration weights
   */
  getRandomEnemyType() {
    const wave = this.getCurrentWave();
    if (!wave) return null;
    
    // Calculate total weight
    let totalWeight = 0;
    for (const enemyType of wave.enemyTypes) {
      totalWeight += enemyType.weight;
    }
    
    // Random selection based on weight
    let random = Math.random() * totalWeight;
    for (const enemyType of wave.enemyTypes) {
      random -= enemyType.weight;
      if (random <= 0) {
        return enemyType;
      }
    }
    
    // Fallback to first enemy type
    return wave.enemyTypes[0];
  }
  
  /**
   * Check if currently showing banner
   */
  isBannerActive() {
    return this.state === WaveState.BANNER;
  }
  
  /**
   * Check if wave is currently active
   */
  isWaveActive() {
    return this.state === WaveState.ACTIVE;
  }
  
  /**
   * Check if wave is complete
   */
  isWaveComplete() {
    return this.state === WaveState.COMPLETE;
  }
  
  /**
   * Check if all waves are complete
   */
  isGameComplete() {
    return this.state === WaveState.GAME_COMPLETE;
  }
}
