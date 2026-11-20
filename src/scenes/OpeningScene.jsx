import IntroScene from '../components/IntroScene'

export default function OpeningScene({ onEnter, reducedMotion = false }) {
  return <IntroScene onEnter={onEnter} reducedMotion={reducedMotion} />
}
