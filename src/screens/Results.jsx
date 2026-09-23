import { useMemo, useState } from 'react'
import { recommend } from '../logic/recommend.js'
import { FEELINGS, OCCASIONS, label } from '../data/options.js'
import DrinkCard from '../components/DrinkCard.jsx'
import { Button, LockBadge } from '../components/ui.jsx'

export default function Results({ profile, mood, occasion, dish, onChangeDish, onStartOver, onEditProfile, onPremium }) {
  const { picks, alternatives, dishInfo } = useMemo(() => recommend({ profile, mood, occasion, dish }), [profile, mood, occasion, dish])
  const [showAlts, setShowAlts] = useState(false)
  const [top, ...alts] = picks
  const dishLabel = dishInfo.skipped ? 'party snacks' : dish.trim()

  return (
    <>
      <div className="mb-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-berry/70">Your SipMatch</p>
        <h1 className="font-display text-3xl leading-tight">
          Here's what to grab for <span className="text-berry">{dishLabel}</span>
        </h1>
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
          <span className="rounded-full bg-white px-2.5 py-1">
            {label(FEELINGS, mood.feeling).emoji} {label(FEELINGS, mood.feeling).label}
          </span>
          <span className="rounded-full bg-white px-2.5 py-1">{mood.social === 'social' ? '🙌 Social' : '🛋️ Solo'}</span>
          <span className="rounded-full bg-white px-2.5 py-1">
            {label(OCCASIONS, occasion).emoji} {label(OCCASIONS, occasion).label}
          </span>
        </div>
        {!dishInfo.recognized && (
          <p className="mt-3 rounded-2xl bg-gold/15 p-3 text-sm text-ink/80">
            🤷 We don't know "{dish}" yet, so these are flexible all-rounders that go with most savory meals.
          </p>
        )}
      </div>

      <DrinkCard pick={top} primary dishLabel={dishLabel} />

      <h2 className="mb-2 mt-7 font-semibold">Or try one of these</h2>
      <div className="flex flex-col gap-3">
        {alts.map((p) => (
          <DrinkCard key={p.drink.id} pick={p} dishLabel={dishLabel} />
        ))}
      </div>

      <div className="mt-7 overflow-hidden rounded-3xl border-2 border-berry/15 bg-white/60">
        <button
          onClick={() => setShowAlts(!showAlts)}
          aria-expanded={showAlts}
          className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-white"
        >
          <span className="text-3xl">🤔</span>
          <span className="flex-1">
            <span className="block font-semibold">Don't like these?</span>
            <span className="block text-sm text-muted">Try a wine, a beer and a spirit or cocktail that go a different direction.</span>
          </span>
          <span className={`text-berry transition ${showAlts ? 'rotate-180' : ''}`}>⌄</span>
        </button>
        {showAlts && (
          <div className="flex flex-col gap-3 border-t border-berry/10 p-3 pb-4">
            {alternatives.map((a) => (
              <DrinkCard key={a.drink.id} pick={a} dishLabel={dishLabel} contrast={a.contrast} />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onPremium}
        className="mt-7 flex items-center gap-3 rounded-3xl border-2 border-dashed border-gold/60 bg-gold/10 p-4 text-left transition hover:bg-gold/20"
      >
        <span className="text-3xl">🛒</span>
        <span className="flex-1">
          <LockBadge />
          <span className="mt-1 block font-semibold">Already at the store?</span>
          <span className="block text-sm text-muted">Snap your cart and we'll match drinks to everything in it.</span>
        </span>
        <span className="text-berry">→</span>
      </button>

      <div className="mt-6 flex flex-col gap-2">
        <Button onClick={onChangeDish}>Try a different dish</Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={onStartOver}>
            Start over
          </Button>
          <Button variant="secondary" onClick={onEditProfile}>
            Edit profile
          </Button>
        </div>
      </div>
    </>
  )
}
