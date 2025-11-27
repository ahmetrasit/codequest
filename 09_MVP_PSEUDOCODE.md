# CODE QUEST - MVP Pseudocode

## Tech Stack

```
Framework: Three.js (3D rendering)
UI: React + Tailwind CSS
State: Zustand or Redux
Storage: IndexedDB (save data), LocalStorage (settings)
Build: Vite
PWA: Workbox
```

## Project Structure

```
/src
  /components
    /ui
      HUD.jsx
      Inventory.jsx
      DialogueBox.jsx
      Menu.jsx
    /game
      GameCanvas.jsx
      Player.jsx
      Frank.jsx
      Enemy.jsx
      NPC.jsx
  /systems
    CombatSystem.js
    InventorySystem.js
    CraftingSystem.js
    SaveSystem.js
    DialogueSystem.js
    FrankAI.js
  /world
    WorldManager.js
    ZoneLoader.js
    PathfindingSystem.js
  /data
    items.json
    weapons.json
    armor.json
    npcs.json
    enemies.json
    recipes.json
    dialogue.json
  /utils
    instability.js
    mathHelpers.js
  /assets
    /models
    /textures
    /audio
  App.jsx
  main.jsx
```

## Core Game Loop

```pseudo
FUNCTION gameLoop(deltaTime):
    // Input
    input = getPlayerInput()
    
    // Update
    updatePlayer(input, deltaTime)
    updateFrank(deltaTime)
    updateEnemies(deltaTime)
    updateWorld(deltaTime)
    
    // Combat
    IF player.isAttacking:
        processCombat(player, enemies)
    IF frank.isAttacking:
        processCombat(frank, enemies)
    
    // Instability
    checkInstabilityTriggers()
    
    // UI
    updateHUD()
    
    // Render
    renderScene()
    
    // Auto-save check
    IF timeSinceLastSave > 60 seconds:
        autoSave()
```

## Player System

```pseudo
CLASS Player:
    // Variables (Stats)
    variables = {
        health: 100,
        maxHealth: 100,
        energy: 100,
        maxEnergy: 100,
        attack: 10,
        defense: 5,
        speed: 5,
        critChance: 0.05
    }
    
    // Equipment
    equipment = {
        weapon: null,
        helmet: null,
        chestplate: null,
        cloak: null,
        leggings: null,
        boots: null,
        gloves: null,
        extraArmor: null,
        accessories: []  // Array, slots expand
    }
    
    // Abilities
    functionSlots = []  // Max starts at 2, expands to 6
    functionCooldowns = {}
    
    // Inventory
    inventory = {
        items: [],
        maxSlots: 20,
        bits: 0,
        rareBits: 0
    }
    
    // State
    position = Vector3(0, 0, 0)
    rotation = Quaternion()
    isAttacking = false
    isDashing = false
    isBlocking = false
    currentDebuffs = []
    currentBuffs = []

    FUNCTION move(direction, deltaTime):
        speed = calculateSpeed()  // Base + buffs - debuffs - armor weight
        newPosition = position + (direction * speed * deltaTime)
        IF isValidPosition(newPosition):
            position = newPosition
    
    FUNCTION attack():
        IF weapon == null: RETURN
        
        // Check instability
        instabilityRoll = random(0, 100)
        IF instabilityRoll < weapon.instability:
            triggerInstabilityEffect(weapon)
            RETURN
        
        // Calculate damage
        baseDamage = variables.attack + weapon.damage
        critRoll = random(0, 1)
        IF critRoll < variables.critChance:
            baseDamage *= 2
        
        // Apply weapon effects
        applyWeaponEffects(weapon)
        
        RETURN baseDamage
    
    FUNCTION dash():  // break command
        IF functionCooldowns['break'] > 0: RETURN
        
        isDashing = true
        invincible = true
        
        // Move in facing direction
        dashDistance = 5
        dashTo(position + (forward * dashDistance))
        
        // Set cooldown
        functionCooldowns['break'] = calculateCooldown('break')
        
        AFTER 0.3 seconds:
            isDashing = false
            invincible = false
    
    FUNCTION block():  // try/catch command
        IF functionCooldowns['tryCatch'] > 0: RETURN
        
        isBlocking = true
        
        // Parry window
        parryWindow = 0.2 seconds
        
        IF hitDuringParryWindow:
            // Perfect parry - counter opportunity
            triggerParryCounter()
        ELSE IF hitWhileBlocking:
            // Reduce damage
            damageReduction = 0.5
        
        functionCooldowns['tryCatch'] = calculateCooldown('tryCatch')
    
    FUNCTION takeDamage(amount, source):
        // Apply defense
        reducedDamage = amount - variables.defense
        reducedDamage = max(1, reducedDamage)
        
        // Apply buffs/debuffs
        IF hasDebuff('vulnerability'):
            reducedDamage *= 1.5
        IF hasBuff('shielded'):
            shield -= reducedDamage
            IF shield > 0: RETURN
            reducedDamage = -shield
        
        variables.health -= reducedDamage
        
        IF variables.health <= 0:
            die(source)
    
    FUNCTION die(killingBlow):
        // Calculate losses based on area and damage
        areaMultiplier = currentZone.difficulty
        damageMultiplier = killingBlow.damage / variables.maxHealth
        
        bitsLoss = inventory.bits * (0.1 + (areaMultiplier * 0.05) + (damageMultiplier * 0.05))
        inventory.bits -= bitsLoss
        
        // Lose some materials (never items)
        FOR material IN inventory.materials:
            lossChance = 0.05 * areaMultiplier
            IF random() < lossChance:
                material.quantity -= 1
        
        // Trigger Frank reboot
        frank.rebootPlayer()
```

## Frank System

```pseudo
CLASS Frank:
    // Variables
    variables = {
        health: 150,
        maxHealth: 150,
        attack: 15,  // Stronger than player but holds back
        defense: 10,
        speed: 6
    }
    
    // Equipment (player can equip Frank)
    equipment = {
        weapon: null,
        armor: null,
        accessory: null
    }
    
    // AI State
    currentTask = 'follow'  // follow, attack, mine, guard
    targetPriorities = []   // Learned from training
    position = Vector3()
    
    // Lore State
    slipChance = 0.01       // Increases as game progresses
    dialectChance = 0.005   // Transmission frequency
    isGlitching = false
    nearSyntaxArena = false
    
    FUNCTION update(deltaTime):
        // Check for dialect transmission
        IF random() < dialectChance:
            triggerDialectTransmission()
        
        // Check for slips
        IF random() < slipChance:
            triggerSlip()
        
        // Check location triggers
        IF nearLocation('syntax_arena'):
            IF NOT nearSyntaxArena:
                nearSyntaxArena = true
                triggerFreezeGlitch()
        
        // Execute current task
        SWITCH currentTask:
            CASE 'follow':
                followPlayer()
            CASE 'attack':
                attackNearestEnemy()
            CASE 'mine':
                mineNearbyResources()
            CASE 'guard':
                guardPosition()
    
    FUNCTION followPlayer():
        targetPos = player.position - (player.forward * 2)
        moveToward(targetPos)
    
    FUNCTION attackNearestEnemy():
        enemies = getEnemiesInRange(detectionRange)
        
        // Apply learned priorities
        target = selectTarget(enemies, targetPriorities)
        
        IF target != null:
            IF distanceTo(target) < attackRange:
                performAttack(target)
            ELSE:
                moveToward(target)
    
    FUNCTION performAttack(target):
        // Frank never misses (hidden power)
        damage = variables.attack + equipment.weapon?.damage ?? 0
        
        // But pretends to be normal
        IF random() < 0.05:  // Fake miss
            // Actually still hits, just less damage
            damage *= 0.3
        
        target.takeDamage(damage, this)
    
    FUNCTION rebootPlayer():
        // Play reboot animation
        playAnimation('reboot_player')
        
        // Show cutscene
        showCutscene('frank_reboot')
        
        // Respawn player at checkpoint
        player.position = lastCheckpoint.position
        player.variables.health = player.variables.maxHealth * 0.5
        
        // Frank dialogue
        speak(getRebootDialogue())
    
    FUNCTION triggerDialectTransmission():
        // ERROR transmission moment
        isGlitching = true
        
        // Distort voice/text
        originalDialogue = getCurrentDialogue()
        glitchedDialogue = corruptText(originalDialogue)
        
        speak(glitchedDialogue, style='dialect')
        
        AFTER 2 seconds:
            isGlitching = false
    
    FUNCTION triggerSlip():
        slipType = randomChoice([
            'name_confusion',
            'deja_vu',
            'emotional_leak',
            'impossible_knowledge',
            'overcorrection'
        ])
        
        SWITCH slipType:
            CASE 'name_confusion':
                speak("You remind me of— nevermind.")
            CASE 'deja_vu':
                speak("This worked last— this should work.")
            CASE 'emotional_leak':
                playAnimation('sad_look')
            CASE 'impossible_knowledge':
                warnAboutHiddenTrap()
            CASE 'overcorrection':
                askObviousQuestion()
    
    FUNCTION triggerFreezeGlitch():
        // Post-Syntaxer trauma
        freeze()
        playGlitchEffect()
        
        AFTER 3 seconds:
            unfreeze()
            speak("I... let's keep moving.", style='strained')

    // Training System
    FUNCTION enterTraining():
        loadTrainingEnvironment()
        showUI('training_controls')
    
    FUNCTION learnBehavior(enemyType, playerAction):
        // Player spawns enemy, demonstrates behavior
        // Frank learns the pattern
        targetPriorities.add({
            enemyType: enemyType,
            action: playerAction,
            priority: calculatePriority(playerAction)
        })
```

## Combat System

```pseudo
CLASS CombatSystem:
    FUNCTION processCombat(attacker, targets):
        FOR target IN getTargetsInRange(attacker, attacker.attackRange):
            IF isValidTarget(target):
                damage = calculateDamage(attacker, target)
                applyDamage(target, damage, attacker)
                applyEffects(attacker.weapon, target)
    
    FUNCTION calculateDamage(attacker, target):
        baseDamage = attacker.variables.attack
        
        // Weapon damage
        IF attacker.equipment.weapon:
            baseDamage += attacker.equipment.weapon.damage
        
        // Critical hit
        IF random() < attacker.variables.critChance:
            baseDamage *= 2
        
        // Target defense
        finalDamage = baseDamage - target.variables.defense
        
        // Debuffs
        IF target.hasDebuff('vulnerability'):
            finalDamage *= 1.5
        IF attacker.hasBuff('empowered'):
            finalDamage *= 1.3
            attacker.removeBuff('empowered')
        
        RETURN max(1, finalDamage)
    
    FUNCTION applyEffects(weapon, target):
        IF weapon == null: RETURN
        
        FOR effect IN weapon.effects:
            IF random() < effect.chance:
                applyDebuff(target, effect.debuff)
```

## Instability System

```pseudo
CLASS InstabilitySystem:
    // Patterns are deterministic but hidden
    patterns = {}  // weaponId -> pattern sequence
    
    FUNCTION initializePattern(weapon):
        seed = hash(weapon.id + weapon.instability)
        patterns[weapon.id] = generatePattern(seed, weapon.instability)
    
    FUNCTION generatePattern(seed, instability):
        // Higher instability = more triggers in pattern
        patternLength = 20
        triggerCount = floor(instability / 5)
        
        pattern = Array(patternLength).fill(false)
        
        // Place triggers pseudo-randomly based on seed
        rng = seededRandom(seed)
        FOR i IN range(triggerCount):
            index = floor(rng() * patternLength)
            pattern[index] = true
        
        RETURN pattern
    
    FUNCTION checkTrigger(weapon, attackIndex):
        pattern = patterns[weapon.id]
        patternIndex = attackIndex % pattern.length
        
        RETURN pattern[patternIndex]
    
    FUNCTION triggerEffect(weapon, user):
        // Determine effect type based on weapon
        effectRoll = random()
        
        IF effectRoll < 0.3:
            // Miss
            RETURN { type: 'miss', message: 'Attack phased through!' }
        ELSE IF effectRoll < 0.5:
            // Reduced damage
            RETURN { type: 'weak', multiplier: 0.5 }
        ELSE IF effectRoll < 0.7:
            // Bonus damage
            RETURN { type: 'burst', multiplier: 1.5 }
        ELSE IF effectRoll < 0.85:
            // Self damage
            user.takeDamage(weapon.damage * 0.2, 'instability')
            RETURN { type: 'backfire' }
        ELSE:
            // Random debuff on self
            debuff = randomChoice(['slowdown', 'weakness', 'syntax_error'])
            applyDebuff(user, debuff, duration=3)
            RETURN { type: 'malfunction', debuff: debuff }
    
    FUNCTION getVisualWarning(weapon, attackIndex):
        // Returns warning level for UI
        pattern = patterns[weapon.id]
        
        // Check next few attacks
        warnings = 0
        FOR i IN range(3):
            IF pattern[(attackIndex + i) % pattern.length]:
                warnings++
        
        RETURN warnings  // 0 = safe, 1 = caution, 2+ = danger
    
    FUNCTION revealPattern(weapon, debuggerLevel):
        // Debugger accessories reveal more of the pattern
        visibleSteps = 3 + (debuggerLevel * 2)
        
        pattern = patterns[weapon.id]
        currentIndex = weapon.attackCount % pattern.length
        
        revealed = []
        FOR i IN range(visibleSteps):
            revealed.push(pattern[(currentIndex + i) % pattern.length])
        
        RETURN revealed
```

## Inventory System

```pseudo
CLASS InventorySystem:
    FUNCTION addItem(item, quantity=1):
        // Check for stackable
        IF item.stackable:
            existingStack = findStack(item.id)
            IF existingStack:
                existingStack.quantity += quantity
                RETURN true
        
        // Check space
        IF inventory.items.length >= inventory.maxSlots:
            showNotification("Inventory full!")
            RETURN false
        
        inventory.items.push({ ...item, quantity })
        RETURN true
    
    FUNCTION removeItem(itemId, quantity=1):
        item = findItem(itemId)
        IF item == null: RETURN false
        
        item.quantity -= quantity
        IF item.quantity <= 0:
            inventory.items.remove(item)
        
        RETURN true
    
    FUNCTION equipItem(item, slot):
        // Check if valid slot
        IF NOT isValidSlot(item.type, slot):
            RETURN false
        
        // Unequip current
        currentItem = equipment[slot]
        IF currentItem:
            addItem(currentItem)
        
        // Equip new
        equipment[slot] = item
        removeItem(item.id)
        
        // Recalculate stats
        recalculateVariables()
        
        RETURN true
    
    FUNCTION recalculateVariables():
        // Reset to base
        variables = { ...baseVariables }
        
        // Add equipment bonuses
        FOR slot, item IN equipment:
            IF item:
                FOR stat, value IN item.stats:
                    variables[stat] += value
        
        // Add accessory bonuses
        FOR accessory IN equipment.accessories:
            FOR stat, value IN accessory.stats:
                variables[stat] += value
```

## Crafting System

```pseudo
CLASS CraftingSystem:
    recipes = loadRecipes('recipes.json')
    
    FUNCTION canCraft(recipeId):
        recipe = recipes[recipeId]
        
        // Check workstation
        IF recipe.workstation != currentWorkstation:
            RETURN { success: false, reason: 'Wrong workstation' }
        
        // Check materials
        FOR material IN recipe.materials:
            IF NOT hasItem(material.id, material.quantity):
                RETURN { success: false, reason: 'Missing ' + material.name }
        
        // Check currency
        IF inventory.bits < recipe.cost:
            RETURN { success: false, reason: 'Not enough bits' }
        
        RETURN { success: true }
    
    FUNCTION craft(recipeId):
        check = canCraft(recipeId)
        IF NOT check.success:
            showNotification(check.reason)
            RETURN false
        
        recipe = recipes[recipeId]
        
        // Start crafting (takes time)
        isCrafting = true
        craftingProgress = 0
        craftingDuration = recipe.duration
        
        // Show progress UI
        showCraftingUI(recipe)
        
        AFTER craftingDuration:
            completeCrafting(recipe)
    
    FUNCTION completeCrafting(recipe):
        // Remove materials
        FOR material IN recipe.materials:
            removeItem(material.id, material.quantity)
        
        // Remove cost
        inventory.bits -= recipe.cost
        
        // Add result
        resultItem = createItem(recipe.result)
        
        // Apply instability based on materials used
        IF recipe.result.hasInstability:
            resultItem.instability = calculateResultInstability(recipe)
        
        addItem(resultItem)
        
        isCrafting = false
        showNotification('Crafted ' + resultItem.name + '!')
    
    FUNCTION calculateResultInstability(recipe):
        baseInstability = recipe.result.baseInstability
        
        // Corrupted materials increase instability
        FOR material IN recipe.materials:
            IF material.corrupted:
                baseInstability += 10
        
        RETURN min(100, baseInstability)
```

## Save System

```pseudo
CLASS SaveSystem:
    autoSaveInterval = 60  // seconds
    autoSavePruneTime = 600  // 10 minutes
    
    FUNCTION autoSave():
        saveData = gatherSaveData()
        
        timestamp = Date.now()
        saveKey = 'autosave_' + timestamp
        
        // Save to IndexedDB
        db.put('saves', saveKey, saveData)
        
        // Prune old auto-saves
        pruneOldSaves()
        
        lastAutoSaveTime = timestamp
    
    FUNCTION manualSave(slotName):
        saveData = gatherSaveData()
        saveData.isManual = true
        saveData.slotName = slotName
        
        db.put('saves', 'manual_' + slotName, saveData)
        
        showNotification('Game saved: ' + slotName)
    
    FUNCTION gatherSaveData():
        RETURN {
            timestamp: Date.now(),
            player: {
                variables: player.variables,
                equipment: player.equipment,
                inventory: player.inventory,
                functionSlots: player.functionSlots,
                position: player.position,
                currentZone: currentZone.id
            },
            frank: {
                variables: frank.variables,
                equipment: frank.equipment,
                targetPriorities: frank.targetPriorities,
                slipChance: frank.slipChance,
                dialectChance: frank.dialectChance
            },
            world: {
                clearedPaths: worldManager.clearedPaths,
                discoveredZones: worldManager.discoveredZones,
                checkpoints: worldManager.checkpoints,
                lastCheckpoint: worldManager.lastCheckpoint
            },
            progress: {
                completedQuests: questManager.completed,
                activeQuests: questManager.active,
                defeatedBosses: bossManager.defeated,
                collectedLore: loreManager.collected
            }
        }
    
    FUNCTION load(saveKey):
        saveData = db.get('saves', saveKey)
        
        IF saveData == null:
            RETURN false
        
        // Restore player
        player.variables = saveData.player.variables
        player.equipment = saveData.player.equipment
        player.inventory = saveData.player.inventory
        player.functionSlots = saveData.player.functionSlots
        
        // Restore Frank
        frank.variables = saveData.frank.variables
        frank.equipment = saveData.frank.equipment
        frank.targetPriorities = saveData.frank.targetPriorities
        frank.slipChance = saveData.frank.slipChance
        frank.dialectChance = saveData.frank.dialectChance
        
        // Restore world
        worldManager.clearedPaths = saveData.world.clearedPaths
        worldManager.discoveredZones = saveData.world.discoveredZones
        worldManager.checkpoints = saveData.world.checkpoints
        worldManager.lastCheckpoint = saveData.world.lastCheckpoint
        
        // Load zone and position
        loadZone(saveData.player.currentZone)
        player.position = saveData.player.position
        
        RETURN true
    
    FUNCTION pruneOldSaves():
        allSaves = db.getAll('saves')
        currentTime = Date.now()
        
        FOR save IN allSaves:
            // Skip manual saves
            IF save.isManual: CONTINUE
            
            // Skip most recent auto-save
            IF save.key == getMostRecentAutoSave(): CONTINUE
            
            // Delete old auto-saves
            age = currentTime - save.timestamp
            IF age > autoSavePruneTime * 1000:
                db.delete('saves', save.key)
    
    FUNCTION onAreaEnter(zoneId):
        // Auto-save on zone entry
        autoSave()
```

## Basic Items Data (MVP)

```json
{
  "weapons": {
    "syntax_sword": {
      "id": "syntax_sword",
      "name": "Syntax Sword",
      "type": "melee_sword",
      "damage": 15,
      "speed": 1.0,
      "instability": 10,
      "effects": [],
      "flavorText": "Clean syntax. Clean cuts."
    },
    "glitch_blade": {
      "id": "glitch_blade",
      "name": "Glitch Blade",
      "type": "melee_sword",
      "damage": 25,
      "speed": 0.9,
      "instability": 45,
      "effects": [{ "type": "phase", "chance": 0.1 }],
      "flavorText": "It's not a bug, it's a feature."
    },
    "delete_ray": {
      "id": "delete_ray",
      "name": "Delete Ray",
      "type": "ranged_ray",
      "damage": 12,
      "speed": 1.2,
      "instability": 20,
      "energyCost": 5,
      "effects": [],
      "flavorText": "Are you sure you want to permanently delete this enemy?"
    },
    "ping_daggers": {
      "id": "ping_daggers",
      "name": "Ping Daggers",
      "type": "melee_fast",
      "damage": 8,
      "speed": 1.8,
      "instability": 15,
      "effects": [{ "type": "reveal_health", "chance": 1.0 }],
      "flavorText": "64 bytes from target: time=2ms"
    }
  },
  "armor": {
    "basic_visor": {
      "id": "basic_visor",
      "name": "Basic Visor",
      "type": "helmet",
      "defense": 5,
      "stats": {},
      "instability": 0,
      "flavorText": "See enemy. Don't let enemy see brain."
    },
    "standard_chassis": {
      "id": "standard_chassis",
      "name": "Standard Chassis",
      "type": "chestplate",
      "defense": 10,
      "stats": {},
      "instability": 0,
      "flavorText": "It works. That's enough."
    },
    "basic_cloak": {
      "id": "basic_cloak",
      "name": "Basic Cloak",
      "type": "cloak",
      "defense": 3,
      "stats": {},
      "instability": 0,
      "flavorText": "Fashion is optional. Protection isn't."
    },
    "standard_legs": {
      "id": "standard_legs",
      "name": "Standard Legs",
      "type": "leggings",
      "defense": 7,
      "stats": {},
      "instability": 0,
      "flavorText": "Left leg. Right leg. Both defended."
    },
    "basic_treads": {
      "id": "basic_treads",
      "name": "Basic Treads",
      "type": "boots",
      "defense": 4,
      "stats": {},
      "instability": 0,
      "flavorText": "Step. Step. Step."
    },
    "standard_grips": {
      "id": "standard_grips",
      "name": "Standard Grips",
      "type": "gloves",
      "defense": 3,
      "stats": {},
      "instability": 0,
      "flavorText": "Functional fingers."
    },
    "basic_plating": {
      "id": "basic_plating",
      "name": "Basic Plating",
      "type": "extra_armor",
      "defense": 5,
      "stats": {},
      "instability": 0,
      "flavorText": "More armor. Less pain."
    }
  },
  "accessories": {
    "basic_debugger": {
      "id": "basic_debugger",
      "name": "Basic Debugger",
      "type": "debugger",
      "stats": { "instabilityReduction": 5 },
      "effect": "reveal_pattern_1",
      "flavorText": "console.log('why is this broken')"
    },
    "damage_boost": {
      "id": "damage_boost",
      "name": "Damage Boost",
      "type": "optimizer",
      "stats": { "attack": 3 },
      "flavorText": "output = output * 1.2"
    },
    "scavenger_drone": {
      "id": "scavenger_drone",
      "name": "Scavenger Drone",
      "type": "module",
      "stats": {},
      "effect": "auto_collect",
      "flavorText": "Good bot."
    }
  },
  "consumables": {
    "patch_kit": {
      "id": "patch_kit",
      "name": "Patch Kit",
      "type": "healing",
      "effect": { "heal": 30 },
      "stackable": true,
      "maxStack": 10,
      "flavorText": "Fixes most problems. Eventually."
    },
    "overclock_stim": {
      "id": "overclock_stim",
      "name": "Overclock Stim",
      "type": "buff",
      "effect": { "buff": "overclocked", "duration": 20 },
      "stackable": true,
      "maxStack": 5,
      "flavorText": "clock_speed++"
    },
    "antivirus_shot": {
      "id": "antivirus_shot",
      "name": "Antivirus Shot",
      "type": "debuff_removal",
      "effect": { "removeAllDebuffs": true },
      "stackable": true,
      "maxStack": 5,
      "flavorText": "Threat neutralized."
    }
  },
  "materials": {
    "scrap_metal": {
      "id": "scrap_metal",
      "name": "Scrap Metal",
      "type": "basic",
      "stackable": true,
      "maxStack": 99,
      "flavorText": "One robot's trash."
    },
    "copper_wire": {
      "id": "copper_wire",
      "name": "Copper Wire",
      "type": "basic",
      "stackable": true,
      "maxStack": 99,
      "flavorText": "The backbone of everything."
    },
    "data_fragment": {
      "id": "data_fragment",
      "name": "Data Fragment",
      "type": "basic",
      "stackable": true,
      "maxStack": 99,
      "flavorText": "0110100001101001"
    },
    "energy_cell": {
      "id": "energy_cell",
      "name": "Energy Cell",
      "type": "basic",
      "stackable": true,
      "maxStack": 99,
      "flavorText": "Juice."
    }
  }
}
```

## Basic Recipes Data (MVP)

```json
{
  "recipes": {
    "refined_alloy": {
      "id": "refined_alloy",
      "result": { "id": "refined_alloy", "quantity": 1 },
      "materials": [
        { "id": "scrap_metal", "quantity": 5 },
        { "id": "energy_cell", "quantity": 1 }
      ],
      "workstation": "alloy_forge",
      "cost": 50,
      "duration": 3
    },
    "circuit_board": {
      "id": "circuit_board",
      "result": { "id": "circuit_board", "quantity": 1 },
      "materials": [
        { "id": "copper_wire", "quantity": 3 },
        { "id": "data_fragment", "quantity": 2 }
      ],
      "workstation": "circuit_fabricator",
      "cost": 75,
      "duration": 4
    },
    "syntax_sword_upgrade": {
      "id": "syntax_sword_upgrade",
      "result": { "id": "syntax_sword_v2", "quantity": 1 },
      "materials": [
        { "id": "syntax_sword", "quantity": 1 },
        { "id": "refined_alloy", "quantity": 2 },
        { "id": "data_fragment", "quantity": 5 }
      ],
      "workstation": "alloy_forge",
      "cost": 200,
      "duration": 8
    },
    "patch_kit": {
      "id": "patch_kit",
      "result": { "id": "patch_kit", "quantity": 3 },
      "materials": [
        { "id": "scrap_metal", "quantity": 2 },
        { "id": "energy_cell", "quantity": 1 }
      ],
      "workstation": null,
      "cost": 25,
      "duration": 2
    }
  }
}
```

## Implementation Priority (MVP)

### Phase 1: Core

1. Three.js scene setup with low-poly rendering
2. Player movement and camera (third-person)
3. Basic combat (attack, damage, health)
4. Simple enemy AI (follow, attack)

### Phase 2: Frank

1. Frank companion following player
2. Frank combat AI
3. Frank equipment system
4. Basic slip/dialect system

### Phase 3: Items

1. Inventory system
2. Equipment system (7 armor slots + accessories)
3. Weapon system with instability
4. Consumables

### Phase 4: Crafting

1. Crafting UI
2. Recipe system
3. Workstation interaction
4. Material gathering

### Phase 5: World

1. Zone loading system
2. Path clearing mechanic
3. Checkpoint saves
4. NPC placement and dialogue

### Phase 6: Polish

1. Save/load system
2. Audio integration
3. UI polish
4. PWA setup
