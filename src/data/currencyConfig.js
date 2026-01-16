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

// Default currency rewards for fallback scenarios
export const DEFAULT_CURRENCY_REWARDS = {
  gold: 10,
  experience: 5,
  gemDropRate: 0.1,
  gemAmount: 1
};
