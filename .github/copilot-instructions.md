# Copilot Instructions for game2026

## Core Constraints

**game2026** is a zero-build HTML5 canvas game for mobile Safari and GitHub Pages.

**⚠️ ABSOLUTE REQUIREMENTS:**

1. **NO BUILD STEP**: Project runs by opening `index.html` over HTTP - no compilation/bundling
2. **JAVASCRIPT ONLY**: Plain `.js` files only - no TypeScript, JSX, or transpilation
3. **NATIVE ES MODULES**: Use `import`/`export` with explicit `.js` extensions
4. **NO BUNDLERS**: No Vite, Webpack, esbuild, Parcel, etc.

## Project Structure

```
game2026/
├── index.html           # Entry point
├── src/
│   ├── main.js          # Application entry
│   ├── core/            # Game orchestration
│   ├── entities/        # Game objects (Player, Enemy, etc.)
│   ├── systems/         # Game systems (Input, Collision, Rendering, etc.)
│   ├── data/            # Configuration and balance data
│   ├── skilltree/       # Skill tree system
│   └── types/           # JSDoc type definitions
└── package.json         # Minimal (only `serve` script)
```

## Development

**Running Locally:**
```bash
python3 -m http.server 8000
# Or: npm run serve
```

**No Build/Test Commands** - validate by opening in browser and playing the game.

## Code Guidelines

- **Imports**: Always use explicit `.js` extensions: `import { Game } from './core/Game.js'`
- **Types**: Use JSDoc comments for type hints
- **Config**: Put tweakable values in `src/data/*.js` files
- **Module Pattern**: Named exports, ECS-inspired architecture

## Common Pitfalls

❌ Don't add TypeScript source files  
❌ Don't add build tools or bundlers  
❌ Don't omit `.js` file extensions  
❌ Don't add npm dependencies  
✅ Keep it simple - plain JavaScript that runs in the browser
