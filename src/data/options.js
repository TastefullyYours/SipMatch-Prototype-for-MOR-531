// Choice lists shown in the profile and the matching quiz.
// Sweetness, categories, strength and budget are multi-select (arrays of ids).

// ---- Profile ----

export const FLAVORS = [
  { id: 'sweet', label: '🍭 Sweet' },
  { id: 'fruity', label: '🍓 Fruity' },
  { id: 'acidic', label: '🍋 Tart / acidic' },
  { id: 'herbal', label: '🌿 Herbal' },
  { id: 'bitter', label: '☕ Bitter' },
  { id: 'dry', label: '🌵 Dry' },
  { id: 'smoky', label: '🔥 Smoky' },
]

export const SWEETNESS = [
  { id: 1, label: 'Bone dry' },
  { id: 2, label: 'Dry' },
  { id: 3, label: 'Balanced' },
  { id: 4, label: 'Sweet-ish' },
  { id: 5, label: 'Sweet' },
]

export const CATEGORIES = [
  { id: 'beer', emoji: '🍺', label: 'Beer & cider' },
  { id: 'wine', emoji: '🍷', label: 'Wine' },
  { id: 'spirits', emoji: '🥃', label: 'Spirits' },
  { id: 'cocktails', emoji: '🍸', label: 'Cocktails' },
  { id: 'na', emoji: '☕', label: 'Non-alcoholic & coffee' },
]

// Strength bands (pick any). Approximate strength as served.
export const ABV_LEVELS = [
  { id: 'low', emoji: '🪶', label: 'Light', sub: 'Session-strength, up to ~7%: beer, cider, spritzes' },
  { id: 'medium', emoji: '🍷', label: 'Wine-strength', sub: 'About 7–16%: wine and most mixed drinks' },
  { id: 'high', emoji: '🥃', label: 'Strong', sub: '16%+: spirits and stronger cocktails' },
]

export const RESTRICTIONS = [
  { id: 'sulfites', label: 'Sulfites', hint: 'wine, vermouth, cider' },
  { id: 'gluten', label: 'Gluten', hint: 'most beer' },
  { id: 'dairy', label: 'Dairy', hint: 'cream drinks' },
  { id: 'artificialSweeteners', label: 'Artificial sweeteners', hint: 'diet mixers' },
  { id: 'juniper', label: 'Juniper (gin)', hint: 'gin drinks' },
  { id: 'oak', label: 'Oak-aged', hint: 'whiskey, oaked wine' },
]

// Familiar drinks for the calibration step (ids from drinks.json).
export const CALIBRATION_DRINKS = [
  'prosecco', 'pinot-grigio', 'sauvignon-blanc', 'rose', 'moscato', 'pinot-noir', 'cabernet', 'red-sangria',
  'mexican-lager', 'ipa', 'stout', 'cider', 'margarita', 'mojito', 'aperol-spritz', 'moscow-mule',
  'pina-colada', 'old-fashioned', 'espresso-martini', 'gin', 'bourbon', 'cold-brew',
]

// ---- Matching quiz ----

export const FEELINGS = [
  { id: 'cheerful', emoji: '😄', label: 'Cheerful', sub: 'Good vibes, feeling bright' },
  { id: 'stressed', emoji: '😮‍💨', label: 'Stressed / anxious', sub: 'A lot on my mind' },
  { id: 'sad', emoji: '😔', label: 'Sad / low energy', sub: 'A bit down or worn out' },
]

export const SOCIAL = [
  { id: 'social', emoji: '🙌', label: 'Social', sub: 'Up for company' },
  { id: 'solo', emoji: '🛋️', label: 'Solo', sub: 'Keeping it low-key' },
]

export const OCCASIONS = [
  { id: 'solo', emoji: '🛋️', label: 'Just me', sub: 'A quiet night in, solo' },
  { id: 'date', emoji: '💞', label: 'Duo / date', sub: 'Just the two of you' },
  { id: 'group', emoji: '🍽️', label: 'Small group', sub: 'Dinner with a few friends' },
  { id: 'party', emoji: '🎉', label: 'Party', sub: 'A crowd, snacks, good times' },
]

export const BUDGETS = [
  { id: 1, label: '$', sub: 'Under $15' },
  { id: 2, label: '$$', sub: '$15–30' },
  { id: 3, label: '$$$', sub: '$30+' },
]

export const STYLE_CUES = [
  {
    id: 'temp',
    label: 'Temperature',
    options: [
      { id: 'iced', label: '🧊 Iced / cold' },
      { id: 'neat', label: '🥃 Neat / room temp' },
      { id: 'any', label: '🤷 Either' },
    ],
  },
  {
    id: 'fizz',
    label: 'Bubbles',
    options: [
      { id: 'bubbly', label: '🫧 Carbonated' },
      { id: 'still', label: '🌊 Still' },
      { id: 'any', label: '🤷 Either' },
    ],
  },
  {
    id: 'body',
    label: 'Body',
    options: [
      { id: 'light', label: '🪶 Light' },
      { id: 'bold', label: '💪 Bold' },
      { id: 'any', label: '🤷 Either' },
    ],
  },
]

export const label = (list, id) => list.find((o) => o.id === id)

// Age in whole years from a YYYY-MM-DD birthday string.
export function ageFrom(birthday, today = new Date()) {
  const [y, m, d] = birthday.split('-').map(Number)
  let age = today.getFullYear() - y
  if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) age--
  return age
}
