import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { CASTLE_LINE } from '../data/storyData'
import FantasyWorld from './FantasyWorld'
import SecretLetter, { SealedEnvelope } from './SecretLetter'

export default function CastleScene({ onNext, reducedMotion = false }) {
  const [doorsOpen, setDoorsOpen] = useState(false)
  const [letterOpen, setLetterOpen] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const openLetter = () => {
    setDoorsOpen(true)
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setLetterOpen(true), reducedMotion ? 200 : 1050)
  }

  return (
    <section className="cinematic-scene chapter-scene castle-scene">
      <FantasyWorld variant="castle" doorsOpen={doorsOpen} reducedMotion={reducedMotion} />

      <div className="scene-content chapter-content castle-content">
        <AnimatePresence>
          {!letterOpen && (
            <motion.div
              key="castle-intro"
              className="castle-intro"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: reducedMotion ? 0.15 : 1 }}
            >
              <span className="chapter-number">Глава четвёртая</span>
              <h2 className="gold-title chapter-title">Замок тайн</h2>
              <div className="castle-envelope-holder">
                <SealedEnvelope />
              </div>
              <p className="story-line castle-line">{CASTLE_LINE}</p>
              <motion.button
                type="button"
                className="cinematic-button"
                onClick={openLetter}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Sparkles size={16} strokeWidth={1.5} />
                ОТКРЫТЬ ПИСЬМО
              </motion.button>
              {doorsOpen && !letterOpen && <span className="castle-status">Двери медленно открываются...</span>}
            </motion.div>
          )}
        </AnimatePresence>

        <SecretLetter
          open={letterOpen}
          onClose={() => setLetterOpen(false)}
          reducedMotion={reducedMotion}
        />

        <AnimatePresence>
          {letterOpen && (
            <motion.div
              className="chapter-action letter-action"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: reducedMotion ? 0 : 1.3, duration: 0.7 }}
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
