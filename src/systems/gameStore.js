import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

/**
 * Main Game State Store
 * Manages global game state including player, world, and UI
 */
const useGameStore = create(
  devtools(
    (set, get) => ({
      // ==================== PLAYER STATE ====================
      player: {
        // Position and movement
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },

        // Stats
        health: 100,
        maxHealth: 100,
        stamina: 100,
        maxStamina: 100,
        mana: 50,
        maxMana: 50,
        energy: 100,
        maxEnergy: 100,

        // Level and progression
        level: 1,
        experience: 0,
        experienceToNextLevel: 100,

        // Attributes
        strength: 10,
        vitality: 10,
        agility: 10,
        intelligence: 10,

        // Combat variables
        attack: 10,
        defense: 5,
        speed: 5,
        critChance: 0.05,

        // Combat states
        isAttacking: false,
        isDodging: false,
        isBlocking: false,

        // Dash state
        isDashing: false,
        dashCooldown: 0,
        dashCooldownMax: 10,

        // Block state
        blockCooldown: 0,
        blockCooldownMax: 10,

        // Currency
        bits: 150,
        rareBits: 0,

        // Inventory (starting with test items)
        inventory: [
          { id: 'syntax_sword', name: 'Syntax Sword', type: 'melee_sword', damage: 15, speed: 1.0, instability: 10, effects: [], rarity: 'common', description: 'Clean syntax. Clean cuts.', quantity: 1 },
          { id: 'patch_kit', name: 'Patch Kit', type: 'healing', effect: { heal: 30 }, stackable: true, maxStack: 10, rarity: 'common', description: 'Fixes most problems. Eventually.', quantity: 3 },
          { id: 'energy_pack', name: 'Energy Pack', type: 'energy', effect: { restoreEnergy: 50 }, stackable: true, maxStack: 10, rarity: 'common', description: 'Instant energy boost.', quantity: 2 },
          { id: 'scrap_metal', name: 'Scrap Metal', type: 'basic', stackable: true, maxStack: 99, rarity: 'common', description: 'One robot\'s trash.', quantity: 5 },
          { id: 'basic_visor', name: 'Basic Visor', type: 'helmet', defense: 5, stats: {}, weight: 2, rarity: 'common', description: 'See enemy. Don\'t let enemy see brain.', quantity: 1 },
        ],
        maxInventorySlots: 20,

        // Equipment (7 armor slots + accessories)
        equipment: {
          weapon: null,
          helmet: null,
          chestplate: null,
          cloak: null,
          leggings: null,
          boots: null,
          gloves: null,
          extraArmor: null,
          accessories: [], // Expandable accessory slots
        },

        // Base stats (before equipment bonuses)
        baseStats: {
          attack: 10,
          defense: 5,
          speed: 5,
          critChance: 0.05,
        },
      },

      // ==================== WORLD STATE ====================
      world: {
        currentZone: 'tutorial_zone',
        timeOfDay: 12, // 0-24 hour format
        weatherCondition: 'clear',
        isLoading: false,
        enemies: [],
        npcs: [],
        interactables: [],
      },

      // ==================== UI STATE ====================
      ui: {
        showInventory: false,
        showCharacterSheet: false,
        showSettings: false,
        isPaused: false,
        activeDialog: null,
        notifications: [],
        showFPS: false,
      },

      // ==================== GAME STATE ====================
      game: {
        isInitialized: false,
        isPaused: false,
        difficulty: 'normal',
        soundEnabled: true,
        musicEnabled: true,
        soundVolume: 0.7,
        musicVolume: 0.5,
      },

      // ==================== ACTIONS ====================

      // Player Actions
      updatePlayerPosition: (position) => set((state) => ({
        player: { ...state.player, position: { ...state.player.position, ...position } }
      })),

      updatePlayerStats: (stats) => set((state) => ({
        player: { ...state.player, ...stats }
      })),

      takeDamage: (amount) => set((state) => ({
        player: {
          ...state.player,
          health: Math.max(0, state.player.health - amount)
        }
      })),

      heal: (amount) => set((state) => ({
        player: {
          ...state.player,
          health: Math.min(state.player.maxHealth, state.player.health + amount)
        }
      })),

      useStamina: (amount) => set((state) => ({
        player: {
          ...state.player,
          stamina: Math.max(0, state.player.stamina - amount)
        }
      })),

      useMana: (amount) => set((state) => ({
        player: {
          ...state.player,
          mana: Math.max(0, state.player.mana - amount)
        }
      })),

      useEnergy: (amount) => set((state) => ({
        player: {
          ...state.player,
          energy: Math.max(0, state.player.energy - amount)
        }
      })),

      restoreEnergy: (amount) => set((state) => ({
        player: {
          ...state.player,
          energy: Math.min(state.player.maxEnergy, state.player.energy + amount)
        }
      })),

      gainExperience: (amount) => set((state) => {
        const newExp = state.player.experience + amount
        const expToNext = state.player.experienceToNextLevel

        if (newExp >= expToNext) {
          // Level up!
          return {
            player: {
              ...state.player,
              level: state.player.level + 1,
              experience: newExp - expToNext,
              experienceToNextLevel: Math.floor(expToNext * 1.5),
              maxHealth: state.player.maxHealth + 10,
              health: state.player.maxHealth + 10,
              maxStamina: state.player.maxStamina + 5,
              stamina: state.player.maxStamina + 5,
            }
          }
        }

        return {
          player: { ...state.player, experience: newExp }
        }
      }),

      // World Actions
      setCurrentZone: (zone) => set((state) => ({
        world: { ...state.world, currentZone: zone }
      })),

      setTimeOfDay: (time) => set((state) => ({
        world: { ...state.world, timeOfDay: time }
      })),

      addEnemy: (enemy) => set((state) => ({
        world: { ...state.world, enemies: [...state.world.enemies, enemy] }
      })),

      removeEnemy: (enemyId) => set((state) => ({
        world: {
          ...state.world,
          enemies: state.world.enemies.filter(e => e.id !== enemyId)
        }
      })),

      // UI Actions
      toggleInventory: () => set((state) => ({
        ui: { ...state.ui, showInventory: !state.ui.showInventory }
      })),

      toggleCharacterSheet: () => set((state) => ({
        ui: { ...state.ui, showCharacterSheet: !state.ui.showCharacterSheet }
      })),

      toggleSettings: () => set((state) => ({
        ui: { ...state.ui, showSettings: !state.ui.showSettings }
      })),

      togglePause: () => set((state) => ({
        ui: { ...state.ui, isPaused: !state.ui.isPaused },
        game: { ...state.game, isPaused: !state.game.isPaused }
      })),

      showDialog: (dialog) => set((state) => ({
        ui: { ...state.ui, activeDialog: dialog }
      })),

      hideDialog: () => set((state) => ({
        ui: { ...state.ui, activeDialog: null }
      })),

      addNotification: (notification) => set((state) => ({
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, {
            id: Date.now(),
            ...notification
          }]
        }
      })),

      removeNotification: (id) => set((state) => ({
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(n => n.id !== id)
        }
      })),

      // Game Actions
      initializeGame: () => set(() => ({
        game: { ...get().game, isInitialized: true }
      })),

      setSoundVolume: (volume) => set((state) => ({
        game: { ...state.game, soundVolume: volume }
      })),

      setMusicVolume: (volume) => set((state) => ({
        game: { ...state.game, musicVolume: volume }
      })),

      toggleSound: () => set((state) => ({
        game: { ...state.game, soundEnabled: !state.game.soundEnabled }
      })),

      toggleMusic: () => set((state) => ({
        game: { ...state.game, musicEnabled: !state.game.musicEnabled }
      })),

      // Inventory Actions
      addItem: (item, quantity = 1) => set((state) => {
        // Check if item is stackable
        if (item.stackable) {
          const existingItem = state.player.inventory.find(i => i.id === item.id)
          if (existingItem) {
            return {
              player: {
                ...state.player,
                inventory: state.player.inventory.map(i =>
                  i.id === item.id
                    ? { ...i, quantity: Math.min(i.quantity + quantity, item.maxStack || 99) }
                    : i
                )
              }
            }
          }
        }

        // Check if inventory is full
        if (state.player.inventory.length >= state.player.maxInventorySlots) {
          return state // Inventory full, no change
        }

        // Add new item
        return {
          player: {
            ...state.player,
            inventory: [...state.player.inventory, { ...item, quantity }]
          }
        }
      }),

      removeItem: (itemId, quantity = 1) => set((state) => {
        const item = state.player.inventory.find(i => i.id === itemId)
        if (!item) return state

        if (item.quantity <= quantity) {
          // Remove item completely
          return {
            player: {
              ...state.player,
              inventory: state.player.inventory.filter(i => i.id !== itemId)
            }
          }
        }

        // Reduce quantity
        return {
          player: {
            ...state.player,
            inventory: state.player.inventory.map(i =>
              i.id === itemId ? { ...i, quantity: i.quantity - quantity } : i
            )
          }
        }
      }),

      equipItem: (item, slot) => set((state) => {
        // Unequip current item in slot if exists
        const currentItem = state.player.equipment[slot]
        let newInventory = state.player.inventory

        if (currentItem) {
          // Add current item back to inventory
          newInventory = [...newInventory, currentItem]
        }

        // Remove item from inventory
        newInventory = newInventory.filter(i => i.id !== item.id)

        // Equip new item
        const newEquipment = {
          ...state.player.equipment,
          [slot]: item
        }

        // Recalculate stats
        const recalculatedStats = get().recalculateStats(newEquipment)

        return {
          player: {
            ...state.player,
            inventory: newInventory,
            equipment: newEquipment,
            ...recalculatedStats
          }
        }
      }),

      unequipItem: (slot) => set((state) => {
        const item = state.player.equipment[slot]
        if (!item) return state

        // Check if inventory has space
        if (state.player.inventory.length >= state.player.maxInventorySlots) {
          return state // Inventory full
        }

        // Unequip item
        const newEquipment = {
          ...state.player.equipment,
          [slot]: null
        }

        // Recalculate stats
        const recalculatedStats = get().recalculateStats(newEquipment)

        return {
          player: {
            ...state.player,
            inventory: [...state.player.inventory, item],
            equipment: newEquipment,
            ...recalculatedStats
          }
        }
      }),

      useConsumable: (itemId) => set((state) => {
        const item = state.player.inventory.find(i => i.id === itemId)
        if (!item || item.type !== 'healing' && item.type !== 'buff' && item.type !== 'energy' && item.type !== 'debuff_removal') {
          return state
        }

        const effect = item.effect
        let newPlayerState = { ...state.player }

        // Apply effect
        if (effect.heal) {
          newPlayerState.health = Math.min(newPlayerState.maxHealth, newPlayerState.health + effect.heal)
        }
        if (effect.restoreEnergy) {
          newPlayerState.energy = Math.min(newPlayerState.maxEnergy, newPlayerState.energy + effect.restoreEnergy)
        }
        if (effect.buff) {
          // TODO: Implement buff system in future
        }

        // Remove one quantity of the item
        newPlayerState.inventory = newPlayerState.inventory.map(i =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        ).filter(i => i.quantity > 0)

        return { player: newPlayerState }
      }),

      recalculateStats: (equipment) => {
        const state = get()
        const base = state.player.baseStats

        let attack = base.attack
        let defense = base.defense
        let speed = base.speed
        let critChance = base.critChance

        // Add weapon stats
        if (equipment.weapon) {
          attack += equipment.weapon.damage || 0
        }

        // Add armor stats
        Object.keys(equipment).forEach(slot => {
          const item = equipment[slot]
          if (item && item.defense !== undefined) {
            defense += item.defense
          }
          if (item && item.stats) {
            attack += item.stats.attack || 0
            speed += item.stats.speed || 0
            critChance += item.stats.critChance || 0
          }
        })

        return { attack, defense, speed, critChance }
      },

      addBits: (amount) => set((state) => ({
        player: { ...state.player, bits: state.player.bits + amount }
      })),

      spendBits: (amount) => set((state) => ({
        player: { ...state.player, bits: Math.max(0, state.player.bits - amount) }
      })),

      // Reset game state
      resetGame: () => set(() => ({
        player: {
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          velocity: { x: 0, y: 0, z: 0 },
          health: 100,
          maxHealth: 100,
          stamina: 100,
          maxStamina: 100,
          mana: 50,
          maxMana: 50,
          energy: 100,
          maxEnergy: 100,
          level: 1,
          experience: 0,
          experienceToNextLevel: 100,
          strength: 10,
          vitality: 10,
          agility: 10,
          intelligence: 10,
          attack: 10,
          defense: 5,
          speed: 5,
          critChance: 0.05,
          isAttacking: false,
          isDodging: false,
          isBlocking: false,
          isDashing: false,
          dashCooldown: 0,
          dashCooldownMax: 10,
          blockCooldown: 0,
          blockCooldownMax: 10,
          bits: 0,
          rareBits: 0,
          inventory: [],
          maxInventorySlots: 20,
          equipment: {
            weapon: null,
            helmet: null,
            chestplate: null,
            cloak: null,
            leggings: null,
            boots: null,
            gloves: null,
            extraArmor: null,
            accessories: [],
          },
          baseStats: {
            attack: 10,
            defense: 5,
            speed: 5,
            critChance: 0.05,
          },
        },
        world: {
          currentZone: 'tutorial_zone',
          timeOfDay: 12,
          weatherCondition: 'clear',
          isLoading: false,
          enemies: [],
          npcs: [],
          interactables: [],
        },
        ui: {
          showInventory: false,
          showCharacterSheet: false,
          showSettings: false,
          isPaused: false,
          activeDialog: null,
          notifications: [],
          showFPS: false,
        },
      })),
    }),
    { name: 'CodeQuest Game Store' }
  )
)

export default useGameStore
