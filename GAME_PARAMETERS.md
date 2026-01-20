# Game 2026 - Tweakable Parameters

This document describes all tweakable parameters available to modify the pacing, difficulty, and balance of Game 2026. All values are extracted from the current game configuration files.

---

## Table of Contents
1. [Wave System](#wave-system)
2. [Enemy Types](#enemy-types)
3. [Boss Configurations](#boss-configurations)
4. [Skill Tree](#skill-tree)
5. [Player Configuration](#player-configuration)
6. [Combat Parameters](#combat-parameters)
7. [Economy & Rewards](#economy--rewards)
8. [Physics & Movement](#physics--movement)
9. [Visual & UI Parameters](#visual--ui-parameters)

---

## Wave System

**File:** `src/data/waveData.js`

The game has 10 waves with increasing difficulty. Each wave defines:
- **duration**: Wave length in seconds
- **spawnInterval**: Time between enemy spawns in milliseconds
- **enemyTypes**: Array of enemy configurations with weights and multipliers

### Wave 1 - Tutorial
- **Duration:** 60 seconds
- **Spawn Interval:** 1500ms
- **Enemies:**
  - Asteroid: 100% weight, 1.0x health, 0.8x speed, 1.0x damage

### Wave 2 - Slightly Harder
- **Duration:** 60 seconds
- **Spawn Interval:** 1300ms
- **Enemies:**
  - Asteroid: 80% weight, 1.0x health, 0.9x speed, 1.0x damage
  - Basic: 20% weight, 1.5x health, 1.1x speed, 1.0x damage

### Wave 3 - MINI BOSS
- **Duration:** 90 seconds
- **Spawn Interval:** 1500ms
- **Boss Scale:** 0.3 (30% strength of final boss)
- **Is Boss Wave:** Yes
- **Enemies:**
  - Asteroid: 60% weight, 1.0x health, 1.0x speed, 1.0x damage
  - Basic: 30% weight, 2.0x health, 1.2x speed, 1.0x damage
  - Fast: 10% weight, 1.0x health, 1.8x speed, 1.0x damage

### Wave 4 - More Pressure
- **Duration:** 60 seconds
- **Spawn Interval:** 1000ms
- **Enemies:**
  - Asteroid: 30% weight, 1.5x health, 1.1x speed, 1.0x damage
  - Basic: 35% weight, 2.5x health, 1.3x speed, 1.5x damage
  - Fast: 15% weight, 1.5x health, 2.0x speed, 1.0x damage
  - Splitter: 20% weight, 2.0x health, 1.0x speed, 1.0x damage

### Wave 5 - Midpoint Challenge
- **Duration:** 60 seconds
- **Spawn Interval:** 900ms
- **Enemies:**
  - Asteroid: 20% weight, 2.0x health, 1.2x speed, 1.0x damage
  - Basic: 30% weight, 3.0x health, 1.4x speed, 1.5x damage
  - Fast: 20% weight, 2.0x health, 2.2x speed, 1.5x damage
  - Tank: 15% weight, 5.0x health, 0.8x speed, 2.0x damage
  - Splitter: 10% weight, 2.5x health, 1.0x speed, 1.0x damage
  - Bomber: 5% weight, 1.0x health, 0.6x speed, 1.0x damage

### Wave 6 - MID BOSS
- **Duration:** 100 seconds
- **Spawn Interval:** 1200ms
- **Boss Scale:** 0.6 (60% strength of final boss)
- **Is Boss Wave:** Yes
- **Enemies:**
  - Asteroid: 15% weight, 2.5x health, 1.3x speed, 1.5x damage
  - Basic: 25% weight, 3.5x health, 1.5x speed, 2.0x damage
  - Fast: 20% weight, 2.5x health, 2.5x speed, 1.5x damage
  - Tank: 20% weight, 6.0x health, 0.9x speed, 2.5x damage
  - Splitter: 10% weight, 3.0x health, 1.1x speed, 1.5x damage
  - Bomber: 5% weight, 1.5x health, 0.7x speed, 1.0x damage
  - Teleporter: 5% weight, 1.5x health, 1.0x speed, 1.5x damage

### Wave 7 - Heavy Assault
- **Duration:** 60 seconds
- **Spawn Interval:** 700ms
- **Enemies:**
  - Asteroid: 15% weight, 3.0x health, 1.4x speed, 2.0x damage
  - Basic: 25% weight, 4.0x health, 1.6x speed, 2.0x damage
  - Fast: 20% weight, 3.0x health, 2.8x speed, 2.0x damage
  - Tank: 25% weight, 7.0x health, 1.0x speed, 3.0x damage
  - Splitter: 10% weight, 3.5x health, 1.2x speed, 1.5x damage
  - Bomber: 5% weight, 2.0x health, 0.8x speed, 1.5x damage
  - Teleporter: 5% weight, 2.0x health, 1.1x speed, 2.0x damage

### Wave 8 - Expert Level
- **Duration:** 60 seconds
- **Spawn Interval:** 600ms
- **Enemies:**
  - Asteroid: 10% weight, 3.5x health, 1.5x speed, 2.5x damage
  - Basic: 20% weight, 5.0x health, 1.7x speed, 2.5x damage
  - Fast: 25% weight, 3.5x health, 3.0x speed, 2.0x damage
  - Tank: 30% weight, 8.5x health, 1.1x speed, 3.5x damage
  - Splitter: 10% weight, 4.0x health, 1.3x speed, 2.0x damage
  - Bomber: 5% weight, 2.5x health, 0.9x speed, 2.0x damage
  - Teleporter: 5% weight, 2.5x health, 1.2x speed, 2.5x damage

### Wave 9 - Almost Impossible
- **Duration:** 60 seconds
- **Spawn Interval:** 500ms
- **Enemies:**
  - Asteroid: 8% weight, 4.0x health, 1.6x speed, 3.0x damage
  - Basic: 15% weight, 6.0x health, 1.8x speed, 3.0x damage
  - Fast: 30% weight, 4.0x health, 3.5x speed, 2.5x damage
  - Tank: 32% weight, 10.0x health, 1.2x speed, 4.0x damage
  - Splitter: 10% weight, 5.0x health, 1.4x speed, 2.5x damage
  - Bomber: 5% weight, 3.0x health, 1.0x speed, 2.5x damage
  - Teleporter: 5% weight, 3.0x health, 1.3x speed, 3.0x damage

### Wave 10 - FINAL BOSS
- **Duration:** 120 seconds
- **Spawn Interval:** 2000ms
- **Is Boss Wave:** Yes (scale = 1.0, full power)
- **Enemies:**
  - Asteroid: 5% weight, 5.0x health, 1.8x speed, 3.5x damage
  - Basic: 30% weight, 4.0x health, 1.5x speed, 2.0x damage
  - Fast: 70% weight, 3.0x health, 2.5x speed, 1.5x damage

---

## Enemy Types

**File:** `src/entities/EnemyConfig.js`

### Base Enemy Stats
- **BASE_HEALTH:** 1
- **BASE_SPEED:** 50
- **BASE_SIZE:** 15
- **BASE_DAMAGE:** 10

All enemy stats are multiplied by these base values and wave-specific multipliers.

### Enemy Type Configurations

#### Asteroid
- **Size Multiplier:** 1.2
- **Color:** #00ccff (cyan)
- **Shape:** Diamond
- **Special:** Constant velocity (doesn't track player)

#### Basic
- **Size Multiplier:** 1.0
- **Color:** #ff0000 (red)
- **Shape:** Square
- **Special:** Standard tracking enemy

#### Fast
- **Size Multiplier:** 0.8
- **Color:** #ff6600 (orange)
- **Shape:** Square
- **Special:** Higher speed, smaller size

#### Tank
- **Size Multiplier:** 1.5
- **Color:** #cc0000 (dark red)
- **Shape:** Square
- **Special:** Larger, slower, more health

#### Splitter
- **Size Multiplier:** 1.1
- **Color:** #9c27b0 (purple)
- **Shape:** Diamond
- **Special:** Splits on death
- **Children Count:** 2-3
- **Child Health Multiplier:** 0.5
- **Child Speed Multiplier:** 1.2
- **Child Damage Multiplier:** 0.5
- **Child Size Multiplier:** 0.66
- **Child Speed Range:** 100-150

#### Bomber
- **Size Multiplier:** 0.9
- **Color:** #ff9800 (orange)
- **Shape:** Circle
- **Special:** Explodes on death
- **Explosion Radius:** 80
- **Explosion Damage:** 15
- **Pulse Frequency:** 6
- **Pulse Scale:** 0.15
- **Ring Scale:** 0.3
- **Ring Alpha:** 0.5
- **Ring Line Width:** 2

#### Teleporter
- **Size Multiplier:** 0.85
- **Color:** #00bcd4 (cyan)
- **Shape:** Triangle
- **Special:** Can teleport
- **Teleport Min Distance:** 100
- **Teleport Max Distance:** 150
- **Teleport Cooldown:** 3.5 seconds
- **Min Player Distance:** 30
- **Fade Duration:** 0.3 seconds
- **Initial Delay Min:** 3 seconds
- **Initial Delay Range:** 2 seconds (random)
- **Fade In Delay Factor:** 0.2 (20% of cooldown)

---

## Boss Configurations

**File:** `src/entities/Boss.js` and `src/core/BossManager.js`

### Boss Base Stats
- **TANK_BASE_HEALTH:** 12
- **HEALTH_MULTIPLIER:** 10
- **Effective Base Health:** 120 (before scaling)
- **BASE_SPEED:** 40
- **DAMAGE:** 20
- **SIZE:** 40
- **COLOR:** #9400D3 (dark violet for hard difficulty)

### Boss Difficulty Colors
- **Easy (< 0.5 scale):** #4169E1 (royal blue)
- **Medium (0.5-0.8 scale):** #8B008B (dark magenta)
- **Hard (> 0.8 scale):** #9400D3 (dark violet)

### Boss Scaling
- **Health Scaling:** Linear (health = 120 × difficultyScale)
- **Speed Scaling:** Square root (speed = 40 × √difficultyScale)
- **Damage Scaling:** Linear (damage = 20 × difficultyScale)
- **Size Scaling:** Size = 40 × min(1.0 + (scale - 1) × 0.3, 1.5)
- **Max Size Multiplier:** 1.5

### Boss Attack Pattern - Dash
- **Dash Cooldown:** 3.0 seconds
- **Dash Duration:** 0.5 seconds
- **Dash Speed:** 300
- **Dash Min Range:** 100
- **Dash Max Range:** 400
- **Dash Color (visual):** #FF00FF (magenta)

### Boss Eye Appearance
- **Eye Color:** #FF0000 (red)
- **Eye Size:** 5
- **Eye Offset Ratio:** 0.3 (30% of boss size)

### Boss Waves
Three boss encounters throughout the game:

#### Mini Boss (Wave 3)
- **Boss Scale:** 0.3
- **Health:** 36
- **Speed:** 21.9
- **Damage:** 6
- **Size:** ~40 (minimal size increase)
- **Color:** Royal Blue

#### Mid Boss (Wave 6)
- **Boss Scale:** 0.6
- **Health:** 72
- **Speed:** 31.0
- **Damage:** 12
- **Size:** ~43.6
- **Color:** Dark Magenta

#### Final Boss (Wave 10)
- **Boss Scale:** 1.0
- **Health:** 120
- **Speed:** 40
- **Damage:** 20
- **Size:** 40
- **Color:** Dark Violet
- **Victory Trigger:** Only this boss triggers game completion

---

## Skill Tree

**File:** `src/data/skillTreeData.js`

### Currency Types
- **Gold:** Starting amount = 0, Color = #FFD700
- **Gems:** Starting amount = 0, Color = #FF69B4
- **Experience:** Starting amount = 0, Color = #00CED1

### Offense Branch Skills

#### Damage I (damage_boost_1)
- **Description:** Increase damage by 10%
- **Max Level:** 3
- **Costs:** [10 gold, 20 gold, 40 gold]
- **Prerequisites:** None
- **Effect:** +10% damage per level (stackable)

#### Attack Speed I (attack_speed_1)
- **Description:** Increase attack speed by 15%
- **Max Level:** 3
- **Costs:** [20 gold, 40 gold, 80 gold]
- **Prerequisites:** None
- **Effect:** +15% attack speed per level (stackable)

#### Damage II (damage_boost_2)
- **Description:** Further increase damage by 15%
- **Max Level:** 3
- **Costs:** [50g + 1gem, 100g + 2gem, 200g + 4gem]
- **Prerequisites:** Damage I
- **Effect:** +15% damage per level (stackable)

#### Attack Speed II (attack_speed_2)
- **Description:** Further increase attack speed by 20%
- **Max Level:** 2
- **Costs:** [100g + 3gem, 200g + 6gem]
- **Prerequisites:** Attack Speed I
- **Effect:** +20% attack speed per level (stackable)

#### Critical Strike (critical_strike)
- **Description:** Gain 15% chance to deal double damage
- **Max Level:** 2
- **Costs:** [80g + 2gem, 160g + 5gem]
- **Prerequisites:** Damage I
- **Effect:** +15% crit chance per level (stackable)

#### Piercing Shots (piercing_shots)
- **Description:** Projectiles pierce through enemies
- **Max Level:** 1
- **Costs:** [200g + 8gem + 50exp]
- **Prerequisites:** Damage II
- **Effect:** Projectiles don't stop on enemy hit

#### Fire Damage (fire_damage)
- **Description:** Add fire damage over time effect
- **Max Level:** 1
- **Costs:** [180g + 7gem + 40exp]
- **Prerequisites:** Critical Strike
- **Effect:** Adds burning DoT effect

#### Multishot (multishot)
- **Description:** Fire two projectiles at once
- **Max Level:** 2
- **Costs:** [250g + 10gem + 60exp, 500g + 20gem + 120exp]
- **Prerequisites:** Attack Speed II
- **Effect:** +1 projectile per level (stackable)

#### Explosive Shots (explosive_shots)
- **Description:** Projectiles explode on impact, damaging nearby enemies
- **Max Level:** 1
- **Costs:** [600g + 25gem + 200exp]
- **Prerequisites:** Piercing Shots AND Fire Damage AND Multishot
- **Effect:** AoE explosion on projectile hit

### Defense Branch Skills

#### Health I (health_boost_1)
- **Description:** Increase max health by 20
- **Max Level:** 5
- **Costs:** [12g, 24g, 48g, 96g, 192g]
- **Prerequisites:** None
- **Effect:** +20 max health per level (stackable)

#### Regeneration (health_regen)
- **Description:** Slowly regenerate health over time
- **Max Level:** 3
- **Costs:** [60g + 1gem, 120g + 3gem, 240g + 6gem]
- **Prerequisites:** Health I
- **Effect:** +0.5 HP/sec per level (stackable)

#### Damage Reduction (damage_reduction)
- **Description:** Reduce incoming damage by 10%
- **Max Level:** 3
- **Costs:** [70g + 2gem, 140g + 4gem, 280g + 8gem]
- **Prerequisites:** Health I
- **Effect:** -10% incoming damage per level (stackable)

#### Lifesteal (lifesteal)
- **Description:** Regain 2 health per enemy defeated
- **Max Level:** 2
- **Costs:** [90g + 3gem, 180g + 6gem]
- **Prerequisites:** Health I
- **Effect:** +2 HP on kill per level (stackable)

#### Shield (shield)
- **Description:** Gain a damage-absorbing shield with 50 capacity
- **Max Level:** 2
- **Costs:** [250g + 10gem + 80exp, 500g + 20gem + 160exp]
- **Prerequisites:** Regeneration AND Damage Reduction
- **Effect:** +50 shield capacity per level (stackable)

#### Thorns (thorns)
- **Description:** Reflect 25% of damage back to attackers
- **Max Level:** 1
- **Costs:** [220g + 9gem + 70exp]
- **Prerequisites:** Damage Reduction
- **Effect:** 25% damage reflection

#### Second Chance (second_chance)
- **Description:** Once per game, survive a fatal hit with 1 HP
- **Max Level:** 1
- **Costs:** [700g + 30gem + 250exp]
- **Prerequisites:** Shield AND Thorns
- **Effect:** One-time death prevention

### Utility Branch Skills

#### Speed I (speed_boost_1)
- **Description:** Increase movement speed by 10%
- **Max Level:** 3
- **Costs:** [15g, 30g, 60g]
- **Prerequisites:** None
- **Effect:** +10% movement speed per level (stackable)

#### Currency Magnet (pickup_radius)
- **Description:** Increase currency pickup radius by 30
- **Max Level:** 3
- **Costs:** [18g, 36g, 72g]
- **Prerequisites:** None
- **Effect:** +30 pickup radius per level (stackable)

#### Speed II (speed_boost_2)
- **Description:** Further increase speed by 15%
- **Max Level:** 2
- **Costs:** [80g + 2gem, 160g + 4gem]
- **Prerequisites:** Speed I
- **Effect:** +15% movement speed per level (stackable)

#### Gold Rush (gold_bonus)
- **Description:** Increase gold gained by 25%
- **Max Level:** 3
- **Costs:** [50g + 1gem, 100g + 2gem, 200g + 4gem]
- **Prerequisites:** Currency Magnet
- **Effect:** +25% gold drops per level (stackable)

#### Wisdom (experience_boost)
- **Description:** Increase experience gained by 30%
- **Max Level:** 2
- **Costs:** [70g + 2gem, 140g + 4gem]
- **Prerequisites:** Currency Magnet
- **Effect:** +30% experience per level (stackable)

#### Dash (dash)
- **Description:** Unlock dash ability with 5 second cooldown
- **Max Level:** 2
- **Costs:** [200g + 8gem + 60exp, 400g + 16gem + 120exp]
- **Prerequisites:** Speed II
- **Effect:** Dash ability, -1 second cooldown per level

#### Treasure Hunter (gem_find)
- **Description:** Increase gem drop rate by 50%
- **Max Level:** 1
- **Costs:** [180g + 7gem + 50exp]
- **Prerequisites:** Gold Rush AND Wisdom
- **Effect:** +50% gem drop rate

#### Time Warp (time_warp)
- **Description:** Slow down time by 30% for 3 seconds when activated
- **Max Level:** 1
- **Costs:** [650g + 28gem + 230exp]
- **Prerequisites:** Dash AND Treasure Hunter
- **Effect:** Time slow ability

---

## Player Configuration

**File:** `src/data/gameConfig.js`

- **PLAYER_SPEED:** 200 (base movement speed)
- **PLAYER_START_HEALTH:** 100
- **PLAYER_MAX_HEALTH:** 100

---

## Combat Parameters

**File:** `src/data/gameConfig.js`

- **BULLET_RANGE:** 300 (projectile max travel distance)
- **BULLET_SPEED:** 300 (projectile velocity)
- **AUTO_SHOOT_RANGE:** 250 (max range to auto-target enemies)
- **AUTO_SHOOT_INTERVAL:** 500ms (time between shots)

---

## Economy & Rewards

**File:** `src/data/gameConfig.js`

### Wave Rewards
- **WAVE_COMPLETE_HEALTH_REWARD:** 30 (HP restored on wave completion)

### Boss Rewards
- **BOSS_GOLD_REWARD:** 500 (base gold, scaled by boss difficulty)
- **BOSS_GEM_REWARD:** 20 (base gems, scaled by boss difficulty)

### Currency
- **CURRENCY_PICKUP_RADIUS:** 100 (base pickup range)
- **ENEMY_GOLD_DROP:** 10 (gold per enemy killed)

---

## Physics & Movement

**File:** `src/data/gameConfig.js`

- **TAP_MOVE_STOP_DISTANCE:** 5 (pixels from touch target before stopping)
- **MOVEMENT_VELOCITY_THRESHOLD:** 10 (velocity below which player is considered stationary)
- **TRAIL_SPAWN_PROBABILITY:** 0.3 (30% chance per frame to spawn trail particle)

### Wave Banner Physics
- **BANNER_BOUNCE_MULTIPLIER:** 3.0
- **BANNER_BASE_PUSH_FORCE:** 100

---

## Visual & UI Parameters

**File:** `src/data/gameConfig.js` and `src/data/skillTreeUIConfig.js`

### Canvas Dimensions
- **CANVAS_WIDTH:** 800
- **CANVAS_HEIGHT:** 600

### Skill Tree UI
- **Canvas Width:** 1200
- **Canvas Height:** 900
- **Min Zoom Scale:** 0.5
- **Max Zoom Scale:** 2.0
- **Zoom In Factor:** 1.1
- **Zoom Out Factor:** 0.9
- **Auto-center Padding:** 100
- **Max Auto-center Scale:** 1.5
- **Double-tap Timeout:** 500ms

### Tooltip Configuration
- **Width:** 700
- **Height:** 400
- **Margin:** 10 (from canvas edge)
- **Padding:** 30
- **Font Size Title:** 42
- **Font Size Body:** 32
- **Font Size Details:** 28
- **Line Height:** 48
- **Spacing Large:** 12
- **Spacing Small:** 8
- **Spacing Prereq:** -2

### Currency Panel
- **Height:** 40

---

## Parameter Tuning Guide

### To Make the Game Easier:
1. **Increase wave duration** in `waveData.js`
2. **Increase spawn intervals** (slower enemy spawning)
3. **Decrease enemy multipliers** (health, speed, damage)
4. **Increase PLAYER_START_HEALTH** in `gameConfig.js`
5. **Decrease skill costs** in `skillTreeData.js`
6. **Increase WAVE_COMPLETE_HEALTH_REWARD**
7. **Decrease boss scale values** (0.3, 0.6, 1.0)
8. **Increase CURRENCY_PICKUP_RADIUS**

### To Make the Game Harder:
1. **Decrease wave duration** (less time to survive)
2. **Decrease spawn intervals** (more frequent enemies)
3. **Increase enemy multipliers** (tougher enemies)
4. **Decrease PLAYER_SPEED** or health
5. **Increase skill costs**
6. **Decrease AUTO_SHOOT_INTERVAL** (slower shooting)
7. **Increase boss scale values**
8. **Decrease BOSS_GOLD_REWARD** and BOSS_GEM_REWARD

### To Change Game Pacing:
1. **Adjust spawn intervals** for wave rhythm
2. **Modify wave durations** for session length
3. **Change boss wave positions** (currently waves 3, 6, 10)
4. **Adjust enemy type weights** to change variety
5. **Modify skill progression** through costs and prerequisites

### To Rebalance Economy:
1. **ENEMY_GOLD_DROP** - base gold per kill
2. **BOSS_GOLD_REWARD** and **BOSS_GEM_REWARD** - boss rewards
3. **Skill costs arrays** - progression speed
4. **Gold/Gem/Experience multiplier skills** - income boosters

---

## File Reference

All parameters can be modified in these files:

- **src/data/waveData.js** - Wave configurations
- **src/data/skillTreeData.js** - Skill tree and upgrade data
- **src/data/gameConfig.js** - Core game parameters
- **src/entities/EnemyConfig.js** - Enemy type definitions
- **src/entities/Boss.js** - Boss constants
- **src/core/BossManager.js** - Boss rewards
- **src/data/skillTreeUIConfig.js** - UI configuration

---

*Last Updated: 2026-01-20*
*Game Version: Current*
