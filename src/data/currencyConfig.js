/**
 * Currency Configuration Constants
 * Single source of truth for currency-related data
 */

// Import currency colors from skillTreeData to maintain consistency
import { skillTreeData } from './skillTreeData.js';

// Currency colors exported from skill tree data
export const CURRENCY_COLORS = {
  gold: skillTreeData.currencies.gold.color,
  gems: skillTreeData.currencies.gems.color,
  experience: skillTreeData.currencies.experience.color
};

// Default currency rewards by enemy type
export const DEFAULT_CURRENCY_REWARDS_BY_TYPE = {
  asteroid: {
    gold: 8,
    experience: 5,
    gemDropRate: 0.1,
    gemAmount: 1
  },
  basic: {
    gold: 10,
    experience: 5,
    gemDropRate: 0.1,
    gemAmount: 1
  },
  fast: {
    gold: 8,
    experience: 8,
    gemDropRate: 0.15,
    gemAmount: 1
  },
  tank: {
    gold: 15,
    experience: 15,
    gemDropRate: 0.3,
    gemAmount: 2
  }
};

// Generic fallback for unknown types
export const DEFAULT_CURRENCY_REWARDS = DEFAULT_CURRENCY_REWARDS_BY_TYPE.basic;

