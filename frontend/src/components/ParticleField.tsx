import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleField() {
  const meshRef = useRef<THREE.Points>(null)
  const particleCount = 2000

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 200
      positions[i3 + 1] = (Math.random() - 0.5) * 200
      positions[i3 + 2] = (Math.random() - 0.5) * 200

      // Cyan to purple gradient
      const t = Math.random()
      colors[i3] = t * 0.5 // R
      colors[i3 + 1] = 0.8 + t * 0.2 // G
      colors[i3 + 2] = 0.6 + t * 0.4 // B
    }

    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    
    const time = state.clock.elapsedTime * 0.1
    meshRef.current.rotation.x = time * 0.1
    meshRef.current.rotation.y = time * 0.15

    // Animate particles
    const positionAttribute = meshRef.current.geometry.attributes.position
    const posArray = positionAttribute.array as Float32Array

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      posArray[i3 + 1] += Math.sin(time + i * 0.01) * 0.02
    }
    positionAttribute.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
