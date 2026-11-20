import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Sparkles, X } from 'lucide-react'
import { Float, Sparkles as MagicSparkles } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import { DoubleSide } from 'three'
import { FOREST_LINES } from '../data/storyData'
import { FOREST_MESSAGES } from '../data/messages'
import FantasyWorld from './FantasyWorld'

function ForestTree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.3, 3, 7]} />
        <meshStandardMaterial color="#30213b" roughness={1} />
      </mesh>
      <mesh position={[0, 3.4, 0]} castShadow>
        <coneGeometry args={[1.15, 2.3, 8]} />
        <meshStandardMaterial color="#173d3b" roughness={1} />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow>
        <coneGeometry args={[0.85, 1.9, 8]} />
        <meshStandardMaterial color="#20544b" roughness={1} />
      </mesh>
    </group>
  )
}

function GlowingFlower({ position, color = '#ffd58f' }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.018, 0.025, 0.4, 5]} />
        <meshStandardMaterial color="#31534a" roughness={1} />
      </mesh>
      <mesh position={[0, 0.44, 0]}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Butterfly({ position, color = '#c9b1ff', reducedMotion }) {
  const leftWing = useRef()
  const rightWing = useRef()

  useFrame(({ clock }) => {
    if (reducedMotion) return
    const flap = Math.sin(clock.elapsedTime * 5.2) * 0.5
    if (leftWing.current) leftWing.current.rotation.y = -0.25 - flap
    if (rightWing.current) rightWing.current.rotation.y = 0.25 + flap
  })

  return (
    <Float speed={reducedMotion ? 0 : 1.5} floatIntensity={reducedMotion ? 0 : 1.2} rotationIntensity={0.1}>
      <group position={position} scale={0.16}>
        <mesh ref={leftWing} position={[-0.5, 0, 0]}>
          <planeGeometry args={[1, 0.72]} />
          <meshBasicMaterial color={color} transparent opacity={0.72} side={DoubleSide} toneMapped={false} />
        </mesh>
        <mesh ref={rightWing} position={[0.5, 0, 0]}>
          <planeGeometry args={[1, 0.72]} />
          <meshBasicMaterial color={color} transparent opacity={0.72} side={DoubleSide} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  )
}

function ForestOrb({ position, index, onDiscover, reducedMotion }) {
  const orb = useRef()

  useFrame(({ clock }) => {
    if (!orb.current || reducedMotion) return
    const pulse = 1 + Math.sin(clock.elapsedTime * 2 + index) * 0.12
    orb.current.scale.setScalar(pulse)
  })

  return (
    <group position={position}>
      <mesh ref={orb}>
        <sphereGeometry args={[0.18, 18, 18]} />
        <meshBasicMaterial color={index % 2 === 0 ? '#ffd68c' : '#a7f0ff'} toneMapped={false} />
      </mesh>
      <mesh scale={2.8}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshBasicMaterial color="#ffe2a6" transparent opacity={0.06} depthWrite={false} />
      </mesh>
      <mesh
        onClick={(event) => {
          event.stopPropagation()
          onDiscover(index)
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = ''
        }}
      >
        <sphereGeometry args={[0.55, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <MagicSparkles count={reducedMotion ? 0 : 14} scale={[1.6, 1.6, 1.6]} size={1.6} speed={0.5} color="#ffe4ad" />
    </group>
  )
}

function Portal() {
  return (
    <Float speed={0.6} floatIntensity={0.3} rotationIntensity={0.05}>
      <group position={[0, 1.9, -8.5]}>
        <mesh>
          <torusGeometry args={[1.35, 0.09, 12, 48]} />
          <meshBasicMaterial color="#e5c3ff" transparent opacity={0.8} toneMapped={false} />
        </mesh>
        <mesh>
          <circleGeometry args={[1.28, 48]} />
          <meshBasicMaterial color="#6f5bd6" transparent opacity={0.16} side={DoubleSide} depthWrite={false} />
        </mesh>
      </group>
    </Float>
  )
}

function ForestDetails({ onDiscover, reducedMotion }) {
  const low = useMemo(
    () => window.matchMedia('(max-width: 760px)').matches || window.matchMedia('(pointer: coarse)').matches,
    []
  )

  const trees = useMemo(
    () => [
      [-4.8, -1.2, -6], [-3.6, -1.2, -2.6], [-2.6, -1.2, 2.2],
      [4.7, -1.2, -6.5], [3.7, -1.2, -2.2], [2.8, -1.2, 2.6],
      [-6.2, -1.2, -10], [6.1, -1.2, -10], [0.4, -1.2, -11]
    ],
    []
  )

  const flowers = useMemo(
    () => [
      [-2.2, -1.1, 0.4], [-1.4, -1.1, -2.4], [0.8, -1.1, -0.8],
      [2.4, -1.1, -3.6], [-3.2, -1.1, -4.2], [1.9, -1.1, 1.4],
      [-0.6, -1.1, -6.3], [3.4, -1.1, -6.8]
    ],
    []
  )

  const orbs = useMemo(
    () => [
      [-2.4, 0.3, -1.6], [2.3, 0.7, -3.8], [-0.6, 1.1, -6.6],
      [3.2, 0.5, 0.8], [-3.7, 0.9, -6.2]
    ],
    []
  )

  return (
    <group>
      {trees.map((position, index) => (
        <ForestTree key={`tree-${index}`} position={position} scale={0.85 + (index % 3) * 0.16} />
      ))}
      {flowers.map((position, index) => (
        <GlowingFlower
          key={`flower-${index}`}
          position={position}
          color={index % 3 === 0 ? '#ffe2a3' : index % 3 === 1 ? '#a9ecff' : '#e5b9ff'}
        />
      ))}
      {orbs.map((position, index) => (
        <ForestOrb
          key={`orb-${index}`}
          position={position}
          index={index}
          onDiscover={onDiscover}
          reducedMotion={reducedMotion}
        />
      ))}
      {!low && (
        <>
          <Butterfly position={[-1.8, 1.7, 1.2]} reducedMotion={reducedMotion} />
          <Butterfly position={[1.4, 2.2, -2.4]} color="#ffd9a8" reducedMotion={reducedMotion} />
          <Butterfly position={[2.9, 1.4, -5.2]} color="#b6f0d5" reducedMotion={reducedMotion} />
        </>
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.6, -1.08, -3]}>
        <planeGeometry args={[2.4, 18]} />
        <meshStandardMaterial color="#2a7c88" emissive="#1d6f83" emissiveIntensity={0.45} transparent opacity={0.72} metalness={0.5} roughness={0.25} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((step) => (
        <mesh key={`step-${step}`} position={[0, -1.03, 3 - step * 2.1]} rotation={[0, step * 0.24, 0]}>
          <cylinderGeometry args={[0.68, 0.74, 0.12, 8]} />
          <meshStandardMaterial color="#4b4059" roughness={1} />
        </mesh>
      ))}
      <Portal />
      <MagicSparkles count={low ? 34 : 110} scale={[13, 6, 12]} size={2} speed={reducedMotion ? 0 : 0.35} color="#ffe1a6" />
    </group>
  )
}

export default function MagicalForest({ onNext, reducedMotion = false }) {
  const [message, setMessage] = useState('')
  const [found, setFound] = useState([])

  const handleDiscover = (index) => {
    setMessage(FOREST_MESSAGES[index % FOREST_MESSAGES.length])
    setFound((current) => (current.includes(index) ? current : [...current, index]))
  }

  return (
    <section className="cinematic-scene chapter-scene forest-scene">
      <FantasyWorld variant="forest" reducedMotion={reducedMotion}>
        <ForestDetails onDiscover={handleDiscover} reducedMotion={reducedMotion} />
      </FantasyWorld>

      <div className="scene-content chapter-content forest-content">
        <motion.div
          className="chapter-heading"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 1 }}
        >
          <span className="chapter-number">Глава третья</span>
          <h2 className="gold-title chapter-title">Зачарованный лес</h2>
        </motion.div>

        <motion.div
          className="chapter-lines"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.5, delayChildren: 0.6 } }
          }}
        >
          {FOREST_LINES.map((line) => (
            <motion.p
              key={line}
              className="story-line"
              variants={{
                hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: reducedMotion ? 0.2 : 1 } }
              }}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>

        <div className="forest-counter">
          <Sparkles size={14} />
          Найдено огоньков: {found.length} из {FOREST_MESSAGES.length}
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              key={message}
              className="discovery-card"
              initial={{ opacity: 0, y: 26, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: reducedMotion ? 0.15 : 0.6 }}
            >
              <button type="button" className="discovery-close" onClick={() => setMessage('')} aria-label="Скрыть сообщение">
                <X size={16} />
              </button>
              <span className="discovery-mark">✦</span>
              <p>{message}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="chapter-action"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reducedMotion ? 0 : 1.6, duration: 0.8 }}
        >
          <motion.button
            type="button"
            className="cinematic-button"
            onClick={onNext}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            ПРОДОЛЖИТЬ
            <ArrowRight size={17} strokeWidth={1.5} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
