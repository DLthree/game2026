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
      startingAmount: 100
    },
    gems: {
      id: 'gems',
      name: 'Gems',
      color: '#FF69B4',
      startingAmount: 10
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
      description: 'Increase damage by 10%',
      maxLevel: 3,
      costs: [
        { gold: 10 },
        { gold: 20 },
        { gold: 40 }
      ],
      prerequisites: [],
      position: { x: 150, y: 100 },
      effects: { damageMultiplier: 0.1 }
    },

    attack_speed_1: {
      id: 'attack_speed_1',
      name: 'Attack Speed I',
      description: 'Increase attack speed by 15%',
      maxLevel: 3,
      costs: [
        { gold: 20 },
        { gold: 40 },
        { gold: 80 }
      ],
      prerequisites: [],
      position: { x: 300, y: 100 },
      effects: { attackSpeedMultiplier: 0.15 }
    },

    // Tier 2 - Intermediate Offense Skills
    damage_boost_2: {
      id: 'damage_boost_2',
      name: 'Damage II',
      description: 'Further increase damage by 15%',
      maxLevel: 3,
      costs: [
        { gold: 50, gems: 1 },
        { gold: 100, gems: 2 },
        { gold: 200, gems: 4 }
      ],
      prerequisites: ['damage_boost_1'],
      position: { x: 150, y: 200 },
      effects: { damageMultiplier: 0.15 }
    },

    attack_speed_2: {
      id: 'attack_speed_2',
      name: 'Attack Speed II',
      description: 'Further increase attack speed by 20%',
      maxLevel: 2,
      costs: [
        { gold: 100, gems: 3 },
        { gold: 200, gems: 6 }
      ],
      prerequisites: ['attack_speed_1'],
      position: { x: 300, y: 200 },
      effects: { attackSpeedMultiplier: 0.2 }
    },

    critical_strike: {
      id: 'critical_strike',
      name: 'Critical Strike',
      description: 'Gain 15% chance to deal double damage',
      maxLevel: 2,
      costs: [
        { gold: 80, gems: 2 },
        { gold: 160, gems: 5 }
      ],
      prerequisites: ['damage_boost_1'],
      position: { x: 225, y: 200 },
      effects: { criticalChance: 0.15 }
    },

    // Tier 3 - Advanced Offense Skills
    piercing_shots: {
      id: 'piercing_shots',
      name: 'Piercing Shots',
      description: 'Projectiles pierce through enemies',
      maxLevel: 1,
      costs: [
        { gold: 200, gems: 8, experience: 50 }
      ],
      prerequisites: ['damage_boost_2'],
      position: { x: 150, y: 300 },
      effects: { piercingShots: true }
    },

    fire_damage: {
      id: 'fire_damage',
      name: 'Fire Damage',
      description: 'Add fire damage over time effect',
      maxLevel: 1,
      costs: [
        { gold: 180, gems: 7, experience: 40 }
      ],
      prerequisites: ['critical_strike'],
      position: { x: 225, y: 300 },
      effects: { fireDamage: true }
    },

    multishot: {
      id: 'multishot',
      name: 'Multishot',
      description: 'Fire two projectiles at once',
      maxLevel: 2,
      costs: [
        { gold: 250, gems: 10, experience: 60 },
        { gold: 500, gems: 20, experience: 120 }
      ],
      prerequisites: ['attack_speed_2'],
      position: { x: 300, y: 300 },
      effects: { projectileCount: 1 }
    },

    // Tier 4 - Ultimate Offense Skill
    explosive_shots: {
      id: 'explosive_shots',
      name: 'Explosive Shots',
      description: 'Projectiles explode on impact, damaging nearby enemies',
      maxLevel: 1,
      costs: [
        { gold: 600, gems: 25, experience: 200 }
      ],
      prerequisites: ['piercing_shots', 'fire_damage', 'multishot'],
      position: { x: 225, y: 400 },
      effects: { explosiveShots: true }
    },

    // ===== DEFENSE BRANCH =====
    // Tier 1 - Starting Skills
    health_boost_1: {
      id: 'health_boost_1',
      name: 'Health I',
      description: 'Increase max health by 20',
      maxLevel: 5,
      costs: [
        { gold: 12 },
        { gold: 24 },
        { gold: 48 },
        { gold: 96 },
        { gold: 192 }
      ],
      prerequisites: [],
      position: { x: 450, y: 100 },
      effects: { healthBonus: 20 }
    },

    // Tier 2 - Intermediate Defense Skills
    health_regen: {
      id: 'health_regen',
      name: 'Regeneration',
      description: 'Slowly regenerate health over time',
      maxLevel: 3,
      costs: [
        { gold: 60, gems: 1 },
        { gold: 120, gems: 3 },
        { gold: 240, gems: 6 }
      ],
      prerequisites: ['health_boost_1'],
      position: { x: 450, y: 200 },
      effects: { healthRegen: 0.5 }
    },

    damage_reduction: {
      id: 'damage_reduction',
      name: 'Damage Reduction',
      description: 'Reduce incoming damage by 10%',
      maxLevel: 3,
      costs: [
        { gold: 70, gems: 2 },
        { gold: 140, gems: 4 },
        { gold: 280, gems: 8 }
      ],
      prerequisites: ['health_boost_1'],
      position: { x: 550, y: 200 },
      effects: { damageReduction: 0.1 }
    },

    lifesteal: {
      id: 'lifesteal',
      name: 'Lifesteal',
      description: 'Regain 2 health per enemy defeated',
      maxLevel: 2,
      costs: [
        { gold: 90, gems: 3 },
        { gold: 180, gems: 6 }
      ],
      prerequisites: ['health_boost_1'],
      position: { x: 375, y: 200 },
      effects: { lifestealAmount: 2 }
    },

    // Tier 3 - Advanced Defense Skills
    shield: {
      id: 'shield',
      name: 'Shield',
      description: 'Gain a damage-absorbing shield with 50 capacity',
      maxLevel: 2,
      costs: [
        { gold: 250, gems: 10, experience: 80 },
        { gold: 500, gems: 20, experience: 160 }
      ],
      prerequisites: ['health_regen', 'damage_reduction'],
      position: { x: 500, y: 300 },
      effects: { shieldCapacity: 50 }
    },

    thorns: {
      id: 'thorns',
      name: 'Thorns',
      description: 'Reflect 25% of damage back to attackers',
      maxLevel: 1,
      costs: [
        { gold: 220, gems: 9, experience: 70 }
      ],
      prerequisites: ['damage_reduction'],
      position: { x: 575, y: 300 },
      effects: { thornsReflection: 0.25 }
    },

    // Tier 4 - Ultimate Defense Skill
    second_chance: {
      id: 'second_chance',
      name: 'Second Chance',
      description: 'Once per game, survive a fatal hit with 1 HP',
      maxLevel: 1,
      costs: [
        { gold: 700, gems: 30, experience: 250 }
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
      description: 'Increase movement speed by 10%',
      maxLevel: 3,
      costs: [
        { gold: 15 },
        { gold: 30 },
        { gold: 60 }
      ],
      prerequisites: [],
      position: { x: 700, y: 100 },
      effects: { speedMultiplier: 0.1 }
    },

    pickup_radius: {
      id: 'pickup_radius',
      name: 'Currency Magnet',
      description: 'Increase currency pickup radius by 30',
      maxLevel: 3,
      costs: [
        { gold: 18 },
        { gold: 36 },
        { gold: 72 }
      ],
      prerequisites: [],
      position: { x: 800, y: 100 },
      effects: { pickupRadius: 30 }
    },

    // Tier 2 - Intermediate Utility Skills
    speed_boost_2: {
      id: 'speed_boost_2',
      name: 'Speed II',
      description: 'Further increase speed by 15%',
      maxLevel: 2,
      costs: [
        { gold: 80, gems: 2 },
        { gold: 160, gems: 4 }
      ],
      prerequisites: ['speed_boost_1'],
      position: { x: 700, y: 200 },
      effects: { speedMultiplier: 0.15 }
    },

    gold_bonus: {
      id: 'gold_bonus',
      name: 'Gold Rush',
      description: 'Increase gold gained by 25%',
      maxLevel: 3,
      costs: [
        { gold: 50, gems: 1 },
        { gold: 100, gems: 2 },
        { gold: 200, gems: 4 }
      ],
      prerequisites: ['pickup_radius'],
      position: { x: 800, y: 200 },
      effects: { goldMultiplier: 0.25 }
    },

    experience_boost: {
      id: 'experience_boost',
      name: 'Wisdom',
      description: 'Increase experience gained by 30%',
      maxLevel: 2,
      costs: [
        { gold: 70, gems: 2 },
        { gold: 140, gems: 4 }
      ],
      prerequisites: ['pickup_radius'],
      position: { x: 875, y: 200 },
      effects: { experienceMultiplier: 0.3 }
    },

    // Tier 3 - Advanced Utility Skills
    dash: {
      id: 'dash',
      name: 'Dash',
      description: 'Unlock dash ability with 5 second cooldown',
      maxLevel: 2,
      costs: [
        { gold: 200, gems: 8, experience: 60 },
        { gold: 400, gems: 16, experience: 120 }
      ],
      prerequisites: ['speed_boost_2'],
      position: { x: 700, y: 300 },
      effects: { dashAbility: true, dashCooldown: -1 }
    },

    gem_find: {
      id: 'gem_find',
      name: 'Treasure Hunter',
      description: 'Increase gem drop rate by 50%',
      maxLevel: 1,
      costs: [
        { gold: 180, gems: 7, experience: 50 }
      ],
      prerequisites: ['gold_bonus', 'experience_boost'],
      position: { x: 837, y: 300 },
      effects: { gemDropRate: 0.5 }
    },

    // Tier 4 - Ultimate Utility Skill
    time_warp: {
      id: 'time_warp',
      name: 'Time Warp',
      description: 'Slow down time by 30% for 3 seconds when activated',
      maxLevel: 1,
      costs: [
        { gold: 650, gems: 28, experience: 230 }
      ],
      prerequisites: ['dash', 'gem_find'],
      position: { x: 768, y: 400 },
      effects: { timeWarp: true }
    }
  }
};

export default skillTreeData;
