import React from 'react'
import Scene from './components/game/Scene'
import HUD from './components/ui/HUD'
import Inventory from './components/ui/Inventory'

function App() {
  return (
    <div className="relative w-full h-screen bg-game-dark">
      {/* Game HUD */}
      <HUD />

      {/* Inventory UI */}
      <Inventory />

      {/* 3D Scene */}
      <Scene />
    </div>
  )
}

export default App
