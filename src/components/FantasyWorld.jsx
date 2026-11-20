import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Cloud, Float, Sparkles, Stars } from '@react-three/drei'
import { DoubleSide, MathUtils, Vector3 } from 'three'

function detectWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    )
  } catch {
    return false
  }
}

function useLowQuality() {
  return useMemo(() => {
    if (typeof window === 'undefined') return false
    return (
      window.matchMedia('(max-width: 760px)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    )
  }, [])
}

function CameraRig({ variant, reducedMotion, doorsOpen }) {
  const lookTarget = useMemo(() => new Vector3(), [])
  const target = useMemo(() => new Vector3(), [])

  useFrame(({ camera, clock }, delta) => {
    if (reducedMotion) return

    const t = clock.elapsedTime * 0.12

    if (variant === 'opening') {
      target.set(Math.sin(t) * 1.2, 4.2, Math.max(13, 17 - t * 0.8))
      lookTarget.set(0, 2.4, -2)
    } else if (variant === 'kingdom') {
      target.set(Math.sin(t * 0.8) * 2, 6.4, Math.max(16, 22 - t * 1.2))
      lookTarget.set(0, 1.6, -2)
    } else if (variant === 'forest') {
      target.set(Math.sin(t * 0.7) * 0.7, 2.3, Math.max(9.5, 12 - t * 0.7))
      lookTarget.set(0, 1.3, -2)
    } else if (variant === 'castle') {
      target.set(Math.sin(t * 0.5) * 0.5, 3.1, doorsOpen ? 10.5 : Math.max(14, 18 - t * 0.9))
      lookTarget.set(0, 2.1, 0)
    } else if (variant === 'stars') {
      target.set(Math.sin(t * 0.4) * 0.6, 2.2, 11)
      lookTarget.set(0, 4.5, -2)
    } else {
      target.set(Math.sin(t * 0.35) * 0.9, 3.2, Math.max(15, 20 - t * 1.1))
      lookTarget.set(0, 2.4, -1)
    }

    camera.position.lerp(target, Math.min(1, delta * 0.55))
    camera.lookAt(lookTarget)
  })

  return null
}

function Moon({ position = [-8, 9, -18], scale = 1, color = '#fff0d2' }) {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh scale={1.3}>
        <sphereGeometry args={[2.2, 24, 24]} />
        <meshBasicMaterial color="#b8a4ff" transparent opacity={0.1} depthWrite={false} />
      </mesh>
      <mesh scale={1.65}>
        <sphereGeometry args={[2.2, 24, 24]} />
        <meshBasicMaterial color="#8c78d8" transparent opacity={0.04} depthWrite={false} />
      </mesh>
    </group>
  )
}

function Tower({ position, height = 3, radius = 0.45, lit = true, roofColor = '#4a2d63' }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[radius, radius * 1.12, height, 12]} />
        <meshStandardMaterial color="#28243f" roughness={0.85} metalness={0.08} />
      </mesh>
      <mesh position={[0, height / 2 + 0.75, 0]} castShadow>
        <coneGeometry args={[radius * 1.5, 1.5, 12]} />
        <meshStandardMaterial color={roofColor} roughness={0.7} />
      </mesh>
      {lit && (
        <mesh position={[0, height * 0.2, radius + 0.03]}>
          <planeGeometry args={[0.18, 0.34]} />
          <meshBasicMaterial color="#ffd99a" toneMapped={false} />
        </mesh>
      )}
    </group>
  )
}

function CastleModel({ position = [0, 0, 0], scale = 1, doorsOpen = false, lit = true }) {
  const leftDoor = useRef()
  const rightDoor = useRef()

  useFrame((_, delta) => {
    if (!leftDoor.current || !rightDoor.current) return
    leftDoor.current.rotation.y = MathUtils.damp(
      leftDoor.current.rotation.y,
      doorsOpen ? -1.05 : 0,
      2.2,
      delta
    )
    rightDoor.current.rotation.y = MathUtils.damp(
      rightDoor.current.rotation.y,
      doorsOpen ? 1.05 : 0,
      2.2,
      delta
    )
  })

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <cylinderGeometry args={[3.6, 4.1, 0.5, 12]} />
        <meshStandardMaterial color="#24223a" roughness={1} />
      </mesh>
      <mesh position={[0, 2, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 4.5, 2.6]} />
        <meshStandardMaterial color="#302b48" roughness={0.9} />
      </mesh>
      <mesh position={[0, 4.9, -0.4]} castShadow>
        <coneGeometry args={[2.2, 1.7, 4]} />
        <meshStandardMaterial color="#4b2c66" roughness={0.7} />
      </mesh>

      <Tower position={[-2.1, 1.5, -0.8]} height={3.6} radius={0.5} lit={lit} />
      <Tower position={[2.1, 1.5, -0.8]} height={3.6} radius={0.5} lit={lit} />
      <Tower position={[-2.9, 1.1, 1.5]} height={2.8} radius={0.4} lit={lit} roofColor="#59356f" />
      <Tower position={[2.9, 1.1, 1.5]} height={2.8} radius={0.4} lit={lit} roofColor="#59356f" />

      <mesh position={[0, 1.05, 1.02]}>
        <boxGeometry args={[1.55, 2.1, 0.12]} />
        <meshStandardMaterial color="#17142b" roughness={1} />
      </mesh>
      <group ref={leftDoor} position={[-0.78, 0, 1.1]}>
        <mesh position={[0.39, 1.02, 0]} castShadow>
          <boxGeometry args={[0.78, 2, 0.08]} />
          <meshStandardMaterial color="#3a2741" roughness={0.8} metalness={0.2} />
        </mesh>
      </group>
      <group ref={rightDoor} position={[0.78, 0, 1.1]}>
        <mesh position={[-0.39, 1.02, 0]} castShadow>
          <boxGeometry args={[0.78, 2, 0.08]} />
          <meshStandardMaterial color="#3a2741" roughness={0.8} metalness={0.2} />
        </mesh>
      </group>

      {lit && (
        <>
          <mesh position={[-0.62, 2.8, 0.94]}>
            <planeGeometry args={[0.24, 0.42]} />
            <meshBasicMaterial color="#ffd48c" toneMapped={false} />
          </mesh>
          <mesh position={[0.62, 2.8, 0.94]}>
            <planeGeometry args={[0.24, 0.42]} />
            <meshBasicMaterial color="#ffd48c" toneMapped={false} />
          </mesh>
          <pointLight position={[0, 2.2, 2.4]} color="#ffbd78" intensity={doorsOpen ? 4 : 1.4} distance={9} />
        </>
      )}

      <mesh position={[0, -0.18, 4.4]} receiveShadow>
        <boxGeometry args={[1.7, 0.16, 5.6]} />
        <meshStandardMaterial color="#3c3553" roughness={0.9} />
      </mesh>
    </group>
  )
}

function FloatingIsland({ position, scale = 1, rotation = 0, low = false }) {
  return (
    <Float speed={0.7} rotationIntensity={0.05} floatIntensity={0.45}>
      <group position={position} scale={scale} rotation={[0, rotation, 0]}>
        <mesh rotation={[Math.PI, 0, 0]} castShadow>
          <coneGeometry args={[1.5, 2.8, 9]} />
          <meshStandardMaterial color="#211d38" roughness={1} />
        </mesh>
        <mesh position={[0, 1.36, 0]} receiveShadow>
          <cylinderGeometry args={[1.55, 1.5, 0.3, 9]} />
          <meshStandardMaterial color="#2d594e" roughness={0.95} />
        </mesh>
        {!low && (
          <>
            <mesh position={[-0.5, 1.75, 0.2]}>
              <coneGeometry args={[0.36, 0.95, 7]} />
              <meshStandardMaterial color="#244f47" roughness={1} />
            </mesh>
            <mesh position={[0.65, 1.7, -0.35]}>
              <coneGeometry args={[0.3, 0.8, 7]} />
              <meshStandardMaterial color="#2b5b50" roughness={1} />
            </mesh>
          </>
        )}
      </group>
    </Float>
  )
}

function Waterfall({ position, scale = 1, low = false }) {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <planeGeometry args={[0.55, 3.4]} />
        <meshBasicMaterial
          color="#7de9ff"
          transparent
          opacity={0.32}
          side={DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <Sparkles count={low ? 14 : 42} scale={[0.8, 3.6, 0.8]} size={2} speed={0.5} color="#a8f4ff" />
    </group>
  )
}

function Lake({ variant }) {
  const isFinal = variant === 'final'
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, -1]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial
        color={isFinal ? '#27374f' : '#101b39'}
        emissive={isFinal ? '#51334a' : '#101c46'}
        emissiveIntensity={isFinal ? 0.28 : 0.4}
        metalness={0.72}
        roughness={0.22}
        transparent
        opacity={0.95}
      />
    </mesh>
  )
}

function Bridge() {
  return (
    <group position={[0, -0.9, -3]}>
      <mesh receiveShadow>
        <boxGeometry args={[1.9, 0.12, 11]} />
        <meshStandardMaterial color="#5b4a61" roughness={0.8} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.98, 0.42, 0]}>
          <boxGeometry args={[0.08, 0.8, 11]} />
          <meshBasicMaterial color="#e7bb79" transparent opacity={0.55} toneMapped={false} />
        </mesh>
      ))}
      {[-4, -2, 0, 2, 4].map((z) => (
        <mesh key={z} position={[0, 0.48, z]}>
          <boxGeometry args={[2, 0.08, 0.08]} />
          <meshBasicMaterial color="#ffd79a" transparent opacity={0.45} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function WorldBackdrop({ variant, low, reducedMotion, doorsOpen }) {
  const starCount = variant === 'stars' ? (low ? 1800 : 5200) : low ? 700 : 2400
  const sparkleCount = low ? 28 : 76

  return (
    <>
      <ambientLight intensity={variant === 'final' ? 0.65 : 0.42} color="#b9b5ff" />
      <directionalLight
        position={[-8, 12, 4]}
        intensity={variant === 'final' ? 1.8 : 1.1}
        color={variant === 'final' ? '#ffb27a' : '#cfc5ff'}
        castShadow={!low}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[6, 5, 4]} color="#ffc987" intensity={variant === 'stars' ? 0.5 : 1.1} distance={22} />

      <Stars
        radius={80}
        depth={45}
        count={starCount}
        factor={variant === 'stars' ? 4 : 3}
        saturation={0.2}
        fade
        speed={reducedMotion ? 0 : 0.4}
      />
      <Sparkles
        count={sparkleCount}
        scale={[18, 9, 12]}
        size={2.4}
        speed={reducedMotion ? 0 : 0.28}
        color="#f6d18b"
        opacity={0.65}
      />

      {variant === 'stars' && (
        <>
          <Moon position={[-7, 8, -20]} scale={1.15} />
          <Lake variant={variant} />
          <group position={[0, 0, -12]}>
            {[
              [-4, 6, 0],
              [-1.6, 7.4, -1],
              [1.2, 6.2, 0.5],
              [4.2, 7.8, -1.5]
            ].map((point, index, array) =>
              index < array.length - 1 ? (
                <mesh key={index} position={[(point[0] + array[index + 1][0]) / 2, (point[1] + array[index + 1][1]) / 2, -0.5]}>
                  <boxGeometry args={[Math.hypot(array[index + 1][0] - point[0], array[index + 1][1] - point[1]), 0.012, 0.012]} />
                  <meshBasicMaterial color="#b9a6ff" transparent opacity={0.35} />
                </mesh>
              ) : null
            )}
          </group>
        </>
      )}

      {variant === 'opening' && (
        <>
          <Moon position={[-7.5, 8.5, -19]} scale={1.3} />
          <CastleModel position={[1, -2.2, -14]} scale={1.25} lit={false} />
          <FloatingIsland position={[-6, -2.5, -8]} scale={1.3} low={low} />
          <FloatingIsland position={[7, -3.4, -9]} scale={1.6} low={low} />
          <FloatingIsland position={[0, -5.2, -5]} scale={1.9} low={low} />
        </>
      )}

      {variant === 'kingdom' && (
        <>
          <Moon position={[-9, 9, -22]} scale={0.9} />
          <CastleModel position={[2, -2.5, -16]} scale={1.15} lit />
          <FloatingIsland position={[-7, -1.8, -7]} scale={1.5} low={low} />
          <FloatingIsland position={[6.5, -2.6, -9]} scale={1.8} low={low} />
          <FloatingIsland position={[-2.5, -4.4, -4]} scale={2.1} low={low} />
          <Waterfall position={[6.4, -2.4, -5.2]} low={low} />
          <Waterfall position={[-7, -2, -4.5]} scale={0.8} low={low} />
          <Lake variant={variant} />
        </>
      )}

      {variant === 'castle' && (
        <>
          <CastleModel position={[0, -2.2, -6]} scale={1.5} doorsOpen={doorsOpen} lit />
          <pointLight position={[0, -0.5, -2.5]} color="#ffd7a0" intensity={doorsOpen ? 5 : 1.8} distance={12} />
        </>
      )}

      {variant === 'final' && (
        <>
          <Moon position={[8, 7, -22]} scale={0.8} color="#ffe4c2" />
          <CastleModel position={[0, -2.6, -17]} scale={1.1} lit />
          <FloatingIsland position={[-7, -2.6, -10]} scale={1.5} low={low} />
          <FloatingIsland position={[7, -3, -11]} scale={1.6} low={low} />
          <Bridge />
          <Lake variant={variant} />
        </>
      )}

      {!low && ['opening', 'kingdom', 'final'].includes(variant) && (
        <>
          <Cloud position={[-9, -1, -12]} scale={14} opacity={0.22} speed={0.15} />
          <Cloud position={[8, 0.5, -16]} scale={18} opacity={0.18} speed={0.1} />
          <Cloud position={[0, -3.5, -22]} scale={22} opacity={0.14} speed={0.08} />
        </>
      )}

      {variant === 'forest' && (
        <Lake variant={variant} />
      )}
    </>
  )
}

export function FantasyWorld({
  variant = 'kingdom',
  children = null,
  doorsOpen = false,
  reducedMotion = false,
  className = ''
}) {
  const [webgl] = useState(detectWebGL)
  const low = useLowQuality()

  useEffect(() => {
    return () => {
      document.body.style.cursor = ''
    }
  }, [])

  const background = {
    opening: '#050613',
    kingdom: '#080a1d',
    forest: '#061019',
    castle: '#090716',
    stars: '#040615',
    final: '#150d24'
  }[variant]

  const fog = {
    opening: ['#090a1c', 14, 58],
    kingdom: ['#0b1027', 12, 62],
    forest: ['#07151b', 8, 38],
    castle: ['#0b0819', 10, 42],
    stars: ['#050716', 16, 70],
    final: ['#221129', 13, 62]
  }[variant]

  if (!webgl) {
    return (
      <div className={`world-layer world-fallback fallback-${variant} ${className}`} aria-hidden="true">
        <div className="fallback-moon" />
        <div className="fallback-castle" />
        <div className="fallback-horizon" />
        <div className="vignette" />
      </div>
    )
  }

  return (
    <div className={`world-layer world-${variant} ${className}`} aria-hidden="true">
      <Canvas
        shadows={!low}
        dpr={low ? [1, 1.4] : [1, 1.8]}
        gl={{ antialias: !low, powerPreference: 'high-performance', alpha: false }}
        camera={{
          position: variant === 'forest' ? [0, 2.3, 12] : variant === 'stars' ? [0, 2.2, 11] : [0, 4, 18],
          fov: variant === 'castle' ? 42 : 48,
          near: 0.1,
          far: 160
        }}
      >
        <color attach="background" args={[background]} />
        <fog attach="fog" args={fog} />
        <CameraRig variant={variant} reducedMotion={reducedMotion} doorsOpen={doorsOpen} />
        <WorldBackdrop variant={variant} low={low} reducedMotion={reducedMotion} doorsOpen={doorsOpen} />
        {children}
      </Canvas>
      <div className="vignette" />
      <div className="film-grain" />
    </div>
  )
}

export default FantasyWorld
