import { Button, LockBadge, ScreenTitle } from '../components/ui.jsx'

function FeatureCard({ emoji, title, sub, onClick, badge }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-4 rounded-3xl bg-white p-5 text-left shadow-sm transition hover:shadow-md active:scale-[0.99]">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-berry-light text-3xl">{emoji}</span>
      <span className="flex-1">
        {badge}
        <span className="mt-1 block font-display text-lg font-bold leading-tight">{title}</span>
        <span className="mt-0.5 block text-sm text-muted">{sub}</span>
      </span>
      <span className="text-berry">→</span>
    </button>
  )
}

export default function Premium({ onCart, onReverse, onCommunity, onPaywall }) {
  return (
    <>
      <ScreenTitle eyebrow="✨ SipMatch Premium" title="Match smarter, wherever you are" sub="Try a preview of what Premium members get." />

      <div className="grid gap-3 lg:grid-cols-2">
        <FeatureCard
          emoji="🛒"
          title="Snap your cart"
          sub="Take a photo of your grocery cart. We'll spot the ingredients and match drinks to the whole meal."
          badge={<LockBadge>Premium · Preview</LockBadge>}
          onClick={onCart}
        />
        <FeatureCard
          emoji="🔄"
          title="Here's what I'm drinking"
          sub="Already have a bottle? Tell us what it is and get food and recipe ideas that go with it."
          badge={<LockBadge>Premium · Preview</LockBadge>}
          onClick={onReverse}
        />
      </div>

      <h2 className="mb-1 mt-8 font-semibold">Taste communities</h2>
      <p className="mb-3 text-sm text-muted">Swap tips and finds with people who like what you like.</p>
      <FeatureCard
        emoji="👥"
        title="Groups & chat"
        sub="Join groups like Gin Lovers or Natural Wine, start your own, and share drinks you love in the chat."
        badge={<LockBadge>Premium · Preview</LockBadge>}
        onClick={onCommunity}
      />

      <div className="mt-8">
        <Button variant="gold" onClick={onPaywall}>
          See Premium plans
        </Button>
      </div>
    </>
  )
}
