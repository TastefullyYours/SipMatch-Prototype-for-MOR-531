# SipMatch — Process Log

Process documentation for the SipMatch clickable prototype (USC MOR 531).
Each entry records the prompt given to the AI coding assistant (Claude Code), what was built or changed, and any decisions or issues.

---

## 2026-09-23 — Milestone 0: Planning (no code)

**Prompt (verbatim, initial brief):**

> I'm building a clickable web prototype of SipMatch for a product management class (USC MOR 531). It's due in about 24 hours, so scope matters more than polish. Before writing any code, give me a short build plan (file structure, screens, data approach) and wait for my approval.
>
> PRODUCT
> SipMatch: "A Match for Every Meal." A drink pairing recommender for casual drinkers who drink socially but don't have wine or spirits knowledge and feel unsure choosing a drink to go with a meal at the grocery store. Covers any drink type: wine, beer, spirits, cocktails. Positioning: Vivino requires a bottle in hand and scans labels; SipMatch starts from your mood, occasion, and what you're eating, before a bottle is chosen.
>
> TARGET USER
> Young, newer, or casual drinkers (21+) and home cooks who find wine and spirits tools intimidating. Tone should feel friendly and approachable, never snobby.
>
> FREE TIER FLOW (fully built and working)
> 1. Age gate (21+ confirmation).
> 2. Onboarding profile: age group, budget range, sweet vs. dry preference, dislikes, basic taste preferences. Keep to 1 to 2 screens.
> 3. Mood input: happy/sad and social/not social (simple tappable choices).
> 4. Occasion: party, duo/date, or small group.
> 5. Dish input: user types a named dish. If occasion is "party," this step can be skipped.
> 6. Results: 1 primary drink recommendation plus 2 alternates, each with:
>    - Why it works (plain language, beginner-friendly)
>    - The common pairing principle behind it (e.g. acid cuts fat)
>    - A fun fact, cultural reference, or bit of drink history (e.g. the vodka martini, olives, and James Bond)
>    - Price tier matching the user's budget
> 7. Let the user start over or edit their profile.
>
> PREMIUM TIER (show as locked previews, not fully functional)
> - Cart-photo path: user uploads a photo of their grocery cart, AI identifies ingredients, asks clarifying questions, and recommends drinks. For the prototype, show the upload screen plus a scripted demo result from a sample cart, with an upgrade prompt.
> - Reverse flow: "Here's what I'm drinking." User names a drink and gets food or recipe pairings. Same treatment: preview screen and upgrade prompt.
> - A simple paywall/upgrade screen explaining free vs. premium.
>
> OPTIONAL IF TIME: a teaser card for taste communities (e.g. "Gin Lovers," "Natural Wine"), marked "coming soon."
>
> RECOMMENDATION LOGIC
> Use a local curated JSON dataset, no external API or keys. About 30 drinks across wine, beer, spirits, and cocktails, tagged by sweetness, price tier, mood fit, occasion fit, and food/flavor affinities. Map typed dishes to flavor profiles via keyword matching (e.g. "tacos" -> spicy, savory; "salmon" -> fatty, rich), with a sensible fallback for unrecognized dishes. Score drinks against profile + mood + occasion + dish and return the top 3. Only use well-established pairing principles and facts; add a comment flagging any fact I should double check.
>
> TECH
> - Vite + React + Tailwind, mobile-first (design for phone width, should still look fine on desktop).
> - Static site, deployable to Vercel (GitHub Pages as fallback). Include deploy steps in the README.
> - Keep state in React; no backend, no browser storage.
> - Add a small "Please drink responsibly" footer.
>
> WORKFLOW RULES
> - Initialize git and commit after each working milestone with clear messages.
> - Maintain a PROCESS_LOG.md in the repo. After each milestone, add a dated entry: the prompt I gave, what you built or changed, and any decisions or issues. I'm submitting this as process documentation, so keep it accurate and concise.
> - When you make a design or copy decision I didn't specify, list it at the end of your message so I can approve or change it.

**What happened:** The assistant proposed a build plan: file structure, screen list, step-based navigation in `App.jsx`, a JSON drink dataset, keyword-based dish mapping, a weighted scoring function, static premium previews, and five milestones. It also listed unspecified design decisions for approval (visual style, onboarding options, price-tier ranges, a "Demo" label on the cart demo, etc.).

**Follow-up prompt 1 (summary):** The user supplied mood/taste research and asked for moods to reflect it:
- *Stress/anxiety:* heightens bitterness and sour perception; people crave comforting profiles.
- *Positive/cheerful:* enhances sweetness and aroma; people seek playful, fizzy, bright, citrus tastes.
- *Sadness/low energy:* reduces taste sensitivity; people seek nostalgic, comforting, symbolic drinks (e.g. champagne, warm whiskey).
- Sources: sensientflavorsandextracts.com, medium.com (Erik Yang), ratiocoffee.com, sciencedirect.com (S1878450X24002130), omgcheers.com.

**Revision:** The mood screen became three moods (Cheerful / Stressed / Sad–low energy) plus the original social/solo choice, with mood-specific scoring boosts and a "Why it fits your mood" line on each result. The assistant noted that only the ScienceDirect source is peer-reviewed. It also flagged that the "bold flavors when sad" boost is its own inference, not a finding in the sources.

**Follow-up prompt 2 (verbatim):** "stressed should just be things that are more sweet and less dry, not necessarily low abv"

**Revision:** The Stressed mood now only shifts the user's sweetness preference one step sweeter and lightly penalizes very dry drinks. The low/no-ABV guarantee and the extra non-alcoholic drinks were dropped (the dataset stays at about 30 drinks).

**Follow-up prompt 3 (verbatim):** "approved"

---

## 2026-09-23 — Milestone 1: Project scaffold

**Prompt:** "approved" (the plan above)

**Built:**
- Vite 8 + React 19 project at the repo root, with Tailwind CSS v4 via `@tailwindcss/vite`.
- Theme tokens in `src/index.css`: cream/sand backgrounds, a deep-berry primary color, a gold accent, Fraunces display font and Inter body font (Google Fonts).
- `vite.config.js` sets `base: './'` so the same build works on Vercel and on a GitHub Pages sub-path.
- Emoji wine-glass favicon; template demo assets removed.
- Placeholder `App.jsx`; `npm run build` succeeds.

**Decisions / issues:** Chose Tailwind v4 (Vite plugin, no config file) for a faster setup than v3 + PostCSS.

---

## 2026-09-23 — Milestone 2: Drink dataset + recommendation logic

**Prompt:** Continuing the approved plan (no new prompt).

**Built:**
- `src/data/drinks.json`: 33 drinks (12 wine, 5 beer, 1 cider, 5 spirits, 10 cocktails). Each is tagged with sweetness (1–5), price tier ($/$$/$$$), taste tags, mood fit, social/solo vibe, occasion fit, food-flavor affinities and "classic pairing" dish keywords. Each also has beginner copy: why it works, a principle, a fun fact and a "look for" shopping tip.
- `src/data/dishes.js`: about 130 dish keywords mapped to 15 flavor tags. Matching is whole-word, plural-tolerant and longest-first ("fried chicken" beats "chicken"). Unrecognized dishes fall back to a neutral "savory" profile; a party with the dish skipped uses a salty/fried/fatty snack profile.
- `src/logic/recommend.js`: weighted scoring. Dish-flavor overlap is weighted highest (+3 per tag, +4 for a classic pairing), with penalties for known clashes (e.g. high alcohol or tannin with spicy food, a dry drink with dessert). Sweetness distance from the user's preference, mood, social/solo, occasion, taste likes and budget (over-budget is penalized, not hidden) also count. Disliked drinks are excluded. The top 3 always span at least 2 drink types.
- Each result carries a plain-language pairing principle (15 established principles such as "Acid & bubbles cut fat" and "Tannin loves protein") and a mood line.

**Mood logic (per user direction):**
- Cheerful: boost fizzy, citrus, fruity and bright drinks.
- Stressed: *only* shifts the sweet/dry preference one step sweeter and lightly penalizes bone-dry drinks.
- Sad/low energy: boost nostalgic, warm and familiar drinks, plus a small "bold flavor" bump. That bump is the assistant's inference and is flagged in a code comment.

**Fact-checking:** Eight fun facts carry a `factCheck: "VERIFY: …"` field in `drinks.json`: Mexican lager history, IPA origin, Johnny Appleseed/cider, Hemingway/mojito, spritz etymology, hot toddy origin, EU sangria labeling and the Espresso Martini origin quote. The remaining facts are widely documented.

**Testing:** A Node script ran 12 scenarios. Results looked sensible (steak → Cabernet, pad thai → off-dry Riesling, sushi → whisky highball/Riesling, mushroom risotto → Pinot Noir, chocolate cake → stout).

**Decisions / issues:**
- Early tests put a margarita top-3 for salmon and left Chianti out for pizza. Fixes: a "classic pairing" bonus, removing "fatty" from the margarita's affinities, and principle explanations that only claim a mechanism the drink actually has (e.g. no "tannin loves protein" for a white wine).
- Cider gets its own type ("Cider") rather than being lumped into beer.
