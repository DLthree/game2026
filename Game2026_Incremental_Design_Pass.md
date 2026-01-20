# Game 2026 – Updated Parameters for Staircase‑Style Incremental Design

## 1 Overview

The original configuration for **Game 2026** uses 10 waves with gradually increasing spawn rates and health multipliers.  Enemy health and damage scale linearly, and many skill‑tree nodes provide small percentage bonuses (e.g., +10 % damage per level)【370680329202896†L21-L40】【370680329202896†L292-L299】.  Currency consists only of **gold**, **gems** and **experience**【370680329202896†L286-L290】.  Boss waves are triggered at waves 3, 6 and 10【370680329202896†L253-L276】, and the base boss stats scale linearly with a difficulty scale【370680329202896†L233-L238】.

This document proposes new parameters to incorporate the incremental‑game principles discussed earlier: *staircases rather than curves, visible walls and doors, mutually exclusive notables, multiple currencies and large numerical jumps (1 → 5 → 25 → 250 → …),* and always showing the next layer.  The goal is to make each phase feel distinct, with clear walls that require breakthroughs rather than small percentage improvements.

## 2 Plan of Attack

1. **Introduce Currency Tiers.**  Add two new currencies (**shards** and **orbs**) on top of gold and gems.  Currency tiers form a 1 : 5 : 25 : 125 progression (gold → gems → shards → orbs) so that later upgrades are paid with higher‑tier currency.  Waves drop increasingly rare currency to force phase transitions.

2. **Create Stair‑Step Waves.**  Instead of smooth scaling, waves are grouped into phases.  Within a phase, enemy health/damage grow slowly; between phases, they jump by about **5×** or **25×**.  Waves 3, 6 and 9 become **walls** with boss encounters or mini‑boss waves.  After each wall, a “recovery/build” wave provides a flood of currency to encourage upgrades before the next challenge.

3. **Rework the Skill Tree.**  Replace small percentage bonuses with large multiplicative upgrades.  Early skills grant **×1.5** or **×2** bonuses.  Higher‑tier skills give **×5** or more.  Introduce **notable skills** that force short‑term builds by locking the player out of other notables until a prestige.  Costs jump dramatically (using the 1/5/25 pattern) and require higher‑tier currency.

4. **Add New Enemy Types and Boss Scaling.**  Introduce an **Elite** enemy (bulkier and stronger) and a **Shielded** enemy (temporary invulnerability) for later waves.  Boss scales are increased (mini‑boss: 0.5; mid‑boss: 0.8).  These walls require significant upgrades.

5. **Make Rewards Visible and Tease Next Layers.**  Show future currencies and skill branches in the UI even when locked.  Each boss reveals the next currency and the next tier of the skill tree, motivating players to push through the wall.

## 3 New Currency Definitions

| Currency   | Color      | Ratio to Previous | Notes |
|-----------|-----------|------------------|------|
| **Gold**  | `#FFD700` | —              | Base currency for early upgrades |
| **Gems**  | `#FF69B4` | **5 gold = 1 gem** | Dropped starting at wave 2 |
| **Shards**| `#6A5ACD` | **25 gems = 1 shard** | Dropped starting at wave 5 |
| **Orbs**  | `#40E0D0` | **25 shards = 1 orb** | Dropped starting at wave 8 |

## 4 Wave System (file `src/data/waveData.js`)

Below is the redesigned wave schedule.  All health, speed and damage multipliers are relative to the base enemy stats【370680329202896†L138-L145】.  Phases are separated by bold walls (waves 3, 6, 9).  Currency drops increase tier as shown.

### Wave 1 – Tutorial (Phase 1)

- **Duration:** 60 s
- **Spawn interval:** 1500 ms
- **Enemies:** 100 % Asteroid (1× health, 0.8× speed, 1× damage)
- **Currency drops:** Gold only

### Wave 2 – Warm Up (Phase 1)

- **Duration:** 60 s
- **Spawn interval:** **1200 ms** (slightly faster)
- **Enemies:**
  - Asteroid – 80 % weight, **1.5× health**, 0.9× speed, 1× damage
  - Basic – 20 % weight, **2× health**, 1.1× speed, 1× damage
- **Currency drops:** Mostly gold; small chance of gems (approx. 5 % drop rate)

### Wave 3 – First Wall / Mini‑Boss (Phase 2)

- **Boss Scale:** **0.5** (mini‑boss is 50 % of final boss)
- **Duration:** 90 s
- **Spawn interval:** **1800 ms** (slower but tougher enemies)
- **Enemies:**
  - Asteroid – 50 %, **5× health**, 1.0× speed, 1× damage
  - Basic – 30 %, **10× health**, 1.2× speed, **2× damage**
  - Fast – 15 %, **5× health**, **2× speed**, 1.5× damage
  - Tank – 5 %, **15× health**, 0.8× speed, **3× damage**
- **Currency drops:** Gems drop frequently; gold drops reduced.  Defeating the mini‑boss unlocks gems in the shop.

### Wave 4 – Recovery / Build (Phase 2)

- **Duration:** 60 s
- **Spawn interval:** **800 ms** (rapid spawns)
- **Enemies:**
  - Asteroid – 40 %, **2× health**, 1.1× speed, 1× damage
  - Basic – 40 %, **3× health**, 1.3× speed, 1.5× damage
  - Fast – 20 %, **2× health**, **2.2× speed**, 1.2× damage
- **Currency drops:** Huge gold and gem shower to encourage purchasing new skills.  Tease shards in UI but none drop yet.

### Wave 5 – Midpoint Challenge (Phase 3)

- **Duration:** 75 s
- **Spawn interval:** **1000 ms**
- **Enemies:**
  - Asteroid – 30 %, **10× health**, 1.3× speed, 1.5× damage
  - Basic – 25 %, **15× health**, 1.5× speed, **2× damage**
  - Fast – 20 %, **8× health**, **2.5× speed**, 1.5× damage
  - Tank – 15 %, **25× health**, 0.9× speed, **3× damage**
  - **Elite (new)** – 10 %, **30× health**, 1.0× speed, **4× damage**, size multiplier = 1.3
- **Currency drops:** Introduce **shards** (low probability); gems become common.  Players will need shards for higher‑tier skills.

### Wave 6 – Mid‑Boss Wall (Phase 3)

- **Boss Scale:** **0.8**
- **Duration:** 120 s
- **Spawn interval:** **1500 ms**
- **Enemies:**
  - Asteroid – 15 %, **25× health**, 1.3× speed, 2× damage
  - Basic – 25 %, **30× health**, 1.5× speed, **3× damage**
  - Fast – 20 %, **20× health**, **3× speed**, 2× damage
  - Tank – 20 %, **40× health**, 1.0× speed, **4× damage**
  - Splitter – 10 %, **15× health**, 1.2× speed, 1.5× damage, splits into 3
  - **Shielded (new)** – 10 %, **15× health**, 1.2× speed, 1.5× damage; periodically gains invulnerable shield for 1 s
- **Currency drops:** Shards drop reliably; gems drop rarely.  Defeating the mid‑boss reveals orbs as the next currency tier.

### Wave 7 – Heavy Assault (Phase 3 Recover)

- **Duration:** 60 s
- **Spawn interval:** **700 ms**
- **Enemies:**
  - Asteroid – 15 %, **10× health**, 1.4× speed, 2× damage
  - Basic – 25 %, **15× health**, 1.6× speed, 2× damage
  - Fast – 20 %, **10× health**, **3× speed**, 2× damage
  - Tank – 25 %, **20× health**, 1.1× speed, **3.5× damage**
  - Splitter – 10 %, **12× health**, 1.3× speed, 1.5× damage
  - Bomber – 5 %, **8× health**, 0.9× speed, 2× damage
  - Shielded – 5 %, **12× health**, 1.2× speed, 2× damage
- **Currency drops:** Big shard payout; occasional orb drop.

### Wave 8 – Expert Level (Phase 4)

- **Duration:** 60 s
- **Spawn interval:** **500 ms**
- **Enemies:**
  - Asteroid – 10 %, **30× health**, 1.5× speed, **3× damage**
  - Basic – 20 %, **40× health**, 1.7× speed, **3× damage**
  - Fast – 25 %, **25× health**, **4× speed**, 2.5× damage
  - Tank – 30 %, **50× health**, 1.1× speed, **4× damage**
  - Splitter – 10 %, **20× health**, 1.3× speed, 2× damage
  - Bomber – 5 %, **15× health**, 1.0× speed, 3× damage
  - Shielded – 5 %, **18× health**, 1.2× speed, 3× damage
- **Currency drops:** Orbs start dropping; shards and gems become common.

### Wave 9 – Final Wall / Gauntlet (Phase 4)

- **Duration:** 90 s
- **Spawn interval:** **600 ms**
- **Enemies:**
  - Asteroid – 8 %, **50× health**, 1.6× speed, **4× damage**
  - Basic – 15 %, **60× health**, 1.8× speed, **4× damage**
  - Fast – 30 %, **40× health**, **4× speed**, 3× damage
  - Tank – 32 %, **80× health**, 1.2× speed, **5× damage**
  - Splitter – 10 %, **30× health**, 1.4× speed, 3× damage
  - Bomber – 5 %, **20× health**, 1.0× speed, 3× damage
  - Shielded – 5 %, **25× health**, 1.3× speed, 4× damage
- **Currency drops:** Orbs drop frequently.  Defeating this gauntlet is required to face the final boss.

### Wave 10 – Final Boss (Phase 5)

- **Boss Scale:** 1.0 (full power)
- **Duration:** 120 s
- **Spawn interval:** **2000 ms** (occasional adds only)
- **Enemies:**  Players fight the boss exclusively; occasional adds are Fast (70 % weight, 40× health, 2.5× speed) and Basic (30 % weight, 50× health, 1.5× speed).
- **Currency drops:** Large orb reward and end‑game unlock.

## 5 Skill Tree Revisions (file `src/data/skillTreeData.js`)

All costs follow a *1 → 5 → 25 → 125* pattern.  Higher‑tier skills require the new currencies and act as **notables**—purchasing one locks out other notables in the same tier until a prestige.

### 5.1 Currency Changes

Add **shards** and **orbs** as currencies.  `startingAmount` = 0.  Update the UI to display locked currencies with a tooltip (“unlocks after Wave 5”).

### 5.2 Offense Branch

| Skill                         | New Effect & Notes | Levels | Costs | Prerequisites | Lockouts |
|------------------------------|--------------------|--------|-------|---------------|----------|
| **Damage I**                 | +50 % damage per level | 3 | [20g, 100g, 500g] | None | — |
| **Attack Speed I**           | +50 % attack speed per level | 3 | [30g, 150g, 750g] | None | — |
| **Damage II**                | +100 % damage per level | 3 | [1000g + 5 gem, 5000g + 10 gem, 25 000g + 20 gem] | Damage I | Locks out Attack Speed II while any level is active |
| **Attack Speed II**          | +100 % attack speed per level | 2 | [2000g + 5 gem, 10 000g + 10 gem] | Attack Speed I | Locks out Damage II while active |
| **Critical Strike**          | +20 % chance to deal **3×** damage per level | 2 | [1500g + 5 gem, 3000g + 10 gem] | Damage I | — |
| **Piercing Shots**           | Projectiles pierce enemies; **mutually exclusive** with Fire Damage | 1 | [5000g + 20 gem + 200 exp] | Damage II | Locks out Fire Damage |
| **Fire Damage**              | Projectiles inflict burning for 2× base damage over 3 s; **mutually exclusive** with Piercing Shots | 1 | [4500g + 18 gem + 150 exp] | Critical Strike | Locks out Piercing Shots |
| **Multishot**                | Level 1: fire **2×** projectiles; level 2: **4×**; reduces attack speed by 25 % | 2 | [10 000g + 40 gem + 300 exp, 50 000g + 80 gem + 600 exp] | Attack Speed II | — |
| **Explosive Shots**          | Projectiles explode for AoE damage; final notable in offense branch | 1 | [100 000g + 400 gem + 800 exp] | Piercing Shots **AND** Fire Damage **AND** Multishot | — |
| **Glass Cannon** *(new)*     | +300 % damage, −50 % max health for 30 s; cooldown 60 s | 1 | [8000g + 30 gem + 300 exp] | Damage II | Mutually exclusive with Lifesteal and Damage Reduction |
| **Overclock** *(new)*        | +200 % attack speed for 20 s; disables health regeneration for 30 s | 1 | [10 000g + 40 gem + 400 exp] | Attack Speed II | Mutually exclusive with Regeneration |

### 5.3 Defense Branch

| Skill                         | New Effect & Notes | Levels | Costs | Prerequisites | Lockouts |
|------------------------------|--------------------|--------|-------|---------------|----------|
| **Health I**                 | +50 max HP per level | 5 | [20g, 100g, 500g, 2500g, 12 500g] | None | — |
| **Regeneration**             | +2 HP/sec per level | 3 | [200g + 2 gem, 1000g + 4 gem, 5000g + 8 gem] | Health I | Locked out by Overclock |
| **Damage Reduction**         | −20 % damage taken per level | 3 | [500g + 2 gem, 2500g + 4 gem, 12 500g + 8 gem] | Health I | — |
| **Lifesteal**                | +5 HP per enemy kill per level | 2 | [750g + 3 gem, 3750g + 6 gem] | Health I | Locked out by Glass Cannon |
| **Shield**                   | +100 shield capacity per level | 2 | [5000g + 20 gem + 200 exp, 25 000g + 40 gem + 400 exp] | Regeneration **AND** Damage Reduction | — |
| **Thorns**                   | Reflect 50 % of incoming damage | 1 | [10 000g + 30 gem + 300 exp] | Damage Reduction | — |
| **Second Chance**            | Survive one fatal hit | 1 | [50 000g + 50 gem + 500 exp] | Shield **AND** Thorns | — |

### 5.4 Utility Branch

| Skill                         | New Effect & Notes | Levels | Costs | Prerequisites | Lockouts |
|------------------------------|--------------------|--------|-------|---------------|----------|
| **Speed I**                  | +25 % movement speed per level | 3 | [30g, 150g, 750g] | None | — |
| **Pickup Radius**            | +50 pickup radius per level | 3 | [40g, 200g, 1000g] | None | — |
| **Speed II**                 | +50 % movement speed per level | 2 | [500g + 2 gem, 2500g + 4 gem] | Speed I | — |
| **Gold Rush**                | +100 % gold gain per level | 3 | [500g + 2 gem, 2500g + 4 gem, 12 500g + 8 gem] | Pickup Radius | — |
| **Experience Boost**         | +100 % experience gain per level | 2 | [700g + 2 gem, 3500g + 4 gem] | Pickup Radius | — |
| **Dash**                     | Unlock dash ability; reduces cooldown by 2 s per level | 2 | [5000g + 20 gem + 200 exp, 25 000g + 40 gem + 400 exp] | Speed II | — |
| **Treasure Hunter**          | +200 % gem drop rate | 1 | [8000g + 30 gem + 300 exp] | Gold Rush **AND** Experience Boost | — |
| **Time Warp**                | Slow time by 30 % for 3 s; 60 s cooldown | 1 | [50 000g + 50 gem + 500 exp] | Dash **AND** Treasure Hunter | — |

## 6 Enemy Config Updates (file `src/entities/EnemyConfig.js`)

1. **Add `Elite` enemy type:**
   - Size multiplier: 1.3
   - Color: `#FFD700` (gold)
   - Shape: Hexagon
   - Special: High health and damage
2. **Add `Shielded` enemy type:**
   - Size multiplier: 1.0
   - Color: `#4CAF50` (green)
   - Shape: Square
   - Special: Activates a 1‑second invulnerability shield every 5 seconds.
3. **Increase base damage:** Raise `BASE_DAMAGE` from 10 to **15** so early enemies remain threatening.  Keep base health and speed unchanged【370680329202896†L138-L145】.
4. **Adjust tank enemy:** Increase `BASE_DAMAGE` multiplier on `Tank` to reflect new wave values (e.g., 3× instead of 2× in later waves).  No change to size.

## 7 Boss Config Updates (files `src/entities/Boss.js` and `src/core/BossManager.js`)

1. **Difficulty scaling:** Increase the boss scales:
   - Mini‑boss (wave 3) scale = 0.5 (health ≈ 60, speed ≈ 28, damage ≈ 10)
   - Mid‑boss (wave 6) scale = 0.8 (health ≈ 96, speed ≈ 36, damage ≈ 16)
   - Final boss remains scale = 1.0
2. **Dash attack:** Reduce dash cooldown to **2.5 s** and increase dash speed to **350** so the boss feels more aggressive【370680329202896†L239-L245】.
3. **Rewards:** Add `bossShardReward` and `bossOrbReward` fields.  Mini‑boss drops 5 gems, 1 shard; mid‑boss drops 20 gems, 5 shards; final boss drops 50 gems, 5 shards, 1 orb.

## 8 Economy & Reward Tweaks (file `src/data/gameConfig.js`)

1. **Currency Pickup:** Increase the base pickup radius to **150** (was 100) so early progression feels faster【370680329202896†L500-L502】.  Set `CURRENCY_PICKUP_RADIUS` growth per level to 50 units (see skill tree).

2. **Enemy Gold Drops:** Set `ENEMY_GOLD_DROP` = 5 (down from 10) but multiply by currency modifiers from the skill tree.  This encourages players to buy Gold Rush.

3. **Wave Completion Rewards:** Increase `WAVE_COMPLETE_HEALTH_REWARD` to **40** HP【370680329202896†L492-L495】 and grant 2 gems on boss waves.

4. **Boss Rewards:** Define `BOSS_SHARD_REWARD` and `BOSS_ORB_REWARD` as described above.

5. **Prestige Mechanic (optional):** After wave 10, allow a prestige/reset that increases all currency drop rates by ×5 and unlocks previously locked notables.  Prestige currency (e.g., “cores”) can be added in a later pass.

## 9 Implementation Notes for Coding Agents

1. **Wave definitions:** Update `waveData.js` to reflect the new durations, spawn intervals, enemy weights and multipliers.  For new enemy types (`Elite` and `Shielded`), reference the new definitions in `EnemyConfig.js`.
2. **Currencies:** Add `shards` and `orbs` to your currency system.  Assign each currency a `startingAmount` of 0 and define conversion ratios (1 gem = 5 gold, etc.).  Update reward functions to drop appropriate currency tiers based on wave number.
3. **Skill Tree:** Modify `skillTreeData.js` to reflect the new costs, effects and prerequisites.  Add boolean flags or tags to enforce lockouts.  When a notable is purchased, set flags to disable the other notables until a prestige.
4. **Enemy Configuration:** Add the new enemy types with their special behavior.  Modify existing enemy multipliers to match the wave tables.  Increase `BASE_DAMAGE` as noted.
5. **Boss Logic:** Adjust boss scales and dash parameters.  Update boss reward routines to include shard/orb drops.
6. **UI Changes:** The UI should always display locked currencies and skill branches with tooltips explaining when they unlock.  After each boss, animate the reveal of the next currency or skill tier.

By following these instructions, the game will adopt a staircase‑style progression.  Each phase will feel distinct, with clear walls that require players to invest in the right upgrades.  The introduction of new currencies and mutually exclusive notables gives meaningful long‑term goals and keeps players looking forward to the next layer.
