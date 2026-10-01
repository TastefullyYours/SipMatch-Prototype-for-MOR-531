import { useMemo, useState } from 'react'
import { FLAVORS } from '../data/options.js'
import { quickPick } from '../logic/recommend.js'
import DrinkCard from '../components/DrinkCard.jsx'
import { BottomBar, Button, Chip, ScreenTitle, SectionLabel, Segmented } from '../components/ui.jsx'

// Start of every match: choose the short or the full route.
export function StartChoice({ onQuick, onFull, account, onLogOut }) {
  return (
    <>
      <ScreenTitle eyebrow="Tonight's match" title="How much time do you have?" sub="Short on patience? Quick pick gets you ideas in two taps." />
      <div className="grid gap-3 lg:grid-cols-2">
        <button onClick={onQuick} className="rounded-3xl bg-white p-5 text-left shadow-sm ring-2 ring-gold/50 transition hover:shadow-md active:scale-[0.99]">
          <div className="text-4xl">⚡</div>
          <div className="mt-2 font-display text-xl font-bold">Quick pick</div>
          <p className="mt-1 text-sm text-muted">Pick 2–3 flavors and get 3–5 drink ideas instantly. Shuffle for more.</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[#8a6412]">About 10 seconds</p>
        </button>
        <button onClick={onFull} className="rounded-3xl bg-white p-5 text-left shadow-sm ring-2 ring-berry/30 transition hover:shadow-md active:scale-[0.99]">
          <div className="text-4xl">🎯</div>
          <div className="mt-2 font-display text-xl font-bold">Full match</div>
          <p className="mt-1 text-sm text-muted">Mood, occasion, budget and your dish, for a pairing with the reasons behind it.</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-berry">4 quick steps</p>
        </button>
      </div>
      {account && (
        <p className="mt-8 text-center text-xs text-muted">
          Signed in as <b className="text-ink">{account}</b> ·{' '}
          <button onClick={onLogOut} className="font-semibold text-berry underline-offset-2 hover:underline">
            Log out
          </button>
        </p>
      )}
    </>
  )
}

const toggle = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

export function QuickPick({ quick, setQuick, onNext }) {
  const { flavors, count } = quick
  const full = flavors.length >= 3
  return (
    <>
      <ScreenTitle eyebrow="⚡ Quick pick" title="What are you craving?" sub="Pick 2 or 3 flavors. We'll do the rest." />
      <SectionLabel hint={`${flavors.length} of 2–3`}>Flavors</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {FLAVORS.map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            selected={flavors.includes(f.id)}
            onClick={() => (flavors.includes(f.id) || !full) && setQuick({ ...quick, flavors: toggle(flavors, f.id) })}
          />
        ))}
      </div>
      <SectionLabel>How many ideas?</SectionLabel>
      <Segmented options={[3, 4, 5].map((n) => ({ id: n, label: `${n} drinks` }))} value={count} onChange={(v) => setQuick({ ...quick, count: v })} />
      <BottomBar>
        <Button disabled={flavors.length < 2} onClick={onNext}>
          Show me drinks ⚡
        </Button>
      </BottomBar>
    </>
  )
}

export function QuickResults({ profile, saved, setSaved, quick, onChange, onFull, onStartOver }) {
  const [seed, setSeed] = useState(1)
  const [savedSnapshot] = useState(saved) // so rating a card doesn't reshuffle the list
  const picks = useMemo(
    () => quickPick({ profile: { ...profile, saved: savedSnapshot }, flavors: quick.flavors, count: quick.count, seed }),
    [profile, savedSnapshot, quick, seed],
  )
  const words = FLAVORS.filter((f) => quick.flavors.includes(f.id)).map((f) => f.label)
  return (
    <>
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-berry/70">⚡ Quick pick</p>
      <h1 className="font-display text-3xl leading-tight">Drinks for {words.join(' + ')}</h1>
      <p className="mt-2 text-sm text-muted">Picked at random from your best flavor matches. Shuffle for a new mix.</p>

      <div className="mt-5 grid items-start gap-3 lg:grid-cols-2">
        {picks.map((p, i) => (
          <DrinkCard key={p.drink.id} pick={p} defaultOpen={i === 0} saved={saved} setSaved={setSaved} fitTitle="Why we picked it" />
        ))}
      </div>
      {picks.length === 0 && (
        <div className="mt-5 rounded-3xl bg-white p-6 text-center shadow-sm">
          <div className="text-4xl">🤷</div>
          <p className="mt-2 font-semibold">No drinks fit that combo with your profile.</p>
          <p className="mt-1 text-sm text-muted">Try different flavors.</p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2 lg:mx-auto lg:w-full lg:max-w-md">
        <Button onClick={() => setSeed(seed + 1)}>🔀 Shuffle</Button>
        <Button variant="secondary" onClick={onChange}>
          Change flavors
        </Button>
        <Button variant="secondary" onClick={onFull}>
          🎯 Do the full match instead
        </Button>
        <Button variant="ghost" onClick={onStartOver}>
          Start over
        </Button>
      </div>
    </>
  )
}
