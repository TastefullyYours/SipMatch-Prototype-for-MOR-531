import { formatTyped, fromISO, readBirthday, todayISO } from '../logic/birthday.js'

// Typed MM/DD/YYYY birthday with a native calendar button. Shared by the guest age gate and sign-up.

export default function BirthdayField({ id = 'birthday', text, setText, onEnter }) {
  const { iso, valid } = readBirthday(text)
  return (
    <>
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="bday"
          placeholder="MM/DD/YYYY"
          value={text}
          onChange={(e) => setText(formatTyped(e.target.value))}
          onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
          className="min-w-0 flex-1 rounded-2xl border-2 border-berry/15 bg-cream px-4 py-3.5 text-center text-lg tracking-wider outline-none focus:border-berry"
        />
        {/* The real date input sits invisibly over the button, so tapping it opens the phone's own calendar. */}
        <label className="relative flex w-14 shrink-0 cursor-pointer items-center justify-center rounded-2xl border-2 border-berry/15 bg-cream text-2xl hover:border-berry/40">
          <span aria-hidden>📅</span>
          <span className="sr-only">Pick from calendar</span>
          <input
            type="date"
            value={iso || ''}
            max={todayISO()}
            min="1900-01-01"
            onChange={(e) => setText(fromISO(e.target.value))}
            onClick={(e) => e.currentTarget.showPicker?.()}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
      </div>
      {text.length === 10 && !valid && <p className="mt-2 text-center text-sm text-berry">Hmm, that doesn't look like a real date.</p>}
    </>
  )
}
