# SipMatch launch to-do (2 weeks)

Goal: a public-facing beta that strangers can use safely. Each person owns one lane so nobody edits the same files at once. Tick boxes in PRs as you go.

**Day 1 decisions (whole team, 15 min):**
- [ ] Accounts: real accounts on Supabase, or guest-only for launch?
- [ ] Community: real cross-device groups for launch, or keep it as a labeled demo?
- [ ] Domain: keep the `vercel.app` link or buy one?

---

## 1. TastefullyYours: lead, brand, legal, launch

Files: `README.md`, `index.html`, `public/`, new legal pages, `src/components/Layout.jsx` (footer links only)

- [ ] Day 1: run the decisions above; post the plan in the group chat
- [ ] Day 1: Anthropic account → billing + **monthly spend cap** → API key → add `ANTHROPIC_API_KEY` in Vercel (Production + Preview). Never paste the key in chat or code
- [ ] Days 2–3: link-preview image (logo banner 1200×630) and Open Graph tags so shared links look good
- [ ] Days 2–4: Terms of Service + Privacy Policy (template is fine; mention email/birthday, browser storage, AI dish lookup). Link them in the footer and at sign-up
- [ ] Day 4: About + Contact pages; visible "Beta" label
- [ ] Day 5: mid-point demo: everyone shows their lane on the Vercel preview; cut anything slipping
- [ ] Day 8: get an instructor OK on the legal pages if this goes truly public
- [ ] Day 9: soft launch to ~20 friends/classmates with the feedback form
- [ ] Day 10: public launch; decide who checks errors, AI spend and feedback each week

## 2. tliu9928-bot: AI dish lookup + cart

Files: `src/data/dishes.js`, `src/screens/Flow.jsx` (dish step), `api/` (new), `src/screens/CartPhoto.jsx`

- [ ] Days 2–3: turn the simulated flavor scan into a **real Claude Haiku 5.5** call via a Vercel serverless function (`/api/dish-flavors`): known dishes stay local, unknown ones go to Haiku, answer limited to the 15 flavor tags
- [ ] Day 3: safety: 80-character cap, basic rate limit, 4-second timeout → fall back to the local scan; cache answers in the browser
- [ ] Day 4: expand the local dish list (aim for 500+ common dishes) so most lookups never need the API
- [ ] Days 6–7: test 50 unusual dishes on the preview; fix bad tag results
- [ ] Day 7: "Snap your cart": clearly label it as a demo/"coming soon" for launch (no fake results presented as real)

## 3. annaccen: accounts + community

Files: `src/logic/accounts.js`, `src/screens/Auth.jsx`, `src/logic/community.js`, `src/screens/Community.jsx`

- [ ] Days 1–3 (if Supabase): sign-up, log-in, email confirmation, password reset on Supabase; remove the phone field
- [ ] Days 4–5: save profile + saved drinks to the account; **"Delete my account"** button; move existing browser data over on first log-in
- [ ] Days 4–5 (if real community): groups and chat on Supabase **plus** report/block and a basic word filter. Otherwise: label community "Demo — coming soon" for launch
- [ ] Days 6–7: security pass: no keys in the browser, rate-limit sign-up, check what each user can read/write
- [ ] If guest-only was chosen: hide account screens, keep saved drinks in the browser, and help with QA instead

## 4. Teammate 4: content, QA, accessibility

Files: `src/data/drinks.json`, `src/data/recipes.js`, `src/screens/Premium.jsx`, `src/screens/Paywall.jsx`, tests/CI (new)

- [ ] Days 1–3: fact-check the 14 `VERIFY` drinks, all 33 recipes, and spot-check allergen tags (allergens matter most)
- [ ] Day 3: allergy disclaimer on drink cards ("allergen info is approximate, check the label")
- [ ] Day 4: Premium/Paywall: remove placeholder prices, label features "coming soon"
- [ ] Day 4: add error tracking (Sentry, free) + Vercel Analytics + a "Send feedback" link
- [ ] Day 5: add automated click-through tests to the repo and run them on every PR (GitHub Actions)
- [ ] Days 6–7: **real-device testing**: iPhone Safari, Android Chrome, Mac Safari, Windows Chrome/Edge; log bugs as GitHub issues
- [ ] Day 7: accessibility pass: keyboard-only use, screen-reader labels, color contrast
- [ ] Day 8: everyone fixes bugs from testing (Teammate 4 triages the list)

---

**Already done:** logo banner + brand colors, accounts (prototype), skip-anywhere quiz, quick pick, recipes, saved drinks with ratings, community groups (demo), simulated dish + cart analysis.
