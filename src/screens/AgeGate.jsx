import { useState } from 'react'
import BirthdayField from '../components/BirthdayField.jsx'
import { fromISO, readBirthday } from '../logic/birthday.js'
import { Button, ScreenTitle } from '../components/ui.jsx'

// Guest path: just the 21+ birthday check, nothing saved.
export function AgeGate({ birthday, setBirthday, onAdult, onUnderage }) {
  const [text, setText] = useState(fromISO(birthday))
  const { iso, valid, age } = readBirthday(text)

  const submit = () => {
    if (!valid) return
    setBirthday(iso)
    if (age >= 21) onAdult()
    else onUnderage()
  }

  return (
    <div className="flex flex-1 flex-col justify-center py-6">
      <ScreenTitle eyebrow="Continue as guest" title="When's your birthday? 🎂" sub="SipMatch is for adults 21+. Type it in, or pick it from the calendar." />
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <BirthdayField text={text} setText={setText} onEnter={submit} />
        <Button type="button" className="mt-4" disabled={!valid} onClick={submit}>
          Continue
        </Button>
        <p className="mt-3 text-center text-xs text-muted">Guest mode: nothing is saved once you close the page.</p>
      </div>
    </div>
  )
}

export function Underage({ onBack }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
      <div className="mb-4 text-6xl">🧃</div>
      <h1 className="font-display text-3xl text-ink">Come back when you're 21!</h1>
      <p className="mx-auto mt-3 max-w-xs text-muted">
        SipMatch is for adults of legal drinking age. In the meantime, a sparkling lemonade goes with just about everything.
      </p>
      <Button variant="secondary" className="mt-8" onClick={onBack}>
        Go back
      </Button>
    </div>
  )
}
