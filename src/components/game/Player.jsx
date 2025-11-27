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

  // Refs for body parts for animation
  const leftArmUpperRef = useRef()
  const leftArmLowerRef = useRef()
  const rightArmUpperRef = useRef()
  const rightArmLowerRef = useRef()
  const leftLegUpperRef = useRef()
  const leftLegLowerRef = useRef()
  const rightLegUpperRef = useRef()
  const rightLegLowerRef = useRef()
  const bodyRef = useRef()
  const headRef = useRef()
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
  const toggleInventory = useGameStore((state) => state.toggleInventory)

  // Local state for dash timing
  const [dashTimer, setDashTimer] = useState(0)
  const [dashDirection, setDashDirection] = useState({ x: 0, z: 1 })
  const [isBackstep, setIsBackstep] = useState(false)

  // Local state for block timing
  const [blockTimer, setBlockTimer] = useState(0)
  const [isParryWindow, setIsParryWindow] = useState(false)

  // Local state for smooth rotation
  const [currentRotation, setCurrentRotation] = useState(0)

  // Local state for jumping
  const [verticalVelocity, setVerticalVelocity] = useState(0)
  const [isGrounded, setIsGrounded] = useState(true)

  // Animation state
  const [animationTime, setAnimationTime] = useState(0)
  const [isMoving, setIsMoving] = useState(false)

  // Movement speed (units per second)
  const MOVEMENT_SPEED = 5
  const DASH_SPEED = 25 // Forward dash speed
  const BACKSTEP_SPEED = 15 // Backstep speed (slower than dash)
  const DASH_DURATION = 0.3
  const BACKSTEP_DURATION = 0.2
  const BLOCK_DURATION = 0.5
  const PARRY_WINDOW = 0.2

  // Jump and gravity settings
  const JUMP_VELOCITY = 12 // Initial upward velocity when jumping
  const GRAVITY = 30 // Gravity acceleration (pulls player down)
  const GROUND_Y = 0 // Ground level position

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

    // Handle inventory toggle
    if (input.inventory) {
      toggleInventory()
    }

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

    // Apply gravity and vertical movement
    let newY = playerPosition.y + verticalVelocity * delta
    let newVelocity = verticalVelocity - GRAVITY * delta

    // Check if player has landed on ground
    if (newY <= GROUND_Y) {
      newY = GROUND_Y
      newVelocity = 0
      if (!isGrounded) {
        setIsGrounded(true)
      }
    } else {
      if (isGrounded) {
        setIsGrounded(false)
      }
    }

    // Handle jump input (overrides gravity if jumping)
    if (input.jump && isGrounded && newY <= GROUND_Y) {
      newVelocity = JUMP_VELOCITY
      setIsGrounded(false)
    }

    // Update vertical position and velocity
    if (newY !== playerPosition.y) {
      updatePlayerPosition({ y: newY })
    }
    setVerticalVelocity(newVelocity)

    // Handle dash input
    if (input.dash && dashCooldown === 0 && !isDashing) {
      // Determine if this is a backstep or forward dash
      const isBackward = input.backward
      setIsBackstep(isBackward)

      // Calculate dash direction based on current facing rotation
      const facingRotation = currentRotation
      const dashMultiplier = isBackward ? -1 : 1 // Negative for backstep
      const dirX = Math.sin(facingRotation) * dashMultiplier
      const dirZ = Math.cos(facingRotation) * dashMultiplier

      setDashDirection({ x: dirX, z: dirZ })
      setDashTimer(isBackward ? BACKSTEP_DURATION : DASH_DURATION)
      updatePlayerStats({ isDashing: true })
    }

    // Handle dash movement
    if (isDashing && dashTimer > 0) {
      setDashTimer(dashTimer - delta)

      // Apply dash movement (locked direction)
      const speed = isBackstep ? BACKSTEP_SPEED : DASH_SPEED
      const moveX = dashDirection.x * speed * delta
      const moveZ = dashDirection.z * speed * delta

      updatePlayerPosition({
        x: playerPosition.x + moveX,
        z: playerPosition.z + moveZ
      })
    } else if (isDashing && dashTimer <= 0) {
      // End dash
      updatePlayerStats({
        isDashing: false,
        dashCooldown: dashCooldownMax
      })
    }

    // Normal movement (when not dashing)
    if (!isDashing) {
      // Handle rotation with A/D keys
      const ROTATION_SPEED = 3 // radians per second

      if (input.left) {
        // Rotate left (counter-clockwise)
        const newRotation = currentRotation + ROTATION_SPEED * delta
        setCurrentRotation(newRotation)
        if (groupRef.current) {
          groupRef.current.rotation.y = newRotation
          updatePlayerStats({ rotation: { ...playerRotation, y: newRotation } })
        }
      }

      if (input.right) {
        // Rotate right (clockwise)
        const newRotation = currentRotation - ROTATION_SPEED * delta
        setCurrentRotation(newRotation)
        if (groupRef.current) {
          groupRef.current.rotation.y = newRotation
          updatePlayerStats({ rotation: { ...playerRotation, y: newRotation } })
        }
      }

      // Handle forward/backward movement with W/S keys
      let moveAmount = 0

      if (input.forward) moveAmount = 1
      if (input.backward) moveAmount = -1

      if (moveAmount !== 0) {
        // Move in the direction the player is facing
        const facingRotation = currentRotation
        const moveX = Math.sin(facingRotation) * moveAmount * MOVEMENT_SPEED * delta
        const moveZ = Math.cos(facingRotation) * moveAmount * MOVEMENT_SPEED * delta

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

    // ==================== ANIMATIONS ====================

    // Check if player is moving or rotating
    const isMovingForward = input.forward && !isDashing
    const isMovingBackward = input.backward && !isDashing
    const isRotating = (input.left || input.right) && !isDashing
    const moving = (isMovingForward || isMovingBackward || isRotating) && !isDashing
    setIsMoving(moving)

    // Update animation time
    if (moving) {
      setAnimationTime(animationTime + delta * 8) // Animation speed multiplier
    }

    // Forward walking animation
    if (isMovingForward && isGrounded && !isBlocking) {
      const walkCycle = Math.sin(animationTime)
      const walkCycle2 = Math.sin(animationTime + Math.PI) // Opposite phase

      // Arm swing - upper
      if (leftArmUpperRef.current) {
        leftArmUpperRef.current.rotation.x = walkCycle * 0.5
      }
      if (rightArmUpperRef.current) {
        rightArmUpperRef.current.rotation.x = walkCycle2 * 0.5
      }

      // Arm swing - lower (slight bend)
      if (leftArmLowerRef.current) {
        leftArmLowerRef.current.rotation.x = walkCycle * 0.3
      }
      if (rightArmLowerRef.current) {
        rightArmLowerRef.current.rotation.x = walkCycle2 * 0.3
      }

      // Leg swing - upper
      if (leftLegUpperRef.current) {
        leftLegUpperRef.current.rotation.x = walkCycle2 * 0.4
      }
      if (rightLegUpperRef.current) {
        rightLegUpperRef.current.rotation.x = walkCycle * 0.4
      }

      // Leg swing - lower (knee bend when moving forward)
      if (leftLegLowerRef.current) {
        leftLegLowerRef.current.rotation.x = Math.max(0, walkCycle2 * 0.5)
      }
      if (rightLegLowerRef.current) {
        rightLegLowerRef.current.rotation.x = Math.max(0, walkCycle * 0.5)
      }

      // Slight body bob
      if (bodyRef.current) {
        bodyRef.current.position.y = 1.2 + Math.abs(walkCycle) * 0.05
      }
    }

    // Backward walking animation - MOONWALK! (MJ Easter Egg)
    if (isMovingBackward && !isMovingForward && isGrounded && !isBlocking) {
      const walkCycle = Math.sin(animationTime)
      const walkCycle2 = Math.sin(animationTime + Math.PI) // Opposite phase

      // Classic MJ arm pose
      if (leftArmUpperRef.current) {
        // Left arm bent up at chest level with subtle sway
        leftArmUpperRef.current.rotation.x = -0.9 + walkCycle * 0.1
        leftArmUpperRef.current.rotation.z = 0.2
      }
      if (rightArmUpperRef.current) {
        // Right arm slightly down with minimal movement
        rightArmUpperRef.current.rotation.x = 0.3 + walkCycle2 * 0.08
        rightArmUpperRef.current.rotation.z = -0.1
      }

      // Lower arms bent for that iconic pose
      if (leftArmLowerRef.current) {
        leftArmLowerRef.current.rotation.x = -0.6
      }
      if (rightArmLowerRef.current) {
        rightArmLowerRef.current.rotation.x = -0.4
      }

      // Smooth leg slides - straighter legs for that glide effect
      if (leftLegUpperRef.current) {
        leftLegUpperRef.current.rotation.x = walkCycle * 0.2 // Reduced for smooth slide
      }
      if (rightLegUpperRef.current) {
        rightLegUpperRef.current.rotation.x = walkCycle2 * 0.2
      }

      // Minimal knee bend - keeps legs straighter for moonwalk glide
      if (leftLegLowerRef.current) {
        leftLegLowerRef.current.rotation.x = Math.max(0, walkCycle * 0.1)
      }
      if (rightLegLowerRef.current) {
        rightLegLowerRef.current.rotation.x = Math.max(0, walkCycle2 * 0.1)
      }

      // Lean FORWARD while moving backward (classic moonwalk!)
      // Head tilted back slightly
      if (bodyRef.current) {
        bodyRef.current.rotation.x = 0.15 // Lean forward
        bodyRef.current.position.y = 1.2 + Math.abs(walkCycle) * 0.01 // Minimal bob for smooth glide
      }
      if (headRef.current) {
        headRef.current.rotation.x = -0.1 // Tilt head back slightly
      }
    }

    // Rotation animation (when turning without moving forward/backward)
    if (isRotating && !isMovingForward && !isMovingBackward && isGrounded && !isBlocking) {
      const walkCycle = Math.sin(animationTime)
      const walkCycle2 = Math.sin(animationTime + Math.PI)

      // Subtle arm movement
      if (leftArmUpperRef.current) {
        leftArmUpperRef.current.rotation.x = walkCycle * 0.2
      }
      if (rightArmUpperRef.current) {
        rightArmUpperRef.current.rotation.x = walkCycle2 * 0.2
      }

      // Minimal leg movement (shifting weight)
      if (leftLegUpperRef.current) {
        leftLegUpperRef.current.rotation.x = walkCycle2 * 0.15
      }
      if (rightLegUpperRef.current) {
        rightLegUpperRef.current.rotation.x = walkCycle * 0.15
      }

      // Very slight bob
      if (bodyRef.current) {
        bodyRef.current.position.y = 1.2 + Math.abs(walkCycle) * 0.02
      }
    }

    // Jumping animation
    if (!isGrounded) {
      // Arms up - upper
      if (leftArmUpperRef.current) {
        leftArmUpperRef.current.rotation.x = -1.0
      }
      if (rightArmUpperRef.current) {
        rightArmUpperRef.current.rotation.x = -1.0
      }

      // Arms up - lower (bend elbows)
      if (leftArmLowerRef.current) {
        leftArmLowerRef.current.rotation.x = -0.5
      }
      if (rightArmLowerRef.current) {
        rightArmLowerRef.current.rotation.x = -0.5
      }

      // Legs tucked - upper
      if (leftLegUpperRef.current) {
        leftLegUpperRef.current.rotation.x = 0.3
      }
      if (rightLegUpperRef.current) {
        rightLegUpperRef.current.rotation.x = 0.3
      }

      // Legs tucked - lower (bend knees more)
      if (leftLegLowerRef.current) {
        leftLegLowerRef.current.rotation.x = 0.8
      }
      if (rightLegLowerRef.current) {
        rightLegLowerRef.current.rotation.x = 0.8
      }

      // Lean forward slightly
      if (bodyRef.current) {
        bodyRef.current.rotation.x = 0.1
      }
    }

    // Dashing animation
    if (isDashing) {
      // Lean forward aggressively
      if (bodyRef.current) {
        bodyRef.current.rotation.x = isBackstep ? -0.3 : 0.4
        bodyRef.current.position.y = 1.15
      }

      // Arms - upper (back for forward dash, forward for backstep)
      if (leftArmUpperRef.current) {
        leftArmUpperRef.current.rotation.x = isBackstep ? -0.5 : 0.8
      }
      if (rightArmUpperRef.current) {
        rightArmUpperRef.current.rotation.x = isBackstep ? -0.5 : 0.8
      }

      // Arms - lower (extend for speed)
      if (leftArmLowerRef.current) {
        leftArmLowerRef.current.rotation.x = isBackstep ? -0.3 : 0.4
      }
      if (rightArmLowerRef.current) {
        rightArmLowerRef.current.rotation.x = isBackstep ? -0.3 : 0.4
      }

      // Legs - upper (extended)
      if (leftLegUpperRef.current) {
        leftLegUpperRef.current.rotation.x = isBackstep ? 0.3 : -0.2
      }
      if (rightLegUpperRef.current) {
        rightLegUpperRef.current.rotation.x = isBackstep ? 0.3 : -0.2
      }

      // Legs - lower (straight for power)
      if (leftLegLowerRef.current) {
        leftLegLowerRef.current.rotation.x = isBackstep ? 0.2 : 0.1
      }
      if (rightLegLowerRef.current) {
        rightLegLowerRef.current.rotation.x = isBackstep ? 0.2 : 0.1
      }
    }

    // Blocking animation
    if (isBlocking) {
      // Arms - upper (raised in defensive stance)
      if (leftArmUpperRef.current) {
        leftArmUpperRef.current.rotation.x = -1.5
        leftArmUpperRef.current.rotation.z = 0.3
      }
      if (rightArmUpperRef.current) {
        rightArmUpperRef.current.rotation.x = -1.5
        rightArmUpperRef.current.rotation.z = -0.3
      }

      // Arms - lower (bent to support shield)
      if (leftArmLowerRef.current) {
        leftArmLowerRef.current.rotation.x = -0.8
        leftArmLowerRef.current.rotation.z = 0.2
      }
      if (rightArmLowerRef.current) {
        rightArmLowerRef.current.rotation.x = -0.8
        rightArmLowerRef.current.rotation.z = -0.2
      }

      // Legs - stable stance
      if (leftLegLowerRef.current) {
        leftLegLowerRef.current.rotation.x = 0.2
      }
      if (rightLegLowerRef.current) {
        rightLegLowerRef.current.rotation.x = 0.2
      }

      // Lean back slightly
      if (bodyRef.current) {
        bodyRef.current.rotation.x = -0.1
      }
    }

    // Reset to idle pose when not doing anything
    if (!moving && !isDashing && !isBlocking && isGrounded) {
      // Smoothly return to neutral positions - arms
      if (leftArmUpperRef.current) {
        leftArmUpperRef.current.rotation.x *= 0.9
        leftArmUpperRef.current.rotation.z *= 0.9
      }
      if (rightArmUpperRef.current) {
        rightArmUpperRef.current.rotation.x *= 0.9
        rightArmUpperRef.current.rotation.z *= 0.9
      }
      if (leftArmLowerRef.current) {
        leftArmLowerRef.current.rotation.x *= 0.9
        leftArmLowerRef.current.rotation.z *= 0.9
      }
      if (rightArmLowerRef.current) {
        rightArmLowerRef.current.rotation.x *= 0.9
        rightArmLowerRef.current.rotation.z *= 0.9
      }

      // Smoothly return to neutral positions - legs
      if (leftLegUpperRef.current) {
        leftLegUpperRef.current.rotation.x *= 0.9
      }
      if (rightLegUpperRef.current) {
        rightLegUpperRef.current.rotation.x *= 0.9
      }
      if (leftLegLowerRef.current) {
        leftLegLowerRef.current.rotation.x *= 0.9
      }
      if (rightLegLowerRef.current) {
        rightLegLowerRef.current.rotation.x *= 0.9
      }

      // Body reset
      if (bodyRef.current) {
        bodyRef.current.rotation.x *= 0.9
        bodyRef.current.position.y = bodyRef.current.position.y * 0.9 + 1.2 * 0.1
      }

      // Idle breathing animation
      const breathCycle = Math.sin(Date.now() * 0.001) * 0.02
      if (bodyRef.current) {
        bodyRef.current.position.y = 1.2 + breathCycle
      }
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
      <mesh ref={bodyRef} position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[0.8, 1, 0.6]} />
        <meshStandardMaterial {...robotMaterial} />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 2, 0]} castShadow>
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

      {/* Left Arm - Upper with hierarchy */}
      <group ref={leftArmUpperRef} position={[-0.55, 1.5, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.6, 6]} />
          <meshStandardMaterial {...accentMaterial} />
        </mesh>

        {/* Left Arm - Lower (child of upper) */}
        <group ref={leftArmLowerRef} position={[0, -0.5, 0]}>
          <mesh position={[0, -0.15, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 0.6, 6]} />
            <meshStandardMaterial {...robotMaterial} />
          </mesh>

          {/* Left Hand (child of lower arm) */}
          <mesh position={[0, -0.5, 0]} castShadow>
            <boxGeometry args={[0.15, 0.2, 0.15]} />
            <meshStandardMaterial {...accentMaterial} />
          </mesh>
        </group>
      </group>

      {/* Right Arm - Upper with hierarchy */}
      <group ref={rightArmUpperRef} position={[0.55, 1.5, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.6, 6]} />
          <meshStandardMaterial {...accentMaterial} />
        </mesh>

        {/* Right Arm - Lower (child of upper) */}
        <group ref={rightArmLowerRef} position={[0, -0.5, 0]}>
          <mesh position={[0, -0.15, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 0.6, 6]} />
            <meshStandardMaterial {...robotMaterial} />
          </mesh>

          {/* Right Hand (child of lower arm) */}
          <mesh position={[0, -0.5, 0]} castShadow>
            <boxGeometry args={[0.15, 0.2, 0.15]} />
            <meshStandardMaterial {...accentMaterial} />
          </mesh>
        </group>
      </group>

      {/* Left Leg - Upper with hierarchy */}
      <group ref={leftLegUpperRef} position={[-0.25, 0.5, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.7, 6]} />
          <meshStandardMaterial {...robotMaterial} />
        </mesh>

        {/* Left Leg - Lower (child of upper) */}
        <group ref={leftLegLowerRef} position={[0, -0.5, 0]}>
          <mesh position={[0, -0.15, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.5, 6]} />
            <meshStandardMaterial {...accentMaterial} />
          </mesh>

          {/* Left Foot (child of lower leg) */}
          <mesh position={[0, -0.35, 0.1]} castShadow>
            <boxGeometry args={[0.2, 0.1, 0.35]} />
            <meshStandardMaterial {...robotMaterial} />
          </mesh>
        </group>
      </group>

      {/* Right Leg - Upper with hierarchy */}
      <group ref={rightLegUpperRef} position={[0.25, 0.5, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.7, 6]} />
          <meshStandardMaterial {...robotMaterial} />
        </mesh>

        {/* Right Leg - Lower (child of upper) */}
        <group ref={rightLegLowerRef} position={[0, -0.5, 0]}>
          <mesh position={[0, -0.15, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.5, 6]} />
            <meshStandardMaterial {...accentMaterial} />
          </mesh>

          {/* Right Foot (child of lower leg) */}
          <mesh position={[0, -0.35, 0.1]} castShadow>
            <boxGeometry args={[0.2, 0.1, 0.35]} />
            <meshStandardMaterial {...robotMaterial} />
          </mesh>
        </group>
      </group>

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
