import React from 'react'
import { Canvas } from '@react-three/fiber'
import Player from './Player'
import CameraController from './CameraController'

/**
 * Main 3D Scene Component
 * Sets up the Three.js canvas with camera, lighting, and initial objects
 */
function Scene() {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{
          position: [5, 5, 5],
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        shadows
      >
        {/* Ambient light for overall scene illumination */}
        <ambientLight intensity={0.4} />

        {/* Directional light for shadows and depth */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Player Character */}
        <Player />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#ffeb3b" />
        </mesh>

        {/* Third-person camera controller */}
        <CameraController />
      </Canvas>
    </div>
  )
}

export default Scene
