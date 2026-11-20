import { motion } from 'framer-motion'

export default function SceneTransition() {
  return (
    <motion.div
      className="scene-transition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.42, ease: 'easeInOut' }}
    >
      <motion.div
        className="scene-transition-panel scene-transition-panel-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="scene-transition-panel scene-transition-panel-bottom"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="scene-transition-light"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        exit={{ opacity: 0, scaleX: 0 }}
        transition={{ duration: 0.55 }}
      />
      <motion.span
        className="scene-transition-word"
        initial={{ opacity: 0, filter: 'blur(8px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(8px)' }}
        transition={{ delay: 0.16, duration: 0.42 }}
      >
        ИСТОРИЯ ПРОДОЛЖАЕТСЯ
      </motion.span>
    </motion.div>
  )
}
