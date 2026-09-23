// Phone-width app shell: header (back / logo / premium), optional progress bar, content, footer.

export function Header({ onBack, onLogo, onPremium, progress }) {
  return (
    <header className="sticky top-0 z-20 bg-cream/95 backdrop-blur">
      <div className="flex h-14 items-center gap-2 px-3">
        <div className="w-20">
          {onBack && (
            <button onClick={onBack} className="rounded-full px-2 py-1 text-sm font-medium text-muted hover:bg-sand" aria-label="Go back">
              ← Back
            </button>
          )}
        </div>
        <button onClick={onLogo} className="flex-1 text-center font-display text-xl font-bold text-berry" disabled={!onLogo}>
          SipMatch
        </button>
        <div className="flex w-20 justify-end">
          {onPremium && (
            <button
              onClick={onPremium}
              className="whitespace-nowrap rounded-full bg-gold/20 px-2.5 py-1 text-xs font-semibold text-[#8a6412] hover:bg-gold/30"
            >
              ✨ Premium
            </button>
          )}
        </div>
      </div>
      {progress != null && (
        <div className="mx-5 mb-2 h-1.5 overflow-hidden rounded-full bg-sand">
          <div className="h-full rounded-full bg-berry transition-all duration-500" style={{ width: `${progress * 100}%` }} />
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
      <div className="flex min-h-screen w-full max-w-md flex-col bg-cream sm:min-h-[calc(100vh-3rem)] sm:overflow-clip sm:rounded-[2rem] sm:shadow-2xl sm:shadow-berry/10">
        {header}
        <main className="flex flex-1 flex-col px-5 pb-2 pt-4">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
