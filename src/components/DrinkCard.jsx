import { useState } from 'react'
import { TYPE_LABELS } from '../logic/recommend.js'
import { RateAndNote, SaveButton } from './SavedDrink.jsx'
import { RECIPES } from '../data/recipes.js'

function Detail({ icon, title, children }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-lg leading-none">{icon}</span>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-berry/80">{title}</h4>
        <div className="mt-0.5 text-[15px] leading-relaxed text-ink/90">{children}</div>
      </div>
    </div>
  )
}

function PriceTag({ price, overBudget }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-2.5 py-0.5 text-xs font-semibold">
      <span className="text-berry">{price.symbol}</span>
      <span className="text-muted">{price.range}</span>
      {overBudget && <span className="text-[#8a6412]">· a splurge</span>}
    </span>
  )
}

// "How to make it" for cocktails and mixed drinks: shown first, since it's what you need at home.
function Recipe({ recipe }) {
  return (
    <div className="rounded-2xl bg-cream p-4">
      <h4 className="text-sm font-semibold text-berry">🍹 How to make it</h4>
      <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-muted">{recipe.glass}</p>
      <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed text-ink/90">
        {recipe.ingredients.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
      <ol className="mt-2 list-decimal pl-5 text-sm leading-relaxed text-ink/90">
        {recipe.steps.map((st) => (
          <li key={st}>{st}</li>
        ))}
      </ol>
    </div>
  )
}

export default function DrinkCard({ pick, primary = false, defaultOpen = false, dishLabel, contrast, saved = {}, setSaved, fitTitle = 'Why it fits your mood' }) {
  const [open, setOpen] = useState(primary || defaultOpen)
  const [more, setMore] = useState(false)
  const { drink, principle, moodLine, price, overBudget, classic, likeOf } = pick
  const recipe = RECIPES[drink.id]

  return (
    <article
      className={`overflow-hidden rounded-3xl bg-white shadow-sm ${primary ? 'ring-2 ring-berry shadow-lg shadow-berry/10' : ''}`}
    >
      {primary && (
        <div className="bg-berry px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white">⭐ Your top match</div>
      )}
      {contrast && (
        <div className="bg-berry-light px-5 py-2 text-sm font-semibold text-berry">
          {contrast.emoji} {contrast.text}
        </div>
      )}

      <button type="button" onClick={() => !primary && setOpen(!open)} className="flex w-full items-start gap-3 p-5 text-left" disabled={primary}>
        <span className={`${primary ? 'text-5xl' : 'text-4xl'} leading-none`}>{drink.emoji}</span>
        <span className="flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">{TYPE_LABELS[drink.type]}</span>
          <span className={`block font-display font-bold leading-tight ${primary ? 'text-2xl' : 'text-xl'}`}>{drink.name}</span>
          <span className="mt-1 block text-sm text-muted">{drink.style}</span>
          <span className="mt-2 flex flex-wrap gap-1.5">
            <PriceTag price={price} overBudget={overBudget} />
            {classic && (
              <span className="rounded-full bg-berry-light px-2.5 py-0.5 text-xs font-semibold text-berry">🏆 Classic pairing</span>
            )}
          </span>
        </span>
        {!primary && <span className={`mt-1 text-muted transition ${open ? 'rotate-180' : ''}`}>⌄</span>}
      </button>

      {setSaved && (
        <div className="-mt-2 flex flex-col gap-2 px-5 pb-4">
          <div className="flex items-center gap-2">
            <SaveButton
              drinkId={drink.id}
              saved={saved}
              onToggle={(id) => {
                const next = { ...saved }
                if (next[id]) delete next[id]
                else next[id] = { rating: 0, note: '' }
                setSaved(next)
              }}
            />
            {!saved[drink.id] && <span className="text-xs text-muted">Save it to rate it and add a note</span>}
          </div>
          {saved[drink.id] && <RateAndNote entry={saved[drink.id]} onChange={(e) => setSaved({ ...saved, [drink.id]: e })} />}
        </div>
      )}

      {open && (
        <div className="flex flex-col gap-3 border-t border-sand px-5 pb-5 pt-4">
          {recipe ? (
            <Recipe recipe={recipe} />
          ) : (
            <Detail icon="🛒" title="At the store, look for">
              {drink.lookFor}
            </Detail>
          )}
          <button
            type="button"
            onClick={() => setMore(!more)}
            aria-expanded={more}
            className="flex items-center justify-between rounded-2xl border-2 border-sand px-4 py-2.5 text-left text-sm font-semibold text-berry hover:border-berry/30"
          >
            {more ? 'Less about this drink' : 'More about this drink'}
            <span className={`transition ${more ? 'rotate-180' : ''}`}>⌄</span>
          </button>
          {more && (
            <div className="flex flex-col gap-4 pt-1">
              <Detail icon="💬" title="Why it works">
                {drink.why}
              </Detail>
              <Detail icon="🧪" title={`The pairing principle${dishLabel ? ` with ${dishLabel}` : ''}`}>
                <b>{principle.name}.</b> {principle.text}
              </Detail>
              {likeOf && (
                <Detail icon="❤️" title="Based on your taste">
                  {likeOf.id === drink.id ? 'One of your favorites! You said you love it.' : `Similar to ${likeOf.name}, which you said you love.`}
                </Detail>
              )}
              <Detail icon="🫶" title={fitTitle}>
                {moodLine}
              </Detail>
              <Detail icon="📜" title="Fun fact">
                {drink.funFact}
              </Detail>
              {recipe && (
                <Detail icon="🛒" title="At the store, look for">
                  {drink.lookFor}
                </Detail>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  )
}
