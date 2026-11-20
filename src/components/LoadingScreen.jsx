import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const start = performance.now()
    let done = false
    let finishTimer

    const timer = window.setInterval(() => {
      const next = Math.min(100, Math.round(((performance.now() - start) / 1550) * 100))
      setProgress(next)
      if (next === 100 && !done) {
        done = true
        window.clearInterval(timer)
        finishTimer = window.setTimeout(() => onCompleteRef.current?.(), 420)
      }
    }, 35)

    return () => {
      window.clearInterval(timer)
      window.clearTimeout(finishTimer)
    }
  }, [])

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="loading-aura" />
      <motion.div
        className="loading-symbol"
        initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      >
        <Sparkles size={26} strokeWidth={1.2} />
      </motion.div>
      <motion.h1
        className="loading-title"
        initial={{ opacity: 0, letterSpacing: '0.8em' }}
        animate={{ opacity: 1, letterSpacing: '0.24em' }}
        transition={{ duration: 1.6, delay: 0.2 }}
      >
        МАЛИКА
      </motion.h1>
      <p className="loading-subtitle">Мир пробуждается...</p>
      <div className="loading-track">
        <motion.div
          className="loading-fill"
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'linear', duration: 0.08 }}
        />
      </div>
      <span className="loading-percent">{progress}%</span>
    </motion.div>
  )
}
