/**
 * @typedef {Object} Vector2
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} Circle
 * @property {Vector2} pos
 * @property {Vector2} vel
 * @property {number} radius
 * @property {string} color
 */

/**
 * @typedef {Object} Square
 * @property {Vector2} pos
 * @property {Vector2} vel
 * @property {number} size
 * @property {string} color
 * @property {number} health
 */

/**
 * @typedef {Object} Triangle
 * @property {Vector2} pos
 * @property {Vector2} vel
 * @property {number} size
 * @property {string} color
 */

/**
 * @typedef {Object} GameState
 * @property {Circle} player
 * @property {Square[]} enemies
 * @property {Triangle[]} projectiles
 * @property {number} score
 * @property {number} health
 * @property {boolean} isGameOver
 * @property {number} lastEnemySpawn
 * @property {number} lastShot
 * @property {Vector2 | null} targetPos
 */

export {};
