# TODO to GitHub Issue Mapping

This document maps the original TODO list to the created GitHub Issues for easy reference.

## Original TODO Items

From the problem statement, the following TODO items were provided:

1. get gems and experience
2. boss fight
3. different types of enemies
4. tooltip of skill tree bigger
5. more skill tree
6. touch to grab gems?
7. drag line for ship?
8. touch point has grid lighting

## Mapping to GitHub Issues

| TODO Item | GitHub Issue | Issue Title | Priority |
|-----------|--------------|-------------|----------|
| 1. get gems and experience | Issue #1 | Implement Gems and Experience Currency System | High |
| 2. boss fight | Issue #2 | Add Boss Fight Mechanics | Medium-Low |
| 3. different types of enemies | Issue #3 | Implement Additional Enemy Types | Medium |
| 4. tooltip of skill tree bigger | Issue #4 | Enlarge Skill Tree Tooltips | High |
| 5. more skill tree | Issue #5 | Expand Skill Tree Content | Medium |
| 6. touch to grab gems? | Issue #6 | Implement Touch to Grab Gems/Currency | Medium |
| 7. drag line for ship? | Issue #7 | Add Drag Line for Ship Movement | Low |
| 8. touch point has grid lighting | Issue #8 | Add Grid Lighting Effect at Touch Point | Low |

## Detailed Breakdown

### TODO #1: "get gems and experience" → Issue #1

**Interpretation**: Implement gem and experience currencies that players can earn during gameplay.

**Issue Coverage**:
- Adds gems as droppable currency (20% drop rate from enemies)
- Adds experience as auto-awarded currency (earned on enemy defeat)
- Different enemy types reward different amounts
- Visual distinction for gem currency
- UI display for all currencies
- Integration with skill tree system

### TODO #2: "boss fight" → Issue #2

**Interpretation**: Add a boss encounter to provide endgame challenge.

**Issue Coverage**:
- Boss entity class with unique properties
- Boss spawns in Wave 10
- 10x health of tank enemies
- Unique visual appearance
- One unique behavior/mechanic
- Significant currency rewards on defeat
- Boss health bar display
- Victory state on boss defeat

### TODO #3: "different types of enemies" → Issue #3

**Interpretation**: Add more enemy variety beyond existing types.

**Issue Coverage**:
- Splitter enemy (splits into 2-3 smaller enemies)
- Bomber enemy (explodes on death, area damage)
- Teleporter enemy (teleports toward player periodically)
- Distinct visual appearance for each type
- Integration into wave progression
- Unique behaviors requiring different strategies

### TODO #4: "tooltip of skill tree bigger" → Issue #4

**Interpretation**: Increase the size of skill tree tooltips for better readability.

**Issue Coverage**:
- Tooltip width increased 50%+
- Font sizes increased (title: 20-24px, body: 14-16px)
- Improved line height and spacing
- Better mobile readability
- Proper positioning to prevent overflow
- Maintained visual hierarchy

### TODO #5: "more skill tree" → Issue #5

**Interpretation**: Expand skill tree with more skills and deeper progression.

**Issue Coverage**:
- 15-20 total skills (currently ~7-10)
- 3 distinct branches (Offense, Defense, Utility)
- 4-5 tier depth progression
- 5+ unique skill effects beyond stat multipliers
- Logical prerequisites and balanced costs
- Organized, navigable layout

### TODO #6: "touch to grab gems?" → Issue #6

**Interpretation**: Allow players to directly tap/touch currency to collect it.

**Issue Coverage**:
- Direct touch/tap collection of currency
- Works for all currency types
- Touch detection with buffer zone
- Doesn't interfere with movement controls
- Visual feedback on collection
- Works on mobile (touch) and desktop (click)
- Maintains existing magnetic pull as fallback

### TODO #7: "drag line for ship?" → Issue #7

**Interpretation**: Add visual drag mechanic for movement control.

**Issue Coverage**:
- Visible line when dragging from player
- Line direction sets movement direction
- Line length determines speed (with max cap)
- Cyan/white colored line, 3-4px width
- Arrow/indicator at endpoint
- Minimum drag distance threshold
- Works alongside WASD controls
- Disappears on touch release

### TODO #8: "touch point has grid lighting" → Issue #8

**Interpretation**: Add visual grid effect at touch/click locations.

**Issue Coverage**:
- Grid lighting effect at touch/click points
- 20x20 pixel cell grid pattern
- 100-150 pixel effect radius
- Fades out over 0.5-1.0 seconds
- Semi-transparent glowing lines (cyan/blue/white)
- Multiple simultaneous effects supported
- Renders behind game entities
- No gameplay impact (visual only)

## Implementation Order Recommendation

Based on dependencies and complexity:

1. **Issue #4** (Tooltip Size) - Quick win, UI improvement, no dependencies
2. **Issue #1** (Gems & Experience) - Unlocks skill tree progression, foundation for Issue #5
3. **Issue #6** (Touch to Grab) - Complements Issue #1, mobile UX improvement
4. **Issue #3** (Enemy Types) - Gameplay variety, independent feature
5. **Issue #5** (Skill Tree Content) - Depends on Issue #1 for currency balance
6. **Issue #8** (Grid Lighting) - Visual polish, independent
7. **Issue #7** (Drag Line) - Alternative controls, nice-to-have
8. **Issue #2** (Boss Fight) - Endgame content, can be implemented last

## Notes

- All issues are independently implementable (except Issue #5 which benefits from Issue #1)
- Each TODO item was expanded into a comprehensive issue with clear acceptance criteria
- Technical implementation details are provided without being overly prescriptive
- All issues maintain the zero-build-step architecture of game2026
- Issues include "Out of Scope" sections to keep features focused
