import logo from '../assets/sipmatch-logo.png'

// Phone-width app shell: header (back / logo / premium), optional progress bar, content, footer.

// Each part of the flow gets its own label and colour so the profile and the quiz feel separate.
const PHASES = {
  profile: { icon: '👤', label: 'Your taste profile', text: 'text-[#8a6412]', bar: 'bg-gold', bg: 'bg-gold/15' },
  quiz: { icon: '🍸', label: "Tonight's match", text: 'text-berry', bar: 'bg-berry', bg: 'bg-berry-light' },
}

export function Header({ onBack, onLogo, onPremium, onMyDrinks, onCommunity, savedCount = 0, phase }) {
  return (
    <header className="sticky top-0 z-20">
      {/* Logo banner in the logo's own cocoa / blush / vanilla palette */}
      <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-2 bg-cocoa px-3 lg:h-16 lg:px-8">
        <div className="flex min-w-0 items-center gap-1">
          {onBack && (
            <button
              onClick={onBack}
              className="whitespace-nowrap rounded-full px-2 py-1 text-sm font-medium text-vanilla/85 hover:bg-white/10"
              aria-label="Go back"
            >
              ←<span className="hidden min-[400px]:inline"> Back</span>
            </button>
          )}
          {onMyDrinks && (
            <button
              onClick={onMyDrinks}
              aria-label={`My drinks (${savedCount} saved)`}
              className="whitespace-nowrap rounded-full bg-blush px-2.5 py-1 text-xs font-semibold text-cocoa hover:bg-blush/85"
            >
              ♥ {savedCount}
            </button>
          )}
        </div>
        <button onClick={onLogo} className="flex justify-center" disabled={!onLogo} aria-label="SipMatch home">
          <img src={logo} alt="SipMatch" className="h-9 w-auto lg:h-12" />
        </button>
        <div className="flex min-w-0 items-center justify-end gap-1">
          {onCommunity && (
            <button
              onClick={onCommunity}
              aria-label="Community groups"
              title="Community"
              className="whitespace-nowrap rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-vanilla hover:bg-white/20"
            >
              👥
            </button>
          )}
          {onPremium && (
            <button
              onClick={onPremium}
              aria-label="Premium"
              className="whitespace-nowrap rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-cocoa hover:bg-gold/85"
            >
              ✨<span className="hidden min-[400px]:inline"> Premium</span>
            </button>
          )}
        </div>
      </div>
      {phase && (
        <div className="bg-cream/95 px-5 pb-2 pt-2 backdrop-blur lg:px-10">
        <div className={`rounded-2xl px-3 py-2 ${PHASES[phase.kind].bg}`}>
          <div className={`mb-1.5 flex items-center justify-between text-xs font-semibold ${PHASES[phase.kind].text}`}>
            <span>
              {PHASES[phase.kind].icon} {phase.editing ? 'Editing your taste profile' : PHASES[phase.kind].label}
            </span>
            <span>
              {phase.step} of {phase.total}
            </span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: phase.total }, (_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i < phase.step ? PHASES[phase.kind].bar : 'bg-white'}`} />
            ))}
          </div>
        </div>
        </div>
      )}
    </header>
  )
}

export function Footer() {
  return (
    <footer className="px-5 pb-6 pt-2 text-center text-xs text-muted">
      🍃 Please drink responsibly. For adults 21+ only.
      <br />
      <span className="opacity-70">SipMatch prototype · USC MOR 531</span>
    </footer>
  )
}

export function Shell({ header, children }) {
  return (
    <div className="flex min-h-screen justify-center sm:py-6">
      <div className="flex min-h-screen w-full max-w-md flex-col bg-cream lg:max-w-5xl sm:min-h-[calc(100vh-3rem)] sm:overflow-clip sm:rounded-[2rem] sm:shadow-2xl sm:shadow-berry/10">
        {header}
        <main className="flex flex-1 flex-col px-5 pb-2 pt-4 lg:px-10 lg:pt-6">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
