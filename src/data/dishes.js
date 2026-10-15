// Maps dish keywords to flavor tags used by the recommender.
// Matching is done longest-keyword-first, at word starts, so "fried chicken" wins over "chicken".
// Flavor tags: spicy, fatty, rich, salty, acidic, sweet, smoky, light, earthy,
// umami, fried, creamy, herby, meaty, savory.

export const DISH_KEYWORDS = {
  // Mexican / Tex-Mex
  'fish taco': ['light', 'acidic', 'fried', 'spicy'],
  taco: ['spicy', 'savory', 'acidic'],
  burrito: ['spicy', 'fatty', 'savory'],
  enchilada: ['spicy', 'savory', 'fatty'],
  quesadilla: ['fatty', 'salty', 'savory'],
  nacho: ['salty', 'fried', 'fatty', 'spicy'],
  guac: ['fatty', 'acidic', 'herby'],
  salsa: ['acidic', 'spicy', 'herby'],
  ceviche: ['acidic', 'light', 'herby'],
  fajita: ['smoky', 'spicy', 'savory'],
  chili: ['spicy', 'meaty', 'rich'],

  // Italian
  pizza: ['acidic', 'fatty', 'salty', 'savory'],
  margherita: ['acidic', 'herby', 'fatty'],
  pepperoni: ['salty', 'fatty', 'spicy'],
  lasagna: ['acidic', 'rich', 'meaty'],
  bolognese: ['acidic', 'meaty', 'rich'],
  marinara: ['acidic', 'herby', 'savory'],
  'tomato sauce': ['acidic', 'savory'],
  spaghetti: ['acidic', 'savory'],
  pasta: ['savory'],
  carbonara: ['creamy', 'fatty', 'salty', 'rich'],
  alfredo: ['creamy', 'fatty', 'rich'],
  'mac and cheese': ['creamy', 'fatty', 'salty', 'rich'],
  'mac n cheese': ['creamy', 'fatty', 'salty', 'rich'],
  pesto: ['herby', 'fatty', 'salty'],
  risotto: ['creamy', 'earthy', 'rich'],
  tiramisu: ['sweet', 'creamy', 'rich'],

  // American / grill
  burger: ['meaty', 'fatty', 'savory'],
  'hot dog': ['salty', 'fatty', 'savory'],
  steak: ['meaty', 'fatty', 'rich'],
  bbq: ['smoky', 'meaty', 'fatty'],
  barbecue: ['smoky', 'meaty', 'fatty'],
  brisket: ['smoky', 'meaty', 'fatty', 'rich'],
  rib: ['smoky', 'meaty', 'fatty'],
  'pulled pork': ['smoky', 'fatty', 'savory'],
  'fried chicken': ['fried', 'fatty', 'salty'],
  'chicken wing': ['spicy', 'fried', 'fatty', 'salty'],
  wing: ['spicy', 'fried', 'fatty', 'salty'],
  'grilled cheese': ['fatty', 'salty', 'creamy'],
  sandwich: ['savory'],
  fries: ['fried', 'salty'],
  chips: ['fried', 'salty'],
  popcorn: ['salty', 'light'],
  sausage: ['fatty', 'salty', 'meaty'],
  bacon: ['salty', 'fatty', 'smoky'],
  meat: ['meaty', 'savory'],
  jerk: ['spicy', 'smoky', 'meaty'],
  cuban: ['savory', 'acidic', 'meaty'],
  'pork chop': ['savory', 'fatty', 'meaty'],
  pork: ['savory', 'fatty'],
  turkey: ['savory', 'light'],
  'roast chicken': ['savory', 'rich', 'herby'],
  chicken: ['savory', 'light'],
  lamb: ['meaty', 'rich', 'earthy'],
  meatball: ['meaty', 'savory', 'acidic'],

  // Seafood
  'fish and chips': ['fried', 'salty', 'fatty'],
  salmon: ['fatty', 'rich'],
  tuna: ['light', 'fatty'],
  shrimp: ['light', 'salty'],
  lobster: ['rich', 'creamy', 'light'],
  crab: ['light', 'salty', 'rich'],
  oyster: ['salty', 'light'],
  'smoked salmon': ['fatty', 'salty', 'smoky'],
  poke: ['light', 'umami', 'fatty'],
  caviar: ['salty', 'fatty'],
  fish: ['light', 'herby'],
  seafood: ['light', 'salty'],
  sushi: ['light', 'umami', 'salty'],

  // Asian
  ramen: ['umami', 'salty', 'rich'],
  pho: ['herby', 'light', 'umami'],
  'pad thai': ['spicy', 'umami', 'sweet'],
  thai: ['spicy', 'herby', 'umami'],
  curry: ['spicy', 'rich', 'creamy'],
  'tikka masala': ['spicy', 'creamy', 'rich'],
  'butter chicken': ['creamy', 'rich', 'spicy'],
  biryani: ['spicy', 'savory', 'herby'],
  dumpling: ['umami', 'fatty', 'savory'],
  'fried rice': ['umami', 'salty', 'savory'],
  'stir fry': ['umami', 'savory'],
  teriyaki: ['sweet', 'umami', 'salty'],
  'korean bbq': ['smoky', 'meaty', 'sweet', 'umami'],
  bulgogi: ['smoky', 'meaty', 'sweet', 'umami'],
  kimchi: ['spicy', 'acidic', 'umami'],
  'orange chicken': ['sweet', 'fried', 'savory'],
  szechuan: ['spicy', 'umami'],
  sichuan: ['spicy', 'umami'],
  tofu: ['light', 'umami'],
  karaage: ['fried', 'salty', 'fatty'],

  // Mediterranean / Middle Eastern
  falafel: ['fried', 'herby', 'savory'],
  hummus: ['creamy', 'savory', 'earthy'],
  shawarma: ['spicy', 'meaty', 'fatty'],
  gyro: ['meaty', 'fatty', 'savory'],
  kebab: ['smoky', 'meaty', 'savory'],
  paella: ['savory', 'salty', 'rich'],
  tapas: ['salty', 'fatty', 'savory'],

  // Veg, salads, cheese
  'goat cheese': ['acidic', 'salty', 'creamy'],
  charcuterie: ['salty', 'fatty'],
  'cheese board': ['salty', 'fatty', 'rich'],
  cheese: ['salty', 'fatty'],
  caesar: ['salty', 'creamy'],
  olive: ['salty', 'fatty'],
  pickle: ['acidic', 'salty'],
  appetizer: ['salty', 'light'],
  salad: ['light', 'acidic', 'herby'],
  mushroom: ['earthy', 'umami'],
  veggie: ['light', 'earthy'],
  vegetable: ['light', 'earthy'],
  soup: ['savory', 'light'],
  stew: ['rich', 'meaty', 'savory'],
  lemon: ['acidic'],
  tomato: ['acidic'],
  garlic: ['savory'],
  spicy: ['spicy'],
  fried: ['fried'],
  grilled: ['smoky'],
  smoked: ['smoky'],
  creamy: ['creamy'],

  // Brunch
  brunch: ['light', 'fatty', 'savory'],
  egg: ['light', 'fatty'],
  pancake: ['sweet'],
  waffle: ['sweet'],
  pastry: ['sweet', 'fatty'],
  pastries: ['sweet', 'fatty'],
  croissant: ['fatty', 'light'],

  // Desserts
  chocolate: ['sweet', 'rich'],
  brownie: ['sweet', 'rich'],
  cake: ['sweet'],
  cheesecake: ['sweet', 'creamy'],
  pie: ['sweet'],
  'pecan pie': ['sweet', 'rich'],
  'bread pudding': ['sweet', 'rich', 'creamy'],
  'ice cream': ['sweet', 'creamy'],
  cookie: ['sweet'],
  dessert: ['sweet'],
  fruit: ['sweet', 'light'],
  strawberry: ['sweet', 'light'],
  strawberries: ['sweet', 'light'],
  pineapple: ['sweet', 'acidic'],
  tropical: ['sweet', 'acidic'],
}

// Used when nothing in the dish name matches a keyword.
export const FALLBACK_PROFILE = ['savory']

// Used when the occasion is "party" and the user skips the dish step.
export const PARTY_SNACK_PROFILE = ['salty', 'fried', 'fatty']

// Extra language cues used by the prototype's simulated "AI" flavor scan.
// This stays deliberately small and transparent: no network request or model is involved.
const FLAVOR_CLUES = {
  crispy: ['fried', 'salty'],
  crunchy: ['fried', 'salty'],
  buttery: ['creamy', 'fatty', 'rich'],
  cheesy: ['creamy', 'fatty', 'salty'],
  zesty: ['acidic', 'light'],
  citrusy: ['acidic', 'light'],
  roasted: ['smoky', 'rich'],
  charred: ['smoky', 'rich'],
  braised: ['rich', 'savory'],
  caramelized: ['sweet', 'rich'],
  honey: ['sweet'],
  maple: ['sweet', 'rich'],
  miso: ['umami', 'salty'],
  soy: ['umami', 'salty'],
  parmesan: ['umami', 'salty', 'rich'],
  truffle: ['earthy', 'rich'],
  mushroomy: ['earthy', 'umami'],
  avocado: ['fatty', 'creamy'],
  ginger: ['spicy', 'herby'],
  cilantro: ['herby', 'light'],
  basil: ['herby', 'light'],
  mint: ['herby', 'light'],
  fresh: ['light', 'herby'],
}

export const FLAVOR_LABELS = {
  spicy: '🌶️ Spicy',
  fatty: '🥑 Rich & fatty',
  rich: '🍲 Rich',
  salty: '🧂 Salty',
  acidic: '🍋 Bright & acidic',
  sweet: '🍯 Sweet',
  smoky: '🔥 Smoky',
  light: '🌿 Light',
  earthy: '🍄 Earthy',
  umami: '🥢 Umami',
  fried: '🍳 Crispy / fried',
  creamy: '🥛 Creamy',
  herby: '🌱 Herby',
  meaty: '🥩 Meaty',
  savory: '🍽️ Savory',
}

const SORTED_KEYWORDS = Object.keys(DISH_KEYWORDS).sort((a, b) => b.length - a.length)

// Returns { tags: string[], matched: string[], recognized: boolean }
export function profileDish(dishText) {
  let text = ` ${(dishText || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ')} `
  const tags = new Set()
  const matched = []
  for (const kw of SORTED_KEYWORDS) {
    // Whole-word match with optional plural, so "taco" matches "tacos" but "pie" doesn't match "pierogi".
    const re = new RegExp(`\\b${kw}(s|es)?\\b`, 'g')
    if (text.match(re)) {
      DISH_KEYWORDS[kw].forEach((t) => tags.add(t))
      matched.push(kw)
      text = text.replace(re, ' ')
    }
  }
  for (const [clue, clueTags] of Object.entries(FLAVOR_CLUES)) {
    if (new RegExp(`\\b${clue}\\b`).test(text)) {
      clueTags.forEach((tag) => tags.add(tag))
      matched.push(clue)
    }
  }
  if (tags.size === 0) {
    return { tags: [...FALLBACK_PROFILE], matched, recognized: false }
  }
  return { tags: [...tags], matched, recognized: true }
}

// Adds presentation metadata for the visible simulated analysis step on the dish screen.
// The recommendation engine calls profileDish() again, so the preview and final scoring stay aligned.
export function simulateDishAnalysis(dishText) {
  const result = profileDish(dishText)
  const confidence = result.recognized ? Math.min(96, 78 + result.matched.length * 5) : 62
  return {
    ...result,
    confidence,
    summary: result.recognized
      ? `Found ${result.matched.length} food or cooking cue${result.matched.length === 1 ? '' : 's'} and translated them into pairing flavors.`
      : 'No exact cue was found, so the demo is using a flexible savory profile.',
  }
}

// Quick-pick chips on the dish screen.
export const EXAMPLE_DISHES = ['Tacos', 'Pizza', 'Salmon', 'Burgers', 'Pad Thai', 'Mac and cheese', 'Sushi', 'Chocolate cake']
