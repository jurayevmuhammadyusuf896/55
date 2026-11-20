import { useCallback, useEffect, useRef, useState } from 'react'
import { CHAPTERS } from '../data/storyData'

export function useSceneNavigation(initialIndex = 0) {
  const [sceneIndex, setSceneIndex] = useState(initialIndex)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const indexRef = useRef(initialIndex)
  const transitioningRef = useRef(false)
  const timersRef = useRef([])

  useEffect(() => {
    return () => {
      timersRef.current.forEach(window.clearTimeout)
      timersRef.current = []
    }
  }, [])

  const goTo = useCallback((target) => {
    const nextIndex = Math.max(0, Math.min(CHAPTERS.length - 1, target))
    if (nextIndex === indexRef.current || transitioningRef.current) return

    transitioningRef.current = true
    setIsTransitioning(true)

    timersRef.current.push(
      window.setTimeout(() => {
        indexRef.current = nextIndex
        setSceneIndex(nextIndex)
      }, 560)
    )

    timersRef.current.push(
      window.setTimeout(() => {
        transitioningRef.current = false
        setIsTransitioning(false)
      }, 1180)
    )
  }, [])

  const next = useCallback(() => goTo(indexRef.current + 1), [goTo])
  const previous = useCallback(() => goTo(indexRef.current - 1), [goTo])
  const restart = useCallback(() => goTo(0), [goTo])

  return {
    sceneIndex,
    scene: CHAPTERS[sceneIndex],
    chapters: CHAPTERS,
    isTransitioning,
    goTo,
    next,
    previous,
    restart,
    progress: (sceneIndex + 1) / CHAPTERS.length
  }
}
