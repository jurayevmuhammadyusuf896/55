import MagicalForest from '../components/MagicalForest'

export default function ForestScene({ onNext, reducedMotion = false }) {
  return <MagicalForest onNext={onNext} reducedMotion={reducedMotion} />
}
