# CODE QUEST - Game Concept Document

## Overview

A 3D low-poly action RPG PWA where you play as a robot harnessing the power of code. Combat is real-time, melee-focused with ranged options.

## Core Gameplay

- **Genre**: 3D Action RPG
- **Platform**: Progressive Web App (PWA)
- **Camera**: Third-person (default), isometric (settings option)
- **Controls**: Keyboard/mouse + touch support

## World Structure

- Network of hubs connected by paths
- Clear enemies to establish connections between nodes
- Hybrid progression: level recommendations, item/ability gates, story requirements
- Free exploration with storyline guidance

## Combat System

- Real-time combat
- Melee-focused with ranged options
- Stats called `variables`
- Abilities called `functions()` with cooldowns
- Defensive moves: `break` (dash), `try/catch` (block)
- `function()` slots start small, expand through progression
- Abilities swap only in safe zones or conquered areas

## Death System

- Lose currency and some resources (scaled by area danger and killing blow strength)
- Never lose equipped items
- Reboot at `checkpoint.save` locations
- Frank (companion) helps reboot you

## Key Features

- NPC shops and crafting stations
- Quest system
- Hidden lore and collectibles
- Boss battles with multiple phases
- Companion system (Frank)
- Instability mechanic on items

## Zones (MVP)

- `laser_city/` - Trading hub, bustling, neon lights
- `syntax_arena/` - Corrupted boss arena (The Syntaxer)
- `metallic_village/` - Rest stop, cozy and safe
- `circuited_dungeon/` - Trap-heavy, puzzle-like navigation
