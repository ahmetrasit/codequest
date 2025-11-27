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

        // Inventory
        gold: 0,
        inventory: [],
        equippedWeapon: null,
        equippedArmor: null,
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
          gold: 0,
          inventory: [],
          equippedWeapon: null,
          equippedArmor: null,
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
