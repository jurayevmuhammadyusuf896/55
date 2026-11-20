import { AnimatePresence, motion } from 'framer-motion'
import { Heart, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LETTER } from '../data/storyData'

export function SealedEnvelope() {
  return (
    <div className="envelope-wrap">
      <div className="envelope-shadow" />
      <div className="envelope-body">
        <div className="envelope-fold envelope-fold-left" />
        <div className="envelope-fold envelope-fold-right" />
        <div className="envelope-flap-static" />
        <div className="wax-seal">
          <Heart size={20} fill="currentColor" strokeWidth={1.2} />
        </div>
      </div>
    </div>
  )
}

export default function SecretLetter({ open, onClose, reducedMotion = false }) {
  const [showLetter, setShowLetter] = useState(false)

  useEffect(() => {
    if (!open) {
      setShowLetter(false)
      return undefined
    }
    const timer = window.setTimeout(() => setShowLetter(true), reducedMotion ? 120 : 900)
    return () => window.clearTimeout(timer)
  }, [open, reducedMotion])

  if (!open) return null

  return (
    <div className="letter-stage">
      <AnimatePresence mode="wait">
        {!showLetter ? (
          <motion.div
            key="envelope-opening"
            className="envelope-opening"
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ duration: reducedMotion ? 0.15 : 0.8 }}
          >
            <div className="envelope-wrap">
              <div className="envelope-shadow" />
              <div className="envelope-body">
                <div className="envelope-fold envelope-fold-left" />
                <div className="envelope-fold envelope-fold-right" />
                <motion.div
                  className="envelope-flap"
                  style={{ transformOrigin: 'top center' }}
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: -165 }}
                  transition={{ duration: reducedMotion ? 0.15 : 0.9, ease: [0.76, 0, 0.24, 1] }}
                />
                <motion.div
                  className="wax-seal"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0.15 : 0.5, delay: reducedMotion ? 0 : 0.35 }}
                >
                  <Heart size={20} fill="currentColor" strokeWidth={1.2} />
                </motion.div>
              </div>
            </div>
            <p className="envelope-caption">Письмо открывается...</p>
          </motion.div>
        ) : (
          <motion.div
            key="letter-paper"
            className="letter-paper"
            initial={{ opacity: 0, y: 46, rotateX: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: reducedMotion ? 0.15 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <button type="button" className="letter-close" onClick={onClose} aria-label="Закрыть письмо">
              <X size={17} />
            </button>
            <div className="letter-ornament">✦</div>
            {LETTER.map((paragraph, index) => (
              <p key={index} className={index === 0 ? 'letter-greeting' : index === LETTER.length - 1 ? 'letter-signature' : ''}>
                {paragraph}
              </p>
            ))}
            <div className="letter-ornament letter-ornament-bottom">✦</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
