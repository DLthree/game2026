# Game 2026

A minimal HTML5 canvas-based survivors-like game built for mobile Safari with no build step required.

## Features

- **Player**: Green circle that you control
- **Enemies**: Red squares that chase you
- **Projectiles**: Yellow triangles that auto-fire at enemies
- **Skill Tree System**: Flexible, reusable skill tree with multiple currencies and branching paths (see [SKILLTREE.md](SKILLTREE.md))
- **Controls**: 
  - Desktop: WASD keys for movement
  - Mobile: Touch anywhere to move toward that position
- **Goal**: Survive as long as possible and get the highest score!

## Project Structure

```
game2026/
├── src/
│   ├── main.js              # Application entry point
│   ├── core/
│   │   └── Game.js          # Main game orchestration class
│   ├── entities/
│   │   ├── index.js         # Entity exports
│   │   ├── Player.js        # Player entity
│   │   ├── Enemy.js         # Enemy entity
│   │   └── Projectile.js    # Projectile entity
│   ├── systems/
│   │   ├── index.js         # System exports
│   │   ├── InputSystem.js   # Handles keyboard, mouse, and touch input
│   │   ├── CollisionSystem.js # Collision detection logic
│   │   └── RenderSystem.js  # Canvas rendering
│   ├── skilltree/
│   │   ├── index.js         # Skill tree exports
│   │   ├── SkillTreeManager.js # Skill tree logic
│   │   └── SkillTreeUI.js   # Skill tree visual rendering
│   ├── data/
│   │   └── skillTreeData.js # Skill tree configuration data
│   └── types/
│       └── index.js         # JSDoc type definitions
├── index.html               # HTML entry point
├── package.json             # Optional (only for serve script)
├── README.md                # This file
└── SKILLTREE.md             # Skill tree documentation
```

## Architecture

The game follows a modern Entity-Component-System (ECS) inspired architecture:

- **Entities**: Game objects (Player, Enemy, Projectile) with their own state and behavior
- **Systems**: Handle specific aspects like input, collision detection, and rendering
- **Core**: The Game class orchestrates all systems and entities

This structure makes the code:
- Easy to understand and maintain
- Simple to extend with new features
- Testable with clear separation of concerns

## Getting Started

### Prerequisites

- **Python 3** (for local HTTP server)
- No Node.js or npm required (optional for convenience script only)

### Running the Game

**Option 1: Python HTTP Server (Recommended)**
```bash
python3 -m http.server 8000
```

**Option 2: Using npm script (if you have Node.js installed)**
```bash
npm run serve
```

Then open http://localhost:8000 in your browser.

**Option 3: Direct File Access**

Simply open `index.html` in any modern browser. Note: Some browsers may have CORS restrictions with the `file://` protocol for ES modules, so using an HTTP server is recommended.

## How to Play

1. Start a local HTTP server (see "Running the Game" above)
2. Open the game in your browser at http://localhost:8000
3. Move with WASD keys (desktop) or touch (mobile) to avoid red squares
4. Yellow triangles auto-fire from your position toward enemies
5. Each enemy killed gives you 10 points
6. Each enemy collision takes 10 health
7. Game over when health reaches 0
8. Tap/click to restart after game over
9. Click "Skill Tree" button to open the skill tree interface

For full skill tree documentation, see [SKILLTREE.md](SKILLTREE.md)

## Technology Stack

- **Plain JavaScript**: ES modules with JSDoc type annotations
- **HTML5 Canvas**: 2D rendering
- **Zero Build**: No compilation or bundling - runs directly in the browser

## Development Notes

- **No build step required**: All code is plain JavaScript that runs directly in the browser
- **Native ES modules**: Uses `import`/`export` with explicit `.js` file extensions
- **JSDoc for typing**: Type hints via JSDoc comments (no TypeScript compilation)
- **Mobile-first**: Optimized for mobile Safari with touch controls
- **GitHub Pages**: Automatically deployed on push to main branch
- The modular structure makes it easy to add new entities or systems
