import { AGE_GROUPS, BUDGETS, DISLIKES, SWEETNESS, TASTES } from '../data/options.js'
import { BottomBar, Button, ChoiceCard, Chip, ScreenTitle, SectionLabel } from '../components/ui.jsx'

const toggle = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

export function OnboardingBasics({ profile, setProfile, onNext, editing }) {
  const ready = profile.ageGroup && profile.budget
  return (
    <>
      <ScreenTitle
        eyebrow={editing ? 'Edit profile' : 'Step 1 · About you'}
        title="Let's get to know you"
        sub="Two quick questions so we don't suggest a $60 bottle for taco Tuesday."
      />

      <SectionLabel>Your age group</SectionLabel>
      <div className="grid grid-cols-3 gap-2">
        {AGE_GROUPS.map((a) => (
          <button
            key={a.id}
            onClick={() => setProfile({ ...profile, ageGroup: a.id })}
            aria-pressed={profile.ageGroup === a.id}
            className={`rounded-2xl border-2 py-3 font-semibold transition ${
              profile.ageGroup === a.id ? 'border-berry bg-berry-light text-berry' : 'border-transparent bg-white hover:border-berry/30'
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <SectionLabel hint="per bottle / 4-pack">Your usual budget</SectionLabel>
      <div className="flex flex-col gap-2">
        {BUDGETS.map((b) => (
          <ChoiceCard
            key={b.id}
            {...b}
            selected={profile.budget === b.id}
            onClick={() => setProfile({ ...profile, budget: b.id })}
          />
        ))}
      </div>

      <BottomBar>
        <Button disabled={!ready} onClick={onNext}>
          Next
        </Button>
      </BottomBar>
    </>
  )
}

export function OnboardingTaste({ profile, setProfile, onNext, editing }) {
  return (
    <>
      <ScreenTitle
        eyebrow={editing ? 'Edit profile' : 'Step 1 · Your taste'}
        title="What do you usually like?"
        sub="No wrong answers. Go with your gut."
      />

      <SectionLabel>Sweet or dry?</SectionLabel>
      <div className="flex flex-col gap-2">
        {SWEETNESS.map((s) => (
          <ChoiceCard
            key={s.id}
            {...s}
            selected={profile.sweetness === s.id}
            onClick={() => setProfile({ ...profile, sweetness: s.id })}
          />
        ))}
      </div>

      <SectionLabel hint="pick any">Flavors you enjoy</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {TASTES.map((t) => (
          <Chip
            key={t.id}
            label={t.label}
            selected={profile.tastes.includes(t.id)}
            onClick={() => setProfile({ ...profile, tastes: toggle(profile.tastes, t.id) })}
          />
        ))}
      </div>

      <SectionLabel hint="we'll skip these">Not for me</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {DISLIKES.map((d) => (
          <Chip
            key={d.id}
            label={d.label}
            selected={profile.dislikes.includes(d.id)}
            onClick={() => setProfile({ ...profile, dislikes: toggle(profile.dislikes, d.id) })}
          />
        ))}
      </div>

      <BottomBar>
        <Button disabled={!profile.sweetness} onClick={onNext}>
          {editing ? 'Save & see new matches' : 'Next'}
        </Button>
      </BottomBar>
    </>
  )
}
