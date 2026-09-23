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
- `src/data/dishes.js`: about 120 dish keywords mapped to 15 flavor tags. Matching is whole-word, plural-tolerant and longest-first ("fried chicken" beats "chicken"). Unrecognized dishes fall back to a neutral "savory" profile; a party with the dish skipped uses a salty/fried/fatty snack profile.
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

---

## 2026-09-23 — Milestone 3: Free-tier flow (end to end)

**Prompt:** Continuing the approved plan (no new prompt).

**Built:**
- `App.jsx`: all state in React (`step`, `profile`, `mood`, `occasion`, `dish`), a step-based "router", per-step Back targets, and a progress bar across the 5 input steps.
- `AgeGate.jsx`: splash + "Are you 21 or older?". "Not yet" leads to a friendly come-back-later screen.
- `Onboarding.jsx`: 2 screens. (1) Age group + budget. (2) Sweet/in-between/dry + flavor likes (chips) + dislikes (chips).
- `Flow.jsx`: Mood (3 feelings + social/solo, with an expandable "Why does mood matter?" note), Occasion (party / duo-date / small group), and Dish (free text + example chips; "Skip, it's just party snacks" appears only for party).
- `Results.jsx` + `DrinkCard.jsx`: a top match card (expanded) plus 2 alternates (tap to expand). Each card shows why it works, the pairing principle (named for the user's dish), why it fits your mood, a fun fact, a "look for at the store" tip, the price tier with range, a "splurge" flag if over budget and a "Classic pairing" badge. Unrecognized dishes show a friendly note. Actions: try a different dish, start over (keeps the profile), edit profile (returns straight to updated results). There's also a locked "Already at the store?" teaser that leads to Premium.
- Layout: phone-width shell (centered card with shadow on desktop), sticky header with Back / logo / ✨ Premium, and a "Please drink responsibly. For adults 21+ only." footer on every screen.

**Testing:** A headless-browser (Playwright) click-through at 390×844 covered age gate → onboarding → stressed/social/date/"spicy chicken tacos" (→ Paloma, Margarita, Dry Rosé), expanding an alternate, editing the profile, starting over → party + skip (→ Prosecco, Aperol Spritz, Sangria), and an unrecognized dish. No JS errors.

**Decisions / issues:**
- Mood and social/solo sit on **one** screen (two sections) instead of the planned two screens, to save a tap.
- Mood/Occasion/Dish live in one file (`Flow.jsx`) rather than three, for speed.
- Added a "look for at the store" tip to each card (not in the brief) to support the grocery-store use case.
- Fixed a bug where backing out of profile editing left the app in "editing" mode.

---

## 2026-09-23 — Milestone 4: Premium previews + paywall + communities teaser

**Prompt:** Continuing the approved plan (no new prompt).

**Built:**
- `Premium.jsx` (hub): two locked "Premium · Preview" feature cards, plus a **Taste communities** carousel (Gin Lovers, Natural Wine, Hoppy Hour, Home Mixologists) marked "Coming soon", with in-memory "Notify me" toggles. Reachable from the ✨ Premium header button and from the "Already at the store?" card on results.
- `CartPhoto.jsx`: a real upload/camera input that previews the photo, or "Try it with a sample cart". Then a scripted scan animation, then "Here's what we spotted" (chicken thighs, lemons, garlic, arugula, parmesan, olive oil). Two clarifying questions follow (cooking method; what the parmesan is for). The result names a meal and a top pick that changes with the cooking method (roasted → oaked Chardonnay, grilled → dry rosé, pan-fried → Prosecco). Two more picks and a shopping list sit blurred behind an upgrade prompt. A "Demo: results are scripted" banner is always visible.
- `ReverseFlow.jsx`: "Here's what I'm drinking" input + example chips. Recognized drinks show one food idea (from the drink's classic-pairing list in the dataset) with the pairing principle; more ideas and a recipe are blurred behind the upgrade prompt. Unrecognized drinks fall back to a labeled Pinot Noir sample.
- `Paywall.jsx`: a Free vs. Premium comparison table, monthly/yearly plan toggle and a "Start 7-day free trial" button that opens a "this is a class prototype, no payment is taken" note.
- `UpgradePrompt.jsx`: a reusable blur + lock + "Upgrade to Premium" overlay.

**Testing:** A Playwright click-through covered the premium hub → notify → cart demo (sample cart, grilled + salad) → upgrade → paywall → trial note → back navigation → reverse flow (known and unknown drinks) → exiting the premium area back to the screen it was opened from. No JS errors.

**Decisions / issues:**
- Placeholder pricing: **$3.99/month or $29.99/year (save 37%)** with a 7-day free trial.
- The paywall's Premium column also lists "Save favorites & shopping lists" as a plausible premium perk. This isn't in the brief, so it's flagged for approval.
- Fixed a carousel alignment bug (cards snapping flush to the screen edge).

---

## 2026-09-23 — Milestone 5: Polish, README & deploy docs

**Prompt:** Continuing the approved plan (no new prompt).

**Built / changed:**
- Full `README.md`: product summary, feature list, how the recommender works, a mood & taste table with the supplied sources, the list of facts to verify, run-locally steps and deploy steps for **Vercel** (primary) and **GitHub Pages** (fallback, via `npx gh-pages -d dist`).
- Desktop check: the app renders as a centered phone-width card; fixed the "✨ Premium" header pill wrapping onto two lines.
- Re-ran both Playwright click-throughs (free flow + premium) after the final changes: all passed with no app errors.

**Decisions / issues:**
- No GitHub Actions workflow was added for Pages, to avoid a failing CI job if Pages isn't enabled. The manual `gh-pages` command is documented instead.
- Google Fonts (Fraunces/Inter) couldn't load in the sandboxed test browser (proxy certificate). The app falls back to system serif/sans fonts, and fonts load normally once deployed.

---

## 2026-09-23: Milestone 6: "Don't like these?" alternatives + dataset expanded to 61 drinks

**Prompt (verbatim, first part):** "wait i would like it to have a few more alternatives at the end, based on if you don't like sweetness bitterness or other aspects of the drink. like "if you want something a little sweeter/drier" at the end, like alternatives if they don't like what's at the end. I would ideally like to include a few more items like a total 3 main and 3 alts. If they don't like the options the app chooses, lets have a bottom tab that says "don't like these? " and it gives a wine beer and spirit/cocktail suggestion and those are the 3 alts"

**Prompt (summary, second part):** The user supplied tables of 29 drinks to add (5 wines, 1 beer, 5 spirits, 18 cocktails), each with sweetness, price, mood fit and classic pairings, and asked to replace the generic Sangria with Red and White Sangria.

**Context:** PR #1 had already been merged into `main` (and deployed via Vercel), so this work restarted the branch from the updated `main`.

**Built / changed:**
- **Results:** the 3 main picks are unchanged. Below them, a **"Don't like these? 🤔"** tab expands to 3 alternatives: one **wine**, one **beer or cider**, one **spirit or cocktail**. Each carries a banner saying how it differs from the top pick: "If you want something a little sweeter / a little drier / less bitter / lighter / bolder / some bubbles / to skip the bubbles / a different style".
- **Alternative-picking logic** (`recommend.js`): takes the top 5 candidates per category (excluding the main 3 and disliked drinks) and tries the combinations. It favors high scores, 3 different directions, and ideally one sweeter plus one drier option. If a category is empty (e.g. the user dislikes wine), it fills the slot from any category.
- **Dataset:** 33 → **61 drinks** (17 wine, 6 beer + 1 cider, 10 spirits, 27 cocktails). All 29 requested drinks were added with the user's sweetness, price, mood fit and classic pairings, plus beginner copy, a pairing principle, a fun fact and a store tip for each. The generic Sangria was split into Red and White Sangria.
- **Dish keywords:** about 120 → about 140 (bacon, jerk, Cuban, smoked salmon, poke, olives, pickles, appetizers, pastries, pecan pie, bread pudding, strawberries, pineapple, tropical, etc.) so every classic pairing in the table can match.
- The **"Dislike wine"** filter now also excludes wine-based cocktails (sangrias, mimosa, Aperol spritz, French 75).

**Fact-checking:** Six new facts are flagged `VERIFY` (14 total): shandy/Radler origin, Bloody Mary origin, Manhattan/Jennie Jerome myth, Negroni origin, Mai Tai origin and Lemon Drop origin. The Red Sangria entry keeps the EU-labeling flag from the old Sangria.

**Testing:** 14 Node scenarios were checked for sensible main picks and alternatives (e.g. BBQ ribs → Whiskey Sour / Zinfandel / Red Blend; alternatives Malbec "drier", Hard Cider "some bubbles", Red Sangria "sweeter"). Playwright click-throughs of the free flow, the premium screens and the new tab all passed with no app errors.

**Decisions / issues:**
- The requested totals said 62 drinks / 28 cocktails, but the listed additions produce **61 / 27** (33 − generic Sangria + 29). The app uses the 61 listed drinks.
- Removed "spicy food" from Zinfandel's affinities: it's high in alcohol, and high alcohol makes chili heat feel hotter (one of the app's own principles).
- The alternatives are collapsed behind the tab by default so the main 3 stay the focus.

---

## 2026-09-23: Milestone 7: Dish step skippable for every occasion

**Prompt (verbatim):** "also on the food section, allow users to skip options"

**Built / changed:**
- The dish screen always shows a skip button: "Skip, it's just party snacks 🍿" for parties (unchanged) and **"Skip, no dish yet ⏭️"** for duo/date and small group. The subtitle explains what skipping does.
- Recommender: a skipped non-party dish adds no dish-flavor scoring, so mood, occasion, sweet/dry preference, liked flavors and budget decide. Each card explains its drink's own signature pairing principle.
- Results: the headline reads "Here's what to sip tonight" when no dish was given, and the main button changes from "Try a different dish" to **"Add a dish"**. The "Don't like these?" alternatives still work.

**Testing:** Node scenarios for skipped date/group/party (e.g. sad + solo + date → Bourbon / Irish Whiskey / Manhattan with $$ budget and dry taste). Playwright confirmed the skip → results → "Add a dish" round trip. All four earlier click-through scripts still pass with no app errors.

**Decisions / issues:** Kept the party skip copy and "party snacks" profile as before; only the non-party skip is new.
