import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import MovieEnding from './components/MovieEnding'
import MusicController from './components/MusicController'
import SceneTransition from './components/SceneTransition'
import StarrySky from './components/StarrySky'
import { useAudio } from './hooks/useAudio'
import { useSceneNavigation } from './hooks/useSceneNavigation'
import OpeningScene from './scenes/OpeningScene'
import KingdomScene from './scenes/KingdomScene'
import ForestScene from './scenes/ForestScene'
import CastleChapter from './scenes/CastleScene'
import ConfessionScene from './scenes/ConfessionScene'

function CinematicCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 180, damping: 24, mass: 0.35 })
  const springY = useSpring(y, { stiffness: 180, damping: 24, mass: 0.35 })

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined
    const handleMove = (event) => {
      x.set(event.clientX)
      y.set(event.clientY)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [x, y])

  return (
    <div className="cursor-layer" aria-hidden="true">
      <motion.div className="cursor-outer" style={{ x: springX, y: springY }}>
        <span />
      </motion.div>
      <motion.div className="cursor-inner" style={{ x, y }}>
        <span />
      </motion.div>
    </div>
  )
}

function ProgressRail({ chapters, current, onSelect }) {
  return (
    <nav className="progress-rail" aria-label="Прогресс истории">
      <div className="progress-line">
        <span style={{ height: `${((current + 1) / chapters.length) * 100}%` }} />
      </div>
      {chapters.map((chapter, index) => (
        <button
          key={chapter.key}
          type="button"
          className={`progress-dot ${index === current ? 'is-active' : ''} ${index < current ? 'is-complete' : ''}`}
          onClick={() => onSelect(index)}
          aria-label={`${chapter.label}, часть ${index + 1} из ${chapters.length}`}
          aria-current={index === current ? 'step' : undefined}
        >
          <span className="progress-dot-mark">{chapter.short}</span>
          <span className="progress-dot-label">{chapter.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const reducedMotion = Boolean(useReducedMotion())
  const navigation = useSceneNavigation(0)
  const audio = useAudio()
  const playTransitionRef = useRef(audio.playTransition)
  const lastSceneRef = useRef(navigation.sceneIndex)

  playTransitionRef.current = audio.playTransition

  useEffect(() => {
    if (lastSceneRef.current !== navigation.sceneIndex) {
      lastSceneRef.current = navigation.sceneIndex
      playTransitionRef.current()
    }
  }, [navigation.sceneIndex])

  const renderScene = () => {
    switch (navigation.sceneIndex) {
      case 0:
        return <OpeningScene onEnter={navigation.next} reducedMotion={reducedMotion} />
      case 1:
        return <KingdomScene onNext={navigation.next} reducedMotion={reducedMotion} />
      case 2:
        return <ForestScene onNext={navigation.next} reducedMotion={reducedMotion} />
      case 3:
        return <CastleChapter onNext={navigation.next} reducedMotion={reducedMotion} />
      case 4:
        return <StarrySky onNext={navigation.next} reducedMotion={reducedMotion} />
      case 5:
        return <ConfessionScene onNext={navigation.next} reducedMotion={reducedMotion} />
      default:
        return <MovieEnding onRestart={navigation.restart} />
    }
  }

  return (
    <div className="app-root">
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          <AnimatePresence mode="wait">
            <motion.main
              key={navigation.sceneIndex}
              className="scene-shell"
              initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.012 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.99 }}
              transition={{ duration: reducedMotion ? 0.12 : 0.65, ease: 'easeInOut' }}
            >
              {renderScene()}
            </motion.main>
          </AnimatePresence>

          {navigation.sceneIndex > 0 && (
            <ProgressRail
              chapters={navigation.chapters}
              current={navigation.sceneIndex}
              onSelect={navigation.goTo}
            />
          )}

          <MusicController audio={audio} />

          <AnimatePresence>
            {navigation.isTransitioning && <SceneTransition />}
          </AnimatePresence>

          <CinematicCursor />
        </>
      )}
    </div>
  )
}
