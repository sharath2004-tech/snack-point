import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, Environment, OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

function BurgerModel() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.3
    }
  })

  return (
    <Float speed={1.6} rotationIntensity={0.2} floatIntensity={1.8}>
      <group ref={groupRef} scale={1.3}>
        {/* Top bun dome */}
        <mesh position={[0, 1.6, 0]} castShadow>
          <sphereGeometry args={[0.92, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#C8864A" roughness={0.75} metalness={0.05} />
        </mesh>
        {/* Top bun cylinder base */}
        <mesh position={[0, 1.05, 0]}>
          <cylinderGeometry args={[0.92, 0.96, 0.22, 64]} />
          <meshStandardMaterial color="#C8864A" roughness={0.75} />
        </mesh>
        {/* Sesame seeds */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const angle = (i / 7) * Math.PI * 2
          const r = 0.45
          return (
            <mesh key={i} position={[Math.cos(angle) * r, 1.93, Math.sin(angle) * r]}>
              <sphereGeometry args={[0.055, 8, 8]} />
              <meshStandardMaterial color="#F5E6C8" />
            </mesh>
          )
        })}
        {/* Center sesame */}
        <mesh position={[0, 1.93, 0]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color="#F5E6C8" />
        </mesh>

        {/* Lettuce */}
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[1.18, 1.12, 0.14, 64]} />
          <meshStandardMaterial color="#2EAA4F" roughness={0.95} />
        </mesh>

        {/* Tomato slice */}
        <mesh position={[0, 0.66, 0]}>
          <cylinderGeometry args={[1.02, 1.02, 0.13, 64]} />
          <meshStandardMaterial color="#D42B0B" roughness={0.6} metalness={0.1} />
        </mesh>

        {/* Cheese */}
        <mesh position={[0.1, 0.47, 0.1]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[2.3, 0.07, 2.3]} />
          <meshStandardMaterial color="#FFA500" roughness={0.65} emissive="#FF8C00" emissiveIntensity={0.08} />
        </mesh>

        {/* Beef patty */}
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[1.04, 1.0, 0.48, 64]} />
          <meshStandardMaterial color="#3D2012" roughness={0.95} metalness={0.05} />
        </mesh>

        {/* Bottom bun */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[1.1, 1.04, 0.52, 64]} />
          <meshStandardMaterial color="#C8864A" roughness={0.75} />
        </mesh>
        {/* Bottom bun underside */}
        <mesh position={[0, -0.6, 0]}>
          <sphereGeometry args={[1.03, 64, 64, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial color="#B5703C" roughness={0.8} />
        </mesh>
      </group>
    </Float>
  )
}

function FloatingFries() {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.6
      ref.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.2) * 0.2
    }
  })
  return (
    <group ref={ref} position={[3.2, 0.3, -0.5]} scale={0.8}>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i}
          position={[(i % 3 - 1) * 0.14, i * 0.18 - 0.6, (i % 2) * 0.08]}
          rotation={[0.1 * i, 0, 0.05 * (i % 2 === 0 ? 1 : -1)]}
        >
          <boxGeometry args={[0.08, 0.55, 0.08]} />
          <meshStandardMaterial color="#FFD060" roughness={0.7} emissive="#FFB800" emissiveIntensity={0.1} />
        </mesh>
      ))}
    </group>
  )
}

function FloatingRing() {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.5
      ref.current.rotation.z = state.clock.getElapsedTime() * 0.3
    }
  })
  return (
    <mesh ref={ref} position={[-3.0, 0.8, -1]}>
      <torusGeometry args={[0.45, 0.18, 16, 32]} />
      <meshStandardMaterial color="#C8864A" roughness={0.7} />
    </mesh>
  )
}

export default function BurgerScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 6.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 10, 30]} />

      {/* Lighting rig */}
      <ambientLight intensity={0.25} />
      <pointLight position={[4, 5, 4]} intensity={3} color="#FF4500" />
      <pointLight position={[-4, -2, -2]} intensity={2} color="#FFB800" />
      <pointLight position={[0, 8, 2]} intensity={1.5} color="#ffffff" />
      <spotLight position={[0, 6, 0]} angle={0.4} penumbra={0.6} intensity={2} castShadow color="#FF6B35" />

      {/* Atmosphere */}
      <Stars radius={80} depth={50} count={3000} factor={3} fade speed={0.5} />
      <Sparkles count={200} size={1.8} scale={14} speed={0.25} color="#FF4500" opacity={0.55} />
      <Sparkles count={100} size={1.2} scale={10} speed={0.18} color="#FFB800" opacity={0.4} />

      <Suspense fallback={null}>
        <BurgerModel />
        <FloatingFries />
        <FloatingRing />
        <Environment preset="city" />
      </Suspense>

      <EffectComposer>
        <Bloom luminanceThreshold={0.75} intensity={1.8} radius={0.6} mipmapBlur />
      </EffectComposer>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
        maxPolarAngle={Math.PI / 1.7}
        minPolarAngle={Math.PI / 3.5}
      />
    </Canvas>
  )
}
