import React from 'react'
import useGameStore from '../../systems/gameStore'

/**
 * Circular Cooldown Indicator Component
 * Shows cooldown progress as a circular ring
 */
function CooldownIndicator({ cooldown, maxCooldown, label, isActive, keyLabel }) {
  const progress = cooldown > 0 ? (cooldown / maxCooldown) * 100 : 0
  const isReady = cooldown === 0

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-12 h-12 sm:w-16 sm:h-16">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className={isActive ? "text-yellow-400" : "text-gray-600"}
          />
          {/* Progress circle */}
          {cooldown > 0 && (
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-cyan-400"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
          )}
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[0.6rem] sm:text-xs font-bold ${isReady ? 'text-green-400' : 'text-gray-400'}`}>
            {keyLabel}
          </span>
        </div>
        {/* Active indicator */}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-yellow-400/30 rounded-full animate-pulse" />
          </div>
        )}
      </div>
      <div className="text-[0.6rem] sm:text-xs text-gray-300 mt-1">{label}</div>
      <div className={`text-[0.6rem] sm:text-xs ${isReady ? 'text-green-400' : 'text-orange-400'}`}>
        {isReady ? 'READY' : `${Math.ceil(cooldown / 60)}s`}
      </div>
    </div>
  )
}

/**
 * Heads-Up Display (HUD)
 * Displays player stats, combat variables, and ability cooldowns
 */
function HUD() {
  const player = useGameStore((state) => state.player)
  const world = useGameStore((state) => state.world)

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="max-w-7xl mx-auto h-full p-2 sm:p-4 flex flex-col">
        {/* Top Left - Player Stats */}
        <div className="bg-game-primary/80 backdrop-blur-sm rounded-lg p-2 sm:p-4 max-w-xs sm:max-w-sm text-xs sm:text-sm">
          <div className="text-sm text-gray-300 mb-3">
            Level {player.level} | Zone: {world.currentZone}
          </div>

          {/* Health Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-red-400 font-semibold">Health</span>
              <span className="text-gray-300">{Math.round(player.health)}/{player.maxHealth}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-red-600 to-red-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
              />
            </div>
          </div>

          {/* Energy Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-cyan-400 font-semibold">Energy</span>
              <span className="text-gray-300">{Math.round(player.energy)}/{player.maxEnergy}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(player.energy / player.maxEnergy) * 100}%` }}
              />
            </div>
          </div>

          {/* Stamina Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-green-400 font-semibold">Stamina</span>
              <span className="text-gray-300">{Math.round(player.stamina)}/{player.maxStamina}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(player.stamina / player.maxStamina) * 100}%` }}
              />
            </div>
          </div>

          {/* Combat Variables */}
          <div className="mt-4 pt-3 border-t border-gray-600">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between">
                <span className="text-orange-400">Attack:</span>
                <span className="text-gray-300 font-semibold">{player.attack}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-400">Defense:</span>
                <span className="text-gray-300 font-semibold">{player.defense}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">Speed:</span>
                <span className="text-gray-300 font-semibold">{player.speed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-400">Crit:</span>
                <span className="text-gray-300 font-semibold">{(player.critChance * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Experience Bar */}
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-purple-400 font-semibold">Experience</span>
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

        {/* Bottom Center - Ability Cooldowns */}
        <div className="flex-1" />
        <div className="flex justify-center mb-2 sm:mb-4">
          <div className="bg-game-primary/80 backdrop-blur-sm rounded-lg p-2 sm:p-4">
            <div className="flex gap-4 sm:gap-8">
              <CooldownIndicator
                cooldown={player.dashCooldown}
                maxCooldown={player.dashCooldownMax}
                label="Dash"
                isActive={player.isDashing}
                keyLabel="E"
              />
              <CooldownIndicator
                cooldown={player.blockCooldown}
                maxCooldown={player.blockCooldownMax}
                label="Block"
                isActive={player.isBlocking}
                keyLabel="R-CLICK"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HUD
