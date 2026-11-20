import FinalConfession from '../components/FinalConfession'

export default function ConfessionScene({ onNext, reducedMotion = false }) {
  return <FinalConfession onNext={onNext} reducedMotion={reducedMotion} />
}
