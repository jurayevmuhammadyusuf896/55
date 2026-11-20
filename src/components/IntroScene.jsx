import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { INTRO_LINES } from '../data/storyData'
import FantasyWorld from './FantasyWorld'

export default function IntroScene({ onEnter, reducedMotion = false }) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const scale = reducedMotion ? 0.28 : 1
    const timings = [1200, 4200, 6900, 8300].map((time) => time * scale)
    const timers = timings.map((time, index) =>
      window.setTimeout(() => setStage(index + 1), time)
    )
    return () => timers.forEach(window.clearTimeout)
  }, [reducedMotion])

  return (
    <section className="cinematic-scene intro-scene">
      <FantasyWorld variant="opening" reducedMotion={reducedMotion} />

      <div className="scene-content intro-content">
        <AnimatePresence mode="wait">
          {stage === 0 && (
            <motion.div
              key="intro-particle"
              className="intro-particle-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1 }}
            >
              <span className="intro-particle" />
              <span className="intro-particle-halo" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="intro-lines">
          <AnimatePresence>
            {stage >= 1 && (
              <motion.p
                key="intro-line-one"
                className="intro-line"
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: reducedMotion ? 0.2 : 1.2, ease: 'easeOut' }}
              >
                {INTRO_LINES[0]}
              </motion.p>
            )}
            {stage >= 2 && (
              <motion.p
                key="intro-line-two"
                className="intro-line"
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: reducedMotion ? 0.2 : 1.2, ease: 'easeOut' }}
              >
                {INTRO_LINES[1]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              key="intro-name"
              className="intro-name-block"
              initial={{ opacity: 0, scale: 0.92, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: reducedMotion ? 0.25 : 1.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="intro-eyebrow">Эта история — для тебя</span>
              <h1 className="gold-title intro-name">МАЛИКА</h1>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stage >= 4 && (
            <motion.div
              key="intro-action"
              className="intro-action"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0.2 : 1, delay: reducedMotion ? 0 : 0.25 }}
            >
              <p className="intro-subtitle">Маленькая история, созданная специально для тебя.</p>
              <motion.button
                type="button"
                className="cinematic-button primary-button"
                onClick={onEnter}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Sparkles size={17} strokeWidth={1.5} />
                ВОЙТИ В МОЙ МИР
                <ArrowRight size={17} strokeWidth={1.5} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {stage < 4 && (
          <button type="button" className="skip-button" onClick={() => setStage(4)}>
            Пропустить вступление
          </button>
        )}
      </div>
    </section>
  )
}
