import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import useGameStore from '../../systems/gameStore'

/**
 * Third-Person Camera Controller
 * Follows the player from behind and above with smooth interpolation
 * Rotates with player to stay behind them
 */
function CameraController() {
  const { camera } = useThree()
  const playerPosition = useGameStore((state) => state.player.position)
  const playerRotation = useGameStore((state) => state.player.rotation)

  // Camera distance settings
  const CAMERA_DISTANCE = 6
  const CAMERA_HEIGHT = 4

  // Target positions for smooth following
  const targetPosition = useRef(new Vector3())
  const targetLookAt = useRef(new Vector3())

  useFrame(() => {
    // Calculate camera offset based on player rotation
    // Camera should be behind the player (opposite of facing direction)
    const offsetX = -Math.sin(playerRotation.y) * CAMERA_DISTANCE
    const offsetZ = -Math.cos(playerRotation.y) * CAMERA_DISTANCE

    // Calculate target camera position (behind and above player, rotated)
    targetPosition.current.set(
      playerPosition.x + offsetX,
      playerPosition.y + CAMERA_HEIGHT,
      playerPosition.z + offsetZ
    )

    // Calculate target look-at position (player center, slightly above ground)
    targetLookAt.current.set(
      playerPosition.x,
      playerPosition.y + 1,
      playerPosition.z
    )

    // Smooth camera position using lerp (0.1 = smoothing factor)
    camera.position.lerp(targetPosition.current, 0.1)

    // Always look at the player
    camera.lookAt(targetLookAt.current)
  })

  return null
}

export default CameraController
