import { motion } from 'framer-motion'
import { Music2, Pause, Play, Volume2, VolumeX } from 'lucide-react'

export default function MusicController({ audio }) {
  const label = !audio.enabled
    ? 'Включить музыку'
    : audio.playing
      ? 'Приостановить музыку'
      : 'Продолжить музыку'

  return (
    <motion.div
      className="music-controller"
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8, duration: 0.8 }}
    >
      <motion.button
        className="music-main"
        type="button"
        onClick={audio.toggle}
        aria-label={label}
        title={label}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        {!audio.enabled || !audio.playing ? <Play size={17} fill="currentColor" /> : <Pause size={17} fill="currentColor" />}
      </motion.button>
      <div className="music-copy">
        <span className="music-label">{!audio.enabled ? 'Музыка выключена' : audio.playing ? 'Музыка играет' : 'Пауза'}</span>
        <span className="music-icon"><Music2 size={12} /></span>
      </div>
      <motion.button
        className={`music-mute ${audio.muted ? 'is-muted' : ''}`}
        type="button"
        onClick={audio.toggleMute}
        disabled={!audio.enabled}
        aria-label={audio.muted ? 'Включить звук' : 'Выключить звук'}
        title={audio.muted ? 'Включить звук' : 'Выключить звук'}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        {audio.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </motion.button>
    </motion.div>
  )
}
