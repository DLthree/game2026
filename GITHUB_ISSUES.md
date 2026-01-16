# GitHub Issues for Game2026 Enhancements

This document contains 8 GitHub Issues ready to be created. Each issue is separated by a horizontal rule and can be copy-pasted directly into GitHub.

## Quick Creation

**Automated:** Run `./create-github-issues.sh` to create all 8 issues at once using GitHub CLI.

**Manual:** Copy-paste each issue into GitHub's web interface at https://github.com/DLthree/game2026/issues

See `.github/ISSUE_TEMPLATES_README.md` for detailed instructions.

---

## Issue #1: Implement Gems and Experience Currency System

### Problem Statement

The game currently has a gold currency system (implemented in `src/entities/Currency.js`), but the skill tree data references both `gems` and `experience` currencies that are not yet integrated into gameplay. Players need a way to earn these additional currencies during gameplay to unlock higher-tier skills.

**Current State:**
- `src/data/skillTreeData.js` defines `gems` and `experience` currencies
- `src/entities/Currency.js` exists but only supports `gold` type in gameplay
- Currency drops are implemented but only gold is awarded when enemies are defeated

**Desired State:**
- Enemies drop gems in addition to gold
- Players earn experience points from defeating enemies and surviving waves
- Different enemy types award different amounts of gems/experience
- Currency drops are visually distinct (different colors/shapes for gems vs gold vs experience)

### Acceptance Criteria

- [ ] Gems are dropped by enemies with a lower frequency than gold (e.g., 20% drop rate)
- [ ] Experience is awarded automatically when enemies are defeated (no pickup required)
- [ ] Different enemy types award different amounts:
  - Basic enemies: 10 gold, 5 experience, 10% gem drop (1 gem)
  - Fast enemies: 8 gold, 8 experience, 15% gem drop (1 gem)
  - Tank enemies: 15 gold, 15 experience, 30% gem drop (2 gems)
- [ ] Gem currency entities have a distinct visual appearance (different color/shape than gold)
- [ ] Experience is displayed in the UI alongside gold and gems
- [ ] Currency collection automatically adds to SkillTreeManager currency totals
- [ ] Experience has a different collection mechanic (auto-collected, no pickup required OR larger pickup radius)

### Out of Scope

- Experience levels or leveling system
- Prestige or meta-progression systems
- Currency conversion or trading
- Shop system for spending currencies
- Currency multipliers or boosters
- Boss-specific currency rewards (covered in separate issue)

### Suggested Files/Areas

- **Primary Files:**
  - `src/entities/Currency.js` - Add visual distinction for gem type
  - `src/core/Game.js` - Modify enemy defeat logic to award experience and gems
  - `src/data/waveData.js` - Add currency reward data to enemy types
  
- **Secondary Files:**
  - `src/systems/RenderSystem.js` - May need updates for rendering experience differently
  - `index.html` - Add UI elements to display gems and experience counts
  - `src/skilltree/SkillTreeManager.js` - Ensure proper integration with currency system

### Technical Notes

- Currency class already supports a `type` parameter in constructor
- Consider adding a `currencyRewards` object to enemy type definitions in waveData.js
- Experience could use instant collection (no physics/pickup) for better UX
- Maintain zero-build-step architecture - no new dependencies

---

## Issue #2: Add Boss Fight Mechanics

### Problem Statement

The game currently has 10 waves defined in `src/data/waveData.js`, with Wave 10 labeled as "FINAL" but it only spawns stronger regular enemies, not an actual boss encounter. Players need a climactic boss fight that provides a unique challenge and rewards.

**Current State:**
- Wave system implemented with progressively harder waves
- Wave 10 exists but only spawns regular enemies with high multipliers
- No unique boss entity type or mechanics
- No special boss spawn or boss-specific behaviors

**Desired State:**
- Wave 10 spawns a unique boss enemy with special properties
- Boss has significantly higher health and unique visual appearance
- Boss exhibits unique movement patterns or attack behaviors
- Defeating the boss provides substantial rewards (gold, gems, experience)
- Boss victory triggers a special completion state

### Acceptance Criteria

- [ ] Boss entity class created (`src/entities/Boss.js`) extending or similar to Enemy
- [ ] Boss has at least 10x health of tank enemies
- [ ] Boss has unique visual appearance (larger size, distinct color, unique shape)
- [ ] Boss spawns at the start of Wave 10 (single boss, not continuous spawning)
- [ ] Boss exhibits one unique behavior (examples: dash attack, circle around player, summon minions, or periodic invulnerability)
- [ ] Defeating boss awards significant rewards: 500 gold, 100 experience, 20 gems
- [ ] Boss defeat triggers victory screen or special message
- [ ] Boss health bar displayed prominently when boss is active
- [ ] Wave system supports boss wave configuration

### Out of Scope

- Multiple boss types or boss roster
- Complex boss attack patterns with multiple phases
- Boss special abilities beyond one unique behavior
- Boss arena or environment changes
- Boss music or sound effects
- Pre-boss cutscenes or story elements
- Boss difficulty scaling or hard mode

### Suggested Files/Areas

- **Primary Files:**
  - `src/entities/Boss.js` (NEW) - Create boss entity class
  - `src/data/waveData.js` - Add boss configuration to Wave 10
  - `src/systems/WaveSystem.js` - Add boss spawn logic
  - `src/core/Game.js` - Handle boss spawn, boss defeat, and victory state
  
- **Secondary Files:**
  - `src/systems/RenderSystem.js` - Add boss health bar rendering
  - `src/entities/index.js` - Export Boss entity
  - `index.html` - Add boss health bar UI element

### Technical Notes

- Boss could reuse Enemy class with special flags or create separate Boss class
- Consider a `isBoss: true` flag in enemy type configuration
- Boss defeat could check if all enemies are cleared to trigger victory
- Maintain mobile-friendly design - boss should be challenging but fair on touch controls

---

## Issue #3: Implement Additional Enemy Types

### Problem Statement

The game currently has 4 enemy types defined in the wave system (`basic`, `fast`, `tank`, `asteroid`), but enemy variety is limited. Additional enemy types with unique behaviors would increase gameplay depth and strategic variety.

**Current State:**
- 4 enemy types exist: basic (standard), fast (faster movement), tank (high health), asteroid (straight-line movement)
- All enemies use the same chasing AI except asteroids
- Enemy differentiation is primarily through stat multipliers (health, speed, damage)
- Visual differences are minimal (color and size variations)

**Desired State:**
- At least 3 new enemy types with unique behaviors
- Each new enemy type has distinct visual appearance
- New enemy types integrated into wave progression
- Unique behaviors that require different player strategies to counter

### Acceptance Criteria

- [ ] **Splitter Enemy**: Splits into 2-3 smaller enemies when defeated
  - Distinct visual appearance (e.g., purple diamond shape)
  - Medium health, medium speed
  - Child enemies have reduced health and size
  - Appears starting Wave 4
  
- [ ] **Bomber Enemy**: Explodes on death, damaging player if in range
  - Distinct visual appearance (e.g., orange circle with pulsing effect)
  - Low health, slow movement
  - Explosion radius of 80 units
  - Explosion deals 15 damage to player if in range
  - Appears starting Wave 5
  
- [ ] **Teleporter Enemy**: Periodically teleports short distances toward player
  - Distinct visual appearance (e.g., cyan triangle with fade effect)
  - Low health, medium speed
  - Teleports every 3-4 seconds, distance of 100-150 units
  - Cannot teleport through player
  - Appears starting Wave 6

- [ ] New enemy types added to `waveData.js` in appropriate waves
- [ ] Enemy behaviors implemented in `Enemy.js` or separate behavior system
- [ ] Visual feedback for special behaviors (e.g., bomber pulse, teleporter fade)

### Out of Scope

- Enemy AI pathfinding or obstacle avoidance
- Enemy formations or coordinated attacks
- Elite or champion variants
- Enemy projectile attacks
- Enemy shields or armor mechanics
- More than 3 new enemy types
- Boss enemies (covered in separate issue)

### Suggested Files/Areas

- **Primary Files:**
  - `src/entities/Enemy.js` - Add new enemy type logic and behaviors
  - `src/data/waveData.js` - Add new enemy types to wave configurations
  - `src/core/Game.js` - Handle special behaviors (splitting, explosions, teleportation)
  
- **Secondary Files:**
  - `src/systems/CollisionSystem.js` - May need explosion radius checks
  - `src/systems/RenderSystem.js` - Add visual effects for special enemy behaviors
  - `src/types/index.js` - Add JSDoc types if needed

### Technical Notes

- Splitter behavior: spawn child enemies at parent's position with random velocity
- Bomber behavior: check distance to player on death, apply damage if in range
- Teleporter behavior: use timer and occasional position updates
- Consider adding a `behavior` callback or method to Enemy class
- Maintain performance - avoid too many entities from splitters

---

## Issue #4: Enlarge Skill Tree Tooltips

### Problem Statement

The skill tree UI (`src/skilltree/SkillTreeUI.js`) displays tooltips in the `drawInfoPanel()` method, but the tooltip size may be too small for comfortable reading, especially on mobile devices. Players need larger, more readable tooltips when hovering or selecting skills.

**Current State:**
- Tooltips are drawn in `drawInfoPanel()` method
- Info panel displays skill name, description, level, cost, and prerequisites
- Panel size is dynamically calculated based on content
- Font sizes are hardcoded in the rendering methods

**Desired State:**
- Skill tree tooltips are 1.5-2x larger than current size
- Text remains readable on mobile devices (minimum font size 14-16px)
- Tooltip layout scales gracefully with larger text
- Tooltip doesn't obscure the skill node being inspected

### Acceptance Criteria

- [ ] Tooltip panel width increased by at least 50% (from current size)
- [ ] Tooltip panel height scales appropriately with larger text
- [ ] Font sizes increased:
  - Skill name: 20-24px (currently smaller)
  - Description text: 14-16px (currently smaller)
  - Cost and prerequisite info: 12-14px
- [ ] Line height/spacing adjusted for readability
- [ ] Tooltip positioning updated to prevent canvas overflow
- [ ] Tooltip remains readable on mobile devices (tested on viewport)
- [ ] No overlap with currency panel at top of skill tree
- [ ] Visual hierarchy maintained (name most prominent, description secondary, details tertiary)

### Out of Scope

- Tooltip animations or transitions
- Custom tooltip themes or styling options
- Tooltip for currency panel items
- Rich text formatting in tooltips (bold, italic, colors within text)
- Tooltip follow cursor
- Multiple simultaneous tooltips
- Tooltip shadows or complex borders

### Suggested Files/Areas

- **Primary Files:**
  - `src/skilltree/SkillTreeUI.js` - Modify `drawInfoPanel()` method and related constants
  
- **Specific Methods:**
  - `drawInfoPanel()` - Update panel dimensions, font sizes, padding
  - `drawSkillNode()` - Ensure tooltip positioning works with larger tooltips
  - Class constants - Add configurable tooltip size constants

### Technical Notes

- Current tooltip rendering uses `ctx.font` for text sizing
- Consider adding constants: `TOOLTIP_FONT_SIZE_TITLE`, `TOOLTIP_FONT_SIZE_BODY`, `TOOLTIP_PADDING`
- Test on different zoom levels (skill tree has zoom functionality)
- Ensure tooltip remains within canvas bounds (800x600 base size)
- May need to adjust tooltip positioning logic to keep it on-screen

---

## Issue #5: Expand Skill Tree Content

### Problem Statement

The current skill tree in `src/data/skillTreeData.js` has a limited number of skills. Players need more skills to unlock, providing deeper progression and more build variety.

**Current State:**
- Skill tree has approximately 7-10 skills defined
- Skills cover basic upgrades (damage, speed, health)
- Limited branching paths
- Most skills have 1-3 levels

**Desired State:**
- At least 15-20 total skills in the tree
- Multiple branching paths (at least 3 distinct branches)
- Skills organized by theme (offense, defense, utility)
- Deeper progression with 4-5 tier levels
- More creative/unique skill effects

### Acceptance Criteria

- [ ] Total of at least 15 unique skills added to skillTreeData.js
- [ ] Skills organized into at least 3 distinct branches:
  - **Offense Branch**: Damage, fire rate, projectile count, crit chance
  - **Defense Branch**: Max health, regeneration, damage reduction, shield
  - **Utility Branch**: Movement speed, pickup radius, currency bonuses, dash ability
  
- [ ] Skill tier structure:
  - Tier 1: 3-4 starter skills (no prerequisites, low cost)
  - Tier 2: 4-5 intermediate skills (1 prerequisite, medium cost)
  - Tier 3: 4-5 advanced skills (2+ prerequisites, high cost)
  - Tier 4: 2-3 ultimate skills (multiple prerequisites, very high cost)
  
- [ ] At least 5 unique skill effects beyond simple stat multipliers:
  - Example: "Dash" ability (short cooldown movement burst)
  - Example: "Lifesteal" (regain health on enemy kill)
  - Example: "Double Shot" (fire two projectiles)
  - Example: "Pierce" (projectiles go through enemies)
  - Example: "Currency Magnet" (increased pickup radius)
  
- [ ] All skills have:
  - Clear, descriptive names
  - Helpful descriptions (explain what the skill does)
  - Appropriate costs (balanced for progression)
  - Logical prerequisites
  - Proper positioning in UI (x, y coordinates)
  
- [ ] Skill tree layout remains navigable (not overcrowded)
- [ ] All new skills have valid JSDoc types

### Out of Scope

- Skill tree UI redesign or layout changes
- Skill animations or visual effects
- Skill synergies or combo systems
- Skill respec or reset functionality (already exists)
- Skill tree presets or builds
- Skill descriptions beyond basic text
- Additional currency types for skills
- Skill tree branches beyond 3 main paths

### Suggested Files/Areas

- **Primary Files:**
  - `src/data/skillTreeData.js` - Add new skill definitions
  
- **Secondary Files (if implementing new skill effects):**
  - `src/core/Game.js` - Implement skill effects in gameplay
  - `src/entities/Player.js` - Add properties for new skills (if needed)
  - `src/skilltree/SkillTreeManager.js` - Ensure skill effects are properly applied

### Technical Notes

- Each skill needs: `id`, `name`, `description`, `maxLevel`, `costs`, `prerequisites`, `position`, `effects`
- Position coordinates should avoid overlap (use grid layout)
- Start with data-only changes (just adding skills to skillTreeData.js)
- Implementation of skill effects can be done incrementally
- Consider spacing skills 100-150 pixels apart in x/y coordinates
- Use existing skills as templates for structure

### Example Skill Definition

```javascript
piercing_shots: {
  id: 'piercing_shots',
  name: 'Piercing Shots',
  description: 'Projectiles pierce through enemies',
  maxLevel: 1,
  costs: [{ gold: 200, gems: 10 }],
  prerequisites: ['damage_boost'],
  position: { x: 300, y: 250 },
  effects: { piercingShots: true }
}
```

---

## Issue #6: Implement Touch to Grab Gems/Currency

### Problem Statement

Currently, currency items (gems and gold) in `src/entities/Currency.js` have a magnetic pull effect that automatically moves currency toward the player when within pickup radius. However, this automatic behavior may not feel responsive enough. Players should be able to manually grab currency by touching/tapping it on mobile devices.

**Current State:**
- Currency has magnetic pull when player is within `CURRENCY_PICKUP_RADIUS` (100 units)
- Pickup is automatic when currency touches player hitbox
- No direct interaction with currency items
- Touch input only controls player movement (`src/systems/InputSystem.js`)

**Desired State:**
- Players can tap/touch currency items to immediately collect them
- Touch-to-grab provides instant collection (feels more responsive)
- Magnetic pull remains as fallback for nearby currency
- Touch-to-grab works independently of player movement controls
- Visual feedback when currency is grabbed

### Acceptance Criteria

- [ ] Touching/tapping a currency item directly collects it immediately
- [ ] Touch detection works for all currency types (gold, gems, experience)
- [ ] Touch area is slightly larger than visual currency size (8-12 pixel buffer)
- [ ] Currency collection awards appropriate amount to player
- [ ] Touch-to-grab doesn't interfere with player movement controls
- [ ] Visual feedback on collection (brief flash or particle effect optional)
- [ ] Magnetic pull remains active for currency not manually touched
- [ ] Works on both mobile (touch) and desktop (click)
- [ ] Performance remains smooth with many currency items (10+ on screen)

### Out of Scope

- Swipe gestures to collect multiple currencies
- Currency auto-collection without touch
- Currency collection combo systems or bonuses
- Visual effects beyond simple feedback
- Sound effects for currency collection
- Different collection mechanics for different currency types
- Currency vacuum ability (collect all on screen)

### Suggested Files/Areas

- **Primary Files:**
  - `src/systems/InputSystem.js` - Add touch/click detection for currency items
  - `src/core/Game.js` - Handle currency collection logic on touch
  - `src/entities/Currency.js` - May need method to check if point is within currency
  
- **Touch Event Handling:**
  - Add touch event listener for canvas
  - Convert touch coordinates to world space
  - Check if touch point intersects any currency entity
  - Call collection method when hit detected

### Technical Notes

- InputSystem already has touch event handlers (`handleTouchStart`, `handleTouchEnd`)
- Need to distinguish between movement touches and currency collection touches
- Consider using a small delay/distance threshold to differentiate tap from drag
- Currency position is in `currency.pos.x/y`, size is `currency.size`
- Simple collision detection: `distance < currency.size + buffer`
- May need to track touch IDs to support multi-touch (player movement + currency collection)
- Maintain zero-build-step architecture

### Implementation Suggestion

```javascript
// In InputSystem or Game class
handleCurrencyTap(x, y) {
  for (let i = this.currencies.length - 1; i >= 0; i--) {
    const currency = this.currencies[i];
    const dx = x - currency.pos.x;
    const dy = y - currency.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < currency.size + 10) { // 10px buffer
      // Collect currency
      this.collectCurrency(i);
      return true; // Consumed touch
    }
  }
  return false; // Touch not on currency
}
```

---

## Issue #7: Add Drag Line for Ship Movement

### Problem Statement

The current player movement system uses WASD keys on desktop and tap-to-move on mobile. To improve mobile UX and provide better directional control, add a visual drag line mechanic where players can drag from the ship to set movement direction and speed.

**Current State:**
- Desktop: WASD keys control movement direction
- Mobile: Tap anywhere to move player toward that position
- No visual feedback for movement direction or intent
- Input handled in `src/systems/InputSystem.js`

**Desired State:**
- Touch and drag from player ship creates a visual line
- Line length determines movement speed (longer = faster)
- Line direction determines movement direction
- Line is visible while dragging
- Releasing touch continues movement in that direction
- Provides precise directional control on mobile

### Acceptance Criteria

- [ ] Dragging from player position creates visible line
- [ ] Line extends from player center to current touch position
- [ ] Line length capped at reasonable maximum (e.g., 150 pixels)
- [ ] Line visual properties:
  - Color: Bright color (e.g., cyan or white)
  - Width: 3-4 pixels
  - Style: Solid line or slight gradient
  - Arrow or indicator at end point (optional but recommended)
  
- [ ] Movement mechanics:
  - Line direction sets player velocity direction
  - Line length sets velocity magnitude (20-100% of max speed)
  - Minimum drag distance to activate (e.g., 20 pixels) to prevent accidental activation
  - Maximum effective distance for speed calculation (e.g., 150 pixels)
  
- [ ] Line disappears when touch is released
- [ ] Works alongside existing WASD controls (desktop remains unchanged)
- [ ] Line renders above game entities but below UI elements
- [ ] Performance remains smooth (60 FPS)

### Out of Scope

- Trajectory prediction or arc visualization
- Multiple simultaneous drag lines
- Drag line for aiming projectiles (projectiles are auto-aim)
- Drag line customization or color options
- Drag line animations or effects
- Joystick-style fixed origin dragging
- Drag line for purposes other than movement
- Touch gestures beyond simple drag

### Suggested Files/Areas

- **Primary Files:**
  - `src/systems/InputSystem.js` - Add drag detection and state tracking
  - `src/systems/RenderSystem.js` - Render the drag line
  - `src/core/Game.js` - Apply drag line input to player velocity
  
- **Rendering:**
  - Add `drawDragLine()` method to RenderSystem or create new overlay render
  - Use canvas line drawing: `ctx.beginPath()`, `ctx.moveTo()`, `ctx.lineTo()`, `ctx.stroke()`

### Technical Notes

- Track drag start position and current position during touch move
- Calculate direction: `angle = Math.atan2(dy, dx)`
- Calculate magnitude: `length = Math.sqrt(dx*dx + dy*dy)`
- Normalize and scale to player speed: `vel = direction * (length / maxLength) * maxSpeed`
- Consider showing line only during active drag (touchstart → touchmove → touchend)
- Line origin should be player center position, not touch start position
- Alternative: Line could originate from initial touch point (joystick-like), not player position

### Implementation Options

**Option A: Line from player to touch (recommended)**
- Line starts at player center
- Line ends at current touch position
- Feels like "pulling" the ship in a direction

**Option B: Line from initial touch to current touch**
- Line starts at first touch point
- Line ends at current touch position
- Feels like joystick control
- More intuitive for fixed-position controls

Choose option based on UX testing or preference.

---

## Issue #8: Add Grid Lighting Effect at Touch Point

### Problem Statement

To improve visual feedback and enhance the futuristic aesthetic of the game, add a grid lighting effect that appears at the player's touch point. This creates visual interest and helps players see exactly where they're touching on mobile devices.

**Current State:**
- No visual feedback at touch points
- Canvas uses solid background color
- No ambient lighting or effects
- Touch input is handled but not visually indicated

**Desired State:**
- Tapping/touching the canvas creates a temporary grid lighting effect
- Effect radiates outward from touch point
- Grid pattern with glowing lines creates futuristic look
- Effect fades out over 0.5-1.0 seconds
- Multiple touches can create multiple simultaneous effects

### Acceptance Criteria

- [ ] Grid lighting effect appears at touch/click position
- [ ] Effect visual properties:
  - Grid pattern with lines forming squares (e.g., 20x20 pixel cells)
  - Grid lines glow with bright color (cyan, blue, or white)
  - Effect radius: 100-150 pixels from touch point
  - Grid fades out over 0.5-1.0 seconds
  - Lines are semi-transparent (alpha 0.3-0.7)
  
- [ ] Animation properties:
  - Grid appears at full brightness initially
  - Opacity decreases linearly over duration
  - Optional: Grid can expand slightly while fading
  
- [ ] Multiple touches create multiple independent effects
- [ ] Effects render behind game entities (under player, enemies, projectiles)
- [ ] Effects don't impact game performance (maintain 60 FPS)
- [ ] Effects work on both touch (mobile) and mouse click (desktop)
- [ ] Effects are purely visual (no gameplay impact)

### Out of Scope

- Grid lighting following player movement
- Permanent grid background
- Grid lighting on enemy death or other game events
- Customizable grid colors or patterns
- Grid lighting affecting game visibility
- Audio feedback for grid lighting
- Particle effects or complex animations
- Grid lighting performance optimization beyond basic implementation
- Integration with shader systems

### Suggested Files/Areas

- **Primary Files:**
  - `src/systems/InputSystem.js` - Capture touch/click positions
  - `src/systems/RenderSystem.js` - Render grid lighting effects
  - `src/core/Game.js` - Manage effect lifecycle (creation, update, removal)
  
- **Implementation Approach:**
  - Create `GridLightEffect` class or simple effect objects
  - Store active effects in array: `this.gridEffects = []`
  - On touch: create new effect with position and timestamp
  - In game loop: update effect ages, remove expired effects
  - In render: draw all active effects

### Technical Notes

- Effect data structure: `{ x, y, age, duration, radius }`
- Update method: `effect.age += dt; if (effect.age > effect.duration) remove()`
- Render method: calculate `alpha = 1 - (age / duration)`, draw grid with alpha
- Grid drawing:
  - Use `ctx.strokeStyle` with rgba for transparency
  - Draw horizontal and vertical lines in grid pattern
  - Use `ctx.globalAlpha` for fading
  
- Performance considerations:
  - Limit maximum simultaneous effects (e.g., 10)
  - Use simple line drawing (no complex paths)
  - Remove effects as soon as expired

### Example Grid Drawing Code

```javascript
drawGridEffect(effect) {
  const ctx = this.ctx;
  const alpha = 1 - (effect.age / effect.duration);
  const cellSize = 20;
  const radius = effect.radius;
  
  ctx.save();
  ctx.strokeStyle = `rgba(0, 200, 255, ${alpha * 0.5})`;
  ctx.lineWidth = 1;
  
  // Draw vertical lines
  for (let x = -radius; x <= radius; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(effect.x + x, effect.y - radius);
    ctx.lineTo(effect.x + x, effect.y + radius);
    ctx.stroke();
  }
  
  // Draw horizontal lines
  for (let y = -radius; y <= radius; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(effect.x - radius, effect.y + y);
    ctx.lineTo(effect.x + radius, effect.y + y);
    ctx.stroke();
  }
  
  ctx.restore();
}
```

### Visual Reference

The effect should resemble:
- Tron-style grid
- Ripple effect on water surface
- Sci-fi hologram projection
- Geometry Wars-style neon grid floor

Choose aesthetic that matches existing game visual style.

---

## Summary

These 8 issues cover the following TODO items:

1. ✅ **Get gems and experience** → Issue #1
2. ✅ **Boss fight** → Issue #2
3. ✅ **Different types of enemies** → Issue #3
4. ✅ **Tooltip of skill tree bigger** → Issue #4
5. ✅ **More skill tree** → Issue #5
6. ✅ **Touch to grab gems** → Issue #6
7. ✅ **Drag line for ship** → Issue #7
8. ✅ **Touch point has grid lighting** → Issue #8

Each issue can be created independently in GitHub and implemented in any order based on priority.

---

## Instructions for Creating Issues in GitHub

1. Go to https://github.com/DLthree/game2026/issues
2. Click "New Issue"
3. Copy the title from each issue above (e.g., "Implement Gems and Experience Currency System")
4. Copy the entire content for that issue (everything under the title)
5. Add appropriate labels (e.g., `enhancement`, `gameplay`, `ui`, `mobile`)
6. Assign to developers or leave unassigned
7. Set milestone if applicable
8. Click "Submit new issue"

Repeat for all 8 issues.
