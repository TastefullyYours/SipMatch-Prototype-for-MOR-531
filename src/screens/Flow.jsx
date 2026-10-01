import { useState } from 'react'
import { BUDGETS, FEELINGS, OCCASIONS, SOCIAL, STYLE_CUES } from '../data/options.js'
import { EXAMPLE_DISHES } from '../data/dishes.js'
import { BottomBar, Button, ChoiceCard, Chip, ScreenTitle, SectionLabel, Segmented } from '../components/ui.jsx'

export function Mood({ mood, setMood, onNext }) {
  const [showWhy, setShowWhy] = useState(false)
  return (
    <>
      <ScreenTitle eyebrow="Matching quiz · 1 of 4" title="How are you feeling today?" sub="Your mood actually changes how things taste." />

      <SectionLabel>Right now I'm…</SectionLabel>
      <div className="flex flex-col gap-2">
        {FEELINGS.map((f) => (
          <ChoiceCard key={f.id} {...f} selected={mood.feeling === f.id} onClick={() => setMood({ ...mood, feeling: f.id })} />
        ))}
      </div>

      <button onClick={() => setShowWhy(!showWhy)} className="mt-3 self-start text-sm font-medium text-berry underline-offset-2 hover:underline">
        {showWhy ? 'Hide' : 'Why does mood matter?'} 🤔
      </button>
      {showWhy && (
        <div className="mt-2 rounded-2xl bg-white p-4 text-sm leading-relaxed text-muted">
          <p>
            <b className="text-ink">Cheerful:</b> sweet and fruity notes feel stronger, and people tend to reach for bright, bubbly drinks.
          </p>
          <p className="mt-2">
            <b className="text-ink">Stressed:</b> bitter and sour notes can taste harsher, so we lean a little sweeter and softer.
          </p>
          <p className="mt-2">
            <b className="text-ink">Low energy:</b> taste can feel muted overall, and people gravitate to warm, familiar favorites.
          </p>
        </div>
      )}

      <SectionLabel>Feeling social?</SectionLabel>
      <div className="grid grid-cols-2 gap-2">
        {SOCIAL.map((s) => (
          <ChoiceCard key={s.id} {...s} selected={mood.social === s.id} onClick={() => setMood({ ...mood, social: s.id })} />
        ))}
      </div>

      <BottomBar>
        <Button disabled={!mood.feeling || !mood.social} onClick={onNext}>
          Next
        </Button>
      </BottomBar>
    </>
  )
}

export function Occasion({ occasion, setOccasion, onNext }) {
  return (
    <>
      <ScreenTitle eyebrow="Matching quiz · 2 of 4" title="What's the occasion?" sub="Who are you sipping with?" />
      <div className="flex flex-col gap-2">
        {OCCASIONS.map((o) => (
          <ChoiceCard key={o.id} {...o} selected={occasion === o.id} onClick={() => setOccasion(o.id)} />
        ))}
      </div>
      <BottomBar>
        <Button disabled={!occasion} onClick={onNext}>
          Next
        </Button>
      </BottomBar>
    </>
  )
}

export function Tonight({ tonight, setTonight, onNext }) {
  return (
    <>
      <ScreenTitle eyebrow="Matching quiz · 3 of 4" title="What are you in the mood for?" sub="Budget and style for tonight. Pick “Either” if you don’t mind." />

      <SectionLabel>Tonight's budget</SectionLabel>
      <Segmented options={BUDGETS} value={tonight.budget} onChange={(v) => setTonight({ ...tonight, budget: v })} />

      {STYLE_CUES.map((cue) => (
        <div key={cue.id} className="mt-6">
          <SectionLabel>{cue.label}</SectionLabel>
          <Segmented options={cue.options} value={tonight[cue.id]} onChange={(v) => setTonight({ ...tonight, [cue.id]: v })} size="sm" />
        </div>
      ))}

      <BottomBar>
        <Button disabled={!tonight.budget} onClick={onNext}>
          Next
        </Button>
      </BottomBar>
    </>
  )
}

export function Dish({ dish, setDish, occasion, onNext, onSkip }) {
  const isParty = occasion === 'party'
  return (
    <>
      <ScreenTitle
        eyebrow="Matching quiz · 4 of 4"
        title="What's on the menu?"
        sub={
          isParty
            ? 'Type a dish, or skip it and we’ll match classic party snacks.'
            : 'Type the dish you’re making or ordering, or skip it and we’ll match your mood and occasion.'
        }
      />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (dish.trim()) onNext()
        }}
      >
        <label htmlFor="dish" className="sr-only">
          Dish name
        </label>
        <input
          id="dish"
          value={dish}
          onChange={(e) => setDish(e.target.value)}
          placeholder="e.g. spicy chicken tacos"
          autoComplete="off"
          className="w-full rounded-2xl border-2 border-berry/15 bg-white px-4 py-4 text-lg outline-none placeholder:text-muted/60 focus:border-berry"
        />
      </form>

      <SectionLabel hint="tap to fill">Need ideas?</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {EXAMPLE_DISHES.map((d) => (
          <Chip key={d} label={d} selected={dish.toLowerCase() === d.toLowerCase()} onClick={() => setDish(d)} />
        ))}
      </div>

      <BottomBar>
        <div className="flex flex-col gap-2">
          <Button disabled={!dish.trim()} onClick={onNext}>
            Find my match ✨
          </Button>
          <Button variant="ghost" onClick={onSkip}>
            {isParty ? "Skip, it's just party snacks 🍿" : 'Skip, no dish yet ⏭️'}
          </Button>
        </div>
      </BottomBar>
    </>
  )
}
