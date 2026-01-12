# Game 2026

A modern TypeScript canvas-based game with a clean, modular architecture.

## Features

- **Player**: Green circle that you control
- **Enemies**: Red squares that chase you
- **Projectiles**: Yellow triangles that auto-fire at enemies
- **Controls**: 
  - Desktop: WASD keys for movement
  - Mobile: Touch anywhere to move toward that position
- **Goal**: Survive as long as possible and get the highest score!

## Project Structure

```
game2026/
├── src/
│   ├── main.ts              # Application entry point
│   ├── core/
│   │   └── Game.ts          # Main game orchestration class
│   ├── entities/
│   │   ├── index.ts         # Entity exports
│   │   ├── Player.ts        # Player entity
│   │   ├── Enemy.ts         # Enemy entity
│   │   └── Projectile.ts    # Projectile entity
│   ├── systems/
│   │   ├── index.ts         # System exports
│   │   ├── InputSystem.ts   # Handles keyboard, mouse, and touch input
│   │   ├── CollisionSystem.ts # Collision detection logic
│   │   └── RenderSystem.ts  # Canvas rendering
│   └── types/
│       └── index.ts         # TypeScript interfaces and types
├── index.html               # HTML entry point
├── package.json             # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
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

- Node.js (v18 or higher)

### Installation

```bash
npm install
```

### Development

Run the development server with hot module replacement:

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

### Production Build

Build the optimized production bundle:

```bash
npm run build
```

The output will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Type Checking

Run TypeScript type checking without building:

```bash
npm run typecheck
```

## How to Play

1. Run the development server (`npm run dev`)
2. Open the game in your browser
3. Move with WASD keys (desktop) or touch (mobile) to avoid red squares
4. Yellow triangles auto-fire from your position toward enemies
5. Each enemy killed gives you 10 points
6. Each enemy collision takes 10 health
7. Game over when health reaches 0
8. Tap/click to restart after game over

## Technology Stack

- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **HTML5 Canvas**: 2D rendering
- **ES Modules**: Modern JavaScript module system

## Development Notes

- The game uses TypeScript only (no JavaScript files in src/)
- Vite handles bundling and provides hot module replacement during development
- All game logic is fully typed for better IDE support and fewer bugs
- The modular structure makes it easy to add new entities or systems
