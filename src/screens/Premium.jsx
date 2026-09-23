import { useState } from 'react'
import { Button, LockBadge, ScreenTitle } from '../components/ui.jsx'

const COMMUNITIES = [
  { emoji: '🌿', name: 'Gin Lovers', members: 'Botanical nerds unite' },
  { emoji: '🍇', name: 'Natural Wine', members: 'Funky, fresh, low-intervention' },
  { emoji: '🍺', name: 'Hoppy Hour', members: 'IPAs, lagers & everything between' },
  { emoji: '🍹', name: 'Home Mixologists', members: 'Cocktails with what you have' },
]

function FeatureCard({ emoji, title, sub, onClick, badge }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-4 rounded-3xl bg-white p-5 text-left shadow-sm transition hover:shadow-md active:scale-[0.99]">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-berry-light text-3xl">{emoji}</span>
      <span className="flex-1">
        {badge}
        <span className="mt-1 block font-display text-lg font-bold leading-tight">{title}</span>
        <span className="mt-0.5 block text-sm text-muted">{sub}</span>
      </span>
      <span className="text-berry">→</span>
    </button>
  )
}

export default function Premium({ onCart, onReverse, onPaywall }) {
  const [notified, setNotified] = useState([])
  return (
    <>
      <ScreenTitle eyebrow="✨ SipMatch Premium" title="Match smarter, wherever you are" sub="Try a preview of what Premium members get." />

      <div className="flex flex-col gap-3">
        <FeatureCard
          emoji="🛒"
          title="Snap your cart"
          sub="Take a photo of your grocery cart. We'll spot the ingredients and match drinks to the whole meal."
          badge={<LockBadge>Premium · Preview</LockBadge>}
          onClick={onCart}
        />
        <FeatureCard
          emoji="🔄"
          title="Here's what I'm drinking"
          sub="Already have a bottle? Tell us what it is and get food and recipe ideas that go with it."
          badge={<LockBadge>Premium · Preview</LockBadge>}
          onClick={onReverse}
        />
      </div>

      <h2 className="mb-1 mt-8 flex items-center gap-2 font-semibold">
        Taste communities <span className="rounded-full bg-sand px-2 py-0.5 text-xs font-semibold text-muted">Coming soon</span>
      </h2>
      <p className="mb-3 text-sm text-muted">Swap tips and finds with people who like what you like.</p>
      <div className="-mx-5 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pb-2">
        {COMMUNITIES.map((c) => {
          const on = notified.includes(c.name)
          return (
            <div key={c.name} className="flex w-40 shrink-0 snap-start flex-col rounded-3xl bg-white p-4 opacity-90 shadow-sm">
              <div className="text-3xl">{c.emoji}</div>
              <div className="mt-2 font-semibold leading-tight">{c.name}</div>
              <div className="mb-3 mt-1 text-xs text-muted">{c.members}</div>
              <button
                onClick={() => setNotified(on ? notified.filter((n) => n !== c.name) : [...notified, c.name])}
                className={`mt-auto w-full rounded-full py-1.5 text-xs font-semibold ${on ? 'bg-berry text-white' : 'bg-berry-light text-berry'}`}
              >
                {on ? '✓ We’ll let you know' : '🔔 Notify me'}
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-8">
        <Button variant="gold" onClick={onPaywall}>
          See Premium plans
        </Button>
      </div>
    </>
  )
}
