import { useEffect, useMemo, useState } from 'react'
import { DRINKS, PRICE_TIERS, TYPE_LABELS } from '../logic/recommend.js'
import { Button, Chip, LockBadge, ScreenTitle, SectionLabel } from '../components/ui.jsx'
import UpgradePrompt from '../components/UpgradePrompt.jsx'

// Local scenarios power the camera demo. No photo leaves the device and no API is called.
const CART_SCENARIOS = [
  {
    id: 'roast',
    emoji: '🍗',
    label: 'Lemon chicken',
    sub: 'Chicken, greens & parmesan',
    items: [
      { emoji: '🍗', name: 'Chicken thighs' },
      { emoji: '🍋', name: 'Lemons' },
      { emoji: '🧄', name: 'Garlic' },
      { emoji: '🥬', name: 'Arugula' },
      { emoji: '🧀', name: 'Parmesan' },
      { emoji: '🫒', name: 'Olive oil' },
    ],
    questions: [
      {
        id: 'method',
        prompt: 'How are you cooking the chicken?',
        options: [
          { id: 'roasted', label: '🔥 Roasted' },
          { id: 'grilled', label: '♨️ Grilled' },
          { id: 'fried', label: '🍳 Pan-fried' },
        ],
      },
      {
        id: 'side',
        prompt: "What's the parmesan for?",
        options: [
          { id: 'pasta', label: '🍝 Pasta side' },
          { id: 'salad', label: '🥗 Arugula salad' },
        ],
      },
    ],
    result: ({ method, side }) => {
      const choices = {
        roasted: {
          topPick: 'chardonnay',
          base: 'Lemon-garlic roast chicken',
          note: 'Round, buttery Chardonnay matches the richness of roast chicken and loves the garlic.',
        },
        grilled: {
          topPick: 'rose',
          base: 'Grilled lemon-garlic chicken',
          note: 'Crisp, fruity rosé stands up to char without overpowering the lemon.',
        },
        fried: {
          topPick: 'prosecco',
          base: 'Crispy lemon chicken',
          note: 'Bubbles reset the palate after each crispy bite, while bright citrus echoes the lemon.',
        },
      }
      const pick = choices[method]
      return {
        ...pick,
        meal: `${pick.base}${side === 'pasta' ? ' with lemony parmesan pasta' : ' with arugula-parmesan salad'}`,
        alts: ['sauvignon-blanc', 'saison'],
      }
    },
  },
  {
    id: 'tacos',
    emoji: '🌮',
    label: 'Taco night',
    sub: 'Shrimp, lime & avocado',
    items: [
      { emoji: '🍤', name: 'Shrimp' },
      { emoji: '🌮', name: 'Corn tortillas' },
      { emoji: '🥑', name: 'Avocados' },
      { emoji: '🍋', name: 'Limes' },
      { emoji: '🌿', name: 'Cilantro' },
      { emoji: '🌶️', name: 'Jalapeños' },
    ],
    questions: [
      {
        id: 'method',
        prompt: 'How are you cooking the shrimp?',
        options: [
          { id: 'grilled', label: '🔥 Grilled' },
          { id: 'crispy', label: '🍤 Crispy' },
        ],
      },
      {
        id: 'heat',
        prompt: 'How spicy will the tacos be?',
        options: [
          { id: 'mild', label: '🙂 Mild' },
          { id: 'medium', label: '🌶️ Medium' },
          { id: 'hot', label: '🔥 Hot' },
        ],
      },
    ],
    result: ({ method, heat }) => {
      const drinks = { mild: 'mexican-lager', medium: 'riesling', hot: 'margarita' }
      const notes = {
        mild: 'A crisp Mexican lager keeps lime and cilantro bright without covering the shrimp.',
        medium: 'A touch of Riesling sweetness cools chili heat while its acidity matches the lime.',
        hot: 'A citrusy Margarita mirrors the lime and has enough personality for serious heat.',
      }
      return {
        topPick: drinks[heat],
        meal: `${method === 'crispy' ? 'Crispy' : 'Grilled'} shrimp tacos with avocado, lime and ${heat} heat`,
        note: notes[heat],
        alts: ['rose', 'paloma'],
      }
    },
  },
  {
    id: 'pasta',
    emoji: '🍝',
    label: 'Mushroom pasta',
    sub: 'Mushrooms, herbs & cheese',
    items: [
      { emoji: '🍝', name: 'Pasta' },
      { emoji: '🍄', name: 'Mushrooms' },
      { emoji: '🧄', name: 'Garlic' },
      { emoji: '🧀', name: 'Parmesan' },
      { emoji: '🌿', name: 'Fresh thyme' },
      { emoji: '🥛', name: 'Cream' },
    ],
    questions: [
      {
        id: 'sauce',
        prompt: 'What kind of sauce are you making?',
        options: [
          { id: 'cream', label: '🥛 Creamy' },
          { id: 'tomato', label: '🍅 Tomato' },
          { id: 'olive-oil', label: '🫒 Olive oil' },
        ],
      },
      {
        id: 'style',
        prompt: 'What is the overall style?',
        options: [
          { id: 'cozy', label: '🕯️ Cozy & rich' },
          { id: 'fresh', label: '🌿 Fresh & herby' },
        ],
      },
    ],
    result: ({ sauce, style }) => {
      const drinks = { cream: 'chardonnay', tomato: 'chianti', 'olive-oil': 'pinot-noir' }
      const notes = {
        cream: 'Chardonnay has enough roundness for the cream, with freshness to keep the dish balanced.',
        tomato: 'Chianti meets tomato acidity and brings savory herbal notes that echo the sauce.',
        'olive-oil': 'Earthy Pinot Noir mirrors mushrooms without overpowering the herbs.',
      }
      return {
        topPick: drinks[sauce],
        meal: `${style === 'cozy' ? 'Cozy' : 'Fresh herbed'} mushroom pasta with ${sauce === 'olive-oil' ? 'olive oil' : `${sauce} sauce`}`,
        note: notes[sauce],
        alts: ['sauvignon-blanc', 'saison'],
      }
    },
  },
]

const byId = (id) => DRINKS.find((drink) => drink.id === id)

function DemoBanner() {
  return (
    <div className="mb-4 rounded-2xl bg-ink px-4 py-2 text-center text-xs font-medium text-white/90">
      🎬 Simulated locally — no photo analysis or external API
    </div>
  )
}

function MiniDrink({ drink, note }) {
  if (!drink) return null
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
  const [stage, setStage] = useState('upload') // upload → scanning → review → result
  const [photo, setPhoto] = useState(null)
  const [scenarioId, setScenarioId] = useState(CART_SCENARIOS[0].id)
  const [keptItems, setKeptItems] = useState([])
  const [extraItems, setExtraItems] = useState([])
  const [extraItem, setExtraItem] = useState('')
  const [answers, setAnswers] = useState({})
  const scenario = CART_SCENARIOS.find((item) => item.id === scenarioId) || CART_SCENARIOS[0]

  useEffect(() => {
    if (stage !== 'scanning') return
    const timer = window.setTimeout(() => {
      setKeptItems(scenario.items.map((item) => item.name))
      setExtraItems([])
      setAnswers({})
      setStage('review')
    }, 1800)
    return () => window.clearTimeout(timer)
  }, [stage, scenario])

  useEffect(
    () => () => {
      if (photo) URL.revokeObjectURL(photo)
    },
    [photo],
  )

  const allQuestionsAnswered = scenario.questions.every((question) => answers[question.id])
  const result = useMemo(() => (allQuestionsAnswered ? scenario.result(answers) : null), [allQuestionsAnswered, answers, scenario])

  const toggleItem = (name) => setKeptItems((items) => (items.includes(name) ? items.filter((item) => item !== name) : [...items, name]))
  const addItem = () => {
    const clean = extraItem.trim()
    if (!clean || extraItems.some((item) => item.toLowerCase() === clean.toLowerCase())) return
    setExtraItems((items) => [...items, clean])
    setExtraItem('')
  }

  if (stage === 'upload') {
    return (
      <>
        <DemoBanner />
        <ScreenTitle eyebrow={<LockBadge>Premium · Demo</LockBadge>} title="Snap your cart 🛒" sub="Upload any photo, then choose which prepared cart the prototype should simulate." />
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-berry/30 bg-white px-6 py-8 text-center transition hover:border-berry/60">
          {photo ? (
            <img src={photo} alt="Your cart" className="max-h-52 rounded-2xl object-cover" />
          ) : (
            <>
              <span className="text-5xl">📸</span>
              <span className="mt-3 font-semibold">Upload or take a photo</span>
              <span className="mt-1 text-sm text-muted">Optional — you can also continue with a sample cart</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (!file) return
              if (photo) URL.revokeObjectURL(photo)
              setPhoto(URL.createObjectURL(file))
            }}
          />
        </label>

        <SectionLabel hint="choose one demo result">Sample cart</SectionLabel>
        <div className="grid gap-2 lg:grid-cols-3">
          {CART_SCENARIOS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={scenarioId === item.id}
              onClick={() => setScenarioId(item.id)}
              className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${
                scenarioId === item.id ? 'border-berry bg-berry-light' : 'border-transparent bg-white hover:border-berry/30'
              }`}
            >
              <span className="text-3xl">{item.emoji}</span>
              <span>
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className="block text-xs text-muted">{item.sub}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <Button onClick={() => setStage('scanning')}>{photo ? 'Simulate photo scan' : 'Scan sample cart'} ✨</Button>
        </div>
        <p className="mt-3 text-center text-xs text-muted">The selected scenario controls the simulated result. Your image is displayed locally and is never uploaded.</p>
      </>
    )
  }

  if (stage === 'scanning') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
        <DemoBanner />
        <div className="relative">
          {photo ? (
            <img src={photo} alt="" className="h-44 w-44 rounded-3xl object-cover" />
          ) : (
            <div className="grid h-44 w-44 grid-cols-3 place-items-center rounded-3xl bg-white text-3xl shadow-sm">
              {scenario.items.map((item) => <span key={item.name}>{item.emoji}</span>)}
            </div>
          )}
          <div className="absolute inset-x-0 top-0 h-1 animate-[scan_1.6s_ease-in-out_infinite] rounded-full bg-berry shadow-[0_0_12px] shadow-berry" />
        </div>
        <p className="mt-6 font-display text-xl">Simulating ingredient scan…</p>
        <p className="mt-1 text-sm text-muted">Checking shapes, colors and likely grocery items</p>
      </div>
    )
  }

  if (stage === 'review') {
    return (
      <>
        <DemoBanner />
        <ScreenTitle title="Here's what we spotted" sub="Tap an incorrect item to remove it, or add anything the demo missed." />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {scenario.items.map((item) => {
            const kept = keptItems.includes(item.name)
            return (
              <button
                key={item.name}
                type="button"
                aria-pressed={kept}
                onClick={() => toggleItem(item.name)}
                className={`relative rounded-2xl border-2 p-3 text-center shadow-sm transition ${kept ? 'border-berry/20 bg-white' : 'border-transparent bg-ink/5 opacity-50'}`}
              >
                <span className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-xs ${kept ? 'bg-berry text-white' : 'bg-ink/10 text-muted'}`}>
                  {kept ? '✓' : '×'}
                </span>
                <div className="text-3xl">{item.emoji}</div>
                <div className="mt-1 text-xs font-medium">{item.name}</div>
              </button>
            )
          })}
          {extraItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setExtraItems((items) => items.filter((name) => name !== item))}
              className="relative rounded-2xl border-2 border-gold/40 bg-gold/10 p-3 text-center shadow-sm"
            >
              <span className="absolute right-2 top-2 text-xs text-muted">×</span>
              <div className="text-3xl">🛍️</div>
              <div className="mt-1 text-xs font-medium">{item}</div>
            </button>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <label htmlFor="missing-item" className="sr-only">Add a missing item</label>
          <input
            id="missing-item"
            value={extraItem}
            onChange={(event) => setExtraItem(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && addItem()}
            placeholder="Add a missing item"
            className="min-w-0 flex-1 rounded-2xl border-2 border-berry/15 bg-white px-4 py-3 outline-none placeholder:text-muted/60 focus:border-berry"
          />
          <button type="button" onClick={addItem} className="rounded-2xl bg-white px-4 font-semibold text-berry shadow-sm">Add</button>
        </div>

        <SectionLabel>A couple quick questions 🤔</SectionLabel>
        {scenario.questions.map((question) => (
          <div key={question.id} className="mb-5">
            <p className="mb-2 text-sm text-muted">{question.prompt}</p>
            <div className="flex flex-wrap gap-2">
              {question.options.map((option) => (
                <Chip
                  key={option.id}
                  label={option.label}
                  selected={answers[question.id] === option.id}
                  onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="mt-3">
          <Button disabled={keptItems.length + extraItems.length < 2 || !allQuestionsAnswered} onClick={() => setStage('result')}>
            Match my cart ✨
          </Button>
        </div>
      </>
    )
  }

  const top = byId(result?.topPick)
  const alternatives = (result?.alts || []).map(byId).filter(Boolean)
  return (
    <>
      <DemoBanner />
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-berry/70">Your cart menu</p>
      <h1 className="mb-2 font-display text-3xl leading-tight">{result?.meal}</h1>
      <p className="mb-5 text-sm text-muted">Based on {keptItems.length + extraItems.length} confirmed cart items.</p>

      <MiniDrink drink={top} note={result?.note} />

      <h2 className="mb-2 mt-6 font-semibold">2 more matches + a shopping list</h2>
      <UpgradePrompt sub="See every match for your cart, plus a ready-to-go shopping list." onUpgrade={onUpgrade}>
        <div className="flex flex-col gap-3">
          {alternatives.map((drink) => (
            <MiniDrink key={drink.id} drink={drink} note="Another flexible pairing based on the confirmed flavors in this cart." />
          ))}
        </div>
      </UpgradePrompt>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={() => setStage('review')}>Edit items</Button>
        <Button variant="secondary" onClick={() => setStage('upload')}>Try another cart</Button>
      </div>
    </>
  )
}
