import { useState } from 'react'
import BirthdayField from '../components/BirthdayField.jsx'
import { readBirthday } from '../logic/birthday.js'
import { Button, ScreenTitle } from '../components/ui.jsx'
import { createAccount, logIn } from '../logic/accounts.js'

const inputClass =
  'w-full rounded-2xl border-2 border-berry/15 bg-cream px-4 py-3 outline-none placeholder:text-muted/60 focus:border-berry'

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between text-sm font-semibold">
        {label}
        {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
      </span>
      {children}
    </label>
  )
}

const DemoNote = () => (
  <p className="mt-4 rounded-2xl bg-gold/15 p-3 text-xs leading-relaxed text-ink/70">
    🔒 Prototype accounts are saved only in this browser on this device. Passwords are scrambled before saving, but please don't reuse a real password.
  </p>
)

export function Welcome({ onSignUp, onLogIn, onGuest }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
      <div className="mb-6 flex gap-1 text-5xl">
        <span>🍷</span>
        <span>🍺</span>
        <span>🍸</span>
      </div>
      <h1 className="font-display text-5xl font-bold text-berry">SipMatch</h1>
      <p className="mt-2 font-display text-xl text-ink">A Match for Every Meal</p>
      <p className="mx-auto mt-4 max-w-xs text-muted">
        Tell us your mood, your plans and what's for dinner. We'll tell you what to grab at the store. No wine degree required.
      </p>
      <div className="mt-10 flex w-full max-w-sm flex-col gap-2">
        <Button onClick={onSignUp}>Create an account</Button>
        <Button variant="secondary" onClick={onLogIn}>
          Log in
        </Button>
        <Button variant="ghost" onClick={onGuest}>
          Continue as guest
        </Button>
      </div>
      <p className="mt-4 text-xs text-muted">An account saves your taste profile and drinks for next time.</p>
    </div>
  )
}

export function SignUp({ onCreated, onUnderage, onLogIn }) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [bday, setBday] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const birthday = readBirthday(bday)
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const phoneOk = !phone.trim() || phone.replace(/\D/g, '').length >= 10
  const passOk = password.length >= 8
  const matchOk = password === confirm
  const ready = emailOk && phoneOk && birthday.valid && passOk && matchOk && !busy

  const submit = async () => {
    if (!ready) return
    if (birthday.age < 21) return onUnderage()
    setBusy(true)
    const { user, error } = await createAccount({ email, phone, birthday: birthday.iso, password })
    setBusy(false)
    if (error) setError(error)
    else onCreated(user)
  }

  return (
    <>
      <ScreenTitle eyebrow="Create an account" title="Let's get you set up" sub="Your taste profile and saved drinks will be here next time you log in." />
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm">
        <Field label="Email">
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
        </Field>
        <Field label="Phone number" hint="optional">
          <input type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" className={inputClass} />
          {!phoneOk && <span className="mt-1 block text-xs text-berry">Enter a full phone number, or leave it blank.</span>}
        </Field>
        <div>
          <span className="mb-1 block text-sm font-semibold">Birthday</span>
          <BirthdayField id="signup-birthday" text={bday} setText={setBday} />
          <span className="mt-1 block text-xs text-muted">You must be 21+ to use SipMatch.</span>
        </div>
        <Field label="Password" hint="8+ characters">
          <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Confirm password">
          <input
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className={inputClass}
          />
          {confirm && !matchOk && <span className="mt-1 block text-xs text-berry">Passwords don't match.</span>}
        </Field>
        {error && <p className="rounded-xl bg-berry-light p-3 text-sm text-berry">{error}</p>}
        <Button type="button" disabled={!ready} onClick={submit}>
          {busy ? 'Creating…' : 'Create account'}
        </Button>
      </div>
      <button onClick={onLogIn} className="mt-4 text-sm font-semibold text-berry underline-offset-2 hover:underline">
        Already have an account? Log in
      </button>
      <DemoNote />
    </>
  )
}

export function LogIn({ onLoggedIn, onSignUp }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    if (!email.trim() || !password || busy) return
    setBusy(true)
    const { user, error } = await logIn(email, password)
    setBusy(false)
    if (error) setError(error)
    else onLoggedIn(user)
  }

  return (
    <>
      <ScreenTitle eyebrow="Welcome back" title="Log in" sub="Pick up where you left off." />
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm">
        <Field label="Email">
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Password">
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className={inputClass}
          />
        </Field>
        {error && <p className="rounded-xl bg-berry-light p-3 text-sm text-berry">{error}</p>}
        <Button type="button" disabled={!email.trim() || !password || busy} onClick={submit}>
          {busy ? 'Logging in…' : 'Log in'}
        </Button>
      </div>
      <button onClick={onSignUp} className="mt-4 text-sm font-semibold text-berry underline-offset-2 hover:underline">
        New here? Create an account
      </button>
      <DemoNote />
    </>
  )
}
