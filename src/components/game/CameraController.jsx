import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import useGameStore from '../../systems/gameStore'

/**
 * Third-Person Camera Controller
 * Follows the player from behind and above with smooth interpolation
 */
function CameraController() {
  const { camera } = useThree()
  const playerPosition = useGameStore((state) => state.player.position)

  // Camera offset from player (behind and above)
  const cameraOffset = useRef(new Vector3(0, 4, -6))
  const lookAtOffset = useRef(new Vector3(0, 1, 0))

  // Target positions for smooth following
  const targetPosition = useRef(new Vector3())
  const targetLookAt = useRef(new Vector3())

  useFrame(() => {
    // Calculate target camera position (behind and above player)
    targetPosition.current.set(
      playerPosition.x + cameraOffset.current.x,
      playerPosition.y + cameraOffset.current.y,
      playerPosition.z + cameraOffset.current.z
    )

    // Calculate target look-at position (slightly above player center)
    targetLookAt.current.set(
      playerPosition.x + lookAtOffset.current.x,
      playerPosition.y + lookAtOffset.current.y,
      playerPosition.z + lookAtOffset.current.z
    )

    // Smooth camera position using lerp (0.1 = smoothing factor)
    camera.position.lerp(targetPosition.current, 0.1)

    // Smooth camera look-at
    const currentLookAt = new Vector3()
    camera.getWorldDirection(currentLookAt)
    currentLookAt.multiplyScalar(10).add(camera.position)
    currentLookAt.lerp(targetLookAt.current, 0.1)

    camera.lookAt(targetLookAt.current)
  })

  return null
}

export default CameraController
