import { ABV_LEVELS, CALIBRATION_DRINKS, CATEGORIES, FLAVORS, RESTRICTIONS, SWEETNESS } from '../data/options.js'
import { DRINKS } from '../logic/recommend.js'
import { BottomBar, Button, ChoiceCard, Chip, ScreenTitle, SectionLabel, Segmented } from '../components/ui.jsx'
import { ProfileCard } from '../components/ProfileSummary.jsx'

// Taste profile: 4 short screens (palate → what you drink → restrictions → calibration).

const toggle = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
const without = (list, id) => list.filter((x) => x !== id)

const TOPICS = ['Palate', 'Drink habits', 'Things to avoid', 'Calibration']
function eyebrow(editing, n) {
  return editing ? `Editing profile · ${TOPICS.at(n - 1)}` : TOPICS.at(n - 1)
}

function NextBar({ editing, last, disabled, onNext, onSave, onSkip, onSkipStep, children }) {
  return (
    <BottomBar>
      <div className="flex flex-col gap-2">
        {children}
        <Button variant="gold" disabled={disabled} onClick={onNext}>
          {last ? (editing ? 'Save & see new matches' : 'Save my profile') : 'Next'}
        </Button>
        {editing && !last && (
          <Button variant="ghost" disabled={disabled} onClick={onSave}>
            Save & see new matches
          </Button>
        )}
        {!editing && onSkipStep && (
          <Button variant="ghost" onClick={onSkipStep}>
            Skip this step ⏭️
          </Button>
        )}
        {!editing && onSkip && (
          <button type="button" onClick={onSkip} className="py-1 text-sm font-medium text-muted underline-offset-2 hover:underline">
            Skip the rest of the profile
          </button>
        )}
      </div>
    </BottomBar>
  )
}

export function ProfilePalate({ profile, setProfile, editing, onNext, onSave, onSkip }) {
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

      <SectionLabel hint="pick any">How sweet do you like it?</SectionLabel>
      <Segmented multi options={SWEETNESS} value={profile.sweetness} onChange={(v) => setProfile({ ...profile, sweetness: v })} size="sm" />
      <div className="mt-1.5 flex justify-between px-1 text-[11px] text-muted">
        <span>🌵 Not sugary</span>
        <span>Dessert-y 🍭</span>
      </div>

      <NextBar
        editing={editing}
        disabled={!profile.sweetness.length && !profile.likes.length && !profile.dislikes.length}
        onNext={onNext}
        onSave={onSave}
        onSkip={onSkip}
        onSkipStep={onNext}
      />
    </>
  )
}

export function ProfileDrinks({ profile, setProfile, editing, onNext, onSave, onSkip }) {
  const { categories, strengths } = profile
  return (
    <>
      <ScreenTitle eyebrow={eyebrow(editing, 2)} title="What do you usually drink?" sub="Pick everything that applies. We'll stick to these." />

      <SectionLabel hint="pick any">What you drink</SectionLabel>
      <div className="grid gap-2 lg:grid-cols-2">
        {CATEGORIES.map((c) => (
          <ChoiceCard
            key={c.id}
            emoji={c.emoji}
            label={c.label}
            selected={categories.includes(c.id)}
            onClick={() => setProfile({ ...profile, categories: toggle(categories, c.id) })}
          />
        ))}
      </div>

      <SectionLabel hint="pick any">How strong?</SectionLabel>
      <div className="grid gap-2 lg:grid-cols-3">
        {ABV_LEVELS.map((a) => (
          <ChoiceCard key={a.id} {...a} selected={strengths.includes(a.id)} onClick={() => setProfile({ ...profile, strengths: toggle(strengths, a.id) })} />
        ))}
      </div>

      <NextBar editing={editing} disabled={!categories.length && !strengths.length} onNext={onNext} onSave={onSave} onSkip={onSkip} onSkipStep={onNext}>
        {(!categories.length || !strengths.length) && (
          <p className="text-center text-sm text-muted">Pick at least one drink type and one strength.</p>
        )}
      </NextBar>
    </>
  )
}

export function ProfileAvoid({ profile, setProfile, editing, onNext, onSave, onSkip }) {
  return (
    <>
      <ScreenTitle
        eyebrow={eyebrow(editing, 3)}
        title="Anything to avoid?"
        sub="Allergies, sensitivities or things you just can't stand. We'll never suggest drinks that usually contain them."
      />

      <div className="grid gap-2 lg:grid-cols-2">
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

      <NextBar editing={editing} onNext={onNext} onSave={onSave} onSkip={onSkip} onSkipStep={onNext} />
    </>
  )
}

export function ProfileCalibrate({ profile, setProfile, editing, onNext }) {
  const { loved, hated } = profile
  const drinks = CALIBRATION_DRINKS.map((id) => DRINKS.find((d) => d.id === id))
  const lovedOk = loved.length >= 3 && loved.length <= 5
  const hatedOk = hated.length === 2
  const skipped = loved.length === 0 && hated.length === 0

  // Each drink has two explicit buttons; tapping the active one again clears it.
  const set = (id, state) =>
    setProfile({
      ...profile,
      loved: state === 'love' ? [...without(loved, id), id] : without(loved, id),
      hated: state === 'pass' ? [...without(hated, id), id] : without(hated, id),
    })

  return (
    <>
      <ScreenTitle
        eyebrow={eyebrow(editing, 4)}
        title="Rate a few drinks you know"
        sub="Mark 3–5 you love and 2 you'd pass on. Skip any you haven't tried."
      />

      <div className="sticky top-[7.5rem] lg:top-[8.5rem] lg:-mx-10 lg:px-10 z-10 -mx-5 mb-3 flex gap-2 bg-cream/95 px-5 py-2 text-sm backdrop-blur">
        <span className={`flex-1 rounded-2xl p-2.5 text-center font-semibold ${lovedOk ? 'bg-berry text-white' : 'bg-white'}`}>
          👍 Love: {loved.length} of 3–5
        </span>
        <span className={`flex-1 rounded-2xl p-2.5 text-center font-semibold ${hatedOk ? 'bg-ink text-white' : 'bg-white'}`}>
          👎 Pass: {hated.length} of 2
        </span>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm lg:grid lg:grid-cols-2">
        {drinks.map((d) => {
          const isLove = loved.includes(d.id)
          const isPass = hated.includes(d.id)
          const loveFull = !isLove && loved.length >= 5
          const passFull = !isPass && hated.length >= 2
          return (
            <div key={d.id} className="flex items-center gap-3 border-b border-sand px-4 py-2.5 last:border-0">
              <span className="text-2xl">{d.emoji}</span>
              <span className="flex-1 text-sm font-medium">{d.name}</span>
              <button
                type="button"
                aria-pressed={isLove}
                disabled={loveFull}
                onClick={() => set(d.id, isLove ? null : 'love')}
                className={`rounded-full border-2 px-3 py-1 text-xs font-semibold transition disabled:opacity-30 ${
                  isLove ? 'border-berry bg-berry text-white' : 'border-berry/20 text-berry hover:border-berry/50'
                }`}
              >
                👍 Love
              </button>
              <button
                type="button"
                aria-pressed={isPass}
                disabled={passFull}
                onClick={() => set(d.id, isPass ? null : 'pass')}
                className={`rounded-full border-2 px-3 py-1 text-xs font-semibold transition disabled:opacity-30 ${
                  isPass ? 'border-ink bg-ink text-white' : 'border-ink/15 text-ink/70 hover:border-ink/40'
                }`}
              >
                👎 Pass
              </button>
            </div>
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

// Shown once after the age gate: explains the two parts of SipMatch.
export function ProfileIntro({ onNext, onSkip }) {
  return (
    <>
      <ScreenTitle eyebrow="Welcome to SipMatch" title="Two quick parts, then your match" sub="We split it up so you only answer the “who you are” questions once." />

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-2 ring-gold/50">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-sm font-bold text-ink">1</span>
            <span className="font-display text-xl font-bold">Your taste profile</span>
          </div>
          <p className="mt-2 text-sm text-ink/80">What you like, what you drink and anything to avoid.</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#8a6412]">👤 Once · 4 short screens</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-2 ring-berry/30">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-berry text-sm font-bold text-white">2</span>
            <span className="font-display text-xl font-bold">Tonight's match</span>
          </div>
          <p className="mt-2 text-sm text-ink/80">Your mood, the occasion, tonight's budget and what's for dinner.</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-berry">🍸 Every time · 4 quick steps</p>
        </div>
      </div>

      <BottomBar>
        <div className="flex flex-col gap-2">
          <Button variant="gold" onClick={onNext}>
            Build my taste profile
          </Button>
          <Button variant="ghost" onClick={onSkip}>
            Skip it, just match me ⚡
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-muted">You can fill in your profile any time later.</p>
      </BottomBar>
    </>
  )
}

// Shown once the profile is finished, before the first match.
export function ProfileDone({ profile, onNext, onEdit }) {
  return (
    <>
      <div className="mb-5 text-center">
        <div className="text-5xl">🎉</div>
        <h1 className="mt-2 font-display text-3xl leading-tight">Profile saved!</h1>
        <p className="mt-2 text-muted">You won't need to answer these again. Edit them any time from your results.</p>
      </div>

      <ProfileCard profile={profile} />

      <BottomBar>
        <div className="flex flex-col gap-2">
          <Button onClick={onNext}>Start tonight's match 🍸</Button>
          <Button variant="ghost" onClick={onEdit}>
            Change something
          </Button>
        </div>
      </BottomBar>
    </>
  )
}
