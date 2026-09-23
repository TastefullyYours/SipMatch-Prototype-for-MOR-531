import { useEffect, useState } from 'react'
import { Header, Shell } from './components/Layout.jsx'
import { AgeGate, Underage } from './screens/AgeGate.jsx'
import { OnboardingBasics, OnboardingTaste } from './screens/Onboarding.jsx'
import { Dish, Mood, Occasion } from './screens/Flow.jsx'
import Results from './screens/Results.jsx'

// All state lives here in React (no backend, no browser storage).
const EMPTY_PROFILE = { ageGroup: null, budget: null, sweetness: null, tastes: [], dislikes: [] }
const EMPTY_MOOD = { feeling: null, social: null }

// Steps that show the progress bar, in order.
const PROGRESS_STEPS = ['basics', 'taste', 'mood', 'occasion', 'dish']

// Where "Back" goes from each step.
const BACK = { underage: 'age', taste: 'basics', occasion: 'mood', dish: 'occasion' }

export default function App() {
  const [step, setStep] = useState('age')
  const [profile, setProfile] = useState(EMPTY_PROFILE)
  const [mood, setMood] = useState(EMPTY_MOOD)
  const [occasion, setOccasion] = useState(null)
  const [dish, setDish] = useState('')
  const [editing, setEditing] = useState(false) // editing profile from results
  const [premiumReturn, setPremiumReturn] = useState('mood')

  useEffect(() => window.scrollTo(0, 0), [step])

  const onboarded = profile.sweetness && !['age', 'underage', 'basics', 'taste'].includes(step)
  const openPremium = () => {
    setPremiumReturn(step)
    setStep('premium')
  }

  const startOver = () => {
    setMood(EMPTY_MOOD)
    setOccasion(null)
    setDish('')
    setStep('mood')
  }

  let back = BACK[step] ? () => setStep(BACK[step]) : null
  if (step === 'basics' && editing) back = () => {
    setEditing(false)
    setStep('results')
  }
  if (step === 'taste' && editing) back = () => setStep('basics')
  if (step === 'results') back = () => setStep('dish')

  const progressIndex = PROGRESS_STEPS.indexOf(step)
  const progress = progressIndex >= 0 && !editing ? (progressIndex + 1) / (PROGRESS_STEPS.length + 1) : null

  let screen
  switch (step) {
    case 'age':
      screen = <AgeGate onYes={() => setStep('basics')} onNo={() => setStep('underage')} />
      break
    case 'underage':
      screen = <Underage onBack={() => setStep('age')} />
      break
    case 'basics':
      screen = <OnboardingBasics profile={profile} setProfile={setProfile} editing={editing} onNext={() => setStep('taste')} />
      break
    case 'taste':
      screen = (
        <OnboardingTaste
          profile={profile}
          setProfile={setProfile}
          editing={editing}
          onNext={() => {
            setStep(editing ? 'results' : 'mood')
            setEditing(false)
          }}
        />
      )
      break
    case 'mood':
      screen = <Mood mood={mood} setMood={setMood} onNext={() => setStep('occasion')} />
      break
    case 'occasion':
      screen = (
        <Occasion
          occasion={occasion}
          setOccasion={setOccasion}
          onNext={() => {
            setStep('dish')
          }}
        />
      )
      break
    case 'dish':
      screen = (
        <Dish
          dish={dish}
          setDish={setDish}
          occasion={occasion}
          onNext={() => setStep('results')}
          onSkip={() => {
            setDish('')
            setStep('results')
          }}
        />
      )
      break
    case 'results':
      screen = (
        <Results
          profile={profile}
          mood={mood}
          occasion={occasion}
          dish={dish}
          onChangeDish={() => setStep('dish')}
          onStartOver={startOver}
          onEditProfile={() => {
            setEditing(true)
            setStep('basics')
          }}
          onPremium={openPremium}
        />
      )
      break
    default:
      screen = null
  }

  return (
    <Shell
      header={
        step !== 'age' && (
          <Header
            onBack={back}
            onLogo={onboarded ? startOver : null}
            onPremium={onboarded && step !== 'premium' ? openPremium : null}
            progress={progress}
          />
        )
      }
    >
      <div key={step} className="flex flex-1 flex-col animate-[fadeIn_.25s_ease-out]">
        {screen}
      </div>
    </Shell>
  )
}
