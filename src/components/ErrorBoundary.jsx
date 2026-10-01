import { Component } from 'react'

// Catches any crash while drawing the app and shows a friendly restart screen instead of a blank page.
// The error text is shown small so testers can screenshot it for debugging.
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('SipMatch crashed:', error, info?.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="flex min-h-screen items-center justify-center p-5">
        <div className="w-full max-w-md rounded-3xl bg-cream p-6 text-center shadow-xl">
          <div className="text-5xl">🫗</div>
          <h1 className="mt-3 font-display text-2xl font-bold text-ink">Oops, something spilled</h1>
          <p className="mt-2 text-sm text-muted">
            SipMatch hit a snag. Restarting usually fixes it. If it keeps happening, try turning off browser extensions or page translation for
            this site.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 w-full rounded-2xl bg-berry px-5 py-3.5 font-semibold text-white hover:bg-berry-dark"
          >
            Restart SipMatch
          </button>
          <p className="mt-4 break-words rounded-xl bg-sand p-2 text-left font-mono text-[11px] text-muted">
            Error details: {String(this.state.error?.message || this.state.error)}
          </p>
        </div>
      </div>
    )
  }
}
