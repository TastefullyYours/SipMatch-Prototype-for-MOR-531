import { useState } from 'react'
import { ageFrom } from '../data/options.js'
import { Button } from '../components/ui.jsx'

const todayISO = () => new Date().toISOString().slice(0, 10)

export function AgeGate({ birthday, setBirthday, onAdult, onUnderage }) {
  const [value, setValue] = useState(birthday || '')
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(value) && value <= todayISO() && value >= '1900-01-01'
  const age = valid ? ageFrom(value) : null

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

      <form
        className="mt-10 w-full rounded-3xl bg-white p-6 text-left shadow-sm"
        onSubmit={(e) => {
          e.preventDefault()
          if (!valid) return
          setBirthday(value)
          if (age >= 21) onAdult()
          else onUnderage()
        }}
      >
        <label htmlFor="birthday" className="block text-center text-lg font-semibold">
          When's your birthday? 🎂
        </label>
        <p className="mb-4 mt-1 text-center text-sm text-muted">SipMatch is for adults 21 and over.</p>
        <input
          id="birthday"
          type="date"
          value={value}
          max={todayISO()}
          min="1900-01-01"
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-2xl border-2 border-berry/15 bg-cream px-4 py-3.5 text-center text-lg outline-none focus:border-berry"
        />
        <Button className="mt-4" disabled={!valid}>
          Continue
        </Button>
        <p className="mt-3 text-center text-xs text-muted">We only use this to check your age. It isn't saved anywhere.</p>
      </form>
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
