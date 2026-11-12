# Task briefs — portfolio polish

Companion to `portfolio-polish.md`. One task is one Sonnet dev
agent. Tasks run in order; each depends on the one before.

## Rules for every task

- TDD: write the listed tests first, run them, confirm they fail
  for the expected reason, then implement. Commit tests and code
  together so no commit is red.
- Max 400 lines per file and 80 characters per line, in every file
  you create or touch (lockfile excepted).
- Do not modify or weaken an existing test unless the task says so.
- Update the docs your change makes false, in the same commit.
  Docs describe current behavior in the present tense; no history.
- Stay inside "May touch". Never touch `docs/plans/`, `.claude/`,
  or git stashes. Never push, never open a PR.
- Before finishing run: `npm run lint`, `npm test`,
  `npm run build`, and (once they exist) `npm run test:e2e`,
  `npm run check:limits`.
- Commit on the task's branch with an imperative subject and a body
  that says why. End the message with:
  `Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>`

## T1 — test harness (`chore/test-harness`, PR 1)

ACs: groundwork for all. Characterization tests, green on arrival.

May touch: `package.json`, `package-lock.json`, `vite.config.ts`,
`tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`,
`.gitignore`, `.nvmrc`, `playwright.config.ts`, `src/test/setup.ts`,
`src/**/*.test.tsx`, `scripts/readme.test.ts`, `e2e/smoke.spec.ts`,
`README.md`. Must not touch: any non-test file under `src/`.

Do:
- Dev deps: `vitest`, `jsdom`, `@testing-library/react`,
  `@testing-library/jest-dom`, `@playwright/test` (exact version).
- Scripts: `test` (`vitest run`), `test:e2e` (`playwright test`).
  `engines.node` `>=24`; `.nvmrc` `24`.
- Vitest in `vite.config.ts` via `vitest/config`: jsdom, globals,
  setup file, `include` `src/**/*.test.{ts,tsx}` and
  `scripts/**/*.test.ts`, `exclude` `e2e/**`.
- `tsconfig.node.json` includes `scripts`, `e2e`,
  `playwright.config.ts`, adds `"DOM"` to `lib` (Playwright
  `page.evaluate` callbacks use `document`), and both tsconfigs get
  the Vitest globals and jest-dom types. ESLint: node globals for
  those paths.
- jsdom has no `IntersectionObserver` and Navbar constructs one on
  mount: stub it in `src/test/setup.ts`.
- Playwright: Chromium only; `webServer` runs
  `npm run build && npx vite preview --port 4173 --strictPort`,
  `url` and `baseURL` `http://localhost:4173/portfolio/`,
  `reuseExistingServer: !process.env.CI`, `workers: 1` on CI.
  Ignore `playwright-report/` and `test-results/`.

Tests (invariants only; do not assert `aria-current` or the resume
href, later tasks change them):
- Each section renders its `h2`; Hero renders one `h1`.
- Navbar renders four links with hrefs `#about`, `#experience`,
  `#projects`, `#contact`.
- Every `target="_blank"` link in `<App />` has
  `rel="noopener noreferrer"`.
- `scripts/readme.test.ts`: every key in `package.json` `scripts`
  appears in `README.md` as `npm run <key>` or `npm test`.
- e2e smoke: `page.goto('./')` loads with no console errors; each
  nav link brings its section into the viewport; the resume link
  target responds 200.

Docs: README gains Getting started (`npm ci`,
`npx playwright install chromium`), Testing, and the new folders in
Project Structure.

## T2 — file limits (`chore/file-limits`, PR 2)

ACs: AC16.

May touch: `scripts/check-limits.sh`, `scripts/check-limits.test.ts`,
`package.json`, `README.md`, and any tracked file with a line over
80 characters (reflow only, no behavior change).

Tests first (`scripts/check-limits.test.ts`, spawns bash in a temp
git repo): an 81-column line prints `WIDE <file>:<line>` and exits
1; a 401-line file prints `LONG <file>` and exits 1; a compliant
repo prints nothing and exits 0; an exempt path is ignored.

Do: `check-limits.sh [dir]` over `git ls-files`, exempting exactly
`package-lock.json`, `public/*`, `src/data/projects.ts`. Script
`check:limits`. Reflow every wide line: wrap comments, concatenate
long strings in `src/data/experience.ts`, fold YAML comments.
Rendered text must not change (existing tests stay green).

## T3 — CI gates (`chore/ci-gates`, PR 3)

ACs: AC15.

May touch: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`,
`.github/dependabot.yml`, `scripts/workflows.test.ts`,
`package-lock.json`, `README.md`.

Tests first (`scripts/workflows.test.ts`, plain text assertions):
- `ci.yml` has `pull_request` and `workflow_call`, never
  `pull_request_target`, and only `contents: read`.
- `deploy.yml` has no `pull_request` trigger; a job uses
  `./.github/workflows/ci.yml`; the deploy job `needs` it;
  `actions: write` appears only in the keepalive job; no `npx tsx`.
- Every `uses:` of a third-party action is pinned to a 40-char SHA.

Do: implement the "CI shape" section of the plan. CI steps:
checkout (`persist-credentials: false`), setup-node from `.nvmrc`
with npm cache, `npm ci`, lint, unit, build,
`npx playwright install --with-deps chromium`, e2e, limits.
Deploy job: checkout, node, `npm ci`,
`node scripts/fetch-pinned.ts`, build, pages actions. Keepalive
job: `if: github.event_name == 'schedule'`, one step
`gh api -X PUT repos/${{ github.repository }}/actions/workflows/`
`deploy.yml/enable` with `GH_TOKEN`. Resolve each action's current
major to its commit SHA with `gh api`. Dependabot: monthly, grouped,
for `github-actions` and `npm`. Then `npm audit fix` (no `--force`)
as a separate commit.

Docs: `deploy.yml` header comment; README Deployment section,
including the manual re-enable command.

## T4 — pinned pipeline (`fix/pinned-pipeline`, PR 4)

ACs: AC12, AC13, AC14, AC20.

May touch: `scripts/pinned.ts`, `scripts/pinned.test.ts`,
`scripts/fetch-pinned.ts`, `scripts/fetch-pinned.test.ts`,
`src/data/projects.ts`, `src/sections/Projects.tsx`,
`src/sections/Projects.test.tsx`, `README.md`.

Tests first:
- `toProject`: id from owner and name (unique across owners);
  title casing as today; null description gives no `description`
  key; topics become tags; no topics gives `[primaryLanguage]`; null
  language gives `[]`; `homepageUrl` kept only if it parses and is
  `https:` (reject `javascript:`, `data:`, `http:`, garbage); a
  `url` not starting `https://github.com/` returns null.
- `selectRepos`: drops `IsMichaelHuang/portfolio` case-insensitively
  but keeps `Other/portfolio`; drops nulls.
- `buildProjectsFile`: write to a temp dir, dynamic-import, deep
  equal the input for text containing `"`, `\`, newline, `${`, and
  a `*/` sequence.
- `run({ env, fetchFn, writeFile, log })`: missing token; non-2xx;
  GraphQL `errors`; null `user`; zero usable repos. Each rejects,
  never calls `writeFile`, and no log line contains the token.
  Happy path calls `writeFile` once.
- `Projects`: a project without `description` renders no `<p>`.

Do: pure `scripts/pinned.ts`; `fetch-pinned.ts` exports `run` and
calls it only when executed directly. Imports use `./pinned.ts` and
`import type` (Node runs the file without a compiler). Query adds
`nameWithOwner` and `primaryLanguage { name }`. `description`
becomes optional in `Project`. Values are emitted with
`JSON.stringify`. Errors log status and a short message only.
In `src/data/projects.ts` change only the interface (and the
header the generator emits); keep the data entries. The main agent
regenerates the entries from live pins in a separate commit.

## T5 — responsive layout (`fix/responsive-layout`, PR 5)

ACs: AC1, AC2, AC3, AC4.

May touch: `e2e/layout.spec.ts`, `src/index.css`,
`src/components/Navbar.tsx`, `src/components/Navbar.module.css`,
`src/sections/*.module.css`, `src/assets/mark.png` (provided),
`src/components/Navbar.test.tsx`.

Tests first (`e2e/layout.spec.ts`, reduced motion on, wait for
`document.fonts.ready`):
- AC1 at 320, 375, 768, 1280, 1920: `scrollWidth <= clientWidth`.
- AC2 at 320: brand and four links have bounding boxes inside the
  viewport and height at least 24.
- AC3 at 1280: assert at least two cards; first two are 450 wide,
  share a top, have equal heights of at least 270.
- AC4 at 320: inject a 60-character unbroken word into the first
  card title and description; every card has
  `scrollHeight <= clientHeight + 1` and no horizontal scroll.

Do: grid `repeat(2, minmax(0, 450px))`, single
`minmax(0, 450px)` column at `max-width: 987px`; card
`min-height: 270px` (uniform height without clipping);
`overflow-wrap: anywhere` on card text. Navbar below 600px: smaller
gap and padding, the text brand is visually hidden and the square
mark image shows (`alt=""`, explicit size; the link keeps the text
"Michael Huang" for assistive tech). Nav links
`display: inline-flex; min-height: 24px`. Hero
`min-height: 100vh; min-height: 100svh`.

## T6 — accessibility (`fix/accessibility`, PR 6)

ACs: AC7, AC8, AC9, AC10, AC11, AC17 (resume href), AC19.

May touch: `src/App.tsx`, `src/index.css`, `src/components/*`,
`src/lib/activeSection.ts`, `src/lib/activeSection.test.ts`,
`src/contrast.test.ts`, `src/sections/*`, `src/**/*.test.tsx`,
`e2e/keyboard.spec.ts`, `e2e/motion.spec.ts`, `e2e/a11y.spec.ts`,
`e2e/nav.spec.ts`, `package.json`, `package-lock.json`, `README.md`.
New dev dep: `@axe-core/playwright`.

Tests first:
- `pickActive(tops, offset, atBottom)`: empty above the first
  section; the last section at or above the offset; last section
  when `atBottom`; empty list.
- `contrast.test.ts`: parse the tokens from `src/index.css`,
  composite alpha colors over `--color-bg` and over
  `--color-surface` on `--color-bg`; `--color-text`,
  `--color-text-muted`, `--color-accent-text` are at least 4.5:1 on
  both; muted is at least 5.5:1 on bg.
- `ExternalLink`: `target`, `rel`, visible text first, sr-only
  suffix "(opens in new tab)" and, with `context`, " for X (opens
  in new tab)". Resume link href starts with
  `import.meta.env.BASE_URL` and its suffix says PDF.
- e2e keyboard: first Tab shows "Skip to content" in the viewport;
  Enter focuses `main`; at 320px Tab through every focusable and
  assert each has a non-`none` outline and, except the skip link
  and the nav's own links, its top is at or below the nav's bottom.
- e2e motion: with reduced motion, `html` scroll-behavior is
  `auto` and no element has a running animation.
- e2e nav: no `aria-current` at top; clicking each nav link makes
  exactly that link `aria-current="location"`; scrolling to the
  bottom marks Contact; scrolling to top clears.
- e2e a11y: axe with tags `wcag2a, wcag2aa, wcag21a, wcag21aa,
  wcag22aa` at 320, 375, 1280 has no violations; with WCAG text
  spacing overrides at 320px there is no horizontal scroll.

Do: `<main id="main" tabindex="-1">` around the sections; skip
link above the nav in z-order; `:focus-visible` ring from
`--color-focus`; `--nav-h` used by `scroll-padding-top`;
`@media (prefers-reduced-motion: reduce)` block; nav
`aria-label="Primary"`; replace the IntersectionObserver with a
passive scroll and resize handler using `pickActive` and the nav's
measured height (delete the `IntersectionObserver` stub from
`src/test/setup.ts`); `ExternalLink` used for every new-tab link, with
`context` on project Code and Live links; `.sr-only` utility;
Experience entries become `<article>`; raise
`--color-text-muted`; add `--color-accent-text` and use it where
accent colors text; move raw whites in `Projects.module.css` to
tokens.

Docs: Navbar docblock, README Navigation and Theme sections.

## T7 — typography (`feature/typography`, PR 7)

ACs: AC21 (and AC1, AC10 stay green).

May touch: `package.json`, `package-lock.json`, `src/main.tsx`,
`src/index.css`, `src/**/*.module.css`, `e2e/fonts.spec.ts`,
`README.md`.

Tests first (`e2e/fonts.spec.ts`): every request URL is on the
page origin; after `document.fonts.ready`, `document.fonts` has
an entry with `status === 'loaded'` for the Jost family and one for
Source Serif 4; `h1` computed font-family starts with Jost;
the bio paragraph's starts with Source Serif; the bio `<em>`
computes `font-style: italic`.

Do: add both fontsource packages; import the variable weight CSS
for Jost, and roman plus italic for Source Serif 4; check in
`dist/assets` which files ship and report sizes. Tokens
`--font-display` and `--font-body` with system fallbacks. Jost:
`h1`, `h2`, `h3`, nav, buttons, pills. Source Serif 4: bio,
experience bullets, project descriptions, contact message (slightly
more line-height than the sans it replaces). Skill category labels
drop `text-transform: uppercase`. Set a clear type scale with
`clamp()` for `h1` and `h2`.

## T8 — hero identity (`feature/hero-identity`, PR 8)

ACs: AC17 (and AC1, AC9, AC10 stay green).

May touch: `src/sections/Hero.tsx`, `src/sections/Hero.module.css`,
`src/sections/Hero.test.tsx`, `src/index.css`, `e2e/hero.spec.ts`,
`README.md`.

Tests first:
- Hero renders an `img` with empty alt and numeric `width` and
  `height`; `h1` "Michael Huang"; "Software Engineer"; the summary
  line from the plan; links Resume, GitHub, LinkedIn.
- e2e: hero image is visible and its natural width is at least
  twice its rendered width at 1280px; with reduced motion the hero
  has no animation; `body` `background-attachment` is `scroll`.

Do: mark above the name; one load keyframe (under 400ms,
`from { opacity: 0; transform: translateY(8px) }`,
`animation-fill-mode: backwards`, no base `opacity: 0`); starfield
on `body` as described in the plan.

## T9 — footer and content (`feature/footer-content`, PR 9)

ACs: AC17 (Email link), content from F18.

May touch: `src/App.tsx`, `src/sections/Hero.tsx`,
`src/components/Footer.tsx`,
`src/components/Footer.module.css`, `src/components/Footer.test.tsx`,
`src/data/experience.ts`, `src/sections/Contact.tsx`,
`src/sections/Experience.tsx`, `src/sections/*.test.tsx`,
`README.md`.

Tests first: `<footer>` is outside `<main>`, names the stack, and
links the source repo through `ExternalLink`; Contact's email link
text is the address and its href is the `mailto:`; Hero has an
Email link with the same `mailto:` (not a new-tab link); Experience
renders an entry with id `hackathons` whose bullets match the
resume text supplied in the brief.

Do: Footer component; `App.tsx` docblock; hackathon entry (text
supplied verbatim by the main agent from `public/resume.pdf`);
Contact shows the address.

## T10 — SEO and sharing (`feature/seo-sharing`, PR 10)

ACs: AC5, AC6, AC18.

May touch: `index.html`, `public/404.html`, `public/favicon.png`,
`public/apple-touch-icon.png`, `public/og.png` (images provided),
`scripts/dist.test.ts`, `e2e/noscript.spec.ts`, `package.json`,
`.github/workflows/ci.yml`, `README.md`. May delete `public/stars-space.png` and
`public/stars-space-wb.png` if nothing references them.

Tests first:
- `scripts/dist.test.ts` (skips with a clear message if `dist/` is
  missing; `npm test` in CI runs after build): AC5 tags present
  with exact absolute URLs under
  `https://ismichaelhuang.github.io/portfolio/`; JSON-LD parses and
  has only `@context`, `@type`, `name`, `jobTitle`, `url`,
  `sameAs`; no phone number anywhere in `index.html`, and the
  email address appears only inside the `<noscript>` `mailto:`
  link; `404.html`
  exists and every local URL in it starts with `/portfolio/`; PNG
  headers give 1200x630 for `og.png`, square `favicon.png`, 180x180
  `apple-touch-icon.png`.
- `e2e/noscript.spec.ts` with `javaScriptEnabled: false`: name,
  role, and GitHub, LinkedIn, Email, Resume links are visible.

Do: metadata in `index.html` with attributes wrapped under 80
columns; `<noscript>` block styled inline; static `404.html` with a
link home; icons. `dist.test.ts` needs a fresh build: locally run
`npm run build` before `npm test`, and reorder `ci.yml` so build
precedes the unit step.

## T11 — design polish (`feature/design-polish`, PR 11)

ACs: AC3 (revised), AC22.

May touch: `e2e/polish.spec.ts`, one assertion in
`e2e/layout.spec.ts`, `src/index.css`, CSS modules, `README.md`.

Tests first (`e2e/polish.spec.ts`): odd last card centred at
1280px; row-mates equal height with aligned link rows; a card with
no description is not padded tall; Resume has the accent border and
all hero links are 44px tall; phone links are 44px tall; a hovered
text link is underlined in the accent text color with no glow; the
first About paragraph leads; dates do not wrap; the About heading
is inside the first phone screen.

Do: remove the card minimum height and pin tags to the card
bottom; centre an odd last card on the two-column layout; style
Resume as the lead action; 44px targets; one hover style;
`text-wrap` pretty and balance; tabular dates; 85svh phone hero;
themed `::selection`.
