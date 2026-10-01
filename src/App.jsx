import { useEffect, useState } from 'react'
import { Header, Shell } from './components/Layout.jsx'
import { AgeGate, Underage } from './screens/AgeGate.jsx'
import { ProfileAvoid, ProfileCalibrate, ProfileDone, ProfileDrinks, ProfileIntro, ProfilePalate } from './screens/Onboarding.jsx'
import { Dish, Mood, Occasion, Tonight } from './screens/Flow.jsx'
import Results from './screens/Results.jsx'
import Premium from './screens/Premium.jsx'
import CartPhoto from './screens/CartPhoto.jsx'
import ReverseFlow from './screens/ReverseFlow.jsx'
import Paywall from './screens/Paywall.jsx'
import MyDrinks from './screens/MyDrinks.jsx'

// All state lives here in React (no backend, no browser storage).
// Profile = who you are and what you like (asked once, editable).
const EMPTY_PROFILE = {
  birthday: null,
  likes: [],
  dislikes: [],
  sweetness: [], // multi-select levels 1–5
  categories: [], // multi-select: beer, wine, spirits, cocktails, na
  strengths: [], // multi-select: low, medium, high
  restrictions: [],
  loved: [],
  hated: [],
}
// Matching quiz = tonight's context (asked every time).
const EMPTY_MOOD = { feeling: null, social: null }
const EMPTY_TONIGHT = { budgets: [], temp: 'any', fizz: 'any', body: 'any' }

const PROFILE_STEPS = ['palate', 'drinks', 'avoid', 'calibrate']
const QUIZ_STEPS = ['mood', 'occasion', 'tonight', 'dish']
const PREMIUM_STEPS = ['premium', 'cart', 'reverse', 'paywall']
const SIDE_STEPS = [...PREMIUM_STEPS, 'mydrinks'] // screens opened from the header that return where you were

// Where "Back" goes from each step.
const BACK = {
  underage: 'age',
  intro: 'age',
  palate: 'intro',
  drinks: 'palate',
  avoid: 'drinks',
  calibrate: 'avoid',
  profileDone: 'calibrate',
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
  const [saved, setSaved] = useState({}) // { [drinkId]: { rating: 0–5, note } }
  const [myDrinksReturn, setMyDrinksReturn] = useState('results')

  useEffect(() => window.scrollTo(0, 0), [step])

  const onboarded = profileDone && !PROFILE_STEPS.includes(step) && step !== 'profileDone'
  const openPremium = () => {
    if (!PREMIUM_STEPS.includes(step)) setPremiumReturn(step)
    setStep('premium')
  }
  const openMyDrinks = () => {
    if (!SIDE_STEPS.includes(step)) setMyDrinksReturn(step)
    setStep('mydrinks')
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

  // First time → the "Profile saved" screen; when editing → straight back to updated results.
  const finishProfile = () => {
    setProfileDone(true)
    setStep(editing ? 'results' : 'profileDone')
    setEditing(false)
  }
  const nextProfile = (current) => () => setStep(PROFILE_STEPS[PROFILE_STEPS.indexOf(current) + 1])

  let back = BACK[step] ? () => setStep(BACK[step]) : null
  if (editing && step === 'palate')
    back = () => {
      setEditing(false)
      setStep('results')
    }
  if (step === 'premium') back = () => setStep(premiumReturn)
  if (step === 'paywall') back = () => setStep(paywallReturn)
  if (step === 'mydrinks') back = () => setStep(myDrinksReturn)

  // The profile and the quiz each get their own labelled progress bar.
  const phase = PROFILE_STEPS.includes(step)
    ? { kind: 'profile', step: PROFILE_STEPS.indexOf(step) + 1, total: PROFILE_STEPS.length, editing }
    : QUIZ_STEPS.includes(step)
      ? { kind: 'quiz', step: QUIZ_STEPS.indexOf(step) + 1, total: QUIZ_STEPS.length }
      : null

  const profileProps = { profile, setProfile, editing, onSave: finishProfile }

  let screen
  switch (step) {
    case 'age':
      screen = (
        <AgeGate
          birthday={profile.birthday}
          setBirthday={(birthday) => setProfile({ ...profile, birthday })}
          onAdult={() => setStep(profileDone ? 'mood' : 'intro')}
          onUnderage={() => setStep('underage')}
        />
      )
      break
    case 'underage':
      screen = <Underage onBack={() => setStep('age')} />
      break
    case 'intro':
      screen = <ProfileIntro onNext={() => setStep('palate')} />
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
    case 'profileDone':
      screen = <ProfileDone profile={profile} onNext={() => setStep('mood')} onEdit={() => setStep('palate')} />
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
          saved={saved}
          setSaved={setSaved}
          onMyDrinks={openMyDrinks}
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
    case 'mydrinks':
      screen = <MyDrinks saved={saved} setSaved={setSaved} onBack={() => setStep(myDrinksReturn)} />
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
            onMyDrinks={onboarded && step !== 'mydrinks' ? openMyDrinks : null}
            savedCount={Object.keys(saved).length}
            phase={phase}
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
