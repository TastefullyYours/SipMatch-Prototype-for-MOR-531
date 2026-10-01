import { useMemo, useState } from 'react'
import { recommend } from '../logic/recommend.js'
import { BUDGETS, FEELINGS, OCCASIONS, STYLE_CUES, label } from '../data/options.js'
import DrinkCard from '../components/DrinkCard.jsx'
import { Button, LockBadge } from '../components/ui.jsx'

const RELAXED_TEXT = {
  abv: 'went a little above your strength limit',
  categories: 'included a category you marked "never"',
  hated: 'included a drink you said you’d pass on',
}

export default function Results({ profile, mood, occasion, tonight, dish, onChangeDish, onChangeTonight, onStartOver, onEditProfile, onPremium }) {
  const { picks, alternatives, dishInfo, relaxed } = useMemo(
    () => recommend({ profile, mood, occasion, tonight, dish }),
    [profile, mood, occasion, tonight, dish],
  )
  const styleChips = STYLE_CUES.filter((c) => tonight[c.id] !== 'any').map((c) => label(c.options, tonight[c.id]).label)
  const [showAlts, setShowAlts] = useState(false)
  const [top, ...alts] = picks
  const dishLabel = dishInfo.skipped ? (occasion === 'party' ? 'party snacks' : null) : dish.trim()

  return (
    <>
      <div className="mb-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-berry/70">Your SipMatch</p>
        <h1 className="font-display text-3xl leading-tight">
          {dishLabel ? (
            <>
              Here's what to grab for <span className="text-berry">{dishLabel}</span>
            </>
          ) : (
            <>
              Here's what to sip <span className="text-berry">tonight</span>
            </>
          )}
        </h1>
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
          <span className="rounded-full bg-white px-2.5 py-1">
            {label(FEELINGS, mood.feeling).emoji} {label(FEELINGS, mood.feeling).label}
          </span>
          <span className="rounded-full bg-white px-2.5 py-1">{mood.social === 'social' ? '🙌 Social' : '🛋️ Solo'}</span>
          <span className="rounded-full bg-white px-2.5 py-1">
            {label(OCCASIONS, occasion).emoji} {label(OCCASIONS, occasion).label}
          </span>
          <span className="rounded-full bg-white px-2.5 py-1">💳 {label(BUDGETS, tonight.budget).label}</span>
          {styleChips.map((c) => (
            <span key={c} className="rounded-full bg-white px-2.5 py-1">
              {c}
            </span>
          ))}
        </div>
        {relaxed.length > 0 && (
          <p className="mt-3 rounded-2xl bg-gold/15 p-3 text-sm text-ink/80">
            🙈 Your filters left very few options, so we {relaxed.map((r) => RELAXED_TEXT[r]).join(' and ')}. Your allergies and aversions were still respected.
          </p>
        )}
        {!dishInfo.recognized && (
          <p className="mt-3 rounded-2xl bg-gold/15 p-3 text-sm text-ink/80">
            🤷 We don't know "{dish}" yet, so these are flexible all-rounders that go with most savory meals.
          </p>
        )}
      </div>

      {!top && (
        <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
          <div className="text-4xl">🤷</div>
          <p className="mt-2 font-semibold">No drinks fit all your restrictions yet.</p>
          <p className="mt-1 text-sm text-muted">Try editing your profile to loosen a few settings.</p>
        </div>
      )}
      {top && <DrinkCard pick={top} primary dishLabel={dishLabel} />}

      {alts.length > 0 && <h2 className="mb-2 mt-7 font-semibold">Or try one of these</h2>}
      <div className="flex flex-col gap-3">
        {alts.map((p) => (
          <DrinkCard key={p.drink.id} pick={p} dishLabel={dishLabel} />
        ))}
      </div>

      {alternatives.length > 0 && (
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
      )}

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
        <Button onClick={onChangeDish}>{dishInfo.skipped && occasion !== 'party' ? 'Add a dish' : 'Try a different dish'}</Button>
        <Button variant="secondary" onClick={onChangeTonight}>
          Change budget or style
        </Button>
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
