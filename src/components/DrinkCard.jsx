import { useState } from 'react'
import { TYPE_LABELS } from '../logic/recommend.js'

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

export default function DrinkCard({ pick, primary = false, dishLabel, contrast }) {
  const [open, setOpen] = useState(primary)
  const { drink, principle, moodLine, price, overBudget, classic } = pick

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

      {open && (
        <div className="flex flex-col gap-4 border-t border-sand px-5 pb-5 pt-4">
          <Detail icon="💬" title="Why it works">
            {drink.why}
          </Detail>
          <Detail icon="🧪" title={`The pairing principle${dishLabel ? ` with ${dishLabel}` : ''}`}>
            <b>{principle.name}.</b> {principle.text}
          </Detail>
          <Detail icon="🫶" title="Why it fits your mood">
            {moodLine}
          </Detail>
          <Detail icon="📜" title="Fun fact">
            {drink.funFact}
          </Detail>
          <Detail icon="🛒" title="At the store, look for">
            {drink.lookFor}
          </Detail>
        </div>
      )}
    </article>
  )
}
