import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import useGameStore from '../../systems/gameStore'

/**
 * Player Character Component
 * Low-poly robot character built with Three.js primitives
 */
function Player() {
  const groupRef = useRef()
  const playerPosition = useGameStore((state) => state.player.position)

  // Bright blue color for robotic aesthetic
  const primaryColor = '#0066ff'
  const accentColor = '#0044cc'

  // Material properties for low-poly metallic look
  const robotMaterial = {
    color: primaryColor,
    metalness: 0.8,
    roughness: 0.3,
    flatShading: true,
  }

  const accentMaterial = {
    color: accentColor,
    metalness: 0.6,
    roughness: 0.4,
    flatShading: true,
  }

  // Update player position from store
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(
        playerPosition.x,
        playerPosition.y,
        playerPosition.z
      )
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main Body (Chassis) */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[0.8, 1, 0.6]} />
        <meshStandardMaterial {...robotMaterial} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial {...robotMaterial} />
      </mesh>

      {/* Eyes (two small boxes for that robotic look) */}
      <mesh position={[-0.12, 2.05, 0.26]} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.05]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.12, 2.05, 0.26]} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.05]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
      </mesh>

      {/* Left Arm - Upper */}
      <mesh position={[-0.55, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 6]} />
        <meshStandardMaterial {...accentMaterial} />
      </mesh>

      {/* Left Arm - Lower */}
      <mesh position={[-0.55, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.6, 6]} />
        <meshStandardMaterial {...robotMaterial} />
      </mesh>

      {/* Left Hand */}
      <mesh position={[-0.55, 0.4, 0]} castShadow>
        <boxGeometry args={[0.15, 0.2, 0.15]} />
        <meshStandardMaterial {...accentMaterial} />
      </mesh>

      {/* Right Arm - Upper */}
      <mesh position={[0.55, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 6]} />
        <meshStandardMaterial {...accentMaterial} />
      </mesh>

      {/* Right Arm - Lower */}
      <mesh position={[0.55, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.6, 6]} />
        <meshStandardMaterial {...robotMaterial} />
      </mesh>

      {/* Right Hand */}
      <mesh position={[0.55, 0.4, 0]} castShadow>
        <boxGeometry args={[0.15, 0.2, 0.15]} />
        <meshStandardMaterial {...accentMaterial} />
      </mesh>

      {/* Left Leg - Upper */}
      <mesh position={[-0.25, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.7, 6]} />
        <meshStandardMaterial {...robotMaterial} />
      </mesh>

      {/* Left Leg - Lower */}
      <mesh position={[-0.25, -0.15, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 6]} />
        <meshStandardMaterial {...accentMaterial} />
      </mesh>

      {/* Left Foot */}
      <mesh position={[-0.25, -0.5, 0.1]} castShadow>
        <boxGeometry args={[0.2, 0.1, 0.35]} />
        <meshStandardMaterial {...robotMaterial} />
      </mesh>

      {/* Right Leg - Upper */}
      <mesh position={[0.25, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.7, 6]} />
        <meshStandardMaterial {...robotMaterial} />
      </mesh>

      {/* Right Leg - Lower */}
      <mesh position={[0.25, -0.15, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 6]} />
        <meshStandardMaterial {...accentMaterial} />
      </mesh>

      {/* Right Foot */}
      <mesh position={[0.25, -0.5, 0.1]} castShadow>
        <boxGeometry args={[0.2, 0.1, 0.35]} />
        <meshStandardMaterial {...robotMaterial} />
      </mesh>

      {/* Core Light (chest indicator) */}
      <mesh position={[0, 1.3, 0.31]} castShadow>
        <circleGeometry args={[0.12, 6]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.8}
          flatShading={true}
        />
      </mesh>

      {/* Back Pack/Jetpack detail */}
      <mesh position={[0, 1.2, -0.35]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.2]} />
        <meshStandardMaterial {...accentMaterial} />
      </mesh>
    </group>
  )
}

export default Player
