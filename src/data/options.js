// Choice lists shown in onboarding and the flow screens.

export const AGE_GROUPS = [
  { id: '21-24', label: '21–24' },
  { id: '25-34', label: '25–34' },
  { id: '35+', label: '35+' },
]

export const BUDGETS = [
  { id: 1, emoji: '💵', label: '$ · Under $15', sub: 'Keep it easy on the wallet' },
  { id: 2, emoji: '💳', label: '$$ · $15–30', sub: 'Happy to spend a little more' },
  { id: 3, emoji: '💎', label: '$$$ · $30+', sub: 'Treat yourself' },
]

export const SWEETNESS = [
  { id: 'sweet', emoji: '🍭', label: 'Sweet', sub: 'Fruity, juicy, dessert-y' },
  { id: 'between', emoji: '⚖️', label: 'In between', sub: 'A little of both / not sure' },
  { id: 'dry', emoji: '🌵', label: 'Dry', sub: 'Crisp, not sugary' },
]

export const TASTES = [
  { id: 'fruity', label: '🍓 Fruity' },
  { id: 'citrus', label: '🍋 Citrusy' },
  { id: 'fizzy', label: '🫧 Bubbly' },
  { id: 'smooth', label: '🧈 Smooth' },
  { id: 'earthy', label: '🍄 Earthy' },
  { id: 'spiced', label: '🍂 Warm spice' },
]

export const DISLIKES = [
  { id: 'bitter', label: 'Bitter' },
  { id: 'boozy', label: 'Strong / boozy' },
  { id: 'fizzy', label: 'Bubbly' },
  { id: 'verySweet', label: 'Super sweet' },
  { id: 'oaky', label: 'Oaky / woody' },
  { id: 'smoky', label: 'Smoky' },
  { id: 'beer', label: 'Beer' },
  { id: 'wine', label: 'Wine' },
]

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
  { id: 'party', emoji: '🎉', label: 'Party', sub: 'A crowd, snacks, good times' },
  { id: 'date', emoji: '💞', label: 'Duo / date', sub: 'Just the two of you' },
  { id: 'group', emoji: '🍽️', label: 'Small group', sub: 'Dinner with a few friends' },
]

export const label = (list, id) => list.find((o) => o.id === id)
