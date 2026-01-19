/**
 * Math utility functions
 * Common mathematical operations used throughout the game
 */

/**
 * Calculate Euclidean distance between two points
 * Assumes valid numeric inputs; no bounds checking is performed
 * @param {number} x1 - First point x coordinate
 * @param {number} y1 - First point y coordinate
 * @param {number} x2 - Second point x coordinate
 * @param {number} y2 - Second point y coordinate
 * @returns {number} Distance between the two points
 */
export function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate distance between two position objects
 * @param {Object} pos1 - First position {x, y}
 * @param {Object} pos2 - Second position {x, y}
 * @returns {number} Distance between the two positions
 */
export function distanceBetween(pos1, pos2) {
  return distance(pos1.x, pos1.y, pos2.x, pos2.y);
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values
 * When t is outside 0-1 range, the function extrapolates beyond a and b
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation factor (typically 0-1, but extrapolates if outside range)
 * @returns {number} Interpolated value
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}
