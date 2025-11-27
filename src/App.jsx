import React from 'react'
import Scene from './components/game/Scene'
import HUD from './components/ui/HUD'

function App() {
  return (
    <div className="relative w-full h-screen bg-game-dark">
      {/* Game HUD */}
      <HUD />

      {/* 3D Scene */}
      <Scene />
    </div>
  )
}

export default App
