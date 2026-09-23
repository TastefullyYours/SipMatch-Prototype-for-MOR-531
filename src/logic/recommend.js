import DRINKS from '../data/drinks.json'
import { profileDish, PARTY_SNACK_PROFILE } from '../data/dishes.js'

// Well-established pairing principles, keyed by the dish flavor tag they address.
// Beginner-friendly wording. Sources: standard sommelier/cicerone pairing guidance.
export const PRINCIPLES = {
  spicy: { name: 'Sweet & low-alcohol tame heat', text: 'A touch of sweetness, bubbles and lower alcohol cool spicy food down. High alcohol and heavy tannin make chili heat feel hotter.' },
  sweet: { name: 'Drink sweeter than dessert', text: 'Your drink should be at least as sweet as the food. Otherwise the sugar in the dish makes the drink taste sour and thin.' },
  fatty: { name: 'Acid & bubbles cut fat', text: 'Tangy or bubbly drinks slice through rich, fatty bites and reset your palate, so the last bite tastes as good as the first.' },
  fried: { name: 'Bubbles scrub the palate', text: 'Carbonation and acidity lift grease off your tongue, so fried food keeps tasting crisp bite after bite.' },
  acidic: { name: 'Match acid with acid', text: 'Tangy food (tomato, citrus, vinaigrette) makes low-acid drinks taste flat, so pick one that is at least as zippy as the food.' },
  meaty: { name: 'Tannin loves protein', text: 'The drying grip of bold reds (tannin) softens when it meets protein and fat, so both taste smoother together.' },
  umami: { name: 'Umami wants fruit, not tannin', text: 'Savory umami foods (soy, mushrooms, parmesan) can make tannic drinks taste bitter. Fruity, low-tannin or bubbly drinks stay smooth.' },
  smoky: { name: 'Like with like', text: 'Smoky, charred flavors echo toasty, oaky or smoky drinks, and each makes the other taste richer.' },
  creamy: { name: 'Creamy with round', text: 'Creamy sauces love rounder, fuller drinks with a similar texture, or a crisp one for contrast.' },
  earthy: { name: 'Echo earthy flavors', text: 'Earthy foods like mushrooms or roasted veggies pick up the savory, earthy notes in drinks like Pinot Noir.' },
  herby: { name: 'Echo the herbs', text: 'Fresh herbs like basil, mint or cilantro echo the green, herbal notes in drinks like Sauvignon Blanc or a mojito.' },
  salty: { name: 'Salt loves bubbles & fruit', text: 'Salt makes drinks taste smoother and fruitier, and bubbles or acidity make salty food even more snackable.' },
  rich: { name: 'Match weight with weight', text: 'Hearty, rich food needs a drink with enough body to stand up to it; otherwise the drink tastes watery.' },
  light: { name: 'Delicate with delicate', text: 'Light food like fish or salad gets steamrolled by big drinks. Something light and crisp lets the food shine.' },
  savory: { name: 'Match intensity', text: 'The simplest rule of all: pick a drink about as bold as your food, so neither one overpowers the other.' },
}

// Order in which a dish tag is chosen to "explain" a match (most impactful first).
const PRINCIPLE_PRIORITY = ['spicy', 'sweet', 'fried', 'fatty', 'acidic', 'meaty', 'umami', 'smoky', 'creamy', 'earthy', 'herby', 'salty', 'rich', 'light', 'savory']

export const PRICE_TIERS = {
  1: { symbol: '$', range: 'Under $15' },
  2: { symbol: '$$', range: '$15–30' },
  3: { symbol: '$$$', range: '$30+' },
}

export const TYPE_LABELS = { wine: 'Wine', beer: 'Beer', cider: 'Cider', spirit: 'Spirit', cocktail: 'Cocktail' }

// Onboarding "dislikes" → how to detect them on a drink.
const DISLIKE_RULES = {
  bitter: (d) => d.tasteTags.includes('bitter') || d.tasteTags.includes('tannic'),
  boozy: (d) => d.tasteTags.includes('boozy'),
  fizzy: (d) => d.tasteTags.includes('fizzy'),
  oaky: (d) => d.tasteTags.includes('oaky'),
  smoky: (d) => d.tasteTags.includes('smoky'),
  verySweet: (d) => d.sweetness >= 5,
  beer: (d) => d.type === 'beer',
  wine: (d) => d.type === 'wine' || d.wineBased, // includes wine cocktails like sangria and mimosas
}

// Onboarding "tastes I like" → drink taste tag.
const TASTE_TAGS = { fruity: 'fruity', citrus: 'citrus', earthy: 'earthy', spiced: 'spiced', smooth: 'smooth', fizzy: 'fizzy' }

// Sweet/dry preference → target on the drink's 1 (bone dry) to 5 (sweet) scale.
const SWEETNESS_LEVELS = ['dry', 'between', 'sweet']
const SWEETNESS_TARGET = { dry: 1.5, between: 3, sweet: 4 }

// Mood research (see PROCESS_LOG / README "Mood & taste"):
// - Cheerful: sweetness/aroma feel stronger; people seek fizzy, bright, citrus, fruity drinks.
// - Stressed: bitter/sour feel harsher; per product decision, we ONLY shift one step sweeter / less dry.
// - Sad/low energy: overall taste sensitivity drops; people seek nostalgic, warm, familiar drinks.
const MOOD_TAG_BOOSTS = {
  cheerful: ['fizzy', 'citrus', 'fruity', 'bright'],
  sad: ['nostalgic', 'warm', 'familiar'],
}

export function effectiveSweetness(pref, feeling) {
  if (feeling !== 'stressed') return pref
  const i = SWEETNESS_LEVELS.indexOf(pref)
  return SWEETNESS_LEVELS[Math.min(i + 1, SWEETNESS_LEVELS.length - 1)]
}

function scoreDrink(drink, { profile, mood, occasion, dishTags, matchedKeywords }) {
  let score = 0

  // 1. Dish fit (weighted highest): +3 per shared flavor tag.
  const matchedTags = dishTags.filter((t) => drink.affinities.includes(t))
  score += matchedTags.length * 3
  // Well-known "classic" pairings (e.g. Chianti + pizza) get an extra bump.
  const classic = matchedKeywords.some((k) => drink.classicWith.includes(k))
  if (classic) score += 4

  // Known clashes from classic pairing guidance.
  const tags = drink.tasteTags
  if (dishTags.includes('spicy') && (tags.includes('boozy') || tags.includes('tannic'))) score -= 2
  if (dishTags.includes('sweet') && drink.sweetness <= 2 && !drink.affinities.includes('sweet')) score -= 3
  if (dishTags.includes('umami') && tags.includes('tannic')) score -= 1
  if (dishTags.includes('light') && tags.includes('bold') && !dishTags.some((t) => ['rich', 'meaty', 'smoky'].includes(t))) score -= 1

  // 2. Sweet vs dry preference (stressed shifts it one step sweeter).
  const pref = effectiveSweetness(profile.sweetness, mood.feeling)
  score -= Math.abs(drink.sweetness - SWEETNESS_TARGET[pref]) * 1.2
  if (mood.feeling === 'stressed' && drink.sweetness === 1) score -= 1.5 // gently steer away from bone-dry

  // 3. Mood fit.
  if (mood.feeling !== 'stressed') {
    if (drink.moodFit.includes(mood.feeling)) score += 2
    const boosts = MOOD_TAG_BOOSTS[mood.feeling] || []
    score += Math.min(2, boosts.filter((t) => tags.includes(t)).length * 0.75)
    // Assistant's inference (not from the cited sources): since sadness dulls taste,
    // give fuller-flavored drinks a small bump.
    if (mood.feeling === 'sad' && tags.includes('bold')) score += 0.5
  }
  if (drink.vibe.includes(mood.social)) score += 1

  // 4. Occasion fit.
  if (drink.occasions.includes(occasion)) score += 1.5

  // 5. Taste preferences.
  score += (profile.tastes || []).filter((t) => tags.includes(TASTE_TAGS[t])).length * 1

  // 6. Budget: penalize (don't hide) drinks above budget so we always have 3 picks.
  const over = drink.priceTier - profile.budget
  if (over > 0) score -= over * 3
  else if (over === 0) score += 0.5

  return { score, matchedTags, classic, overBudget: over > 0 }
}

function moodLine(drink, feeling) {
  const tags = drink.tasteTags
  if (feeling === 'cheerful') {
    return MOOD_TAG_BOOSTS.cheerful.some((t) => tags.includes(t))
      ? 'Good moods make sweet and fruity notes pop, so a bright, lively pick fits right in.'
      : 'Good moods make flavors pop, so this one should taste extra good today.'
  }
  if (feeling === 'stressed') {
    return "When you're stressed, bitter and sour notes can taste harsher, so we leaned a little sweeter and softer."
  }
  return MOOD_TAG_BOOSTS.sad.some((t) => tags.includes(t))
    ? "When you're feeling low, flavors can seem a bit muted. A warm, familiar pour with fuller flavor still comes through."
    : "When you're feeling low, flavors can seem a bit muted, so we favored something with plenty of flavor."
}

// A principle only explains a match if the drink actually has the trait it describes.
const PRINCIPLE_FITS = {
  spicy: (d) => !d.tasteTags.includes('boozy') && !d.tasteTags.includes('tannic'),
  sweet: (d) => d.sweetness >= 3 || d.affinities.includes('sweet'),
  fatty: (d) => ['fizzy', 'bright', 'citrus', 'bitter', 'tannic'].some((t) => d.tasteTags.includes(t)),
  fried: (d) => ['fizzy', 'bright', 'citrus', 'bitter'].some((t) => d.tasteTags.includes(t)),
  acidic: (d) => ['bright', 'citrus'].some((t) => d.tasteTags.includes(t)),
  meaty: (d) => d.tasteTags.includes('tannic'),
  umami: (d) => !d.tasteTags.includes('tannic'),
  smoky: (d) => ['smoky', 'oaky', 'warm'].some((t) => d.tasteTags.includes(t)),
  light: (d) => d.tasteTags.includes('light'),
  rich: (d) => !d.tasteTags.includes('light'),
}

function explain(drink, dishTags) {
  const own = Object.entries(PRINCIPLES).find(([, p]) => p.name === drink.principle)
  // Prefer the drink's own signature principle when it applies to this dish.
  if (own && dishTags.includes(own[0])) return own[1]
  const key = PRINCIPLE_PRIORITY.find(
    (t) => dishTags.includes(t) && drink.affinities.includes(t) && (PRINCIPLE_FITS[t]?.(drink) ?? true),
  )
  if (key) return PRINCIPLES[key]
  // No clear overlap: fall back to the drink's signature principle.
  return own ? own[1] : PRINCIPLES.savory
}

// "Don't like these?" alternatives: one per category, each labeled with how it
// differs from the top pick (sweeter, drier, less bitter, lighter...).
export const ALT_CATEGORIES = [
  { key: 'wine', label: 'Wine', emoji: '🍷', types: ['wine'] },
  { key: 'beer', label: 'Beer or cider', emoji: '🍺', types: ['beer', 'cider'] },
  { key: 'mixed', label: 'Spirit or cocktail', emoji: '🍸', types: ['spirit', 'cocktail'] },
]

export const CONTRASTS = {
  sweeter: { emoji: '🍭', text: 'If you want something a little sweeter' },
  drier: { emoji: '🌵', text: 'If you want something a little drier' },
  lessBitter: { emoji: '🌿', text: 'If you want something less bitter' },
  lighter: { emoji: '🪶', text: 'If you want something lighter' },
  bolder: { emoji: '💪', text: 'If you want something bolder' },
  bubbly: { emoji: '🫧', text: 'If you want some bubbles' },
  still: { emoji: '🧊', text: "If you'd rather skip the bubbles" },
  different: { emoji: '🔀', text: 'If you want to try a different style' },
}

const isBitter = (d) => d.tasteTags.includes('bitter') || d.tasteTags.includes('tannic')
const isBold = (d) => d.tasteTags.includes('bold') || d.tasteTags.includes('boozy')

// How does `alt` differ from the reference drink? Most noticeable difference first.
function contrastOf(alt, ref) {
  if (alt.sweetness >= ref.sweetness + 1) return 'sweeter'
  if (alt.sweetness <= ref.sweetness - 1) return 'drier'
  if (isBitter(ref) && !isBitter(alt)) return 'lessBitter'
  if (isBold(ref) && !isBold(alt) && alt.tasteTags.includes('light')) return 'lighter'
  if (!isBold(ref) && isBold(alt)) return 'bolder'
  const refFizzy = ref.tasteTags.includes('fizzy')
  if (refFizzy !== alt.tasteTags.includes('fizzy')) return refFizzy ? 'still' : 'bubbly'
  return 'different'
}

function pickAlternatives(scored, mainIds, ref) {
  const used = new Set(mainIds)
  const remaining = scored.filter((p) => !used.has(p.drink.id))
  // Top few candidates per category (falls back to any category if one is empty, e.g. the user dislikes wine).
  const slots = ALT_CATEGORIES.map((cat) => {
    let cands = remaining.filter((p) => cat.types.includes(p.drink.type)).slice(0, 5)
    let fallback = false
    if (cands.length === 0) {
      cands = remaining.slice(0, 5)
      fallback = true
    }
    return { cat, fallback, cands: cands.map((p) => ({ ...p, contrast: contrastOf(p.drink, ref) })) }
  })

  // Try combinations and prefer ones that cover different directions,
  // ideally including both a sweeter and a drier option.
  let best = null
  const walk = (i, chosen) => {
    if (i === slots.length) {
      const ids = new Set(chosen.map((c) => c.drink.id))
      if (ids.size < chosen.length) return
      const contrasts = chosen.map((c) => c.contrast)
      let total = chosen.reduce((sum, c) => sum + c.score, 0)
      total += new Set(contrasts).size * 3
      if (contrasts.includes('sweeter')) total += 2
      if (contrasts.includes('drier')) total += 2
      total -= contrasts.filter((c) => c === 'different').length * 3
      if (!best || total > best.total) best = { total, chosen }
      return
    }
    for (const c of slots[i].cands) walk(i + 1, [...chosen, c])
  }
  walk(0, [])
  if (!best) return []
  return best.chosen.map((c, i) => ({ ...c, category: slots[i].fallback ? null : slots[i].cat }))
}

/**
 * @param profile  { budget: 1|2|3, sweetness: 'dry'|'between'|'sweet', dislikes: string[], tastes: string[] }
 * @param mood     { feeling: 'cheerful'|'stressed'|'sad', social: 'social'|'solo' }
 * @param occasion 'party'|'date'|'group'
 * @param dish     string ('' when skipped on party)
 * @returns { picks: [...3], alternatives: [...3], dishInfo }
 */
export function recommend({ profile, mood, occasion, dish }) {
  const skipped = !dish || !dish.trim()
  const dishInfo = skipped
    ? { tags: PARTY_SNACK_PROFILE, matched: [], recognized: true, skipped: true }
    : { ...profileDish(dish), skipped: false }

  // Hard-exclude disliked drinks, unless that would leave fewer than 3 options.
  const dislikes = profile.dislikes || []
  const isDisliked = (d) => dislikes.some((k) => DISLIKE_RULES[k]?.(d))
  let pool = DRINKS.filter((d) => !isDisliked(d))
  const relaxed = pool.length < 3
  if (relaxed) pool = DRINKS

  const scored = pool
    .map((drink) => {
      const s = scoreDrink(drink, { profile, mood, occasion, dishTags: dishInfo.tags, matchedKeywords: dishInfo.matched })
      if (relaxed && isDisliked(drink)) s.score -= 10
      return { drink, ...s }
    })
    .sort((a, b) => b.score - a.score)

  // Take the top 3, but make sure the picks span at least 2 drink types.
  const picks = scored.slice(0, 3)
  if (picks.every((p) => p.drink.type === picks[0].drink.type)) {
    const other = scored.find((p) => p.drink.type !== picks[0].drink.type)
    if (other) picks[2] = other
  }

  const present = (p) => ({
    drink: p.drink,
    score: p.score,
    overBudget: p.overBudget,
    classic: p.classic,
    principle: explain(p.drink, dishInfo.tags),
    moodLine: moodLine(p.drink, mood.feeling),
    price: PRICE_TIERS[p.drink.priceTier],
  })

  const alternatives = pickAlternatives(
    scored,
    picks.map((p) => p.drink.id),
    picks[0].drink,
  ).map((a) => ({ ...present(a), contrast: CONTRASTS[a.contrast], category: a.category }))

  return { dishInfo, picks: picks.map(present), alternatives }
}

export { DRINKS }
