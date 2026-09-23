import { useState } from 'react'
import { DRINKS } from '../logic/recommend.js'
import { Button, Chip, LockBadge, ScreenTitle } from '../components/ui.jsx'
import UpgradePrompt from '../components/UpgradePrompt.jsx'

// Preview of the premium "Here's what I'm drinking" flow.
// Food ideas come from each drink's `classicWith` list in drinks.json; the recipe is a locked teaser.

const FOOD_EMOJI = {
  pizza: '🍕', taco: '🌮', steak: '🥩', burger: '🍔', salmon: '🐟', mushroom: '🍄', chocolate: '🍫', oyster: '🦪',
  sushi: '🍣', curry: '🍛', cheese: '🧀', 'cheese board': '🧀', chips: '🥔', 'fried chicken': '🍗', 'roast chicken': '🍗',
  salad: '🥗', bbq: '🍖', barbecue: '🍖', brisket: '🍖', pie: '🥧', cake: '🍰', brownie: '🍫', shrimp: '🍤', fish: '🐟',
}
const EXAMPLES = ['Pinot Noir', 'IPA', 'Margarita', 'Bourbon', 'Prosecco']

// Keywords are stored singular for matching; pluralize the countable ones for display.
const PLURAL = ['taco', 'burger', 'nacho', 'oyster', 'wing', 'chicken wing', 'rib', 'dumpling', 'meatball', 'enchilada', 'fajita', 'kebab', 'sausage', 'brownie', 'mushroom', 'pork chop']
const pretty = (k) => (PLURAL.includes(k) ? `${k}s` : k).replace(/\b\w/g, (c) => c.toUpperCase())

function findDrink(q) {
  const s = q.trim().toLowerCase()
  if (s.length < 3) return null
  return DRINKS.find((d) => d.name.toLowerCase().includes(s) || s.includes(d.name.toLowerCase().split(' (')[0]) || s.includes(d.id.replace('-', ' ')))
}

export default function ReverseFlow({ onUpgrade }) {
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState(null)

  const found = submitted ? findDrink(submitted) : null
  const drink = found || DRINKS.find((d) => d.id === 'pinot-noir')
  const foods = drink.classicWith.slice(0, 3)

  return (
    <>
      <ScreenTitle eyebrow={<LockBadge>Premium · Preview</LockBadge>} title="Here's what I'm drinking 🔄" sub="Tell us the bottle (or can). We'll tell you what to cook." />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (query.trim()) setSubmitted(query)
        }}
        className="flex gap-2"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Pinot Noir"
          aria-label="What are you drinking?"
          className="min-w-0 flex-1 rounded-2xl border-2 border-berry/15 bg-white px-4 py-3 outline-none focus:border-berry"
        />
        <Button className="!w-auto" disabled={!query.trim()}>
          Go
        </Button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((e) => (
          <Chip
            key={e}
            label={e}
            selected={submitted === e}
            onClick={() => {
              setQuery(e)
              setSubmitted(e)
            }}
          />
        ))}
      </div>

      {submitted && (
        <div className="mt-7 animate-[fadeIn_.25s_ease-out]">
          {!found && (
            <p className="mb-3 rounded-2xl bg-gold/15 p-3 text-sm">
              Premium will cover thousands of drinks. For this preview, here's a sample for <b>Pinot Noir</b>.
            </p>
          )}
          <p className="text-xs font-semibold uppercase tracking-widest text-berry/70">
            {drink.emoji} Pairs with {drink.name}
          </p>

          <div className="mt-3 rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-4xl">{FOOD_EMOJI[foods[0]] || '🍽️'}</div>
            <div className="mt-2 font-display text-xl font-bold">{pretty(foods[0])}</div>
            <p className="mt-1 text-sm text-ink/80">
              <b>{drink.principle}.</b> {drink.why}
            </p>
          </div>

          <h2 className="mb-2 mt-6 font-semibold">More ideas + a full recipe</h2>
          <UpgradePrompt sub="Get more food pairings and step-by-step recipes for whatever's in your glass." onUpgrade={onUpgrade}>
            <div className="flex flex-col gap-3">
              {foods.slice(1).map((f) => (
                <div key={f} className="rounded-3xl bg-white p-5 shadow-sm">
                  <div className="text-3xl">{FOOD_EMOJI[f] || '🍽️'}</div>
                  <div className="mt-1 font-display text-lg font-bold">{pretty(f)}</div>
                  <p className="text-sm">A great match for the same reasons: flavor, weight and texture all line up.</p>
                </div>
              ))}
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <div className="font-display text-lg font-bold">📖 Recipe: 30-minute {pretty(foods[0]).toLowerCase()}</div>
                <p className="text-sm">Ingredients · Steps · Timing · Serving tips</p>
              </div>
            </div>
          </UpgradePrompt>
        </div>
      )}
    </>
  )
}
