# CODE QUEST - Game Things Document

## Weapons

### Melee Categories

| Type | Speed | Damage | Examples |
|------|-------|--------|----------|
| Swords | Medium | Medium | `syntax_sword`, `glitch_blade`, `null_edge` |
| Heavy | Slow | High | `data_hammer`, `crash_mace`, `memory_leak` |
| Fast | Fast | Low | `ping_daggers`, `bit_claws`, `recursion_knives` |
| Hybrid | Medium | Medium | `debug_staff`, `exception_spear` |

### Ranged Categories

| Type | Style | Examples |
|------|-------|----------|
| Rays | Continuous beam | `delete_ray`, `trace_beam`, `corruption_stream` |
| Projectiles | Single shots | `packet_launcher`, `exception_thrower`, `fork_bomb` |
| Burst | Slow, explosive | `overflow_cannon`, `kernel_panic`, `stack_overflow` |
| Utility | Debuffs, marks | `trace_dart`, `ping_pistol`, `sleep_injector` |

## Armor (7 Slots)

| Slot | Purpose | Set Piece (Syntaxer) |
|------|---------|---------------------|
| Helmet | Head protection | `syntax_helm` |
| Chestplate | Core defense | `syntax_core` |
| Cloak/Cape | Utility effects | `syntax_shroud` |
| Leggings | Leg protection | `syntax_guards` |
| Boots | Movement effects | `syntax_steps` |
| Gloves | Attack modifiers | `syntax_gauntlets` |
| Extra Armor | Flexible bonus | `syntax_frame` |

## Accessories (6 Categories)

| Category | Purpose | Examples |
|----------|---------|----------|
| `debugger` | Reduce instability | `basic_debugger`, `pattern_scanner`, `error_handler` |
| `optimizer` | Enhance stats | `damage_boost`, `speed_cache`, `overclock_chip` |
| `module` | Utility, drones | `scavenger_drone`, `combat_drone`, `repair_drone` |
| `runtime` | Combat effects | `critical_bit`, `leech_process`, `combo_counter` |
| `failsafe` | Survival | `emergency_reboot`, `damage_buffer`, `regen_loop` |
| `corrupted` | Powerful, risky | `error_shard`, `void_link`, `ERROR_fragment` |

## Consumables

| Type | Examples |
|------|----------|
| Healing | `patch_kit`, `emergency_patch`, `full_restore` |
| Buffs | `overclock_stim`, `damage_amp`, `shield_boost` |
| Debuff Removal | `antivirus_shot`, `firewall_pill`, `corruption_purge` |
| Utility | `recall_beacon`, `reveal_pulse`, `decoy_drone` |
| Combat | `damage_grenade`, `stun_bomb`, `null_mine` |
| Special | `backup_core`, `ERROR_vial`, `memory_fragment` |

## Materials

| Tier | Examples |
|------|----------|
| Basic | `scrap_metal`, `copper_wire`, `silicon_chunk`, `data_fragment` |
| Intermediate | `refined_alloy`, `circuit_board`, `processor_chip`, `power_core` |
| Advanced | `quantum_thread`, `neural_cluster`, `void_shard`, `plasma_core` |
| Boss Drops | `syntax_essence`, `corrupted_core`, `null_fragment` |
| Special | `ERROR_residue`, `ancient_code`, `frank_fragment`, `stable_anomaly` |

## NPCs

### Merchants

- `Chip` - General goods (laser_city)
- `Volt` - Weapons (laser_city)
- `Casing` - Armor (metallic_village)
- `Byte` - Rare goods (roaming)

### Crafters

- `Forge` - Weapons/armor at `alloy_forge`
- `Circuit` - Electronics at `circuit_fabricator`
- `Patch` - Upgrades (laser_city)
- `Glitch` - Corrupted items (hidden)

### Quest Givers

- `Handler` - Main story (laser_city)
- `Scout` - Exploration (metallic_village)
- `Bounty` - Combat (multiple hubs)
- `Archive` - Lore collection (libraries)

### Informants

- `Index` - Lore/history (laser_city)
- `Rumor` - Hints/secrets (metallic_village)
- `Old_Code` - Deep lore (hidden)

### Special

- `The Watcher` - Observes, says little
- `Echo` - Ghost of previous experiment
- `Null` - Shouldn't exist, trades impossible items

## Debuffs

| Type | Examples |
|------|----------|
| Basic | `syntax_error`, `memory_leak`, `slowdown`, `silence` |
| Combat | `burning`, `frozen`, `shocked`, `weakened`, `marked` |
| Corruption | `corrupted`, `glitched`, `infected`, `null_state` |
| Syntaxer | `syntax_lock`, `error_chain`, `delete_mark` |
| Environmental | `overheat`, `static_field`, `corruption_zone` |

## Buffs

- `overclocked` - Speed/damage up
- `shielded` - Absorbs damage
- `focused` - Crit chance up
- `regenerating` - Health over time
- `stabilized` - No instability effects
- `empowered` - Next attack bonus
- `invisible` - Enemies lose track
- `linked` - Frank's damage heals you
