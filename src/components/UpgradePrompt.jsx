import { Button } from './ui.jsx'

// Blurs its children and overlays an upgrade call-to-action.
export default function UpgradePrompt({ children, title = 'Unlock with Premium', sub, onUpgrade }) {
  return (
    <div className="relative overflow-hidden rounded-3xl">
      <div aria-hidden className="pointer-events-none select-none blur-[5px]">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-cream/60 p-6 text-center">
        <div className="text-3xl">🔒</div>
        <p className="mt-2 font-display text-xl font-bold">{title}</p>
        {sub && <p className="mt-1 max-w-xs text-sm text-muted">{sub}</p>}
        <Button variant="gold" className="mt-4 max-w-xs" onClick={onUpgrade}>
          Upgrade to Premium
        </Button>
      </div>
    </div>
  )
}
