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
    
    // Wave 2 - Slightly harder
    {
      id: 2,
      name: "Wave 2",
      duration: 60,
      spawnInterval: 1300,
      enemyTypes: [
        {
          type: 'basic',
          weight: 1.0,
          healthMultiplier: 1.5,
          speedMultiplier: 1.1,
          damageMultiplier: 1.0
        }
      ]
    },
    
    // Wave 3 - Introducing variety
    {
      id: 3,
      name: "Wave 3",
      duration: 60,
      spawnInterval: 1200,
      enemyTypes: [
        {
          type: 'basic',
          weight: 0.7,
          healthMultiplier: 2.0,
          speedMultiplier: 1.2,
          damageMultiplier: 1.0
        },
        {
          type: 'fast',
          weight: 0.3,
          healthMultiplier: 1.0,
          speedMultiplier: 1.8,
          damageMultiplier: 1.0
        }
      ]
    },
    
    // Wave 4 - More pressure
    {
      id: 4,
      name: "Wave 4",
      duration: 60,
      spawnInterval: 1000,
      enemyTypes: [
        {
          type: 'basic',
          weight: 0.6,
          healthMultiplier: 2.5,
          speedMultiplier: 1.3,
          damageMultiplier: 1.5
        },
        {
          type: 'fast',
          weight: 0.4,
          healthMultiplier: 1.5,
          speedMultiplier: 2.0,
          damageMultiplier: 1.0
        }
      ]
    },
    
    // Wave 5 - Midpoint challenge
    {
      id: 5,
      name: "Wave 5",
      duration: 60,
      spawnInterval: 900,
      enemyTypes: [
        {
          type: 'basic',
          weight: 0.5,
          healthMultiplier: 3.0,
          speedMultiplier: 1.4,
          damageMultiplier: 1.5
        },
        {
          type: 'fast',
          weight: 0.3,
          healthMultiplier: 2.0,
          speedMultiplier: 2.2,
          damageMultiplier: 1.5
        },
        {
          type: 'tank',
          weight: 0.2,
          healthMultiplier: 5.0,
          speedMultiplier: 0.8,
          damageMultiplier: 2.0
        }
      ]
    },
    
    // Wave 6 - Increasing difficulty
    {
      id: 6,
      name: "Wave 6",
      duration: 60,
      spawnInterval: 800,
      enemyTypes: [
        {
          type: 'basic',
          weight: 0.4,
          healthMultiplier: 3.5,
          speedMultiplier: 1.5,
          damageMultiplier: 2.0
        },
        {
          type: 'fast',
          weight: 0.3,
          healthMultiplier: 2.5,
          speedMultiplier: 2.5,
          damageMultiplier: 1.5
        },
        {
          type: 'tank',
          weight: 0.3,
          healthMultiplier: 6.0,
          speedMultiplier: 0.9,
          damageMultiplier: 2.5
        }
      ]
    },
    
    // Wave 7 - Heavy assault
    {
      id: 7,
      name: "Wave 7",
      duration: 60,
      spawnInterval: 700,
      enemyTypes: [
        {
          type: 'basic',
          weight: 0.3,
          healthMultiplier: 4.0,
          speedMultiplier: 1.6,
          damageMultiplier: 2.0
        },
        {
          type: 'fast',
          weight: 0.3,
          healthMultiplier: 3.0,
          speedMultiplier: 2.8,
          damageMultiplier: 2.0
        },
        {
          type: 'tank',
          weight: 0.4,
          healthMultiplier: 7.0,
          speedMultiplier: 1.0,
          damageMultiplier: 3.0
        }
      ]
    },
    
    // Wave 8 - Expert level
    {
      id: 8,
      name: "Wave 8",
      duration: 60,
      spawnInterval: 600,
      enemyTypes: [
        {
          type: 'basic',
          weight: 0.25,
          healthMultiplier: 5.0,
          speedMultiplier: 1.7,
          damageMultiplier: 2.5
        },
        {
          type: 'fast',
          weight: 0.35,
          healthMultiplier: 3.5,
          speedMultiplier: 3.0,
          damageMultiplier: 2.0
        },
        {
          type: 'tank',
          weight: 0.4,
          healthMultiplier: 8.5,
          speedMultiplier: 1.1,
          damageMultiplier: 3.5
        }
      ]
    },
    
    // Wave 9 - Almost impossible
    {
      id: 9,
      name: "Wave 9",
      duration: 60,
      spawnInterval: 500,
      enemyTypes: [
        {
          type: 'basic',
          weight: 0.2,
          healthMultiplier: 6.0,
          speedMultiplier: 1.8,
          damageMultiplier: 3.0
        },
        {
          type: 'fast',
          weight: 0.4,
          healthMultiplier: 4.0,
          speedMultiplier: 3.5,
          damageMultiplier: 2.5
        },
        {
          type: 'tank',
          weight: 0.4,
          healthMultiplier: 10.0,
          speedMultiplier: 1.2,
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
      spawnInterval: 2000,
      enemyTypes: [
        {
          type: 'basic',
          weight: 0.3,
          healthMultiplier: 4.0,
          speedMultiplier: 1.5,
          damageMultiplier: 2.0
        },
        {
          type: 'fast',
          weight: 0.7,
          healthMultiplier: 3.0,
          speedMultiplier: 2.5,
          damageMultiplier: 1.5
        }
      ]
    }
  ]
};

export default waveData;
