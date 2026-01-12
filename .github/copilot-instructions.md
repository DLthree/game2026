# Copilot Instructions for game2026

## Repository Overview

**game2026** is a minimal HTML5 canvas-based survivors-like game built for mobile Safari and GitHub Pages. The game runs entirely in the browser with **zero build steps required**—all runtime code is plain JavaScript using native ES modules.

- **Size**: ~280KB, 16 files total, ~562 lines of JavaScript code
- **Language**: Pure JavaScript (ES modules) with JSDoc type annotations
- **Runtime**: Mobile Safari (primary), all modern browsers
- **Deployment**: GitHub Pages (automatic via workflow)
- **Architecture**: Entity-Component-System (ECS) inspired pattern

## Critical Architecture Constraints

**⚠️ ABSOLUTE REQUIREMENTS - NEVER VIOLATE THESE:**

1. **NO BUILD STEP ALLOWED**: The project must run by simply opening `index.html` over HTTP. No compilation, bundling, or transpilation is permitted for runtime code.

2. **JAVASCRIPT ONLY**: All runtime code must be plain `.js` files. TypeScript, JSX/TSX, and other compiled-to-JS languages are NOT permitted.

3. **NATIVE ES MODULES**: Use native `import`/`export` statements with explicit `.js` extensions and relative paths. Example: `import { Game } from './core/Game.js';`

4. **MODULE SCRIPT TAG**: Code is loaded via `<script type="module">` in index.html.

5. **NO DEV SERVERS REQUIRED**: No Vite, Webpack, esbuild, or any bundlers. The game runs directly from files.

6. **OPTIONAL TOOLING ONLY**: ESLint, Prettier, and similar static analysis tools may be used but must NOT be required to run or test the game.

## Project Structure

```
game2026/
├── .github/                    # GitHub configuration (keep empty except this file)
├── .gitignore                  # Git ignore file (*.log, .DS_Store)
├── README.md                   # Main project documentation
├── README                      # Original minimal documentation
├── index.html                  # Entry point - loads src/main.js as module
├── package.json                # Minimal package.json with serve script only
└── src/                        # All JavaScript source code
    ├── main.js                 # Application entry point (12 lines)
    ├── core/
    │   └── Game.js             # Main game orchestration (232 lines)
    ├── entities/
    │   ├── index.js            # Entity exports (3 lines)
    │   ├── Player.js           # Player entity (37 lines)
    │   ├── Enemy.js            # Enemy entity (45 lines)
    │   └── Projectile.js       # Projectile entity (50 lines)
    ├── systems/
    │   ├── index.js            # System exports (3 lines)
    │   ├── InputSystem.js      # Input handling (96 lines)
    │   ├── CollisionSystem.js  # Collision detection (18 lines)
    │   └── RenderSystem.js     # Canvas rendering (33 lines)
    └── types/
        └── index.js            # JSDoc type definitions (45 lines)
```

### Key Files

- **index.html**: Canvas setup, inline styles, loads `src/main.js` as ES module
- **src/main.js**: Initializes Game instance and calls `game.start()`
- **src/core/Game.js**: Main game loop, entity management, system coordination
- **src/entities/**: Player (circle), Enemy (square), Projectile (triangle)
- **src/systems/**: InputSystem (WASD + touch), CollisionSystem, RenderSystem
- **src/types/index.js**: JSDoc typedef declarations for type checking (no runtime impact)

## Development Workflow

### Prerequisites

- **Python 3**: Required for local HTTP server (Python 3.12+ available)
- **Node.js**: Optional, only if using npm scripts (v20.19.6 available)
- **npm**: Optional (v10.8.2 available)

### Running the Game Locally

**Method 1: Python HTTP Server (Recommended)**
```bash
python3 -m http.server 8000
# Then open http://localhost:8000 in browser
```

**Method 2: Using npm script**
```bash
npm run serve
# Runs python3 -m http.server 8000
# Then open http://localhost:8000 in browser
```

**Method 3: Direct File Open**
```bash
# Simply open index.html in any modern browser
# Note: Some browsers may have CORS issues with file:// protocol for ES modules
# Use HTTP server methods above if you encounter module loading errors
```

### No Build Required

There is **NO** build command. The JavaScript files are executed directly by the browser.

### No Tests

There are currently no automated tests in this repository. Manual testing is done by:
1. Running the local HTTP server
2. Opening the game in a browser
3. Testing gameplay (WASD movement on desktop, touch on mobile)
4. Verifying no console errors

## GitHub Workflows

### GitHub Pages Deployment

- **Workflow**: Automatic deployment to GitHub Pages on push to `main` branch
- **Trigger**: Runs automatically via `pages-build-deployment` workflow
- **No Action Required**: The workflow deploys the repository as-is (no build step)
- **Access**: Game is available at `https://dlthree.github.io/game2026/`

## Making Code Changes

### Code Style

1. **JSDoc Comments**: Use JSDoc for type annotations (see existing files for examples)
2. **No Inline Comments**: Code is self-documenting; avoid unnecessary comments
3. **ES Module Exports**: Always use named exports with explicit `.js` extensions in imports
4. **Event Handling**: Touch events use `{ passive: false }` to prevent default scrolling

### Common Operations

**Adding a New Entity:**
1. Create file in `src/entities/NewEntity.js`
2. Export class with JSDoc typedefs
3. Add to `src/entities/index.js` exports
4. Instantiate and manage in `src/core/Game.js`

**Adding a New System:**
1. Create file in `src/systems/NewSystem.js`
2. Export class with clear methods
3. Add to `src/systems/index.js` exports
4. Initialize and call in `src/core/Game.js`

**Modifying Game Logic:**
- All game state in `src/core/Game.js`
- Game loop uses `requestAnimationFrame` with delta time
- Canvas is 800x600, scaled to fit viewport

### File Import Pattern

Always use explicit `.js` extensions and relative paths:
```javascript
// ✅ CORRECT
import { Player } from './entities/Player.js';
import { InputSystem } from '../systems/InputSystem.js';

// ❌ WRONG - Will not work in browser
import { Player } from './entities/Player';
import { InputSystem } from '@/systems/InputSystem';
```

## Validation Steps

Since there is no build or test infrastructure, validate changes by:

1. **Start Local Server**: `python3 -m http.server 8000`
2. **Open in Browser**: Navigate to `http://localhost:8000`
3. **Check Console**: Press F12, verify no JavaScript errors
4. **Test Gameplay**:
   - Desktop: Use WASD keys to move the green player circle
   - Mobile/Touch: Touch screen to move player toward touch position
   - Verify enemies (red squares) spawn and chase player
   - Verify projectiles (yellow triangles) auto-fire at enemies
   - Test collision detection and score/health updates
5. **Test Game Over**: Let enemies hit you until health reaches 0
6. **Test Restart**: Click/tap after game over to restart

## Common Pitfalls to Avoid

1. **Don't add TypeScript**: The README.md mentions TypeScript in places but the actual source is JavaScript. Keep it that way.
2. **Don't add build tools**: No Vite, Webpack, Parcel, Rollup, esbuild, etc.
3. **Don't omit .js extensions**: Browser ES modules require explicit file extensions.
4. **Don't use Node-specific APIs**: Code runs in browser, not Node.js.
5. **Don't add transpilation**: No Babel, no JSX, no TypeScript compiler.
6. **Don't add package dependencies**: package.json exists but has no dependencies. Keep it minimal.
7. **Don't modify .github/ except this file**: Workflows are managed by GitHub.

## When in Doubt

- **Review existing code patterns** before adding new code
- **Test in a browser immediately** after making changes
- **Keep changes minimal** and aligned with the zero-build philosophy
- **Preserve mobile Safari compatibility** as the primary target platform
- **Trust these instructions**: They are based on actual repository structure and validated commands
