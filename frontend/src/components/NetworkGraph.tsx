import { useRef, useMemo, useState } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'

interface Node {
  id: number
  position: THREE.Vector3
  color: string
  size: number
  label: string
  threatLevel: number
  connections: number[]
}

function NetworkNode({ 
  node, 
  isHovered, 
  onHover, 
  onUnhover 
}: { 
  node: Node
  isHovered: boolean
  onHover: () => void
  onUnhover: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return
    
    const scale = isHovered ? 1.5 : 1
    meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
    
    // Pulsing glow effect
    const pulse = Math.sin(state.clock.elapsedTime * 3 + node.id) * 0.3 + 0.7
    glowRef.current.scale.setScalar(node.size * 2 * pulse)
    
    // Floating animation
    meshRef.current.position.y = node.position.y + Math.sin(state.clock.elapsedTime + node.id * 0.5) * 0.5
  })

  return (
    <group position={node.position}>
      {/* Glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color={node.color} 
          transparent 
          opacity={0.15}
        />
      </mesh>
      
      {/* Main node */}
      <mesh 
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); onHover() }}
        onPointerOut={(e) => { e.stopPropagation(); onUnhover() }}
      >
        <sphereGeometry args={[node.size, 32, 32]} />
        <meshStandardMaterial 
          color={node.color}
          emissive={node.color}
          emissiveIntensity={isHovered ? 1 : 0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Label on hover */}
      {isHovered && (
        <Html distanceFactor={50} style={{ pointerEvents: 'none' }}>
          <div className="bg-black/90 backdrop-blur-xl px-4 py-3 rounded-lg border border-cyan-500/30 min-w-[150px]">
            <div className="text-cyan-400 font-semibold text-sm">{node.label}</div>
            <div className="text-gray-400 text-xs mt-1">Threat Level: {node.threatLevel}%</div>
            <div className="text-gray-400 text-xs">Connections: {node.connections.length}</div>
            <div 
              className="h-1 rounded-full mt-2"
              style={{
                background: `linear-gradient(to right, #00ffaa ${node.threatLevel}%, #1a1a2e ${node.threatLevel}%)`
              }}
            />
          </div>
        </Html>
      )}
    </group>
  )
}

function ConnectionLine({ start, end, opacity }: { start: THREE.Vector3, end: THREE.Vector3, opacity: number }) {
  const lineRef = useRef<THREE.Line>(null)

  useFrame((state) => {
    if (!lineRef.current) return
    const material = lineRef.current.material as THREE.LineBasicMaterial
    material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
  })

  return (
    <Line
      ref={lineRef as any}
      points={[start, end]}
      color="#00ffaa"
      lineWidth={1}
      transparent
      opacity={opacity}
    />
  )
}

function GraphLegend() {
  const legendItems = [
    { color: '#00ffaa', label: 'Bot Cluster' },
    { color: '#ff6b35', label: 'Suspicious Account' },
    { color: '#8b5cf6', label: 'Coordinated Network' },
    { color: '#3b82f6', label: 'Amplifier Node' },
    { color: '#ff3366', label: 'Seed Account' },
    { color: '#facc15', label: 'Relay Point' },
  ]

  return (
    <Html fullscreen>
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md p-3 rounded-lg border border-cyan-500/20 text-xs">
        <div className="text-cyan-400 font-semibold mb-2">Legend</div>
        
        {legendItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-300">{item.label}</span>
          </div>
        ))}
      </div>
    </Html>
  )
}

export default function NetworkGraph() {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const groupRef = useRef<THREE.Group>(null)

  // Generate network nodes
  const nodes: Node[] = useMemo(() => {
    const nodeData: Node[] = []
    const colors = ['#00ffaa', '#ff6b35', '#8b5cf6', '#3b82f6', '#ff3366', '#facc15']
    const labels = [
      'Bot Cluster Alpha', 'Suspicious Account', 'Coordinated Network', 
      'Amplifier Node', 'Seed Account', 'Relay Point', 'Burner Profile',
      'Troll Farm Node', 'Astroturf Account', 'Influence Hub'
    ]

    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2
      const radius = 20 + Math.random() * 30
      const height = (Math.random() - 0.5) * 40
      
      nodeData.push({
        id: i,
        position: new THREE.Vector3(
          Math.cos(angle) * radius + (Math.random() - 0.5) * 10,
          height,
          Math.sin(angle) * radius + (Math.random() - 0.5) * 10
        ),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 1 + Math.random() * 2,
        label: labels[i % labels.length],
        threatLevel: Math.floor(Math.random() * 100),
        connections: []
      })
    }

    // Create connections
    nodeData.forEach((node, i) => {
      const numConnections = Math.floor(Math.random() * 4) + 1
      for (let j = 0; j < numConnections; j++) {
        const targetIdx = Math.floor(Math.random() * nodeData.length)
        if (targetIdx !== i && !node.connections.includes(targetIdx)) {
          node.connections.push(targetIdx)
        }
      }
    })

    return nodeData
  }, [])

  // Generate connection lines
  const connections = useMemo(() => {
    const lines: { start: THREE.Vector3, end: THREE.Vector3 }[] = []
    
    nodes.forEach(node => {
      node.connections.forEach(targetIdx => {
        lines.push({
          start: node.position,
          end: nodes[targetIdx].position
        })
      })
    })
    
    return lines
  }, [nodes])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
  })

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      {connections.map((conn, i) => (
        <ConnectionLine 
          key={`line-${i}`} 
          start={conn.start} 
          end={conn.end}
          opacity={0.3}
        />
      ))}

      {/* Nodes */}
      {nodes.map(node => (
        <NetworkNode
          key={node.id}
          node={node}
          isHovered={hoveredNode === node.id}
          onHover={() => setHoveredNode(node.id)}
          onUnhover={() => setHoveredNode(null)}
        />
      ))}

      {/* Central hub indicator */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[15, 0.2, 16, 100]} />
        <meshBasicMaterial color="#00ffaa" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[25, 0.1, 16, 100]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.2} />
      </mesh>
      <GraphLegend />
    </group>
  )
}
