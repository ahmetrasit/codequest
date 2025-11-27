import React from 'react'
import useGameStore from '../../systems/gameStore'

/**
 * Heads-Up Display (HUD)
 * Displays player stats and game information
 */
function HUD() {
  const player = useGameStore((state) => state.player)
  const world = useGameStore((state) => state.world)

  return (
    <div className="fixed top-0 left-0 w-full p-4 pointer-events-none">
      <div className="max-w-7xl mx-auto">
        {/* Player Stats */}
        <div className="bg-game-primary/80 backdrop-blur-sm rounded-lg p-4 max-w-sm">
          <div className="text-sm text-gray-300 mb-2">
            Level {player.level} | Zone: {world.currentZone}
          </div>

          {/* Health Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-red-400">Health</span>
              <span className="text-gray-300">{player.health}/{player.maxHealth}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
              />
            </div>
          </div>

          {/* Stamina Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-green-400">Stamina</span>
              <span className="text-gray-300">{player.stamina}/{player.maxStamina}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(player.stamina / player.maxStamina) * 100}%` }}
              />
            </div>
          </div>

          {/* Mana Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-blue-400">Mana</span>
              <span className="text-gray-300">{player.mana}/{player.maxMana}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(player.mana / player.maxMana) * 100}%` }}
              />
            </div>
          </div>

          {/* Experience Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-purple-400">Experience</span>
              <span className="text-gray-300">
                {player.experience}/{player.experienceToNextLevel}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(player.experience / player.experienceToNextLevel) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HUD
