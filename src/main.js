import { Game } from './core/Game.js';
import { SkillTreeManager, SkillTreeUI } from './skilltree/index.js';

// Initialize game when DOM is loaded
const canvas = document.getElementById('gameCanvas');

if (!canvas) {
  throw new Error('Canvas element not found');
}

const game = new Game(canvas);
game.start();

// Initialize skill tree
const skillTreeManager = new SkillTreeManager();
const skillTreeUI = new SkillTreeUI(skillTreeManager, 'skillTreeContent');

// Setup skill tree toggle
const toggleButton = document.getElementById('skillTreeToggle');
const closeButton = document.getElementById('skillTreeClose');

toggleButton.addEventListener('click', () => {
  if (skillTreeUI.isVisible()) {
    skillTreeUI.hide();
    game.resume();
  } else {
    game.pause();
    skillTreeUI.show();
  }
});

closeButton.addEventListener('click', () => {
  skillTreeUI.hide();
  game.resume();
});

// Export for potential game integration
window.skillTreeManager = skillTreeManager;
window.skillTreeUI = skillTreeUI;

