import { DRINKS, PRICE_TIERS, TYPE_LABELS } from '../logic/recommend.js'
import { RateAndNote } from '../components/SavedDrink.jsx'
import { Button, ScreenTitle } from '../components/ui.jsx'

// Saved drinks with a 1–5 star rating and a note each. Ratings feed future matches.
export default function MyDrinks({ saved, setSaved, onBack }) {
  const entries = Object.entries(saved)
    .map(([id, entry]) => ({ drink: DRINKS.find((d) => d.id === id), entry }))
    .filter((e) => e.drink)

  return (
    <>
      <ScreenTitle
        eyebrow="👤 Your taste profile"
        title="My drinks"
        sub="Rate what you've tried and jot a note. Drinks rated 4–5 stars shape your future matches, and 1–2 stars steer us away."
      />

      {entries.length === 0 ? (
        <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
          <div className="text-4xl">♡</div>
          <p className="mt-2 font-semibold">No saved drinks yet</p>
          <p className="mt-1 text-sm text-muted">Tap “♡ Save” on any match to keep it here.</p>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {entries.map(({ drink, entry }) => (
            <article key={drink.id} className="rounded-3xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-start gap-3">
                <span className="text-3xl leading-none">{drink.emoji}</span>
                <div className="flex-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {TYPE_LABELS[drink.type]} · {PRICE_TIERS[drink.priceTier].symbol}
                  </div>
                  <div className="font-display text-lg font-bold leading-tight">{drink.name}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = { ...saved }
                    delete next[drink.id]
                    setSaved(next)
                  }}
                  className="rounded-full px-2 py-1 text-xs font-semibold text-muted hover:bg-sand"
                >
                  Remove
                </button>
              </div>
              <RateAndNote entry={entry} onChange={(e) => setSaved({ ...saved, [drink.id]: e })} />
            </article>
          ))}
        </div>
      )}

      <p className="mt-4 text-center text-xs text-muted">Prototype note: saved drinks last until you close or refresh the page.</p>

      <div className="mt-6">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
      </div>
    </>
  )
}
