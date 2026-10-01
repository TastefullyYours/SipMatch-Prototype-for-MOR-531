// Save / rate / note controls for a drink. Saved drinks live in profile.saved = { [drinkId]: { rating, note } }.

export function SaveButton({ drinkId, saved, onToggle }) {
  const on = !!saved[drinkId]
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onToggle(drinkId)
      }}
      aria-pressed={on}
      className={`shrink-0 rounded-full border-2 px-3 py-1 text-xs font-semibold transition ${
        on ? 'border-berry bg-berry text-white' : 'border-berry/20 bg-white text-berry hover:border-berry/50'
      }`}
    >
      {on ? '♥ Saved' : '♡ Save'}
    </button>
  )
}

export function Stars({ value, onChange }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onClick={() => onChange(value === n ? 0 : n)}
          className={`text-2xl leading-none transition active:scale-90 ${n <= value ? 'text-gold' : 'text-ink/15 hover:text-gold/50'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

// Rating + note editor, shown on a saved drink.
export function RateAndNote({ entry, onChange }) {
  return (
    <div className="rounded-2xl bg-cream p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-berry/80">Your rating</span>
        <Stars value={entry.rating} onChange={(rating) => onChange({ ...entry, rating })} />
      </div>
      <textarea
        value={entry.note}
        onChange={(e) => onChange({ ...entry, note: e.target.value })}
        placeholder="Add a note: where you bought it, what you ate it with…"
        rows={2}
        className="mt-2 w-full resize-none rounded-xl border-2 border-berry/10 bg-white px-3 py-2 text-sm outline-none placeholder:text-muted/60 focus:border-berry"
      />
      {entry.rating > 0 && (
        <p className="mt-1 text-xs text-muted">
          {entry.rating >= 4 ? 'We’ll suggest more drinks like this.' : entry.rating <= 2 ? 'We’ll suggest fewer drinks like this.' : 'Thanks! Noted.'}
        </p>
      )}
    </div>
  )
}
