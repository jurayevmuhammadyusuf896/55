import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CONFESSION, FINAL_LINES } from '../data/storyData'
import FantasyWorld from './FantasyWorld'

export default function FinalConfession({ onNext, reducedMotion = false }) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const scale = reducedMotion ? 0.25 : 1
    const timers = [
      window.setTimeout(() => setStage(1), 1000 * scale),
      window.setTimeout(() => setStage(2), 4100 * scale),
      window.setTimeout(() => setStage(3), 8200 * scale),
      window.setTimeout(() => setStage(4), 12500 * scale)
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [reducedMotion])

  return (
    <section className="cinematic-scene chapter-scene confession-scene">
      <FantasyWorld variant="final" reducedMotion={reducedMotion} />

      <div className="scene-content chapter-content confession-content">
        <motion.div
          className="chapter-heading"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 1.1 }}
        >
          <span className="chapter-number">Финал</span>
          <h2 className="gold-title chapter-title">Последнее признание</h2>
        </motion.div>

        <div className="confession-lines">
          <AnimatePresence>
            {stage >= 1 && (
              <motion.p
                key="final-line-one"
                className="story-line"
                initial={{ opacity: 0, y: 20, filter: 'blur(7px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: reducedMotion ? 0.2 : 1.2 }}
              >
                {FINAL_LINES[0]}
              </motion.p>
            )}
            {stage >= 2 && (
              <motion.p
                key="final-line-two"
                className="story-line"
                initial={{ opacity: 0, y: 20, filter: 'blur(7px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: reducedMotion ? 0.2 : 1.2 }}
              >
                {FINAL_LINES[1]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              key="confession-letter"
              className="confession-text"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0.2 : 1.4 }}
            >
              {CONFESSION.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stage >= 4 && (
            <motion.div
              key="confession-end"
              className="confession-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0.2 : 1 }}
            >
              <p className="confession-thanks">Спасибо, что стала частью этой маленькой сказки.</p>
              <motion.button
                type="button"
                className="cinematic-button"
                onClick={onNext}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                ПЕРЕЙТИ К ФИЛЬМУ
                <ArrowRight size={17} strokeWidth={1.5} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
