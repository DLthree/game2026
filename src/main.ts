import { Game } from './core/Game.ts';

// Initialize game when DOM is loaded
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

if (!canvas) {
  throw new Error('Canvas element not found');
}

const game = new Game(canvas);
game.start();
