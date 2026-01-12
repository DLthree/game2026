import { skillTreeData } from '../data/skillTreeData.js';

/**
 * @typedef {Object} SkillState
 * @property {string} id
 * @property {number} currentLevel
 * @property {boolean} unlocked
 */

/**
 * Manages the skill tree state and operations
 * This is a reusable component that can be used across multiple games
 */
export class SkillTreeManager {
  constructor(data = skillTreeData) {
    this.data = data;
    this.currencies = {};
    this.skillStates = {};
    
    this.initializeCurrencies();
    this.initializeSkills();
  }

  initializeCurrencies() {
    for (const [currencyId, currencyData] of Object.entries(this.data.currencies)) {
      this.currencies[currencyId] = currencyData.startingAmount;
    }
  }

  initializeSkills() {
    for (const [skillId, skillData] of Object.entries(this.data.skills)) {
      this.skillStates[skillId] = {
        id: skillId,
        currentLevel: 0,
        unlocked: false
      };
    }
  }

  getCurrency(currencyId) {
    return this.currencies[currencyId] || 0;
  }

  addCurrency(currencyId, amount) {
    if (this.currencies.hasOwnProperty(currencyId)) {
      this.currencies[currencyId] += amount;
    }
  }

  removeCurrency(currencyId, amount) {
    if (this.currencies.hasOwnProperty(currencyId)) {
      this.currencies[currencyId] = Math.max(0, this.currencies[currencyId] - amount);
    }
  }

  getSkillState(skillId) {
    return this.skillStates[skillId];
  }

  getSkillData(skillId) {
    return this.data.skills[skillId];
  }

  canAffordSkill(skillId) {
    const skillState = this.skillStates[skillId];
    const skillData = this.data.skills[skillId];

    if (!skillState || !skillData) {
      return false;
    }

    if (skillState.currentLevel >= skillData.maxLevel) {
      return false;
    }

    const cost = skillData.costs[skillState.currentLevel];
    
    for (const [currencyId, amount] of Object.entries(cost)) {
      if (this.currencies[currencyId] < amount) {
        return false;
      }
    }

    return true;
  }

  arePrerequisitesMet(skillId) {
    const skillData = this.data.skills[skillId];
    
    if (!skillData) {
      return false;
    }

    for (const prereqId of skillData.prerequisites) {
      const prereqState = this.skillStates[prereqId];
      
      if (!prereqState || !prereqState.unlocked) {
        return false;
      }
    }

    return true;
  }

  canPurchaseSkill(skillId) {
    const skillState = this.skillStates[skillId];
    const skillData = this.data.skills[skillId];

    if (!skillState || !skillData) {
      return false;
    }

    if (skillState.currentLevel >= skillData.maxLevel) {
      return false;
    }

    if (!this.arePrerequisitesMet(skillId)) {
      return false;
    }

    return this.canAffordSkill(skillId);
  }

  purchaseSkill(skillId) {
    if (!this.canPurchaseSkill(skillId)) {
      return false;
    }

    const skillState = this.skillStates[skillId];
    const skillData = this.data.skills[skillId];
    const cost = skillData.costs[skillState.currentLevel];

    for (const [currencyId, amount] of Object.entries(cost)) {
      this.removeCurrency(currencyId, amount);
    }

    skillState.currentLevel++;
    skillState.unlocked = true;

    return true;
  }

  getActiveSkills() {
    const activeSkills = [];
    
    for (const [skillId, skillState] of Object.entries(this.skillStates)) {
      if (skillState.unlocked && skillState.currentLevel > 0) {
        activeSkills.push({
          id: skillId,
          level: skillState.currentLevel,
          data: this.data.skills[skillId]
        });
      }
    }

    return activeSkills;
  }

  getSkillEffects() {
    const effects = {};
    
    for (const skill of this.getActiveSkills()) {
      const skillEffects = skill.data.effects;
      
      for (const [effectKey, effectValue] of Object.entries(skillEffects)) {
        if (typeof effectValue === 'number') {
          if (!effects[effectKey]) {
            effects[effectKey] = 0;
          }
          effects[effectKey] += effectValue * skill.level;
        } else if (typeof effectValue === 'boolean') {
          effects[effectKey] = effectValue;
        }
      }
    }

    return effects;
  }

  reset() {
    this.initializeCurrencies();
    this.initializeSkills();
  }

  getAllSkills() {
    return Object.values(this.data.skills);
  }

  getAllCurrencies() {
    return this.data.currencies;
  }

  saveState() {
    return {
      currencies: { ...this.currencies },
      skillStates: JSON.parse(JSON.stringify(this.skillStates))
    };
  }

  loadState(state) {
    if (state.currencies) {
      this.currencies = { ...state.currencies };
    }
    if (state.skillStates) {
      this.skillStates = JSON.parse(JSON.stringify(state.skillStates));
    }
  }
}
