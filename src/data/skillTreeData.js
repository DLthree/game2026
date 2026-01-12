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
    // Starting skill - no prerequisites
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

    fire_damage: {
      id: 'fire_damage',
      name: 'Fire Damage',
      description: 'Add fire damage over time',
      maxLevel: 1,
      costs: [
        { gold: 150, gems: 5 }
      ],
      prerequisites: ['damage_boost_2'],
      position: { x: 150, y: 300 },
      effects: { fireDamage: true }
    },

    // Speed branch
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
      position: { x: 300, y: 100 },
      effects: { speedMultiplier: 0.1 }
    },

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
      position: { x: 300, y: 200 },
      effects: { speedMultiplier: 0.15 }
    },

    dash: {
      id: 'dash',
      name: 'Dash',
      description: 'Unlock dash ability',
      maxLevel: 1,
      costs: [
        { gold: 200, gems: 8, experience: 50 }
      ],
      prerequisites: ['speed_boost_2'],
      position: { x: 300, y: 300 },
      effects: { dashAbility: true }
    },

    // Defense branch
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

    shield: {
      id: 'shield',
      name: 'Shield',
      description: 'Gain a damage-absorbing shield',
      maxLevel: 1,
      costs: [
        { gold: 300, gems: 10, experience: 100 }
      ],
      prerequisites: ['health_regen'],
      position: { x: 450, y: 300 },
      effects: { shield: true }
    },

    // Attack rate branch
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
      position: { x: 600, y: 100 },
      effects: { attackSpeedMultiplier: 0.15 }
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
      position: { x: 600, y: 200 },
      effects: { attackSpeedMultiplier: 0.2 }
    },

    multishot: {
      id: 'multishot',
      name: 'Multishot',
      description: 'Fire multiple projectiles',
      maxLevel: 1,
      costs: [
        { gold: 400, gems: 15, experience: 150 }
      ],
      prerequisites: ['attack_speed_2', 'damage_boost_2'],
      position: { x: 375, y: 300 },
      effects: { multishot: true }
    }
  }
};

export default skillTreeData;
