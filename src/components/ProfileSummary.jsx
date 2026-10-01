import { ABV_LEVELS, CATEGORIES, FLAVORS, RESTRICTIONS, SWEETNESS, label } from '../data/options.js'
import { DRINKS } from '../logic/recommend.js'

const names = (list, ids) => ids.map((id) => label(list, id)?.label).filter(Boolean)
const drinkNames = (ids) => ids.map((id) => DRINKS.find((d) => d.id === id)?.name).filter(Boolean)
const catNames = (cats, level) => CATEGORIES.filter((c) => cats[c.id] === level).map((c) => c.label)

// Rows describing a profile in plain words; rows with nothing to say are left out.
function rows(profile) {
  return [
    ['Sweetness', label(SWEETNESS, profile.sweetness)?.label],
    ['Flavors you love', names(FLAVORS, profile.likes).join(', ')],
    ['Flavors you avoid', names(FLAVORS, profile.dislikes).join(', ')],
    ['Favorite categories', catNames(profile.categories, 3).join(', ')],
    ['Never', catNames(profile.categories, 0).join(', ')],
    ['Strength', label(ABV_LEVELS, profile.abvMax)?.label],
    ['Avoiding', names(RESTRICTIONS, profile.restrictions).join(', ')],
    ['Drinks you love', drinkNames(profile.loved).join(', ')],
    ['Drinks you pass on', drinkNames(profile.hated).join(', ')],
  ].filter(([, v]) => v)
}

export function ProfileCard({ profile }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-2 ring-gold/50">
      <div className="flex items-center gap-2 bg-gold/20 px-5 py-3">
        <span className="text-2xl">👤</span>
        <span className="font-display text-lg font-bold">Your taste profile</span>
      </div>
      <dl className="divide-y divide-sand px-5">
        {rows(profile).map(([k, v]) => (
          <div key={k} className="flex gap-3 py-2.5 text-sm">
            <dt className="w-32 shrink-0 text-muted">{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

// One-line version for the results screen.
export function ProfileStrip({ profile, onEdit }) {
  const bits = [
    label(SWEETNESS, profile.sweetness)?.label,
    ...catNames(profile.categories, 3).map((c) => `loves ${c.toLowerCase()}`),
    label(ABV_LEVELS, profile.abvMax)?.label,
    profile.restrictions.length ? `avoiding ${names(RESTRICTIONS, profile.restrictions).join(', ').toLowerCase()}` : null,
  ].filter(Boolean)
  return (
    <div className="mt-3 flex items-center gap-3 rounded-2xl bg-gold/15 px-4 py-3 text-sm">
      <span className="text-xl">👤</span>
      <span className="flex-1">
        <span className="block text-xs font-semibold uppercase tracking-wider text-[#8a6412]">Matched to your taste profile</span>
        <span className="text-ink/80">{bits.join(' · ')}</span>
      </span>
      <button onClick={onEdit} className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-berry hover:bg-berry-light">
        Edit
      </button>
    </div>
  )
}
