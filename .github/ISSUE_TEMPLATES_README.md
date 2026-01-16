# How to Use GitHub Issue Templates

This directory contains templates for creating GitHub Issues for the game2026 project.

## Quick Reference

The main file `GITHUB_ISSUES.md` in the repository root contains 8 comprehensive issue templates:

1. **Issue #1: Gems and Experience System** - Implement additional currency types
2. **Issue #2: Boss Fight Mechanics** - Add climactic boss encounter for Wave 10
3. **Issue #3: Different Enemy Types** - Add Splitter, Bomber, and Teleporter enemies
4. **Issue #4: Enlarge Skill Tree Tooltips** - Make tooltips 1.5-2x larger for better readability
5. **Issue #5: Expand Skill Tree Content** - Add 15-20 skills across 3 branches
6. **Issue #6: Touch to Grab Gems** - Direct tap collection for currency items
7. **Issue #7: Drag Line for Ship** - Visual drag-to-move mechanic
8. **Issue #8: Grid Lighting at Touch** - Futuristic grid effect on touch/click

## How to Create Issues

### Option 1: Manual Creation (Recommended)

1. Open the main `GITHUB_ISSUES.md` file in the repository root
2. Navigate to https://github.com/DLthree/game2026/issues
3. Click "New Issue"
4. Copy the title and content for each issue
5. Paste into GitHub Issue form
6. Add appropriate labels:
   - `enhancement` - All issues are enhancements
   - `gameplay` - Issues #1, #2, #3
   - `ui` - Issues #4, #5, #7, #8
   - `mobile` - Issues #6, #7, #8
   - `currency` - Issues #1, #6
   - `combat` - Issues #2, #3
7. Submit the issue

### Option 2: Using GitHub CLI (gh)

If you have GitHub CLI installed:

```bash
# Example for Issue #1
gh issue create \
  --title "Implement Gems and Experience Currency System" \
  --body-file <(sed -n '/^## Issue #1/,/^---$/p' GITHUB_ISSUES.md) \
  --label enhancement,gameplay,currency
```

## Issue Structure

Each issue contains:

- **Problem Statement**: Context and current vs desired state
- **Acceptance Criteria**: Specific, testable requirements
- **Out of Scope**: What NOT to include (keeps issues focused)
- **Suggested Files/Areas**: Where to make changes
- **Technical Notes**: Implementation hints and considerations
- **Code Examples**: Sample code where helpful (Issues #6, #8)

## Priority Suggestions

Based on dependencies and impact:

**High Priority:**
- Issue #1 (Gems and Experience) - Unlocks skill tree progression
- Issue #4 (Tooltip Size) - Quick UX improvement

**Medium Priority:**
- Issue #3 (Enemy Types) - Adds gameplay variety
- Issue #5 (Skill Tree Content) - Depends on Issue #1
- Issue #6 (Touch to Grab) - Mobile UX improvement

**Lower Priority:**
- Issue #7 (Drag Line) - Nice to have, alternative control scheme
- Issue #8 (Grid Lighting) - Visual polish
- Issue #2 (Boss Fight) - Can be last as it's endgame content

## Labels to Use

Suggested labels for organization:

- `enhancement` - Feature additions
- `gameplay` - Core game mechanics
- `ui` - User interface changes
- `mobile` - Mobile-specific features
- `currency` - Currency system
- `combat` - Combat and enemies
- `skill-tree` - Skill tree system
- `visual-effects` - Graphics and effects
- `good-first-issue` - Suitable for new contributors (Issue #4)
- `help-wanted` - Complex issues needing collaboration

## Notes

- All issues maintain the **zero-build-step** philosophy of game2026
- Issues are designed to be independently implementable
- Each issue is sized for ~1-3 days of work
- Issues reference specific files to ease implementation
- Technical notes provide implementation guidance without being prescriptive
