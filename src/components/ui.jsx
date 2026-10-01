// Small shared UI building blocks.

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-berry text-white hover:bg-berry-dark disabled:bg-berry/30 disabled:cursor-not-allowed shadow-sm',
    secondary: 'bg-white text-berry border-2 border-berry/20 hover:border-berry/50',
    ghost: 'text-berry hover:bg-berry-light',
    gold: 'bg-gold text-ink hover:brightness-95 shadow-sm',
  }
  return (
    <button
      className={`w-full rounded-2xl px-5 py-3.5 font-semibold transition active:scale-[0.98] ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function ChoiceCard({ emoji, label, sub, selected, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition active:scale-[0.98] ${
        selected ? 'border-berry bg-berry-light' : 'border-transparent bg-white hover:border-berry/30'
      } ${className}`}
    >
      {emoji && <span className="text-3xl leading-none">{emoji}</span>}
      <span className="flex-1">
        <span className="block font-semibold">{label}</span>
        {sub && <span className="block text-sm text-muted">{sub}</span>}
      </span>
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs text-white ${
          selected ? 'border-berry bg-berry' : 'border-berry/20'
        }`}
      >
        {selected && '✓'}
      </span>
    </button>
  )
}

export function Chip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border-2 px-3.5 py-1.5 text-sm font-medium transition active:scale-95 ${
        selected ? 'border-berry bg-berry text-white' : 'border-berry/15 bg-white text-ink hover:border-berry/40'
      }`}
    >
      {label}
    </button>
  )
}

export function ScreenTitle({ eyebrow, title, sub }) {
  return (
    <div className="mb-6">
      {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-berry/70">{eyebrow}</p>}
      <h1 className="font-display text-3xl leading-tight text-ink">{title}</h1>
      {sub && <p className="mt-2 text-muted">{sub}</p>}
    </div>
  )
}

export function SectionLabel({ children, hint }) {
  return (
    <div className="mb-2 mt-6 flex items-baseline justify-between first:mt-0">
      <h2 className="font-semibold text-ink">{children}</h2>
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </div>
  )
}

export function LockBadge({ children = 'Premium' }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-semibold text-[#8a6412]">
      🔒 {children}
    </span>
  )
}

// Sticky bottom action area so the main CTA is always reachable on a phone.
export function BottomBar({ children }) {
  return <div className="sticky bottom-0 -mx-5 mt-8 bg-gradient-to-t from-cream via-cream to-cream/0 px-5 pb-4 pt-6">{children}</div>
}

// Row of equal-width options, one selectable (e.g. sweetness scale, style cues).
export function Segmented({ options, value, onChange, size = 'md' }) {
  return (
    <div className="flex gap-1 rounded-2xl bg-white p-1 shadow-sm">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={`flex-1 rounded-xl px-1 font-medium leading-tight transition ${size === 'sm' ? 'py-1.5 text-xs' : 'py-2.5 text-sm'} ${
            value === o.id ? 'bg-berry text-white shadow-sm' : 'text-ink/80 hover:bg-berry-light'
          }`}
        >
          {o.label}
          {o.sub && <span className={`block text-[11px] ${value === o.id ? 'text-white/80' : 'text-muted'}`}>{o.sub}</span>}
        </button>
      ))}
    </div>
  )
}
