# CODE QUEST - Stats and Costs Document

## Stats System

Stats are called `variables`:

- `health` - Hit points
- `energy` - Used for abilities
- `attack` - Base damage
- `defense` - Damage reduction
- `speed` - Movement speed
- `crit_chance` - Critical hit probability

## Ability System

- Abilities called `functions()`
- Each has cooldown timer
- `function()` slots start at 2, expand to max 6
- Slots gained through: special items, quests, progression

### Defensive Functions

- `break` - Dash with invincibility frames
- `try/catch` - Block/parry incoming attacks
- Both start with long cooldowns (10s)
- Cooldowns reduce with progression (down to 3s)

## Instability System

Items have `instability` rating (0-100):

| Rating | Effect |
|--------|--------|
| 0-20 | Stable - reliable, consistent |
| 21-40 | Low - occasional minor glitches |
| 41-60 | Medium - noticeable misfires |
| 61-80 | High - frequent unpredictability |
| 81-100 | Volatile - maximum chaos |

### Instability Effects

- Attacks miss unexpectedly
- Random damage bursts (positive or negative)
- Self-damage potential
- Ability misfires
- Visual glitches on weapon

### Instability Patterns

- Not pure random - has learnable tells
- Visual warnings before misfire
- Timing patterns per weapon
- `debugger` accessories reveal patterns

## Currency System

### Primary Currency: `bits`

- Dropped by enemies
- Found in containers
- Quest rewards
- Used for: shops, NPC crafting fees, upgrades

### Secondary: `rare_bits`

- Rare drops
- Boss kills
- Special quest rewards
- Used for: expensive items, special services

### Trading

- Direct item-to-item trading available
- Some purchases require `bits` + specific items
- Can sell items to merchants

## Death Costs

Cost scales with:
1. Area difficulty (higher zone = more loss)
2. Killing blow damage (bigger hit = more loss)

### What You Lose

- Currency: 10-30% of `bits`
- Resources: 5-15% of materials
- Items: NEVER (equipped gear always safe)

## Crafting Costs

| Workstation | Fee Range |
|-------------|-----------|
| `alloy_forge` | 50-500 bits |
| `circuit_fabricator` | 100-1000 bits |
| NPC-exclusive recipes | 500-5000 bits |

Crafting takes real time (2-10 seconds based on complexity)
