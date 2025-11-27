# CODE QUEST - Extra Information Document

## Save System

### Auto-Save

- Every 60 seconds
- Old auto-saves pruned after 10 minutes
- Most recent always preserved
- Triggers on area entry

### Manual Save

- Available anytime
- For strategic rollback (e.g., before boss)
- Multiple manual save slots

## Enemy System

### Enemy Types

| Type | Behavior |
|------|----------|
| `bug` | Basic fodder, swarms |
| `trojan` | Disguised, ambush attacker |
| `worm` | Spreads, spawns copies |
| `virus` | Inflicts debuffs |
| `malware` | Heavy hitter, tanky |
| `bot` | Ranged, turret-style |
| `corrupted_NPC` | Former friendly, tied to ERROR |

### Enemy Ranks

| Rank | Description |
|------|-------------|
| Fodder | Weak, numerous |
| Standard | Balanced threat |
| Captain | Pre-fight taunt, commands others |
| Elite | Rare, strong, guards paths |
| Boss | Unique, multi-phase, story-relevant |

### Enemy Behavior

- Larger groups have leaders and formations
- Enemies communicate mid-combat
- Adapt to player patterns in difficult zones
- Drop ERROR lore on death

## Boss System

### Structure

- Multi-phase fights
- Interactive arenas (hazards, cover, destructibles)
- Transforming arenas (environment changes with phases)
- Pre-fight dialogue
- Mid-combat taunts
- Post-fight lore drops

### The Syntaxer (First Boss)

**Phase 1: The Ambush**
- Arena forms from peaceful clearing
- Summons `syntax_units`
- Debuff attacks drain his energy if missed
- Player dodges, Frank handles units

**Phase 2: The Fake-Out**
- Arena returns to normal, boss falls
- TRICK - boss rises stronger
- Arena fills with traps and corruption
- Direct `delete_punch` attacks
- Free debuffs on every hit
- Player must lure boss into traps, Frank immobilizes

**Phase 3: True Form**
- Boss ascends, sheds ninja form
- Fragments into copies
- Merges with arena
- Corruption spreads from center
- Frank gets partially hacked
- Chaos: destroy nodes, break Frank's tethers, kill copies

**Death:** "EXECUTE SHUTDOWN PROTOCOL"
**Drops:** `syntax_punch`, `syntax_armor` set, lore, resources

**Aftermath:** Frank permanently changed, slips begin

## Crafting System

### Workstations

| Station | Crafts |
|---------|--------|
| `alloy_forge` | Weapons, armor, metal items |
| `circuit_fabricator` | Electronics, modules, drones |
| NPC-exclusive | Special recipes only they know |

### Crafting Features

- Recipe-based with some discovery
- Linear and branching upgrades
- Stat infusion possible
- Takes time (2-10 seconds)
- Requires materials + fee

## Zones

### `laser_city/`

- Main trading hub
- Bustling, populated
- Neon lights, vibrant colors
- Most merchants and quest givers

### `syntax_arena/`

- Corrupted boss arena
- Purple/black corruption dominant
- The Syntaxer's domain
- Oppressive atmosphere

### `metallic_village/`

- Rest stop between adventures
- Warm metallic tones
- Cozy and safe
- Recovery focused

### `circuited_dungeon/`

- Trap-heavy exploration
- Fewer enemies
- Electric blues and copper
- Puzzle-like navigation

## Progression

### Gating Types

1. **Level (version) recommendations** - Can go anywhere, but high-level zones are deadly
2. **Item/ability gates** - Need `decrypt()` or specific items
3. **Story gates** - Unlock after story beats
4. **Combat gates** - Must defeat enemies to clear paths

### Slot Expansion

- `function()` slots: Items, quests, progression
- Inventory slots: Accessories
- Accessory slots: Progression, special accessories
