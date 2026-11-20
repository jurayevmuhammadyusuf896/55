import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { KINGDOM_LINES } from '../data/storyData'
import FantasyWorld from '../components/FantasyWorld'

export default function KingdomScene({ onNext, reducedMotion = false }) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const scale = reducedMotion ? 0.25 : 1
    const timers = [
      window.setTimeout(() => setStage(1), 900 * scale),
      window.setTimeout(() => setStage(2), 3400 * scale),
      window.setTimeout(() => setStage(3), 5200 * scale)
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [reducedMotion])

  return (
    <section className="cinematic-scene chapter-scene kingdom-scene">
      <FantasyWorld variant="kingdom" reducedMotion={reducedMotion} />

      <div className="scene-content chapter-content">
        <motion.div
          className="chapter-heading"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 1.1 }}
        >
          <span className="chapter-number">Глава первая</span>
          <h2 className="gold-title chapter-title">Волшебное королевство</h2>
        </motion.div>

        <div className="chapter-lines">
          <AnimatePresence>
            {stage >= 1 && (
              <motion.p
                key="kingdom-line-one"
                className="story-line"
                initial={{ opacity: 0, y: 22, filter: 'blur(7px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: reducedMotion ? 0.2 : 1.2 }}
              >
                {KINGDOM_LINES[0]}
              </motion.p>
            )}
            {stage >= 2 && (
              <motion.p
                key="kingdom-line-two"
                className="story-line"
                initial={{ opacity: 0, y: 22, filter: 'blur(7px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: reducedMotion ? 0.2 : 1.2 }}
              >
                {KINGDOM_LINES[1]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              key="kingdom-action"
              className="chapter-action"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0.2 : 0.9 }}
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
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
