import { useCallback, useEffect, useRef, useState } from 'react'

const NOTE_SET = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25]

export function useAudio() {
  const [enabled, setEnabled] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const contextRef = useRef(null)
  const masterRef = useRef(null)
  const persistentRef = useRef([])
  const schedulerRef = useRef(null)
  const noteIndexRef = useRef(0)
  const mutedRef = useRef(false)

  const createContext = useCallback(() => {
    if (contextRef.current) return contextRef.current
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return null

    const context = new AudioContextClass()
    const master = context.createGain()
    master.gain.value = 0.0001
    master.connect(context.destination)

    const padFilter = context.createBiquadFilter()
    padFilter.type = 'lowpass'
    padFilter.frequency.value = 760
    const padGain = context.createGain()
    padGain.gain.value = 0.12
    padFilter.connect(padGain)
    padGain.connect(master)

    const chord = [130.81, 196, 261.63, 329.63]
    chord.forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      oscillator.type = index % 2 === 0 ? 'sine' : 'triangle'
      oscillator.frequency.value = frequency
      const voiceGain = context.createGain()
      voiceGain.gain.value = index === 0 ? 0.5 : 0.24
      oscillator.connect(voiceGain)
      voiceGain.connect(padFilter)

      const lfo = context.createOscillator()
      lfo.frequency.value = 0.045 + index * 0.017
      const lfoGain = context.createGain()
      lfoGain.gain.value = 1.4
      lfo.connect(lfoGain)
      lfoGain.connect(oscillator.frequency)

      oscillator.start()
      lfo.start()
      persistentRef.current.push(oscillator, lfo)
    })

    const noiseBuffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate)
    const channel = noiseBuffer.getChannelData(0)
    for (let i = 0; i < channel.length; i += 1) {
      channel[i] = (Math.random() * 2 - 1) * 0.6
    }
    const noise = context.createBufferSource()
    noise.buffer = noiseBuffer
    noise.loop = true
    const noiseFilter = context.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.value = 1600
    noiseFilter.Q.value = 0.5
    const noiseGain = context.createGain()
    noiseGain.gain.value = 0.018
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(master)
    noise.start()
    persistentRef.current.push(noise)

    const shimmer = context.createOscillator()
    shimmer.type = 'sine'
    shimmer.frequency.value = 1046.5
    const shimmerGain = context.createGain()
    shimmerGain.gain.value = 0.003
    const shimmerLfo = context.createOscillator()
    shimmerLfo.frequency.value = 0.12
    const shimmerLfoGain = context.createGain()
    shimmerLfoGain.gain.value = 0.003
    shimmer.connect(shimmerGain)
    shimmerGain.connect(master)
    shimmerLfo.connect(shimmerLfoGain)
    shimmerLfoGain.connect(shimmerGain.gain)
    shimmer.start()
    shimmerLfo.start()
    persistentRef.current.push(shimmer, shimmerLfo)

    contextRef.current = context
    masterRef.current = master
    return context
  }, [])

  const playNote = useCallback((frequency, duration = 2.8, delay = 0) => {
    const context = contextRef.current
    const master = masterRef.current
    if (!context || !master || context.state !== 'running') return

    const start = context.currentTime + delay
    const oscillator = context.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, start)

    const overtone = context.createOscillator()
    overtone.type = 'triangle'
    overtone.frequency.setValueAtTime(frequency * 2, start)

    const gain = context.createGain()
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.055, start + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)

    const overtoneGain = context.createGain()
    overtoneGain.gain.setValueAtTime(0.0001, start)
    overtoneGain.gain.exponentialRampToValueAtTime(0.012, start + 0.04)
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, start + duration * 0.7)

    oscillator.connect(gain)
    overtone.connect(overtoneGain)
    gain.connect(master)
    overtoneGain.connect(master)
    oscillator.start(start)
    overtone.start(start)
    oscillator.stop(start + duration + 0.1)
    overtone.stop(start + duration + 0.1)
  }, [])

  const schedulePhrase = useCallback(() => {
    const index = noteIndexRef.current
    const first = NOTE_SET[index % NOTE_SET.length]
    const second = NOTE_SET[(index + 2) % NOTE_SET.length]
    playNote(first, 3.2, 0)
    playNote(second, 3.6, 1.1)
    noteIndexRef.current += 1
  }, [playNote])

  const stopScheduler = useCallback(() => {
    if (schedulerRef.current) {
      window.clearInterval(schedulerRef.current)
      schedulerRef.current = null
    }
  }, [])

  const setMasterLevel = useCallback((level, ramp = 0.8) => {
    const context = contextRef.current
    const master = masterRef.current
    if (!context || !master) return
    const now = context.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now)
    master.gain.linearRampToValueAtTime(Math.max(level, 0.0001), now + ramp)
  }, [])

  const enable = useCallback(async () => {
    const context = createContext()
    if (!context) return
    if (context.state === 'suspended') {
      await context.resume()
    }
    setEnabled(true)
    setPlaying(true)
    setMasterLevel(mutedRef.current ? 0 : 0.85, 1.4)
    schedulePhrase()
    stopScheduler()
    schedulerRef.current = window.setInterval(schedulePhrase, 5200)
  }, [createContext, schedulePhrase, setMasterLevel, stopScheduler])

  const pause = useCallback(() => {
    const context = contextRef.current
    if (!context) return
    stopScheduler()
    setMasterLevel(0, 0.5)
    window.setTimeout(() => {
      if (contextRef.current === context && context.state === 'running') {
        context.suspend().catch(() => {})
      }
    }, 600)
    setPlaying(false)
  }, [setMasterLevel, stopScheduler])

  const resume = useCallback(async () => {
    const context = contextRef.current
    if (!context) {
      await enable()
      return
    }
    if (context.state === 'suspended') {
      await context.resume()
    }
    setMasterLevel(mutedRef.current ? 0 : 0.85, 0.9)
    schedulePhrase()
    stopScheduler()
    schedulerRef.current = window.setInterval(schedulePhrase, 5200)
    setPlaying(true)
  }, [enable, schedulePhrase, setMasterLevel, stopScheduler])

  const toggle = useCallback(() => {
    if (!enabled || !playing) {
      resume()
    } else {
      pause()
    }
  }, [enabled, pause, playing, resume])

  const toggleMute = useCallback(() => {
    const nextMuted = !mutedRef.current
    mutedRef.current = nextMuted
    setMuted(nextMuted)
    setMasterLevel(nextMuted ? 0 : enabled && playing ? 0.85 : 0, 0.3)
  }, [enabled, playing, setMasterLevel])

  const playTransition = useCallback(() => {
    if (!enabled || !playing || mutedRef.current) return
    playNote(659.25, 1.4, 0)
    playNote(987.77, 1.8, 0.12)
  }, [enabled, playNote, playing])

  useEffect(() => {
    return () => {
      stopScheduler()
      persistentRef.current.forEach((node) => {
        try {
          node.stop()
        } catch {
          return
        }
      })
      contextRef.current?.close().catch(() => {})
    }
  }, [stopScheduler])

  return {
    enabled,
    playing,
    muted,
    toggle,
    toggleMute,
    playTransition
  }
}
