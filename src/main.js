import { Game } from './core/Game.js';
import { SkillTreeManager, SkillTreeUI } from './skilltree/index.js';
import { StyleNames } from './systems/index.js';

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
const nextWaveButton = document.getElementById('nextWaveButton');
const waveCompleteSkillTreeButton = document.getElementById('waveCompleteSkillTreeButton');
const gameOverSkillTreeButton = document.getElementById('gameOverSkillTreeButton');
const gameOverRestartButton = document.getElementById('gameOverRestartButton');
const debugSkipButton = document.getElementById('debugSkipButton');
const debugNextWaveButton = document.getElementById('debugNextWaveButton');

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

nextWaveButton.addEventListener('click', () => {
  game.advanceToNextWave();
});

waveCompleteSkillTreeButton.addEventListener('click', () => {
  skillTreeUI.show();
});

gameOverSkillTreeButton.addEventListener('click', () => {
  skillTreeUI.show();
});

gameOverRestartButton.addEventListener('click', () => {
  game.handleRestart();
});

debugSkipButton.addEventListener('click', () => {
  game.skipTime(10);
});

debugNextWaveButton.addEventListener('click', () => {
  game.forceNextWave();
});

// Setup visual style toggle
const visualStyleToggle = document.getElementById('visualStyleToggle');
const visualStyleSystem = game.renderSystem.getVisualStyleSystem();

function updateStyleButtonText() {
  const currentStyle = visualStyleSystem.getCurrentStyle();
  visualStyleToggle.textContent = `Style: ${StyleNames[currentStyle]}`;
}

visualStyleToggle.addEventListener('click', () => {
  visualStyleSystem.nextStyle();
  updateStyleButtonText();
});

// Keyboard shortcut for style switching (V key)
window.addEventListener('keydown', (e) => {
  if (e.key === 'v' || e.key === 'V') {
    visualStyleSystem.nextStyle();
    updateStyleButtonText();
  }
});

// Export for potential game integration
window.skillTreeManager = skillTreeManager;
window.skillTreeUI = skillTreeUI;

