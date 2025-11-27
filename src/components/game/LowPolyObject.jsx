import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/**
 * Low-Poly Geometric Object
 * A simple rotating dodecahedron with flat shading for low-poly aesthetic
 */
function LowPolyObject() {
  const meshRef = useRef()

  // Rotate the object slowly on each frame
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
      {/* Dodecahedron geometry for interesting low-poly shape */}
      <dodecahedronGeometry args={[1, 0]} />

      {/* MeshStandardMaterial with flatShading for low-poly look */}
      <meshStandardMaterial
        color="#00d9ff"
        flatShading
        metalness={0.3}
        roughness={0.7}
      />
    </mesh>
  )
}

export default LowPolyObject
