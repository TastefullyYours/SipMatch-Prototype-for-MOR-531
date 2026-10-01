import { Component } from 'react'

// Catches any crash while drawing the app and shows a friendly restart screen instead of a blank page.
// The error text is shown small so testers can screenshot it for debugging.
export default class ErrorBoundary extends Component {
  state = { error: null, componentStack: '', copied: false }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('SipMatch crashed:', error, info?.componentStack)
    this.setState({ componentStack: info?.componentStack || '' })
  }

  // Everything needed to debug from a screenshot or a paste: message, where it was thrown, browser.
  details() {
    const { error, componentStack } = this.state
    const stack = String(error?.stack || '').split('\n').slice(0, 8).join('\n')
    const comps = componentStack.split('\n').filter(Boolean).slice(0, 4).join('\n')
    return `${error?.message || error}\n\nWhere:\n${stack}\n\nComponents:\n${comps}\n\nBrowser: ${navigator.userAgent}`
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
          <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-sand p-2 text-left font-mono text-[10px] leading-snug text-muted">
            Error details: {this.details()}
          </pre>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(this.details()).then(() => this.setState({ copied: true }), () => {})
            }}
            className="mt-2 text-xs font-semibold text-berry underline"
          >
            {this.state.copied ? 'Copied!' : 'Copy error details'}
          </button>
        </div>
      </div>
    )
  }
}
