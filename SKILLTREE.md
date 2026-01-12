# Skill Tree System

A flexible, reusable skill tree component designed for incremental/idle games. Built with zero dependencies using vanilla JavaScript and HTML5 Canvas.

## Features

- ✅ **Multiple Currency Types**: Support for unlimited currency types (Gold, Gems, Experience, etc.)
- ✅ **Branching Trees**: Skills can have multiple prerequisites
- ✅ **Multi-Level Skills**: Each skill can have multiple upgrade levels
- ✅ **Data-Driven**: All skill tree configuration defined in a separate data file
- ✅ **Visual UI**: Interactive canvas-based visualization with hover effects
- ✅ **Reusable**: Designed to work across multiple games with minimal integration
- ✅ **No Build Step**: Pure JavaScript ES modules - runs directly in browser

## Quick Start

### 1. Include the Skill Tree in your HTML

```html
<div id="skillTreeContainer"></div>
<script type="module" src="./src/main.js"></script>
```

### 2. Initialize in JavaScript

```javascript
import { SkillTreeManager, SkillTreeUI } from './src/skilltree/index.js';

// Create manager and UI
const skillTreeManager = new SkillTreeManager();
const skillTreeUI = new SkillTreeUI(skillTreeManager, 'skillTreeContainer');

// Show the skill tree
skillTreeUI.show();
```

### 3. Add Currencies

```javascript
// Add currencies to allow purchases
skillTreeManager.addCurrency('gold', 100);
skillTreeManager.addCurrency('gems', 10);
skillTreeManager.addCurrency('experience', 50);
```

## Demo

Open `skilltree-demo.html` in a browser to see a standalone demonstration of the skill tree system.

```bash
python3 -m http.server 8000
# Then open http://localhost:8000/skilltree-demo.html
```

## Architecture

### SkillTreeManager

Manages the skill tree state and operations:

- `getCurrency(currencyId)` - Get current amount of a currency
- `addCurrency(currencyId, amount)` - Add currency
- `removeCurrency(currencyId, amount)` - Remove currency
- `canPurchaseSkill(skillId)` - Check if skill can be purchased
- `purchaseSkill(skillId)` - Purchase/upgrade a skill
- `getActiveSkills()` - Get all unlocked skills
- `getSkillEffects()` - Get combined effects from all active skills
- `reset()` - Reset all skills and currencies
- `saveState()` / `loadState(state)` - Save/load skill tree state

### SkillTreeUI

Renders and manages the visual interface:

- `show()` - Display the skill tree
- `hide()` - Hide the skill tree
- `render()` - Redraw the skill tree (call after currency/skill changes)
- `isVisible()` - Check if skill tree is visible

### Data Structure

Skills are defined in `src/data/skillTreeData.js`:

```javascript
{
  currencies: {
    gold: {
      id: 'gold',
      name: 'Gold',
      color: '#FFD700',
      startingAmount: 100
    }
  },
  skills: {
    damage_boost: {
      id: 'damage_boost',
      name: 'Damage Boost',
      description: 'Increase damage by 10%',
      maxLevel: 3,
      costs: [
        { gold: 10 },
        { gold: 20 },
        { gold: 40 }
      ],
      prerequisites: [],
      position: { x: 150, y: 100 },
      effects: { damageMultiplier: 0.1 }
    }
  }
}
```

## Integration with Game Logic

### Getting Active Effects

```javascript
const effects = skillTreeManager.getSkillEffects();

// Apply effects to game
if (effects.damageMultiplier) {
  damage *= (1 + effects.damageMultiplier);
}
if (effects.speedMultiplier) {
  speed *= (1 + effects.speedMultiplier);
}
if (effects.dashAbility) {
  enableDash();
}
```

### Awarding Currencies

```javascript
// When player defeats an enemy
skillTreeManager.addCurrency('gold', 10);
skillTreeManager.addCurrency('experience', 5);

// Update UI if visible
if (skillTreeUI.isVisible()) {
  skillTreeUI.render();
}
```

### Saving/Loading

```javascript
// Save state to localStorage
const state = skillTreeManager.saveState();
localStorage.setItem('skillTree', JSON.stringify(state));

// Load state from localStorage
const savedState = JSON.parse(localStorage.getItem('skillTree'));
if (savedState) {
  skillTreeManager.loadState(savedState);
}
```

## Customization

### Adding New Skills

Edit `src/data/skillTreeData.js` to add new skills:

1. Choose a unique `id`
2. Set `name`, `description`, and `maxLevel`
3. Define `costs` array (one cost object per level)
4. List `prerequisites` (array of skill IDs that must be unlocked first)
5. Set `position` for UI rendering (x, y coordinates)
6. Define `effects` object with skill bonuses

### Adding New Currencies

Add to the `currencies` object in `skillTreeData.js`:

```javascript
currencies: {
  souls: {
    id: 'souls',
    name: 'Souls',
    color: '#9C27B0',
    startingAmount: 0
  }
}
```

### Styling

The UI can be customized by modifying:
- Node colors in `SkillTreeUI.drawSkillNode()`
- Panel styles in `SkillTreeUI.drawCurrencyPanel()` and `drawInfoPanel()`
- Canvas background in `SkillTreeUI.render()`

## File Structure

```
src/
├── skilltree/
│   ├── index.js              # Exports
│   ├── SkillTreeManager.js   # Core logic
│   └── SkillTreeUI.js        # Visual rendering
└── data/
    └── skillTreeData.js      # Skill tree configuration
```

## Browser Compatibility

Works in all modern browsers that support:
- ES6 modules
- HTML5 Canvas
- ES6 classes and arrow functions

Tested on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (iOS 15+)

## License

This skill tree system is part of the game2026 project.
