import { ABV_LEVELS, CALIBRATION_DRINKS, CATEGORIES, CATEGORY_LEVELS, FLAVORS, RESTRICTIONS, SWEETNESS } from '../data/options.js'
import { DRINKS } from '../logic/recommend.js'
import { BottomBar, Button, ChoiceCard, Chip, ScreenTitle, SectionLabel, Segmented } from '../components/ui.jsx'

// Taste profile: 4 short screens (palate → what you drink → restrictions → calibration).

const toggle = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
const without = (list, id) => list.filter((x) => x !== id)

function eyebrow(editing, n) {
  return editing ? `Edit profile · ${n} of 4` : `Your profile · ${n} of 4`
}

function NextBar({ editing, last, disabled, onNext, onSave, children }) {
  return (
    <BottomBar>
      <div className="flex flex-col gap-2">
        {children}
        <Button disabled={disabled} onClick={onNext}>
          {last ? (editing ? 'Save & see new matches' : 'Start matching ✨') : 'Next'}
        </Button>
        {editing && !last && (
          <Button variant="ghost" disabled={disabled} onClick={onSave}>
            Save & see new matches
          </Button>
        )}
      </div>
    </BottomBar>
  )
}

export function ProfilePalate({ profile, setProfile, editing, onNext, onSave }) {
  const { likes, dislikes } = profile
  return (
    <>
      <ScreenTitle eyebrow={eyebrow(editing, 1)} title="What's your palate like?" sub="No wrong answers. Go with your gut." />

      <SectionLabel hint="pick any">Flavors you love</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {FLAVORS.map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            selected={likes.includes(f.id)}
            onClick={() => setProfile({ ...profile, likes: toggle(likes, f.id), dislikes: without(dislikes, f.id) })}
          />
        ))}
      </div>

      <SectionLabel hint="we'll steer clear">Flavors you don't like</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {FLAVORS.map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            selected={dislikes.includes(f.id)}
            onClick={() => setProfile({ ...profile, dislikes: toggle(dislikes, f.id), likes: without(likes, f.id) })}
          />
        ))}
      </div>

      <SectionLabel>How sweet do you like it?</SectionLabel>
      <Segmented options={SWEETNESS} value={profile.sweetness} onChange={(v) => setProfile({ ...profile, sweetness: v })} size="sm" />
      <div className="mt-1.5 flex justify-between px-1 text-[11px] text-muted">
        <span>🌵 Not sugary</span>
        <span>Dessert-y 🍭</span>
      </div>

      <NextBar editing={editing} disabled={!profile.sweetness} onNext={onNext} onSave={onSave} />
    </>
  )
}

export function ProfileDrinks({ profile, setProfile, editing, onNext, onSave }) {
  const cats = profile.categories
  const anyOn = Object.values(cats).some((v) => v > 0)
  return (
    <>
      <ScreenTitle eyebrow={eyebrow(editing, 2)} title="What do you usually drink?" sub="Tell us how you split your drinks, and how strong you like them." />

      <div className="flex flex-col gap-4">
        {CATEGORIES.map((c) => (
          <div key={c.id}>
            <p className="mb-1.5 text-sm font-semibold">
              {c.emoji} {c.label}
            </p>
            <Segmented
              options={CATEGORY_LEVELS}
              value={cats[c.id]}
              onChange={(v) => setProfile({ ...profile, categories: { ...cats, [c.id]: v } })}
              size="sm"
            />
          </div>
        ))}
      </div>

      <SectionLabel>How strong?</SectionLabel>
      <div className="flex flex-col gap-2">
        {ABV_LEVELS.map((a) => (
          <ChoiceCard key={a.id} {...a} selected={profile.abvMax === a.id} onClick={() => setProfile({ ...profile, abvMax: a.id })} />
        ))}
      </div>

      <NextBar editing={editing} disabled={!anyOn || !profile.abvMax} onNext={onNext} onSave={onSave}>
        {!anyOn && <p className="text-center text-sm text-berry">Pick at least one category you drink.</p>}
      </NextBar>
    </>
  )
}

export function ProfileAvoid({ profile, setProfile, editing, onNext, onSave }) {
  return (
    <>
      <ScreenTitle
        eyebrow={eyebrow(editing, 3)}
        title="Anything to avoid?"
        sub="Allergies, sensitivities or things you just can't stand. We'll never suggest drinks that usually contain them."
      />

      <div className="flex flex-col gap-2">
        {RESTRICTIONS.map((r) => (
          <ChoiceCard
            key={r.id}
            label={r.label}
            sub={r.hint}
            selected={profile.restrictions.includes(r.id)}
            onClick={() => setProfile({ ...profile, restrictions: toggle(profile.restrictions, r.id) })}
          />
        ))}
      </div>
      <p className="mt-4 rounded-2xl bg-white p-3 text-xs leading-relaxed text-muted">
        ⚠️ SipMatch uses typical recipes, not specific brands. If you have a serious allergy, always check the label.
      </p>

      <NextBar editing={editing} onNext={onNext} onSave={onSave} />
    </>
  )
}

export function ProfileCalibrate({ profile, setProfile, editing, onNext }) {
  const { loved, hated } = profile
  const drinks = CALIBRATION_DRINKS.map((id) => DRINKS.find((d) => d.id === id))
  const lovedOk = loved.length >= 3 && loved.length <= 5
  const hatedOk = hated.length === 2
  const skipped = loved.length === 0 && hated.length === 0

  return (
    <>
      <ScreenTitle
        eyebrow={eyebrow(editing, 4)}
        title="Rate a few drinks you know"
        sub="This helps us learn your taste. Pick 3–5 you love and 2 you'd pass on."
      />

      <div className="mb-3 flex gap-2 text-sm">
        <span className={`flex-1 rounded-2xl p-2.5 text-center font-semibold ${lovedOk ? 'bg-berry text-white' : 'bg-white'}`}>
          ❤️ Love: {loved.length}/3–5
        </span>
        <span className={`flex-1 rounded-2xl p-2.5 text-center font-semibold ${hatedOk ? 'bg-ink text-white' : 'bg-white'}`}>
          👎 Pass: {hated.length}/2
        </span>
      </div>
      <p className="mb-3 text-sm text-muted">Tap once for ❤️ love, twice for 👎 pass, three times to clear.</p>
      <div className="flex flex-wrap gap-2">
        {drinks.map((d) => {
          const state = loved.includes(d.id) ? 'love' : hated.includes(d.id) ? 'hate' : null
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                // Cycle: none → love → pass → none (skipping a state that's already full).
                const canLove = loved.length < 5
                const canHate = hated.length < 2
                const next = state === null ? (canLove ? 'love' : canHate ? 'hate' : null) : state === 'love' ? (canHate ? 'hate' : null) : null
                setProfile({
                  ...profile,
                  loved: next === 'love' ? [...without(loved, d.id), d.id] : without(loved, d.id),
                  hated: next === 'hate' ? [...without(hated, d.id), d.id] : without(hated, d.id),
                })
              }}
              className={`rounded-full border-2 px-3.5 py-1.5 text-sm font-medium transition active:scale-95 ${
                state === 'love'
                  ? 'border-berry bg-berry text-white'
                  : state === 'hate'
                    ? 'border-ink bg-ink text-white'
                    : 'border-berry/15 bg-white text-ink hover:border-berry/40'
              }`}
            >
              {state === 'love' ? '❤️ ' : state === 'hate' ? '👎 ' : `${d.emoji} `}
              {d.name}
            </button>
          )
        })}
      </div>

      <NextBar editing={editing} last disabled={!(lovedOk && hatedOk)} onNext={onNext}>
        {skipped && (
          <Button variant="ghost" onClick={onNext}>
            I'm new to this, skip for now
          </Button>
        )}
      </NextBar>
    </>
  )
}
