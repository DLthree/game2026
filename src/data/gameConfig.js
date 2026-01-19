/**
 * Game configuration and balance constants
 * Centralized location for all tweakable game parameters
 */

// Canvas dimensions
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

// Player constants
export const PLAYER_SPEED = 200;
export const PLAYER_START_HEALTH = 100;
export const PLAYER_MAX_HEALTH = 100;

// Combat constants
export const BULLET_RANGE = 300;
export const BULLET_SPEED = 300;
export const AUTO_SHOOT_RANGE = 250;
export const AUTO_SHOOT_INTERVAL = 500; // milliseconds

// Wave rewards
export const WAVE_COMPLETE_HEALTH_REWARD = 30;

// Boss rewards
export const BOSS_GOLD_REWARD = 500;
export const BOSS_GEM_REWARD = 20;

// Currency system
export const CURRENCY_PICKUP_RADIUS = 100;
export const ENEMY_GOLD_DROP = 10;

// Wave banner physics
export const BANNER_BOUNCE_MULTIPLIER = 3.0;
export const BANNER_BASE_PUSH_FORCE = 100;

// Movement and physics thresholds
export const TAP_MOVE_STOP_DISTANCE = 5; // Stop moving when within this distance
export const MOVEMENT_VELOCITY_THRESHOLD = 10; // Threshold for considering player "moving"
export const TRAIL_SPAWN_PROBABILITY = 0.3; // Chance to spawn trail particle per frame
