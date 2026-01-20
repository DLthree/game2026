/**
 * Skill Tree Data Configuration
 * 
 * This file defines the complete skill tree structure including:
 * - Currency types available for purchasing skills
 * - Skill nodes with their properties, costs, and prerequisites
 * - Tree layout positions for UI rendering
 */

export const skillTreeData = {
  currencies: {
    gold: {
      id: 'gold',
      name: 'Gold',
      color: '#FFD700',
      startingAmount: 0
    },
    gems: {
      id: 'gems',
      name: 'Gems',
      color: '#FF69B4',
      startingAmount: 0,
      unlockWave: 2
    },
    shards: {
      id: 'shards',
      name: 'Shards',
      color: '#6A5ACD',
      startingAmount: 0,
      unlockWave: 5
    },
    orbs: {
      id: 'orbs',
      name: 'Orbs',
      color: '#40E0D0',
      startingAmount: 0,
      unlockWave: 8
    },
    experience: {
      id: 'experience',
      name: 'Experience',
      color: '#00CED1',
      startingAmount: 0
    }
  },

  skills: {
    // ===== OFFENSE BRANCH =====
    // Tier 1 - Starting Skills
    damage_boost_1: {
      id: 'damage_boost_1',
      name: 'Damage I',
      description: 'Increase damage by 50% per level',
      maxLevel: 3,
      costs: [
        { gold: 20 },
        { gold: 100 },
        { gold: 500 }
      ],
      prerequisites: [],
      position: { x: 150, y: 100 },
      effects: { damageMultiplier: 0.5 }
    },

    attack_speed_1: {
      id: 'attack_speed_1',
      name: 'Attack Speed I',
      description: 'Increase attack speed by 50% per level',
      maxLevel: 3,
      costs: [
        { gold: 30 },
        { gold: 150 },
        { gold: 750 }
      ],
      prerequisites: [],
      position: { x: 300, y: 100 },
      effects: { attackSpeedMultiplier: 0.5 }
    },

    // Tier 2 - Intermediate Offense Skills
    damage_boost_2: {
      id: 'damage_boost_2',
      name: 'Damage II',
      description: 'Increase damage by 100% per level (locks out Attack Speed II)',
      maxLevel: 3,
      costs: [
        { gold: 1000, gems: 5 },
        { gold: 5000, gems: 10 },
        { gold: 25000, gems: 20 }
      ],
      prerequisites: ['damage_boost_1'],
      position: { x: 150, y: 200 },
      effects: { damageMultiplier: 1.0 },
      locksOut: ['attack_speed_2']
    },

    attack_speed_2: {
      id: 'attack_speed_2',
      name: 'Attack Speed II',
      description: 'Increase attack speed by 100% per level (locks out Damage II)',
      maxLevel: 2,
      costs: [
        { gold: 2000, gems: 5 },
        { gold: 10000, gems: 10 }
      ],
      prerequisites: ['attack_speed_1'],
      position: { x: 300, y: 200 },
      effects: { attackSpeedMultiplier: 1.0 },
      locksOut: ['damage_boost_2']
    },

    critical_strike: {
      id: 'critical_strike',
      name: 'Critical Strike',
      description: 'Gain 20% chance to deal 3× damage per level',
      maxLevel: 2,
      costs: [
        { gold: 1500, gems: 5 },
        { gold: 3000, gems: 10 }
      ],
      prerequisites: ['damage_boost_1'],
      position: { x: 225, y: 200 },
      effects: { criticalChance: 0.2, criticalMultiplier: 3.0 }
    },

    // Tier 3 - Advanced Offense Skills
    piercing_shots: {
      id: 'piercing_shots',
      name: 'Piercing Shots',
      description: 'Projectiles pierce through enemies (mutually exclusive with Fire Damage)',
      maxLevel: 1,
      costs: [
        { gold: 5000, gems: 20, experience: 200 }
      ],
      prerequisites: ['damage_boost_2'],
      position: { x: 150, y: 300 },
      effects: { piercingShots: true },
      mutuallyExclusive: ['fire_damage']
    },

    fire_damage: {
      id: 'fire_damage',
      name: 'Fire Damage',
      description: 'Projectiles inflict burning for 2× base damage over 3s (mutually exclusive with Piercing Shots)',
      maxLevel: 1,
      costs: [
        { gold: 4500, gems: 18, experience: 150 }
      ],
      prerequisites: ['critical_strike'],
      position: { x: 225, y: 300 },
      effects: { fireDamage: true, burnDuration: 3.0, burnMultiplier: 2.0 },
      mutuallyExclusive: ['piercing_shots']
    },

    multishot: {
      id: 'multishot',
      name: 'Multishot',
      description: 'Level 1: fire 2 projectiles; Level 2: fire 4 projectiles (reduces attack speed by 25%)',
      maxLevel: 2,
      costs: [
        { gold: 10000, gems: 40, experience: 300 },
        { gold: 50000, gems: 80, experience: 600 }
      ],
      prerequisites: ['attack_speed_2'],
      position: { x: 300, y: 300 },
      effects: { additionalProjectiles: 1, attackSpeedPenalty: 0.25 }
    },

    // Tier 4 - Ultimate Offense Skill
    explosive_shots: {
      id: 'explosive_shots',
      name: 'Explosive Shots',
      description: 'Projectiles explode on impact, damaging nearby enemies',
      maxLevel: 1,
      costs: [
        { gold: 100000, gems: 400, experience: 800 }
      ],
      prerequisites: ['piercing_shots', 'fire_damage', 'multishot'],
      position: { x: 225, y: 400 },
      effects: { explosiveShots: true, explosionRadius: 60 }
    },

    glass_cannon: {
      id: 'glass_cannon',
      name: 'Glass Cannon',
      description: '+300% damage, -50% max health for 30s; cooldown 60s',
      maxLevel: 1,
      costs: [
        { gold: 8000, gems: 30, experience: 300 }
      ],
      prerequisites: ['damage_boost_2'],
      position: { x: 75, y: 300 },
      effects: { 
        activeAbility: true, 
        damageBonus: 3.0, 
        healthPenalty: 0.5, 
        duration: 30, 
        cooldown: 60 
      },
      mutuallyExclusive: ['lifesteal', 'damage_reduction']
    },

    overclock: {
      id: 'overclock',
      name: 'Overclock',
      description: '+200% attack speed for 20s; disables health regeneration for 30s',
      maxLevel: 1,
      costs: [
        { gold: 10000, gems: 40, experience: 400 }
      ],
      prerequisites: ['attack_speed_2'],
      position: { x: 375, y: 300 },
      effects: { 
        activeAbility: true, 
        attackSpeedBonus: 2.0, 
        duration: 20, 
        regenDisableDuration: 30 
      },
      mutuallyExclusive: ['health_regen']
    },

    // ===== DEFENSE BRANCH =====
    // Tier 1 - Starting Skills
    health_boost_1: {
      id: 'health_boost_1',
      name: 'Health I',
      description: 'Increase max health by 50 per level',
      maxLevel: 5,
      costs: [
        { gold: 20 },
        { gold: 100 },
        { gold: 500 },
        { gold: 2500 },
        { gold: 12500 }
      ],
      prerequisites: [],
      position: { x: 450, y: 100 },
      effects: { healthBonus: 50 }
    },

    // Tier 2 - Intermediate Defense Skills
    health_regen: {
      id: 'health_regen',
      name: 'Regeneration',
      description: 'Regenerate 2 HP per second per level',
      maxLevel: 3,
      costs: [
        { gold: 200, gems: 2 },
        { gold: 1000, gems: 4 },
        { gold: 5000, gems: 8 }
      ],
      prerequisites: ['health_boost_1'],
      position: { x: 450, y: 200 },
      effects: { healthRegen: 2.0 },
      lockedBy: ['overclock']
    },

    damage_reduction: {
      id: 'damage_reduction',
      name: 'Damage Reduction',
      description: 'Reduce incoming damage by 20% per level',
      maxLevel: 3,
      costs: [
        { gold: 500, gems: 2 },
        { gold: 2500, gems: 4 },
        { gold: 12500, gems: 8 }
      ],
      prerequisites: ['health_boost_1'],
      position: { x: 550, y: 200 },
      effects: { damageReduction: 0.2 },
      lockedBy: ['glass_cannon']
    },

    lifesteal: {
      id: 'lifesteal',
      name: 'Lifesteal',
      description: 'Regain 5 HP per enemy defeated per level',
      maxLevel: 2,
      costs: [
        { gold: 750, gems: 3 },
        { gold: 3750, gems: 6 }
      ],
      prerequisites: ['health_boost_1'],
      position: { x: 375, y: 200 },
      effects: { lifestealAmount: 5 },
      lockedBy: ['glass_cannon']
    },

    // Tier 3 - Advanced Defense Skills
    shield: {
      id: 'shield',
      name: 'Shield',
      description: 'Gain a damage-absorbing shield with 100 capacity per level',
      maxLevel: 2,
      costs: [
        { gold: 5000, gems: 20, experience: 200 },
        { gold: 25000, gems: 40, experience: 400 }
      ],
      prerequisites: ['health_regen', 'damage_reduction'],
      position: { x: 500, y: 300 },
      effects: { shieldCapacity: 100 }
    },

    thorns: {
      id: 'thorns',
      name: 'Thorns',
      description: 'Reflect 50% of incoming damage back to attackers',
      maxLevel: 1,
      costs: [
        { gold: 10000, gems: 30, experience: 300 }
      ],
      prerequisites: ['damage_reduction'],
      position: { x: 575, y: 300 },
      effects: { thornsReflection: 0.5 }
    },

    // Tier 4 - Ultimate Defense Skill
    second_chance: {
      id: 'second_chance',
      name: 'Second Chance',
      description: 'Survive one fatal hit with 1 HP',
      maxLevel: 1,
      costs: [
        { gold: 50000, gems: 50, experience: 500 }
      ],
      prerequisites: ['shield', 'thorns'],
      position: { x: 537, y: 400 },
      effects: { secondChance: true }
    },

    // ===== UTILITY BRANCH =====
    // Tier 1 - Starting Skills
    speed_boost_1: {
      id: 'speed_boost_1',
      name: 'Speed I',
      description: 'Increase movement speed by 25% per level',
      maxLevel: 3,
      costs: [
        { gold: 30 },
        { gold: 150 },
        { gold: 750 }
      ],
      prerequisites: [],
      position: { x: 700, y: 100 },
      effects: { speedMultiplier: 0.25 }
    },

    pickup_radius: {
      id: 'pickup_radius',
      name: 'Pickup Radius',
      description: 'Increase currency pickup radius by 50 per level',
      maxLevel: 3,
      costs: [
        { gold: 40 },
        { gold: 200 },
        { gold: 1000 }
      ],
      prerequisites: [],
      position: { x: 800, y: 100 },
      effects: { pickupRadius: 50 }
    },

    // Tier 2 - Intermediate Utility Skills
    speed_boost_2: {
      id: 'speed_boost_2',
      name: 'Speed II',
      description: 'Increase movement speed by 50% per level',
      maxLevel: 2,
      costs: [
        { gold: 500, gems: 2 },
        { gold: 2500, gems: 4 }
      ],
      prerequisites: ['speed_boost_1'],
      position: { x: 700, y: 200 },
      effects: { speedMultiplier: 0.5 }
    },

    gold_bonus: {
      id: 'gold_bonus',
      name: 'Gold Rush',
      description: 'Increase gold gained by 100% per level',
      maxLevel: 3,
      costs: [
        { gold: 500, gems: 2 },
        { gold: 2500, gems: 4 },
        { gold: 12500, gems: 8 }
      ],
      prerequisites: ['pickup_radius'],
      position: { x: 800, y: 200 },
      effects: { goldMultiplier: 1.0 }
    },

    experience_boost: {
      id: 'experience_boost',
      name: 'Experience Boost',
      description: 'Increase experience gained by 100% per level',
      maxLevel: 2,
      costs: [
        { gold: 700, gems: 2 },
        { gold: 3500, gems: 4 }
      ],
      prerequisites: ['pickup_radius'],
      position: { x: 875, y: 200 },
      effects: { experienceMultiplier: 1.0 }
    },

    // Tier 3 - Advanced Utility Skills
    dash: {
      id: 'dash',
      name: 'Dash',
      description: 'Unlock dash ability; level 2 reduces cooldown by 2s',
      maxLevel: 2,
      costs: [
        { gold: 5000, gems: 20, experience: 200 },
        { gold: 25000, gems: 40, experience: 400 }
      ],
      prerequisites: ['speed_boost_2'],
      position: { x: 700, y: 300 },
      effects: { dashAbility: true, dashCooldown: -2 }
    },

    gem_find: {
      id: 'gem_find',
      name: 'Treasure Hunter',
      description: 'Increase gem drop rate by 200%',
      maxLevel: 1,
      costs: [
        { gold: 8000, gems: 30, experience: 300 }
      ],
      prerequisites: ['gold_bonus', 'experience_boost'],
      position: { x: 837, y: 300 },
      effects: { gemDropRate: 2.0 }
    },

    // Tier 4 - Ultimate Utility Skill
    time_warp: {
      id: 'time_warp',
      name: 'Time Warp',
      description: 'Slow down time by 30% for 3 seconds; 60s cooldown',
      maxLevel: 1,
      costs: [
        { gold: 50000, gems: 50, experience: 500 }
      ],
      prerequisites: ['dash', 'gem_find'],
      position: { x: 768, y: 400 },
      effects: { timeWarp: true, timeWarpSlowdown: 0.3, timeWarpDuration: 3, timeWarpCooldown: 60 }
    }
  }
};

export default skillTreeData;
