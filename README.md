# SipMatch: A Match for Every Meal 🍷🍺🍸

A clickable prototype for **USC MOR 531**. SipMatch is a friendly drink-pairing recommender for casual drinkers (21+) who feel unsure picking a drink at the grocery store.

Vivino needs a bottle in hand. SipMatch starts earlier: from **your mood, your occasion and what you're eating**, before a bottle is chosen. It covers wine, beer, cider, spirits and cocktails.

## What's in the prototype

**Free tier (fully working)**
1. **Welcome:** create an account, log in, or continue as a guest.
   - *Create an account:* email, phone (optional), birthday (MM/DD/YYYY or calendar; must be 21+) and a password (8+ characters, typed twice). Your taste profile and saved drinks are stored on your account and come back when you log in, even after closing the page.
   - *Accounts are a prototype:* they live in this browser's localStorage on this device only (no server). Passwords are salted and SHA-256 hashed before saving, never stored as typed, but this is not production security, so don't reuse a real password.
   - *Guest:* birthday-only 21+ check; nothing is saved.
2. **Two-part intro:** explains that the taste profile is answered once and tonight's match every time. The two parts have separate, colour-coded headers (gold for the profile, berry for the quiz). **"Skip it, just match me ⚡"** skips the profile entirely. Every profile screen has **Skip this step** and a "Skip the rest of the profile" link, and no single answer is required. The only required inputs in the app are the 21+ birthday (and account details when signing up) and the 2–3 flavors in Quick pick.
3. **Taste profile** (4 short screens, asked once, editable any time; ends on a "Profile saved" summary):
   - *Palate:* favorite and disliked flavors (sweet, fruity, tart, herbal, bitter, dry, smoky) + sweetness levels (pick any of 5)
   - *What you drink:* pick any of beer & cider, wine, spirits, cocktails, non-alcoholic & coffee, and any strength bands (light ~7%, wine-strength ~7–16%, strong 16%+)
   - *Anything to avoid:* sulfites, gluten, dairy, artificial sweeteners, juniper (gin), oak-aged
   - *Calibration:* 👍 Love / 👎 Pass buttons on each drink: 3–5 loved and 2 passed (skippable for true beginners)
4. **Quick pick or full match:** each match starts by choosing a route.
   - **⚡ Quick pick:** choose 2–3 flavors and how many ideas (3, 4 or 5). You get a random mix drawn from your best flavor matches (still respecting allergies, strength, drink types and any taste profile). 🔀 Shuffle gives a new mix.
   - **🎯 Full match:** the full quiz below.
5. **Tonight's match** (full match; every step has **Skip this step**):
   - Mood (cheerful / stressed / sad–low energy) + social vs. solo
   - Occasion (just me, duo/date, small group, party)
   - Tonight: budget (pick any of $ / $$ / $$$) + style cues (iced vs. neat, carbonated vs. still, light vs. bold)
   - Dish (free text; always skippable)
6. **Results:** a "Matched to your taste profile" strip with an Edit link, then a top match + 2 alternates, each with *why it works*, *the pairing principle*, *based on your taste* (when it's like a drink you love), *why it fits your mood*, *a fun fact*, *what to look for at the store* and a price tier
   - **Short cards:** an open card leads with **🍹 How to make it** for cocktails and mixed drinks (all 27 cocktails plus G&T, spiced rum & cola, shandy, virgin mojito, zero-proof spritz and espresso tonic: glass, ingredients, numbered steps) or **what to look for at the store** for everything else. The rest (why it works, pairing principle, mood fit, fun fact) sits behind **More about this drink**.
   - **"Don't like these?"** opens 3 more options (one wine, one beer or cider, one spirit or cocktail), each labeled with how it differs from the top pick ("a little sweeter", "a little drier", "less bitter", "lighter", "some bubbles"…)
7. **Save drinks** with ♡ Save on any card, rate them 1–5 stars and add a note; all saved drinks live in **My drinks** (♥ in the header). 4–5★ drinks shape future matches, 1–2★ steer away. Saved drinks are kept on your account; guests keep them for the session only.
8. Try a different dish, change budget/style, start over, or edit your profile

**Premium (locked previews)**
- 🛒 **Snap your cart**: photo upload → scripted scan of a sample cart → clarifying questions → drink matches (partly locked)
- 🔄 **Here's what I'm drinking**: name a drink → food ideas + recipe (partly locked)
- 💳 **Paywall**: Free vs. Premium comparison with placeholder pricing
- 👥 **Taste communities**: "coming soon" teaser cards

## How recommendations work

Everything runs in the browser from a local dataset. There are no APIs, no keys and no backend. The only browser storage is the prototype accounts (localStorage).

- `src/data/drinks.json`: 67 curated drinks (17 wines, 6 beers + 1 cider, 10 spirits, 27 cocktails, 6 non-alcoholic/coffee) tagged by sweetness (1–5), approximate ABV as served, serving temperature, likely allergens (sulfites, gluten, dairy, juniper, oak), price tier, taste tags, mood fit, social/solo vibe, occasion fit, food-flavor affinities and "classic pairing" dishes.
- `src/data/dishes.js`: about 140 dish keywords mapped to flavor tags (e.g. `taco → spicy, savory, acidic`, `salmon → fatty, rich`). Unknown dishes fall back to a neutral "savory" profile; a skipped dish uses a "party snacks" profile for parties, and otherwise lets mood, occasion and taste decide.
- `src/logic/recommend.js`:
  1. **Filters:** removes drinks with a listed allergen/aversion (never relaxed), drinks above the ABV ceiling, categories marked "Never" and drinks you'd pass on. The last three are relaxed, with a notice, only if fewer than 3 drinks would remain.
  2. **Scores** every remaining drink. Dish-flavor fit and classic pairings count most, with penalties for known clashes (e.g. high alcohol with spicy food). Also counted: sweetness preference, favorite/disliked flavors, category weights, similarity to drinks you love or hate, mood, social/solo, occasion, tonight's style cues and budget.
  3. **Returns** the top 3 (spanning at least 2 drink types), plus 3 "Don't like these?" alternatives, one per category, chosen so they go in different directions (ideally one sweeter and one drier than the top pick).
  4. **Quick pick** (`quickPick`): applies the same hard filters, keeps drinks matching at least one chosen flavor, scores them (+3 per flavor hit, −4 per disliked flavor, +2 if you rated it 4–5★), then draws 3–5 at random from the top shortlist, weighted by score. The shuffle is seeded, so a given shuffle is repeatable.

### Mood & taste
| Mood | What research suggests | What SipMatch does |
|---|---|---|
| Cheerful | Sweet notes/aroma feel stronger; people seek bright, fizzy, fruity tastes | Boosts fizzy, citrus, fruity, bright drinks |
| Stressed | Bitter and sour feel harsher | Shifts the sweet/dry preference one step sweeter; lightly avoids bone-dry drinks |
| Sad / low energy | Taste sensitivity drops; people seek nostalgic, comforting drinks | Boosts nostalgic, warm, familiar drinks (+ a small "bold flavor" bump, which is our own inference) |

Sources supplied by the team: [Sensient](https://www.sensientflavorsandextracts.com/insights/mood-food-studying-the-connection-between-feeling-and-consumption/), [Erik Yang (Medium)](https://medium.com/@erik.yang/flavours-that-feel-how-affective-sensory-state-drives-our-food-choice-d145b2829635), [Ratio Coffee](https://ratiocoffee.com/blogs/coffee-guides/behind-the-brew-how-your-mood-can-affect-flavor-perception), [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S1878450X24002130), [OMG Cheers](https://omgcheers.com/blogs/news/the-psychology-of-taste-why-we-prefer-certain-drinks). Only the ScienceDirect article is peer-reviewed.

### Facts to double-check
Drinks whose fun fact should be verified before presenting carry a `"factCheck": "VERIFY: …"` field in `drinks.json`: Mexican lager, IPA, hard cider, mojito, Aperol spritz, hot toddy, red sangria, espresso martini, shandy, Bloody Mary, Manhattan, Negroni, Mai Tai and Lemon Drop.

## Phone and desktop
The app is designed for phones first. On screens 1024px and wider it switches to a desktop layout: a wider card, question options in 2–3 columns, and results in two columns (top match on the left, alternatives and actions on the right). The same link works on both.

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
  screens/              Auth (welcome/sign-up/log-in), AgeGate (guest), Onboarding, Quick (start choice + quick pick), Flow (mood/occasion/dish), Results, Premium, CartPhoto, ReverseFlow, Paywall
  data/                 drinks.json, dishes.js, options.js, recipes.js
  logic/recommend.js    scoring engine + pairing principles + quickPick
  logic/accounts.js     localStorage demo accounts (hashed passwords)
  logic/birthday.js     MM/DD/YYYY parsing + age
PROCESS_LOG.md          dated build log (prompts, changes, decisions)
```

---
🍃 *Please drink responsibly. SipMatch is for adults of legal drinking age.*
