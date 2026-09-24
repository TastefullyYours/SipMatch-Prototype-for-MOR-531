import { useEffect, useState } from 'react'
import { Header, Shell } from './components/Layout.jsx'
import { AgeGate, Underage } from './screens/AgeGate.jsx'
import { ProfileAvoid, ProfileCalibrate, ProfileDrinks, ProfilePalate } from './screens/Onboarding.jsx'
import { Dish, Mood, Occasion, Tonight } from './screens/Flow.jsx'
import Results from './screens/Results.jsx'
import Premium from './screens/Premium.jsx'
import CartPhoto from './screens/CartPhoto.jsx'
import ReverseFlow from './screens/ReverseFlow.jsx'
import Paywall from './screens/Paywall.jsx'
import { DEFAULT_CATEGORIES } from './data/options.js'

// All state lives here in React (no backend, no browser storage).
// Profile = who you are and what you like (asked once, editable).
const EMPTY_PROFILE = {
  birthday: null,
  likes: [],
  dislikes: [],
  sweetness: null,
  categories: DEFAULT_CATEGORIES,
  abvMax: null,
  restrictions: [],
  loved: [],
  hated: [],
}
// Matching quiz = tonight's context (asked every time).
const EMPTY_MOOD = { feeling: null, social: null }
const EMPTY_TONIGHT = { budget: null, temp: 'any', fizz: 'any', body: 'any' }

const PROFILE_STEPS = ['palate', 'drinks', 'avoid', 'calibrate']
const QUIZ_STEPS = ['mood', 'occasion', 'tonight', 'dish']
const PREMIUM_STEPS = ['premium', 'cart', 'reverse', 'paywall']

// Where "Back" goes from each step.
const BACK = {
  underage: 'age',
  palate: 'age',
  drinks: 'palate',
  avoid: 'drinks',
  calibrate: 'avoid',
  occasion: 'mood',
  tonight: 'occasion',
  dish: 'tonight',
  results: 'dish',
  cart: 'premium',
  reverse: 'premium',
}

export default function App() {
  const [step, setStep] = useState('age')
  const [profile, setProfile] = useState(EMPTY_PROFILE)
  const [profileDone, setProfileDone] = useState(false)
  const [mood, setMood] = useState(EMPTY_MOOD)
  const [occasion, setOccasion] = useState(null)
  const [tonight, setTonight] = useState(EMPTY_TONIGHT)
  const [dish, setDish] = useState('')
  const [editing, setEditing] = useState(false) // editing profile from results
  const [premiumReturn, setPremiumReturn] = useState('mood') // where to go when leaving the premium area
  const [paywallReturn, setPaywallReturn] = useState('premium')

  useEffect(() => window.scrollTo(0, 0), [step])

  const onboarded = profileDone && !PROFILE_STEPS.includes(step)
  const openPremium = () => {
    if (!PREMIUM_STEPS.includes(step)) setPremiumReturn(step)
    setStep('premium')
  }
  const openPaywall = () => {
    if (!PREMIUM_STEPS.includes(step)) setPremiumReturn(step)
    setPaywallReturn(step)
    setStep('paywall')
  }

  // Start a new match: keeps the profile, clears tonight's answers.
  const startOver = () => {
    setMood(EMPTY_MOOD)
    setOccasion(null)
    setTonight(EMPTY_TONIGHT)
    setDish('')
    setStep('mood')
  }

  const finishProfile = () => {
    setProfileDone(true)
    setStep(editing ? 'results' : 'mood')
    setEditing(false)
  }
  const nextProfile = (current) => () => setStep(PROFILE_STEPS[PROFILE_STEPS.indexOf(current) + 1])

  let back = BACK[step] ? () => setStep(BACK[step]) : null
  if (editing && step === 'palate')
    back = () => {
      setEditing(false)
      setStep('results')
    }
  if (step === 'mood' && !profileDone) back = () => setStep('calibrate')
  if (step === 'premium') back = () => setStep(premiumReturn)
  if (step === 'paywall') back = () => setStep(paywallReturn)

  // One progress bar across profile (first time only) + quiz.
  const flowSteps = profileDone && !editing ? QUIZ_STEPS : [...PROFILE_STEPS, ...QUIZ_STEPS]
  const progressIndex = editing ? -1 : flowSteps.indexOf(step)
  const progress = progressIndex >= 0 ? (progressIndex + 1) / (flowSteps.length + 1) : null

  const profileProps = { profile, setProfile, editing, onSave: finishProfile }

  let screen
  switch (step) {
    case 'age':
      screen = (
        <AgeGate
          birthday={profile.birthday}
          setBirthday={(birthday) => setProfile({ ...profile, birthday })}
          onAdult={() => setStep('palate')}
          onUnderage={() => setStep('underage')}
        />
      )
      break
    case 'underage':
      screen = <Underage onBack={() => setStep('age')} />
      break
    case 'palate':
      screen = <ProfilePalate {...profileProps} onNext={nextProfile('palate')} />
      break
    case 'drinks':
      screen = <ProfileDrinks {...profileProps} onNext={nextProfile('drinks')} />
      break
    case 'avoid':
      screen = <ProfileAvoid {...profileProps} onNext={nextProfile('avoid')} />
      break
    case 'calibrate':
      screen = <ProfileCalibrate {...profileProps} onNext={finishProfile} />
      break
    case 'mood':
      screen = <Mood mood={mood} setMood={setMood} onNext={() => setStep('occasion')} />
      break
    case 'occasion':
      screen = <Occasion occasion={occasion} setOccasion={setOccasion} onNext={() => setStep('tonight')} />
      break
    case 'tonight':
      screen = <Tonight tonight={tonight} setTonight={setTonight} onNext={() => setStep('dish')} />
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
          tonight={tonight}
          dish={dish}
          onChangeDish={() => setStep('dish')}
          onChangeTonight={() => setStep('tonight')}
          onStartOver={startOver}
          onEditProfile={() => {
            setEditing(true)
            setStep('palate')
          }}
          onPremium={openPremium}
        />
      )
      break
    case 'premium':
      screen = <Premium onCart={() => setStep('cart')} onReverse={() => setStep('reverse')} onPaywall={openPaywall} />
      break
    case 'cart':
      screen = <CartPhoto onUpgrade={openPaywall} />
      break
    case 'reverse':
      screen = <ReverseFlow onUpgrade={openPaywall} />
      break
    case 'paywall':
      screen = <Paywall onClose={() => setStep(paywallReturn)} />
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
            onPremium={onboarded && !PREMIUM_STEPS.includes(step) ? openPremium : null}
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
