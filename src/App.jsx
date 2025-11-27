import React from 'react'
import Scene from './components/game/Scene'

function App() {
  return (
    <div className="relative w-full h-screen bg-game-dark">
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 z-10 p-8 pointer-events-none">
        <h1 className="text-4xl font-bold mb-2 text-game-accent">CODE QUEST</h1>
        <p className="text-lg text-gray-300">A 3D Low-Poly Action RPG</p>
      </div>

      {/* 3D Scene */}
      <Scene />
    </div>
  )
}

export default App
