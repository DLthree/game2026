import { Game } from './core/Game.js';

// Initialize game when DOM is loaded
const canvas = document.getElementById('gameCanvas');

if (!canvas) {
  throw new Error('Canvas element not found');
}

const game = new Game(canvas);
game.start();
