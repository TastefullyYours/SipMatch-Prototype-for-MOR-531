import { useEffect, useState } from 'react'
import { DRINKS, PRICE_TIERS, TYPE_LABELS } from '../logic/recommend.js'
import { Button, Chip, LockBadge, ScreenTitle, SectionLabel } from '../components/ui.jsx'
import UpgradePrompt from '../components/UpgradePrompt.jsx'

// Everything on this screen is SCRIPTED for the prototype: no real image recognition happens.
const SAMPLE_CART = [
  { emoji: '🍗', name: 'Chicken thighs' },
  { emoji: '🍋', name: 'Lemons' },
  { emoji: '🧄', name: 'Garlic' },
  { emoji: '🥬', name: 'Arugula' },
  { emoji: '🧀', name: 'Parmesan' },
  { emoji: '🫒', name: 'Olive oil' },
]

const COOK_METHODS = [
  { id: 'roasted', label: '🔥 Roasted', topPick: 'chardonnay', meal: 'Lemon-garlic roast chicken' },
  { id: 'grilled', label: '♨️ Grilled', topPick: 'rose', meal: 'Grilled lemon-garlic chicken' },
  { id: 'fried', label: '🍳 Pan-fried', topPick: 'prosecco', meal: 'Crispy lemon chicken' },
]

const byId = (id) => DRINKS.find((d) => d.id === id)

function DemoBanner() {
  return (
    <div className="mb-4 rounded-2xl bg-ink px-4 py-2 text-center text-xs font-medium text-white/90">
      🎬 Demo: results are scripted from a sample cart
    </div>
  )
}

function MiniDrink({ drink, note }) {
  return (
    <div className="flex items-start gap-3 rounded-3xl bg-white p-4 shadow-sm">
      <span className="text-4xl leading-none">{drink.emoji}</span>
      <div className="flex-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted">{TYPE_LABELS[drink.type]}</div>
        <div className="font-display text-lg font-bold leading-tight">{drink.name}</div>
        <div className="mt-1 text-sm text-ink/80">{note}</div>
        <span className="mt-2 inline-block rounded-full bg-sand px-2.5 py-0.5 text-xs font-semibold">
          <span className="text-berry">{PRICE_TIERS[drink.priceTier].symbol}</span>{' '}
          <span className="text-muted">{PRICE_TIERS[drink.priceTier].range}</span>
        </span>
      </div>
    </div>
  )
}

export default function CartPhoto({ onUpgrade }) {
  const [stage, setStage] = useState('upload') // upload → scanning → questions → result
  const [photo, setPhoto] = useState(null)
  const [method, setMethod] = useState(null)
  const [forPasta, setForPasta] = useState(null)

  useEffect(() => {
    if (stage !== 'scanning') return
    const t = setTimeout(() => setStage('questions'), 1800)
    return () => clearTimeout(t)
  }, [stage])

  useEffect(() => () => photo && URL.revokeObjectURL(photo), [photo])

  if (stage === 'upload') {
    return (
      <>
        <ScreenTitle eyebrow={<LockBadge>Premium · Preview</LockBadge>} title="Snap your cart 🛒" sub="We'll spot what you're cooking and match drinks to the whole meal." />
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-berry/30 bg-white px-6 py-10 text-center transition hover:border-berry/60">
          {photo ? (
            <img src={photo} alt="Your cart" className="max-h-56 rounded-2xl object-cover" />
          ) : (
            <>
              <span className="text-5xl">📸</span>
              <span className="mt-3 font-semibold">Upload or take a photo</span>
              <span className="mt-1 text-sm text-muted">Your cart, your basket, or the counter</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) setPhoto(URL.createObjectURL(f))
            }}
          />
        </label>

        <div className="mt-6 flex flex-col gap-2">
          {photo && <Button onClick={() => setStage('scanning')}>Scan my cart</Button>}
          <Button variant={photo ? 'secondary' : 'primary'} onClick={() => setStage('scanning')}>
            Try it with a sample cart
          </Button>
        </div>
        <p className="mt-3 text-center text-xs text-muted">Prototype note: any photo runs the same scripted demo.</p>
      </>
    )
  }

  if (stage === 'scanning') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
        <div className="relative">
          {photo ? <img src={photo} alt="" className="h-40 w-40 rounded-3xl object-cover" /> : <div className="grid h-40 w-40 grid-cols-3 place-items-center rounded-3xl bg-white text-3xl shadow-sm">{SAMPLE_CART.map((i) => <span key={i.name}>{i.emoji}</span>)}</div>}
          <div className="absolute inset-x-0 top-0 h-1 animate-[scan_1.6s_ease-in-out_infinite] rounded-full bg-berry shadow-[0_0_12px] shadow-berry" />
        </div>
        <p className="mt-6 font-display text-xl">Spotting ingredients…</p>
        <p className="mt-1 text-sm text-muted">Chicken? Lemons? Is that arugula?</p>
      </div>
    )
  }

  const cook = COOK_METHODS.find((m) => m.id === method)
  const mealName = cook ? `${cook.meal}${forPasta === 'pasta' ? ' with lemony parmesan pasta' : forPasta === 'salad' ? ' with arugula-parmesan salad' : ''}` : ''

  if (stage === 'questions') {
    return (
      <>
        <DemoBanner />
        <ScreenTitle title="Here's what we spotted" sub="Tap anything we got wrong. (In the real thing!)" />
        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_CART.map((i) => (
            <div key={i.name} className="rounded-2xl bg-white p-3 text-center shadow-sm">
              <div className="text-3xl">{i.emoji}</div>
              <div className="mt-1 text-xs font-medium">{i.name}</div>
            </div>
          ))}
        </div>

        <SectionLabel>A couple quick questions 🤔</SectionLabel>
        <p className="mb-2 text-sm text-muted">How are you cooking the chicken?</p>
        <div className="flex flex-wrap gap-2">
          {COOK_METHODS.map((m) => (
            <Chip key={m.id} label={m.label} selected={method === m.id} onClick={() => setMethod(m.id)} />
          ))}
        </div>
        <p className="mb-2 mt-4 text-sm text-muted">What's the parmesan for?</p>
        <div className="flex flex-wrap gap-2">
          <Chip label="🍝 Pasta side" selected={forPasta === 'pasta'} onClick={() => setForPasta('pasta')} />
          <Chip label="🥗 Arugula salad" selected={forPasta === 'salad'} onClick={() => setForPasta('salad')} />
        </div>

        <div className="mt-8">
          <Button disabled={!method || !forPasta} onClick={() => setStage('result')}>
            Match my cart ✨
          </Button>
        </div>
      </>
    )
  }

  // result
  const top = byId(cook.topPick)
  const alts = [byId('sauvignon-blanc'), byId('saison')]
  return (
    <>
      <DemoBanner />
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-berry/70">Your cart menu</p>
      <h1 className="mb-5 font-display text-3xl leading-tight">{mealName}</h1>

      <MiniDrink
        drink={top}
        note={
          {
            roasted: 'Round, buttery Chardonnay matches the richness of roast chicken and loves the garlic.',
            grilled: 'Crisp, fruity rosé stands up to char without overpowering the lemon.',
            fried: 'Bubbles scrub the palate after every crispy bite, and the lemon echoes Prosecco’s freshness.',
          }[method]
        }
      />

      <h2 className="mb-2 mt-6 font-semibold">2 more matches + a shopping list</h2>
      <UpgradePrompt sub="See every match for your cart, plus a ready-to-go shopping list." onUpgrade={onUpgrade}>
        <div className="flex flex-col gap-3">
          {alts.map((d) => (
            <MiniDrink key={d.id} drink={d} note="Zesty and herbal: lemon and arugula's best friend." />
          ))}
        </div>
      </UpgradePrompt>
    </>
  )
}
