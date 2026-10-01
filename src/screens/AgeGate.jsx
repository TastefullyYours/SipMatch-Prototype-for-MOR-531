import { useState } from 'react'
import { ageFrom } from '../data/options.js'
import { Button } from '../components/ui.jsx'

const todayISO = () => new Date().toISOString().slice(0, 10)

// "MM/DD/YYYY" ⇄ "YYYY-MM-DD". Returns null unless it's a real calendar date.
function toISO(text) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text)
  if (!m) return null
  const [, mm, dd, yyyy] = m
  const d = new Date(Date.UTC(+yyyy, +mm - 1, +dd))
  if (d.getUTCFullYear() !== +yyyy || d.getUTCMonth() !== +mm - 1 || d.getUTCDate() !== +dd) return null
  return `${yyyy}-${mm}-${dd}`
}
const fromISO = (iso) => (iso ? `${iso.slice(5, 7)}/${iso.slice(8, 10)}/${iso.slice(0, 4)}` : '')

// Keep only digits and add the slashes as the user types: 0520 → 05/20.
function formatTyped(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('/')
}

export function AgeGate({ birthday, setBirthday, onAdult, onUnderage }) {
  const [text, setText] = useState(fromISO(birthday))
  const iso = toISO(text)
  const valid = !!iso && iso <= todayISO() && iso >= '1900-01-01'
  const age = valid ? ageFrom(iso) : null
  const typedAll = text.length === 10

  const submit = () => {
    if (!valid) return
    setBirthday(iso)
    if (age >= 21) onAdult()
    else onUnderage()
  }

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

      {/* Plain div, not <form>: some desktop browser extensions break React's form-submit handling (blank page / "l is not a function"). */}
      <div className="mt-10 w-full rounded-3xl bg-white p-6 text-left shadow-sm">
        <label htmlFor="birthday" className="block text-center text-lg font-semibold">
          When's your birthday? 🎂
        </label>
        <p className="mb-4 mt-1 text-center text-sm text-muted">Type it in, or pick it from the calendar.</p>

        <div className="flex gap-2">
          <input
            id="birthday"
            type="text"
            inputMode="numeric"
            autoComplete="bday"
            placeholder="MM/DD/YYYY"
            value={text}
            onChange={(e) => setText(formatTyped(e.target.value))}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className="min-w-0 flex-1 rounded-2xl border-2 border-berry/15 bg-cream px-4 py-3.5 text-center text-lg tracking-wider outline-none focus:border-berry"
          />
          {/* The real date input sits invisibly over the button, so tapping it opens the phone's own calendar. */}
          <label className="relative flex w-14 shrink-0 cursor-pointer items-center justify-center rounded-2xl border-2 border-berry/15 bg-cream text-2xl hover:border-berry/40">
            <span aria-hidden>📅</span>
            <span className="sr-only">Pick from calendar</span>
            <input
              type="date"
              value={iso || ''}
              max={todayISO()}
              min="1900-01-01"
              onChange={(e) => setText(fromISO(e.target.value))}
              onClick={(e) => e.currentTarget.showPicker?.()}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>
        </div>
        {typedAll && !valid && <p className="mt-2 text-center text-sm text-berry">Hmm, that doesn't look like a real date.</p>}

        <Button type="button" className="mt-4" disabled={!valid} onClick={submit}>
          Continue
        </Button>
        <p className="mt-3 text-center text-xs text-muted">SipMatch is for adults 21+. We only use this to check your age. It isn't saved anywhere.</p>
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
