import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import useGameStore from '../../systems/gameStore'
import { getInputSystem, destroyInputSystem } from '../../systems/InputSystem'

/**
 * Player Character Component
 * Low-poly robot character built with Three.js primitives
 */
function Player() {
  const groupRef = useRef()
  const inputSystemRef = useRef(null)
  const playerPosition = useGameStore((state) => state.player.position)
  const playerRotation = useGameStore((state) => state.player.rotation)
  const isDashing = useGameStore((state) => state.player.isDashing)
  const dashCooldown = useGameStore((state) => state.player.dashCooldown)
  const dashCooldownMax = useGameStore((state) => state.player.dashCooldownMax)
  const isBlocking = useGameStore((state) => state.player.isBlocking)
  const blockCooldown = useGameStore((state) => state.player.blockCooldown)
  const blockCooldownMax = useGameStore((state) => state.player.blockCooldownMax)
  const updatePlayerPosition = useGameStore((state) => state.updatePlayerPosition)
  const updatePlayerStats = useGameStore((state) => state.updatePlayerStats)

  // Local state for dash timing
  const [dashTimer, setDashTimer] = useState(0)
  const [dashDirection, setDashDirection] = useState({ x: 0, z: 1 })

  // Local state for block timing
  const [blockTimer, setBlockTimer] = useState(0)
  const [isParryWindow, setIsParryWindow] = useState(false)

  // Local state for smooth rotation
  const [currentRotation, setCurrentRotation] = useState(0)

  // Movement speed (units per second)
  const MOVEMENT_SPEED = 5
  const DASH_SPEED = 25
  const DASH_DURATION = 0.3
  const BLOCK_DURATION = 0.5
  const PARRY_WINDOW = 0.2

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

  // Initialize InputSystem
  useEffect(() => {
    inputSystemRef.current = getInputSystem()

    // Cleanup on unmount
    return () => {
      destroyInputSystem()
    }
  }, [])

  // Update player position based on input and render frame
  useFrame((state, delta) => {
    if (!inputSystemRef.current) return

    // Get current input state
    const input = inputSystemRef.current.getInputState()

    // Update dash cooldown
    if (dashCooldown > 0) {
      updatePlayerStats({ dashCooldown: Math.max(0, dashCooldown - delta * 60) })
    }

    // Update block cooldown
    if (blockCooldown > 0) {
      updatePlayerStats({ blockCooldown: Math.max(0, blockCooldown - delta * 60) })
    }

    // Handle block input
    if (input.block && blockCooldown === 0 && !isBlocking && !isDashing) {
      // Start block
      setBlockTimer(BLOCK_DURATION)
      setIsParryWindow(true)
      updatePlayerStats({ isBlocking: true })

      // Parry window expires after PARRY_WINDOW duration
      setTimeout(() => setIsParryWindow(false), PARRY_WINDOW * 1000)
    }

    // Handle block duration
    if (isBlocking && blockTimer > 0) {
      setBlockTimer(blockTimer - delta)
    } else if (isBlocking && blockTimer <= 0) {
      // End block
      updatePlayerStats({
        isBlocking: false,
        blockCooldown: blockCooldownMax
      })
      setIsParryWindow(false)
    }

    // Handle dash input
    if (input.dash && dashCooldown === 0 && !isDashing) {
      // Start dash
      // Calculate dash direction based on current movement or facing direction
      let dirX = 0
      let dirZ = 0

      if (input.forward) dirZ += 1
      if (input.backward) dirZ -= 1
      if (input.left) dirX -= 1
      if (input.right) dirX += 1

      // If no movement input, dash in facing direction
      if (dirX === 0 && dirZ === 0) {
        const currentRotation = groupRef.current?.rotation.y || 0
        dirX = Math.sin(currentRotation)
        dirZ = Math.cos(currentRotation)
      }

      const magnitude = Math.sqrt(dirX * dirX + dirZ * dirZ)
      if (magnitude > 0) {
        setDashDirection({ x: dirX / magnitude, z: dirZ / magnitude })
        setDashTimer(DASH_DURATION)
        updatePlayerStats({ isDashing: true })
      }
    }

    // Handle dash movement
    if (isDashing && dashTimer > 0) {
      setDashTimer(dashTimer - delta)

      // Apply dash movement
      const moveX = dashDirection.x * DASH_SPEED * delta
      const moveZ = dashDirection.z * DASH_SPEED * delta

      updatePlayerPosition({
        x: playerPosition.x + moveX,
        z: playerPosition.z + moveZ
      })

      // Rotate player to face dash direction (instant for dash)
      if (groupRef.current) {
        const targetRotation = Math.atan2(dashDirection.x, dashDirection.z)
        groupRef.current.rotation.y = targetRotation
        setCurrentRotation(targetRotation) // Update rotation state
        // Update rotation in store for camera
        updatePlayerStats({ rotation: { ...playerRotation, y: targetRotation } })
      }
    } else if (isDashing && dashTimer <= 0) {
      // End dash
      updatePlayerStats({
        isDashing: false,
        dashCooldown: dashCooldownMax
      })
    }

    // Normal movement (when not dashing)
    if (!isDashing) {
      // Calculate movement direction based on input
      let dirX = 0
      let dirZ = 0

      if (input.forward) dirZ += 1
      if (input.backward) dirZ -= 1
      if (input.left) dirX -= 1
      if (input.right) dirX += 1

      // Normalize diagonal movement to prevent faster diagonal speed
      const magnitude = Math.sqrt(dirX * dirX + dirZ * dirZ)
      if (magnitude > 0) {
        // Calculate target rotation
        const targetRotation = Math.atan2(dirX, dirZ)

        // Smooth rotation interpolation
        let rotDiff = targetRotation - currentRotation
        // Normalize angle difference to -PI to PI
        while (rotDiff > Math.PI) rotDiff -= Math.PI * 2
        while (rotDiff < -Math.PI) rotDiff += Math.PI * 2

        // Lerp rotation (0.2 = smoothing factor, higher = faster rotation)
        const newRotation = currentRotation + rotDiff * 0.2
        setCurrentRotation(newRotation)

        // Apply rotation to player
        if (groupRef.current) {
          groupRef.current.rotation.y = newRotation
          // Update rotation in store for camera
          updatePlayerStats({ rotation: { ...playerRotation, y: newRotation } })
        }

        // Calculate movement delta
        const moveX = (dirX / magnitude) * MOVEMENT_SPEED * delta
        const moveZ = (dirZ / magnitude) * MOVEMENT_SPEED * delta

        // Update player position in store
        updatePlayerPosition({
          x: playerPosition.x + moveX,
          z: playerPosition.z + moveZ
        })
      }
    }

    // Update visual position from store
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
      {/* Block Shield Effect */}
      {isBlocking && (
        <group>
          {/* Main shield - hexagonal shape */}
          <mesh position={[0, 1.2, 0.8]} rotation={[0, 0, 0]}>
            <circleGeometry args={[1.2, 6]} />
            <meshBasicMaterial
              color={isParryWindow ? "#ffff00" : "#00ffff"}
              transparent
              opacity={isParryWindow ? 0.8 : 0.5}
              side={2}
            />
          </mesh>
          {/* Shield outline */}
          <mesh position={[0, 1.2, 0.8]} rotation={[0, 0, 0]}>
            <ringGeometry args={[1.15, 1.3, 6]} />
            <meshBasicMaterial
              color={isParryWindow ? "#ffaa00" : "#0066ff"}
              transparent
              opacity={0.9}
            />
          </mesh>
          {/* Energy field effect */}
          <mesh position={[0, 1.2, 0.75]}>
            <circleGeometry args={[0.8, 6]} />
            <meshBasicMaterial
              color={isParryWindow ? "#ffffff" : "#00ffff"}
              transparent
              opacity={0.3}
            />
          </mesh>
          {/* Parry window indicator - pulsing center */}
          {isParryWindow && (
            <mesh position={[0, 1.2, 0.85]}>
              <circleGeometry args={[0.3, 16]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.9}
                emissive="#ffff00"
                emissiveIntensity={2}
              />
            </mesh>
          )}
        </group>
      )}

      {/* Dash Trail Effect */}
      {isDashing && (
        <group>
          {/* Outer glow ring */}
          <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.2, 1.5, 32]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.6} />
          </mesh>
          {/* Inner glow */}
          <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 1.2, 32]} />
            <meshBasicMaterial color="#0066ff" transparent opacity={0.4} />
          </mesh>
          {/* Speed lines */}
          <mesh position={[0, 1, -0.5]}>
            <boxGeometry args={[0.1, 0.1, 2]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.5} />
          </mesh>
          <mesh position={[-0.3, 1.2, -0.5]}>
            <boxGeometry args={[0.08, 0.08, 1.8]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.4} />
          </mesh>
          <mesh position={[0.3, 0.8, -0.5]}>
            <boxGeometry args={[0.08, 0.08, 1.8]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.4} />
          </mesh>
        </group>
      )}

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
