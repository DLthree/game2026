/**
 * Wave System Data Configuration
 * 
 * Each wave defines:
 * - Enemy types and spawn rates
 * - Wave duration
 * - Enemy strength multipliers
 */

export const waveData = {
  waves: [
    // Wave 1 - Tutorial
    {
      id: 1,
      name: "Wave 1",
      duration: 60, // seconds
      spawnInterval: 1500, // milliseconds between enemy spawns
      enemyTypes: [
        {
          type: 'asteroid',
          weight: 1.0,
          healthMultiplier: 1.0,
          speedMultiplier: 0.8,
          damageMultiplier: 1.0
        }
      ]
    },
    
    // Wave 2 - Warm Up
    {
      id: 2,
      name: "Wave 2",
      duration: 60,
      spawnInterval: 1200,
      enemyTypes: [
        {
          type: 'asteroid',
          weight: 0.8,
          healthMultiplier: 1.5,
          speedMultiplier: 0.9,
          damageMultiplier: 1.0
        },
        {
          type: 'basic',
          weight: 0.2,
          healthMultiplier: 2.0,
          speedMultiplier: 1.1,
          damageMultiplier: 1.0
        }
      ]
    },
    
    // Wave 3 - First Wall / Mini-Boss
    {
      id: 3,
      name: "Wave 3 - MINI BOSS",
      duration: 90,
      isBossWave: true,
      bossScale: 0.5, // 50% strength of final boss
      spawnInterval: 1800,
      enemyTypes: [
        {
          type: 'asteroid',
          weight: 0.5,
          healthMultiplier: 5.0,
          speedMultiplier: 1.0,
          damageMultiplier: 1.0
        },
        {
          type: 'basic',
          weight: 0.3,
          healthMultiplier: 10.0,
          speedMultiplier: 1.2,
          damageMultiplier: 2.0
        },
        {
          type: 'fast',
          weight: 0.15,
          healthMultiplier: 5.0,
          speedMultiplier: 2.0,
          damageMultiplier: 1.5
        },
        {
          type: 'tank',
          weight: 0.05,
          healthMultiplier: 15.0,
          speedMultiplier: 0.8,
          damageMultiplier: 3.0
        }
      ]
    },
    
    // Wave 4 - Recovery / Build
    {
      id: 4,
      name: "Wave 4",
      duration: 60,
      spawnInterval: 800,
      enemyTypes: [
        {
          type: 'asteroid',
          weight: 0.4,
          healthMultiplier: 2.0,
          speedMultiplier: 1.1,
          damageMultiplier: 1.0
        },
        {
          type: 'basic',
          weight: 0.4,
          healthMultiplier: 3.0,
          speedMultiplier: 1.3,
          damageMultiplier: 1.5
        },
        {
          type: 'fast',
          weight: 0.2,
          healthMultiplier: 2.0,
          speedMultiplier: 2.2,
          damageMultiplier: 1.2
        }
      ]
    },
    
    // Wave 5 - Midpoint Challenge
    {
      id: 5,
      name: "Wave 5",
      duration: 75,
      spawnInterval: 1000,
      enemyTypes: [
        {
          type: 'asteroid',
          weight: 0.3,
          healthMultiplier: 10.0,
          speedMultiplier: 1.3,
          damageMultiplier: 1.5
        },
        {
          type: 'basic',
          weight: 0.25,
          healthMultiplier: 15.0,
          speedMultiplier: 1.5,
          damageMultiplier: 2.0
        },
        {
          type: 'fast',
          weight: 0.2,
          healthMultiplier: 8.0,
          speedMultiplier: 2.5,
          damageMultiplier: 1.5
        },
        {
          type: 'tank',
          weight: 0.15,
          healthMultiplier: 25.0,
          speedMultiplier: 0.9,
          damageMultiplier: 3.0
        },
        {
          type: 'elite',
          weight: 0.1,
          healthMultiplier: 30.0,
          speedMultiplier: 1.0,
          damageMultiplier: 4.0
        }
      ]
    },
    
    // Wave 6 - Mid Boss Wall
    {
      id: 6,
      name: "Wave 6 - MID BOSS",
      duration: 120,
      isBossWave: true,
      bossScale: 0.8, // 80% strength of final boss
      spawnInterval: 1500,
      enemyTypes: [
        {
          type: 'asteroid',
          weight: 0.15,
          healthMultiplier: 25.0,
          speedMultiplier: 1.3,
          damageMultiplier: 2.0
        },
        {
          type: 'basic',
          weight: 0.25,
          healthMultiplier: 30.0,
          speedMultiplier: 1.5,
          damageMultiplier: 3.0
        },
        {
          type: 'fast',
          weight: 0.2,
          healthMultiplier: 20.0,
          speedMultiplier: 3.0,
          damageMultiplier: 2.0
        },
        {
          type: 'tank',
          weight: 0.2,
          healthMultiplier: 40.0,
          speedMultiplier: 1.0,
          damageMultiplier: 4.0
        },
        {
          type: 'splitter',
          weight: 0.1,
          healthMultiplier: 15.0,
          speedMultiplier: 1.2,
          damageMultiplier: 1.5
        },
        {
          type: 'shielded',
          weight: 0.1,
          healthMultiplier: 15.0,
          speedMultiplier: 1.2,
          damageMultiplier: 1.5
        }
      ]
    },
    
    // Wave 7 - Heavy Assault
    {
      id: 7,
      name: "Wave 7",
      duration: 60,
      spawnInterval: 700,
      enemyTypes: [
        {
          type: 'asteroid',
          weight: 0.15,
          healthMultiplier: 10.0,
          speedMultiplier: 1.4,
          damageMultiplier: 2.0
        },
        {
          type: 'basic',
          weight: 0.25,
          healthMultiplier: 15.0,
          speedMultiplier: 1.6,
          damageMultiplier: 2.0
        },
        {
          type: 'fast',
          weight: 0.2,
          healthMultiplier: 10.0,
          speedMultiplier: 3.0,
          damageMultiplier: 2.0
        },
        {
          type: 'tank',
          weight: 0.25,
          healthMultiplier: 20.0,
          speedMultiplier: 1.1,
          damageMultiplier: 3.5
        },
        {
          type: 'splitter',
          weight: 0.1,
          healthMultiplier: 12.0,
          speedMultiplier: 1.3,
          damageMultiplier: 1.5
        },
        {
          type: 'bomber',
          weight: 0.05,
          healthMultiplier: 8.0,
          speedMultiplier: 0.9,
          damageMultiplier: 2.0
        },
        {
          type: 'shielded',
          weight: 0.05,
          healthMultiplier: 12.0,
          speedMultiplier: 1.2,
          damageMultiplier: 2.0
        }
      ]
    },
    
    // Wave 8 - Expert Level
    {
      id: 8,
      name: "Wave 8",
      duration: 60,
      spawnInterval: 500,
      enemyTypes: [
        {
          type: 'asteroid',
          weight: 0.1,
          healthMultiplier: 30.0,
          speedMultiplier: 1.5,
          damageMultiplier: 3.0
        },
        {
          type: 'basic',
          weight: 0.2,
          healthMultiplier: 40.0,
          speedMultiplier: 1.7,
          damageMultiplier: 3.0
        },
        {
          type: 'fast',
          weight: 0.25,
          healthMultiplier: 25.0,
          speedMultiplier: 4.0,
          damageMultiplier: 2.5
        },
        {
          type: 'tank',
          weight: 0.3,
          healthMultiplier: 50.0,
          speedMultiplier: 1.1,
          damageMultiplier: 4.0
        },
        {
          type: 'splitter',
          weight: 0.1,
          healthMultiplier: 20.0,
          speedMultiplier: 1.3,
          damageMultiplier: 2.0
        },
        {
          type: 'bomber',
          weight: 0.05,
          healthMultiplier: 15.0,
          speedMultiplier: 1.0,
          damageMultiplier: 3.0
        },
        {
          type: 'shielded',
          weight: 0.05,
          healthMultiplier: 18.0,
          speedMultiplier: 1.2,
          damageMultiplier: 3.0
        }
      ]
    },
    
    // Wave 9 - Final Wall / Gauntlet
    {
      id: 9,
      name: "Wave 9",
      duration: 90,
      spawnInterval: 600,
      enemyTypes: [
        {
          type: 'asteroid',
          weight: 0.08,
          healthMultiplier: 50.0,
          speedMultiplier: 1.6,
          damageMultiplier: 4.0
        },
        {
          type: 'basic',
          weight: 0.15,
          healthMultiplier: 60.0,
          speedMultiplier: 1.8,
          damageMultiplier: 4.0
        },
        {
          type: 'fast',
          weight: 0.3,
          healthMultiplier: 40.0,
          speedMultiplier: 4.0,
          damageMultiplier: 3.0
        },
        {
          type: 'tank',
          weight: 0.32,
          healthMultiplier: 80.0,
          speedMultiplier: 1.2,
          damageMultiplier: 5.0
        },
        {
          type: 'splitter',
          weight: 0.1,
          healthMultiplier: 30.0,
          speedMultiplier: 1.4,
          damageMultiplier: 3.0
        },
        {
          type: 'bomber',
          weight: 0.05,
          healthMultiplier: 20.0,
          speedMultiplier: 1.0,
          damageMultiplier: 3.0
        },
        {
          type: 'shielded',
          weight: 0.05,
          healthMultiplier: 25.0,
          speedMultiplier: 1.3,
          damageMultiplier: 4.0
        }
      ]
    },
    
    // Wave 10 - Final Boss
    {
      id: 10,
      name: "Wave 10 - FINAL BOSS",
      duration: 120,
      isBossWave: true,
      bossScale: 1.0,
      spawnInterval: 2000,
      enemyTypes: [
        {
          type: 'fast',
          weight: 0.7,
          healthMultiplier: 40.0,
          speedMultiplier: 2.5,
          damageMultiplier: 1.5
        },
        {
          type: 'basic',
          weight: 0.3,
          healthMultiplier: 50.0,
          speedMultiplier: 1.5,
          damageMultiplier: 2.0
        }
      ]
    }
  ]
};

export default waveData;
