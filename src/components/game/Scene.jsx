import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Player from './Player'

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
          <meshStandardMaterial color="#16213e" />
        </mesh>

        {/* Orbit controls for camera movement */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={20}
        />
      </Canvas>
    </div>
  )
}

export default Scene
