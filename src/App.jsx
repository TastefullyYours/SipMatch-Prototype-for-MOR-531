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
import { LogIn, SignUp, Welcome } from './screens/Auth.jsx'
import { QuickPick, QuickResults, StartChoice } from './screens/Quick.jsx'
import { currentUser, logOut, updateUser } from './logic/accounts.js'

// App state lives here in React. Signed-in users' profile and saved drinks are also kept in this browser (logic/accounts.js).
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
const EMPTY_QUICK = { flavors: [], count: 3 }

const PROFILE_STEPS = ['palate', 'drinks', 'avoid', 'calibrate']
const QUIZ_STEPS = ['mood', 'occasion', 'tonight', 'dish']
const PREMIUM_STEPS = ['premium', 'cart', 'reverse', 'paywall']
const SIDE_STEPS = [...PREMIUM_STEPS, 'mydrinks'] // screens opened from the header that return where you were

// Where "Back" goes from each step.
const BACK = {
  age: 'welcome',
  signup: 'welcome',
  login: 'welcome',
  underage: 'welcome',
  intro: 'age',
  palate: 'intro',
  drinks: 'palate',
  avoid: 'drinks',
  calibrate: 'avoid',
  profileDone: 'calibrate',
  mood: 'start',
  quick: 'start',
  quickResults: 'quick',
  occasion: 'mood',
  tonight: 'occasion',
  dish: 'tonight',
  results: 'dish',
  cart: 'premium',
  reverse: 'premium',
}

// Desktop width per screen: full width for results-style screens, a readable column for questions.
const desktopWidth = (step) =>
  ['results', 'premium', 'mydrinks', 'intro', 'quickResults'].includes(step)
    ? ''
    : ['welcome', 'age', 'underage', 'login', 'signup'].includes(step)
      ? 'lg:max-w-md'
      : 'lg:max-w-3xl'

// A returning signed-in user picks up where they left off.
const restored = currentUser()

export default function App() {
  const [account, setAccount] = useState(restored?.email || null) // signed-in email, or null for guests
  const [step, setStep] = useState(restored ? (restored.profileDone ? 'start' : 'intro') : 'welcome')
  const [profile, setProfile] = useState(restored?.profile || { ...EMPTY_PROFILE, birthday: restored?.birthday || null })
  const [profileDone, setProfileDone] = useState(!!restored?.profileDone)
  const [quick, setQuick] = useState(EMPTY_QUICK)
  const [mood, setMood] = useState(EMPTY_MOOD)
  const [occasion, setOccasion] = useState(null)
  const [tonight, setTonight] = useState(EMPTY_TONIGHT)
  const [dish, setDish] = useState('')
  const [editing, setEditing] = useState(false) // editing profile from results
  const [premiumReturn, setPremiumReturn] = useState('mood') // where to go when leaving the premium area
  const [paywallReturn, setPaywallReturn] = useState('premium')
  const [saved, setSaved] = useState(restored?.saved || {}) // { [drinkId]: { rating: 0–5, note } }
  const [myDrinksReturn, setMyDrinksReturn] = useState('results')

  // Braces matter: newer Chrome returns a Promise from scrollTo, and an effect must not return anything but a cleanup function.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [step])

  // Keep the signed-in user's data saved in this browser.
  useEffect(() => {
    if (account) updateUser(account, { profile, saved, profileDone })
  }, [account, profile, saved, profileDone])

  const signIn = (user) => {
    setAccount(user.email)
    setProfile(user.profile || { ...EMPTY_PROFILE, birthday: user.birthday })
    setSaved(user.saved || {})
    setProfileDone(!!user.profileDone)
    setStep(user.profileDone ? 'start' : 'intro')
  }
  const signOut = () => {
    logOut()
    setAccount(null)
    setProfile(EMPTY_PROFILE)
    setSaved({})
    setProfileDone(false)
    setMood(EMPTY_MOOD)
    setOccasion(null)
    setTonight(EMPTY_TONIGHT)
    setDish('')
    setQuick(EMPTY_QUICK)
    setStep('welcome')
  }

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
    setQuick(EMPTY_QUICK)
    setStep('start')
  }

  // Skip the taste profile: matching still works, it just leans on tonight's answers.
  const skipProfile = () => {
    setProfileDone(true)
    setEditing(false)
    setStep('start')
  }

  // First time → the "Profile saved" screen; when editing → straight back to updated results.
  const finishProfile = () => {
    setProfileDone(true)
    setStep(editing ? 'results' : 'profileDone')
    setEditing(false)
  }
  const nextProfile = (current) => () => setStep(PROFILE_STEPS[PROFILE_STEPS.indexOf(current) + 1])

  let back = BACK[step] ? () => setStep(BACK[step]) : null
  if (step === 'intro' && account) back = null // signed-in users don't need the guest birthday screen
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

  const profileProps = { profile, setProfile, editing, onSave: finishProfile, onSkip: skipProfile }

  let screen
  switch (step) {
    case 'welcome':
      screen = <Welcome onSignUp={() => setStep('signup')} onLogIn={() => setStep('login')} onGuest={() => setStep('age')} />
      break
    case 'signup':
      screen = <SignUp onCreated={signIn} onUnderage={() => setStep('underage')} onLogIn={() => setStep('login')} />
      break
    case 'login':
      screen = <LogIn onLoggedIn={signIn} onSignUp={() => setStep('signup')} />
      break
    case 'start':
      screen = <StartChoice onQuick={() => setStep('quick')} onFull={() => setStep('mood')} account={account} onLogOut={signOut} />
      break
    case 'quick':
      screen = <QuickPick quick={quick} setQuick={setQuick} onNext={() => setStep('quickResults')} />
      break
    case 'quickResults':
      screen = (
        <QuickResults
          profile={profile}
          saved={saved}
          setSaved={setSaved}
          quick={quick}
          onChange={() => setStep('quick')}
          onFull={() => setStep('mood')}
          onStartOver={startOver}
        />
      )
      break
    case 'age':
      screen = (
        <AgeGate
          birthday={profile.birthday}
          setBirthday={(birthday) => setProfile({ ...profile, birthday })}
          onAdult={() => setStep(profileDone ? 'start' : 'intro')}
          onUnderage={() => setStep('underage')}
        />
      )
      break
    case 'underage':
      screen = <Underage onBack={() => setStep('welcome')} />
      break
    case 'intro':
      screen = <ProfileIntro onNext={() => setStep('palate')} onSkip={skipProfile} />
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
      screen = <ProfileDone profile={profile} onNext={() => setStep('start')} onEdit={() => setStep('palate')} />
      break
    case 'mood':
      screen = <Mood mood={mood} setMood={setMood} onNext={() => setStep('occasion')} onSkip={() => setStep('occasion')} />
      break
    case 'occasion':
      screen = <Occasion occasion={occasion} setOccasion={setOccasion} onNext={() => setStep('tonight')} onSkip={() => setStep('tonight')} />
      break
    case 'tonight':
      screen = <Tonight tonight={tonight} setTonight={setTonight} onNext={() => setStep('dish')} onSkip={() => setStep('dish')} />
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
        step !== 'welcome' && (
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
      <div key={step} className={`mx-auto flex w-full flex-1 flex-col animate-[fadeIn_.25s_ease-out] ${desktopWidth(step)}`}>
        {screen}
      </div>
    </Shell>
  )
}
