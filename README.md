# SipMatch: A Match for Every Meal 🍷🍺🍸

A clickable prototype for **USC MOR 531**. SipMatch is a friendly drink-pairing recommender for casual drinkers (21+) who feel unsure picking a drink at the grocery store.

Vivino needs a bottle in hand. SipMatch starts earlier: from **your mood, your occasion and what you're eating**, before a bottle is chosen. It covers wine, beer, cider, spirits and cocktails.

## What's in the prototype

**Free tier (fully working)**
1. **Age gate:** enter your birthday (must be 21+). It's only used for the age check and never saved.
2. **Taste profile** (4 short screens, asked once, editable any time):
   - *Palate:* favorite and disliked flavors (sweet, fruity, tart, herbal, bitter, dry, smoky) + a 5-step sweetness scale
   - *What you drink:* category weights for beer & cider, wine, spirits, cocktails and non-alcoholic/coffee (Never / Rarely / Sometimes / Love it) + an ABV ceiling (light / wine-level / strong)
   - *Anything to avoid:* sulfites, gluten, dairy, artificial sweeteners, juniper (gin), oak-aged
   - *Calibration:* rate 3–5 drinks you love and 2 you'd pass on (skippable for true beginners)
3. **Matching quiz** (every time):
   - Mood (cheerful / stressed / sad–low energy) + social vs. solo
   - Occasion (party, duo/date, small group)
   - Tonight: budget + style cues (iced vs. neat, carbonated vs. still, light vs. bold)
   - Dish (free text; always skippable)
4. **Results:** a top match + 2 alternates, each with *why it works*, *the pairing principle*, *based on your taste* (when it's like a drink you love), *why it fits your mood*, *a fun fact*, *what to look for at the store* and a price tier
   - **"Don't like these?"** opens 3 more options (one wine, one beer or cider, one spirit or cocktail), each labeled with how it differs from the top pick ("a little sweeter", "a little drier", "less bitter", "lighter", "some bubbles"…)
5. Try a different dish, change budget/style, start over, or edit your profile

**Premium (locked previews)**
- 🛒 **Snap your cart**: photo upload → scripted scan of a sample cart → clarifying questions → drink matches (partly locked)
- 🔄 **Here's what I'm drinking**: name a drink → food ideas + recipe (partly locked)
- 💳 **Paywall**: Free vs. Premium comparison with placeholder pricing
- 👥 **Taste communities**: "coming soon" teaser cards

## How recommendations work

Everything runs in the browser from a local dataset. There are no APIs, no keys, no backend and no browser storage.

- `src/data/drinks.json`: 67 curated drinks (17 wines, 6 beers + 1 cider, 10 spirits, 27 cocktails, 6 non-alcoholic/coffee) tagged by sweetness (1–5), approximate ABV as served, serving temperature, likely allergens (sulfites, gluten, dairy, juniper, oak), price tier, taste tags, mood fit, social/solo vibe, occasion fit, food-flavor affinities and "classic pairing" dishes.
- `src/data/dishes.js`: about 140 dish keywords mapped to flavor tags (e.g. `taco → spicy, savory, acidic`, `salmon → fatty, rich`). Unknown dishes fall back to a neutral "savory" profile; a skipped dish uses a "party snacks" profile for parties, and otherwise lets mood, occasion and taste decide.
- `src/logic/recommend.js`:
  1. **Filters:** removes drinks with a listed allergen/aversion (never relaxed), drinks above the ABV ceiling, categories marked "Never" and drinks you'd pass on. The last three are relaxed, with a notice, only if fewer than 3 drinks would remain.
  2. **Scores** every remaining drink. Dish-flavor fit and classic pairings count most, with penalties for known clashes (e.g. high alcohol with spicy food). Also counted: sweetness preference, favorite/disliked flavors, category weights, similarity to drinks you love or hate, mood, social/solo, occasion, tonight's style cues and budget.
  3. **Returns** the top 3 (spanning at least 2 drink types), plus 3 "Don't like these?" alternatives, one per category, chosen so they go in different directions (ideally one sweeter and one drier than the top pick).

### Mood & taste
| Mood | What research suggests | What SipMatch does |
|---|---|---|
| Cheerful | Sweet notes/aroma feel stronger; people seek bright, fizzy, fruity tastes | Boosts fizzy, citrus, fruity, bright drinks |
| Stressed | Bitter and sour feel harsher | Shifts the sweet/dry preference one step sweeter; lightly avoids bone-dry drinks |
| Sad / low energy | Taste sensitivity drops; people seek nostalgic, comforting drinks | Boosts nostalgic, warm, familiar drinks (+ a small "bold flavor" bump, which is our own inference) |

Sources supplied by the team: [Sensient](https://www.sensientflavorsandextracts.com/insights/mood-food-studying-the-connection-between-feeling-and-consumption/), [Erik Yang (Medium)](https://medium.com/@erik.yang/flavours-that-feel-how-affective-sensory-state-drives-our-food-choice-d145b2829635), [Ratio Coffee](https://ratiocoffee.com/blogs/coffee-guides/behind-the-brew-how-your-mood-can-affect-flavor-perception), [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S1878450X24002130), [OMG Cheers](https://omgcheers.com/blogs/news/the-psychology-of-taste-why-we-prefer-certain-drinks). Only the ScienceDirect article is peer-reviewed.

### Facts to double-check
Drinks whose fun fact should be verified before presenting carry a `"factCheck": "VERIFY: …"` field in `drinks.json`: Mexican lager, IPA, hard cider, mojito, Aperol spritz, hot toddy, red sangria, espresso martini, shandy, Bloody Mary, Manhattan, Negroni, Mai Tai and Lemon Drop.

## Run locally
Requires Node 18+.
```bash
npm install
npm run dev        # open the printed localhost URL (use your browser's phone view)
npm run build      # production build → dist/
npm run preview    # serve the production build
```

## Deploy

### Option A: Vercel (recommended)
1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and **import** the repository.
3. Vercel auto-detects Vite. Confirm **Build command** `npm run build` and **Output directory** `dist`.
4. Click **Deploy**. You'll get a `*.vercel.app` URL, and every push to the main branch redeploys.

(CLI alternative: `npm i -g vercel && vercel` from the repo root, then `vercel --prod`.)

### Option B: GitHub Pages (fallback)
The build uses relative asset paths (`base: './'` in `vite.config.js`), so it works from a sub-path with no extra config.
```bash
npm run build
npx gh-pages -d dist
```
Then in GitHub go to **Settings → Pages → Build and deployment**, set **Source: Deploy from a branch** and pick **Branch: `gh-pages` / root**. The site appears at `https://<user>.github.io/<repo>/` within a minute or two.

## Project structure
```
src/
  App.jsx               state + step navigation
  components/           Layout (header/footer/shell), ui (buttons, chips, cards), DrinkCard, UpgradePrompt
  screens/              AgeGate, Onboarding, Flow (mood/occasion/dish), Results, Premium, CartPhoto, ReverseFlow, Paywall
  data/                 drinks.json, dishes.js, options.js
  logic/recommend.js    scoring engine + pairing principles
PROCESS_LOG.md          dated build log (prompts, changes, decisions)
```

---
🍃 *Please drink responsibly. SipMatch is for adults of legal drinking age.*
