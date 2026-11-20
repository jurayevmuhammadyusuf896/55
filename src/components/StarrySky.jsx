import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Sparkles, X } from 'lucide-react'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { STAR_MESSAGES } from '../data/messages'
import FantasyWorld from './FantasyWorld'

const STAR_POSITIONS = [
  [-3.4, 4.1, -4.5],
  [-1.6, 6.2, -6],
  [0.7, 4.8, -5],
  [2.9, 6.6, -7],
  [-4.5, 7.2, -8],
  [4.6, 4.3, -8.5],
  [0.1, 8, -10]
]

function InteractiveStar({ position, index, onDiscover, reducedMotion }) {
  const core = useRef()

  useFrame(({ clock }) => {
    if (!core.current || reducedMotion) return
    const scale = 1 + Math.sin(clock.elapsedTime * 2.2 + index * 1.4) * 0.16
    core.current.scale.setScalar(scale)
  })

  return (
    <group position={position}>
      <mesh ref={core}>
        <octahedronGeometry args={[0.28, 0]} />
        <meshBasicMaterial color={index % 2 === 0 ? '#ffe0a2' : '#c7b5ff'} toneMapped={false} />
      </mesh>
      <mesh scale={3.2}>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshBasicMaterial color="#ffe4b0" transparent opacity={0.055} depthWrite={false} />
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
        <sphereGeometry args={[0.85, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

export default function StarrySky({ onNext, reducedMotion = false }) {
  const [message, setMessage] = useState('')
  const [found, setFound] = useState([])

  const handleDiscover = (index) => {
    setMessage(STAR_MESSAGES[index % STAR_MESSAGES.length])
    setFound((current) => (current.includes(index) ? current : [...current, index]))
  }

  return (
    <section className="cinematic-scene chapter-scene stars-scene">
      <FantasyWorld variant="stars" reducedMotion={reducedMotion}>
        {STAR_POSITIONS.map((position, index) => (
          <InteractiveStar
            key={`star-${index}`}
            position={position}
            index={index}
            onDiscover={handleDiscover}
            reducedMotion={reducedMotion}
          />
        ))}
      </FantasyWorld>

      <div className="scene-content chapter-content stars-content">
        <motion.div
          className="chapter-heading"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 1 }}
        >
          <span className="chapter-number">Глава пятая</span>
          <h2 className="gold-title chapter-title">Небо из тысячи звёзд</h2>
        </motion.div>

        <motion.p
          className="story-line"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.7, duration: reducedMotion ? 0.2 : 1 }}
        >
          Коснись звезды — и она расскажет тебе одно маленькое желание.
        </motion.p>

        <div className="stars-counter">
          <Sparkles size={14} />
          Открыто звёзд: {found.length} из {STAR_MESSAGES.length}
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              key={message}
              className="discovery-card star-message-card"
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
          transition={{ delay: reducedMotion ? 0 : 1.2, duration: 0.8 }}
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
