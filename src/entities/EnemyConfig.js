/**
 * Enemy configuration constants
 * Centralizes all enemy type definitions for easier maintenance
 */

// Base values
export const BASE_HEALTH = 1;
export const BASE_SPEED = 50;
export const BASE_SIZE = 15;
export const BASE_DAMAGE = 10;

// Bomber constants
export const BOMBER_EXPLOSION_RADIUS = 80;
export const BOMBER_EXPLOSION_DAMAGE = 15;
export const BOMBER_PULSE_FREQUENCY = 6;
export const BOMBER_PULSE_SCALE = 0.15;
export const BOMBER_RING_SCALE = 0.3;
export const BOMBER_RING_ALPHA = 0.5;
export const BOMBER_RING_LINE_WIDTH = 2;

// Teleporter constants
export const TELEPORTER_MIN_DISTANCE = 100;
export const TELEPORTER_MAX_DISTANCE = 150;
export const TELEPORTER_COOLDOWN = 3.5;
export const TELEPORTER_MIN_PLAYER_DISTANCE = 30;
export const TELEPORTER_FADE_DURATION = 0.3;
export const TELEPORTER_INITIAL_DELAY_MIN = 3; // Minimum initial delay before first teleport
export const TELEPORTER_INITIAL_DELAY_MAX = 5; // Maximum initial delay (min + 2)

// Splitter constants
export const SPLITTER_MIN_CHILDREN = 2;
export const SPLITTER_MAX_CHILDREN = 3;
export const SPLITTER_CHILD_HEALTH_MULTIPLIER = 0.5;
export const SPLITTER_CHILD_SPEED_MULTIPLIER = 1.2;
export const SPLITTER_CHILD_DAMAGE_MULTIPLIER = 0.5;
export const SPLITTER_CHILD_SIZE_MULTIPLIER = 0.66;
export const SPLITTER_CHILD_MIN_SPEED = 100;
export const SPLITTER_CHILD_MAX_SPEED = 150;

/**
 * Enemy type configurations
 * Maps enemy types to their visual and behavioral properties
 */
export const ENEMY_TYPES = {
  basic: {
    sizeMultiplier: 1.0,
    color: '#ff0000',
    shape: 'square'
  },
  fast: {
    sizeMultiplier: 0.8,
    color: '#ff6600',
    shape: 'square'
  },
  tank: {
    sizeMultiplier: 1.5,
    color: '#cc0000',
    shape: 'square'
  },
  asteroid: {
    sizeMultiplier: 1.2,
    color: '#00ccff',
    shape: 'diamond',
    hasConstantVelocity: true
  },
  splitter: {
    sizeMultiplier: 1.1,
    color: '#9c27b0',
    shape: 'diamond',
    splitOnDeath: true
  },
  splitter_child: {
    sizeMultiplier: SPLITTER_CHILD_SIZE_MULTIPLIER,
    color: '#9c27b0',
    shape: 'diamond',
    splitOnDeath: false
  },
  bomber: {
    sizeMultiplier: 0.9,
    color: '#ff9800',
    shape: 'circle',
    explosionRadius: BOMBER_EXPLOSION_RADIUS,
    explosionDamage: BOMBER_EXPLOSION_DAMAGE,
    hasPulse: true
  },
  teleporter: {
    sizeMultiplier: 0.85,
    color: '#00bcd4',
    shape: 'triangle',
    canTeleport: true
  }
};
