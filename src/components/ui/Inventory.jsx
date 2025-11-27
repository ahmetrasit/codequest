import React, { useState } from 'react'
import useGameStore from '../../systems/gameStore'

/**
 * Item Slot Component
 * Displays a single inventory slot with item or empty
 */
function ItemSlot({ item, onClick, isSelected }) {
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-500'
      case 'uncommon': return 'border-green-500'
      case 'rare': return 'border-blue-500'
      case 'epic': return 'border-purple-500'
      case 'legendary': return 'border-yellow-500'
      default: return 'border-gray-600'
    }
  }

  return (
    <div
      onClick={onClick}
      className={`
        relative w-14 h-14 sm:w-16 sm:h-16 rounded border-2
        ${item ? getRarityColor(item.rarity) : 'border-gray-700'}
        ${isSelected ? 'bg-cyan-900/50 border-cyan-400' : 'bg-gray-800/50'}
        hover:bg-gray-700/70 cursor-pointer transition-all
        flex items-center justify-center
      `}
    >
      {item ? (
        <>
          {/* Item Icon Placeholder - Using first letter */}
          <div className="text-2xl font-bold text-gray-300">
            {item.name[0]}
          </div>

          {/* Quantity Badge */}
          {item.quantity > 1 && (
            <div className="absolute bottom-0 right-0 bg-gray-900 text-xs px-1 rounded-tl">
              {item.quantity}
            </div>
          )}

          {/* Instability Warning */}
          {item.instability > 30 && (
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </>
      ) : (
        <div className="text-gray-600 text-xs">—</div>
      )}
    </div>
  )
}

/**
 * Item Tooltip Component
 * Shows detailed item information
 */
function ItemTooltip({ item }) {
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-400'
      case 'uncommon': return 'text-green-400'
      case 'rare': return 'text-blue-400'
      case 'epic': return 'text-purple-400'
      case 'legendary': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 min-w-[200px] max-w-xs">
      {/* Item Name */}
      <div className={`font-bold text-sm ${getRarityColor(item.rarity)} mb-1`}>
        {item.name}
      </div>

      {/* Item Type */}
      <div className="text-xs text-gray-500 mb-2">
        {item.type.replace('_', ' ').toUpperCase()}
      </div>

      {/* Stats */}
      <div className="text-xs text-gray-300 space-y-1 mb-2">
        {item.damage && <div>⚔️ Damage: {item.damage}</div>}
        {item.defense && <div>🛡️ Defense: {item.defense}</div>}
        {item.speed && <div>⚡ Speed: {item.speed}</div>}
        {item.instability && (
          <div className="text-orange-400">
            ⚠️ Instability: {item.instability}%
          </div>
        )}
        {item.weight && <div>⚖️ Weight: {item.weight}</div>}
        {item.effect && item.effect.heal && (
          <div className="text-green-400">+ {item.effect.heal} HP</div>
        )}
        {item.effect && item.effect.restoreEnergy && (
          <div className="text-cyan-400">+ {item.effect.restoreEnergy} Energy</div>
        )}
      </div>

      {/* Description */}
      <div className="text-xs text-gray-400 italic border-t border-gray-700 pt-2">
        {item.description}
      </div>

      {/* Stack Info */}
      {item.stackable && (
        <div className="text-xs text-gray-500 mt-1">
          Max Stack: {item.maxStack}
        </div>
      )}
    </div>
  )
}

/**
 * Inventory Component
 * Main inventory UI with grid layout
 */
function Inventory() {
  const player = useGameStore((state) => state.player)
  const toggleInventory = useGameStore((state) => state.toggleInventory)
  const showInventory = useGameStore((state) => state.ui.showInventory)
  const equipItem = useGameStore((state) => state.equipItem)
  const useConsumable = useGameStore((state) => state.useConsumable)

  const [selectedItem, setSelectedItem] = useState(null)
  const [filter, setFilter] = useState('all')

  if (!showInventory) return null

  // Filter items
  const filteredItems = filter === 'all'
    ? player.inventory
    : player.inventory.filter(item => {
        if (filter === 'weapons') return item.damage !== undefined
        if (filter === 'armor') return item.defense !== undefined
        if (filter === 'consumables') return item.type === 'healing' || item.type === 'buff' || item.type === 'energy' || item.type === 'debuff_removal'
        if (filter === 'materials') return item.type === 'basic' || item.type === 'rare' || item.type === 'refined'
        return true
      })

  // Create empty slots to fill grid
  const slots = []
  for (let i = 0; i < player.maxInventorySlots; i++) {
    slots.push(filteredItems[i] || null)
  }

  const handleItemClick = (item) => {
    if (!item) {
      setSelectedItem(null)
      return
    }

    setSelectedItem(item)
  }

  const handleUseItem = () => {
    if (!selectedItem) return

    // Check if it's a consumable
    if (selectedItem.type === 'healing' || selectedItem.type === 'buff' || selectedItem.type === 'energy' || selectedItem.type === 'debuff_removal') {
      useConsumable(selectedItem.id)
      setSelectedItem(null)
      return
    }

    // Check if it's equippable
    const equipmentSlot = getEquipmentSlot(selectedItem)
    if (equipmentSlot) {
      equipItem(selectedItem, equipmentSlot)
      setSelectedItem(null)
    }
  }

  const getEquipmentSlot = (item) => {
    if (item.damage !== undefined && !item.defense) return 'weapon'
    if (item.type === 'helmet') return 'helmet'
    if (item.type === 'chestplate') return 'chestplate'
    if (item.type === 'cloak') return 'cloak'
    if (item.type === 'leggings') return 'leggings'
    if (item.type === 'boots') return 'boots'
    if (item.type === 'gloves') return 'gloves'
    if (item.type === 'extra_armor') return 'extraArmor'
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-game-primary/95 backdrop-blur-sm border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-cyan-400">Inventory</h2>
            <div className="text-sm text-gray-400 mt-1">
              {player.inventory.length} / {player.maxInventorySlots} slots
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-yellow-400">
              💰 {player.bits} bits
            </div>
            <button
              onClick={toggleInventory}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Side - Item Grid */}
          <div className="flex-1 p-4 overflow-y-auto">
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {['all', 'weapons', 'armor', 'consumables', 'materials'].map(filterType => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`
                    px-3 py-1 rounded text-xs font-semibold transition-all
                    ${filter === filterType
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }
                  `}
                >
                  {filterType.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Item Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {slots.map((item, index) => (
                <ItemSlot
                  key={index}
                  item={item}
                  onClick={() => handleItemClick(item)}
                  isSelected={selectedItem?.id === item?.id}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Item Details */}
          {selectedItem && (
            <div className="w-80 border-l border-gray-700 p-4 bg-gray-900/30">
              <ItemTooltip item={selectedItem} />

              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                {(selectedItem.type === 'healing' || selectedItem.type === 'buff' || selectedItem.type === 'energy' || selectedItem.type === 'debuff_removal') && (
                  <button
                    onClick={handleUseItem}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 rounded transition-all"
                  >
                    Use Item
                  </button>
                )}

                {getEquipmentSlot(selectedItem) && (
                  <button
                    onClick={handleUseItem}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 rounded transition-all"
                  >
                    Equip
                  </button>
                )}

                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-2 rounded transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Inventory
