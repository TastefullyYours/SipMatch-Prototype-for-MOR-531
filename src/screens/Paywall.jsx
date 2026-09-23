import { useState } from 'react'
import { Button, ScreenTitle } from '../components/ui.jsx'

// Pricing shown here is placeholder copy for the prototype.
const FEATURES = [
  { label: 'Matches from mood, occasion & dish', free: true, premium: true },
  { label: 'Top pick + 2 alternates with pairing tips', free: true, premium: true },
  { label: 'Snap your cart: match the whole meal', free: false, premium: true },
  { label: "Here's what I'm drinking: food & recipes", free: false, premium: true },
  { label: 'Save favorites & shopping lists', free: false, premium: true },
  { label: 'Taste communities', free: false, premium: 'soon' },
]

const Cell = ({ v }) => (
  <span className="flex justify-center text-base">
    {v === true ? <span className="text-berry">✓</span> : v === 'soon' ? <span className="text-[10px] font-semibold text-muted">SOON</span> : <span className="text-muted/50">—</span>}
  </span>
)

export default function Paywall({ onClose }) {
  const [plan, setPlan] = useState('year')
  const [showNote, setShowNote] = useState(false)

  return (
    <>
      <ScreenTitle eyebrow="✨ SipMatch Premium" title="Never second-guess a drink again" sub="Free gets you great matches. Premium follows you into the grocery store." />

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="grid grid-cols-[1fr_4rem_4.5rem] items-center border-b border-sand px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted">
          <span />
          <span className="text-center">Free</span>
          <span className="text-center text-[#8a6412]">Premium</span>
        </div>
        {FEATURES.map((f) => (
          <div key={f.label} className="grid grid-cols-[1fr_4rem_4.5rem] items-center border-b border-sand px-4 py-3 text-sm last:border-0">
            <span>{f.label}</span>
            <Cell v={f.free} />
            <span className="-my-3 bg-gold/10 py-3">
              <Cell v={f.premium} />
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {[
          { id: 'month', title: 'Monthly', price: '$3.99', per: '/month' },
          { id: 'year', title: 'Yearly', price: '$29.99', per: '/year', tag: 'Save 37%' },
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => setPlan(p.id)}
            aria-pressed={plan === p.id}
            className={`relative rounded-3xl border-2 p-4 text-left transition ${plan === p.id ? 'border-berry bg-berry-light' : 'border-transparent bg-white'}`}
          >
            {p.tag && <span className="absolute -top-2.5 right-3 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase">{p.tag}</span>}
            <div className="text-sm font-semibold text-muted">{p.title}</div>
            <div className="font-display text-2xl font-bold">
              {p.price}
              <span className="font-sans text-sm font-normal text-muted">{p.per}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <Button variant="gold" onClick={() => setShowNote(true)}>
          Start 7-day free trial
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Maybe later
        </Button>
      </div>

      {showNote && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center" onClick={() => setShowNote(false)}>
          <div className="w-full max-w-sm animate-[fadeIn_.2s_ease-out] rounded-3xl bg-cream p-6 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-4xl">🎓</div>
            <h2 className="mt-2 font-display text-2xl font-bold">Thanks for your interest!</h2>
            <p className="mt-2 text-sm text-muted">
              This is a class prototype, so no payment is taken and Premium isn't live yet. In the real app, this is where checkout would start.
            </p>
            <Button className="mt-5" onClick={() => setShowNote(false)}>
              Got it
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
