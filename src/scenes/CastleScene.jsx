import CastleScene from '../components/CastleScene'

export default function CastleChapter({ onNext, reducedMotion = false }) {
  return <CastleScene onNext={onNext} reducedMotion={reducedMotion} />
}
