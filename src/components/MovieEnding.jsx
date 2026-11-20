import { motion } from 'framer-motion'
import { Clapperboard, Clock3, RotateCcw, Sparkles } from 'lucide-react'
import { CREDIT, MOVIE_INTRO } from '../data/storyData'
import { MOVIE } from '../data/movieData'

const LANTERNS = Array.from({ length: 22 }, (_, index) => ({
  left: 8 + ((index * 37) % 84),
  top: 16 + ((index * 29) % 58),
  delay: (index % 7) * 0.55,
  scale: 0.55 + (index % 5) * 0.16
}))

export default function MovieEnding({ onRestart }) {
  return (
    <section className="cinematic-scene movie-scene">
      <div className="cinema-room" aria-hidden="true">
        <div className="cinema-ceiling" />
        <div className="cinema-curtain cinema-curtain-left" />
        <div className="cinema-curtain cinema-curtain-right" />
        <div className="cinema-seats" />
      </div>

      <div className="scene-content movie-content">
        <motion.div
          className="movie-heading"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="chapter-number">Эпилог</span>
          <p className="movie-intro">{MOVIE_INTRO}</p>
          <h2 className="gold-title chapter-title">История о настоящих чувствах</h2>
        </motion.div>

        <motion.div
          className="cinema-screen"
          initial={{ opacity: 0, scale: 0.96, y: 22 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.35 }}
        >
          <div className="screen-glow" />

          <div className="movie-poster" aria-label="Оригинальная визуализация сцены с летающими фонарями">
            <div className="poster-art">
              {LANTERNS.map((lantern, index) => (
                <span
                  key={index}
                  className="poster-lantern"
                  style={{
                    left: `${lantern.left}%`,
                    top: `${lantern.top}%`,
                    animationDelay: `${lantern.delay}s`,
                    '--s': lantern.scale
                  }}
                />
              ))}
              <div className="poster-horizon" />
              <div className="poster-water" />
            </div>
            <div className="poster-caption">
              <span>Оригинальная визуализация</span>
              <strong>{MOVIE.title}</strong>
              <span>{MOVIE.year}</span>
            </div>
          </div>

          <div className="movie-details">
            <div className="movie-title-row">
              <Clapperboard size={21} strokeWidth={1.4} />
              <h3>{MOVIE.title}</h3>
            </div>
            <div className="movie-meta">
              <span>{MOVIE.year}</span>
              <span className="meta-dot">✦</span>
              <span>{MOVIE.genre}</span>
            </div>

            <p className="movie-description">{MOVIE.description}</p>

            <div className="movie-scene-block">
              <span className="movie-block-label">Выбранная сцена</span>
              <h4>{MOVIE.sceneTitle}</h4>
              <div className="movie-timestamp">
                <Clock3 size={16} strokeWidth={1.6} />
                <strong>{MOVIE.timestamp}</strong>
                <span>{MOVIE.timestampLabel}</span>
              </div>
            </div>

            <div className="movie-meaning">
              <span className="movie-block-label">Почему эта сцена важна</span>
              <p>{MOVIE.meaning}</p>
            </div>

            <p className="movie-note">{MOVIE.note}</p>
            <p className="movie-art-note">{MOVIE.artNote}</p>
          </div>
        </motion.div>

        <motion.div
          className="movie-ending-actions"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.9 }}
        >
          <motion.button
            type="button"
            className="cinematic-button"
            onClick={onRestart}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <RotateCcw size={16} strokeWidth={1.5} />
            НАЧАТЬ ИСТОРИЮ СНАЧАЛА
          </motion.button>
          <p className="movie-soft-line"><Sparkles size={14} /> Ты всегда можешь вернуться в этот маленький мир.</p>
        </motion.div>

        <motion.footer
          className="author-credit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1.2 }}
        >
          {CREDIT}
        </motion.footer>
      </div>
    </section>
  )
}
