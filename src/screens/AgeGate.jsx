import { Button } from '../components/ui.jsx'

export function AgeGate({ onYes, onNo }) {
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

      <div className="mt-10 w-full rounded-3xl bg-white p-6 shadow-sm">
        <p className="mb-4 text-lg font-semibold">Are you 21 or older?</p>
        <div className="flex flex-col gap-3">
          <Button onClick={onYes}>Yes, I'm 21+</Button>
          <Button variant="secondary" onClick={onNo}>
            Not yet
          </Button>
        </div>
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
