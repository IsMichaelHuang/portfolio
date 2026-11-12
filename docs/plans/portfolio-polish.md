# Plan — portfolio polish

Brief from Michael: "make this website the best portfolio website
hosted on GitHub as possible. Test everything." He is hands-off, so
there is no approval gate. Every decision here is the main agent's
call and is listed again in the hand-off. Open questions at intake:
none that block; taste calls are isolated in PRs 7 to 9.

Per-task briefs live in `portfolio-polish-tasks.md`.

## Goal

A recruiter or engineer opening
`https://ismichaelhuang.github.io/portfolio/` on any device gets a
fast, accessible, good-looking page that says who Michael is, shows
proof, and makes contact easy. The repo proves the engineering
standard the About section claims: tests, CI gates, evergreen docs.

## Non-goals

- No framework or hosting change.
- No server-side rendering or prerender step.
- No light theme, blog, contact form, analytics, or CMS.
- No invented content. New copy comes only from `public/resume.pdf`
  or text already on the site.
- No `robots.txt` or `sitemap.xml`. Crawlers read `robots.txt` only
  at the host root, which a project site does not own, and a
  one-page site gains nothing from a sitemap.
- No push, PR, merge, or GitHub settings change without Michael.

## Audit findings

This table records the state the plan started from. It stays in
this file only; README and code comments describe current behavior.

| # | Finding |
|---|---------|
| F1 | Phone layout broken: nav overflows, Contact link clipped |
| F2 | Project cards are a fixed 450px and clip on phones |
| F3 | Deploy workflow is `disabled_inactivity` |
| F4 | Tab title is "portfolio"; no description, OG, canonical |
| F5 | No `404.html` |
| F6 | Favicon is a 640x345 non-square PNG |
| F7 | No tests; CI deploys without lint or tests |
| F8 | No `<main>`, skip link, focus style, reduced-motion rule |
| F9 | Muted text about 4.6:1; accent about 4.5:1 for small text |
| F10 | `aria-current="page"` on sections; never clears at top |
| F11 | Generator escapes only `"`; `\` or newline breaks build |
| F12 | Pins include this repo, a third-party repo, null fields |
| F13 | CI runs unpinned `npx tsx` on Node 20; tag-pinned actions |
| F14 | 36 lines over 80 chars across 11 files |
| F15 | `npm audit` reports dev-dependency advisories |
| F16 | Resume link hardcodes `/portfolio/` |
| F17 | Hero copy vague; system font; nothing memorable |
| F18 | Hackathon wins on the resume are absent from the site |
| F19 | With JS off the page is blank |
| F20 | `liveUrl` from a third-party pin is rendered unvalidated |

## Acceptance criteria

- AC1: Given any viewport from 320px to 1920px wide, then the
  document has no horizontal scroll.
- AC2: Given a 320px viewport, then the brand and all four nav
  links are inside the viewport and each is at least 24px tall.
- AC3: Given a 1280px viewport, then project cards sit two per row
  at 450px wide and row-mates have equal height, at least 270px.
- AC4: Given a card with long or unbroken text at 320px, then the
  card grows; nothing is clipped (`scrollHeight <= clientHeight`).
- AC5: Given built `dist/index.html`, then it has a descriptive
  title, meta description, canonical, Open Graph and Twitter tags
  with an absolute image URL, `theme-color`, a referrer policy, and
  Person JSON-LD holding only name, jobTitle, url, and sameAs.
- AC6: Given `dist/`, then `404.html`, a square `favicon.png`, a
  180px `apple-touch-icon.png`, and a 1200x630 `og.png` exist.
- AC7: Given a keyboard user, when they press Tab once, then a
  "Skip to content" link is visible; Enter moves focus to `<main>`.
- AC8: Given any focusable element at 320px, when focused by
  keyboard, then a focus ring shows and the element is not under
  the fixed navbar.
- AC9: Given `prefers-reduced-motion: reduce`, then scroll behavior
  is `auto` and no animation runs.
- AC10: Given the page at 320, 375, and 1280px, then axe (WCAG 2.0,
  2.1, 2.2 A and AA) reports no violations, and the color tokens
  meet 4.5:1 for text on both `--color-bg` and `--color-surface`.
- AC11: Given the user is above About, then no nav link is current;
  inside a section exactly that link has
  `aria-current="location"`; at the bottom, Contact is current;
  scrolling back to the top clears it.
- AC12: Given a pinned repo whose text contains `"`, `\`, a newline,
  or `${`, then the generated file imports and round-trips exactly.
- AC13: Given pinned repos, then `IsMichaelHuang/portfolio` is
  skipped (matched on owner and name), ids are unique across
  owners, a null description renders no paragraph, a repo with no
  topics shows its primary language (or no tags if that is null).
- AC14: Given no `GITHUB_TOKEN`, an API error, a null user, or zero
  usable repos, then the script exits 1, writes nothing, and never
  prints the token.
- AC15: Given a pull request, then CI runs lint, unit, build, e2e,
  and limits with a read-only token. Deploy runs only on push to
  `main`, schedule, or dispatch, and only after the same checks.
- AC16: Given the repo, then `npm run check:limits` prints nothing;
  given an 81-column or 401-line file, it names it and exits 1.
- AC17: Given the hero, then it shows the logo mark, name, role, a
  specific one-line summary, and Resume, GitHub, LinkedIn, and
  Email links; the resume href is built from `BASE_URL`.
- AC18: Given JS is off, then name, role, and contact links show.
- AC19: Given a link that opens a new tab, then it has
  `rel="noopener noreferrer"`, visible text first, and a
  screen-reader suffix naming its target and "opens in new tab".
- AC20: Given a pinned repo whose homepage is not `https:` or whose
  URL is not under `https://github.com/`, then `liveUrl` is dropped
  or the repo is skipped; nothing unvalidated reaches an `href`.
- AC21: Given the page, then every font request is same-origin and
  the Jost and Source Serif 4 faces report as loaded.

## Design

### Visual direction (main agent's call)

Michael's deep-space theme and token names stay.

- **Type.** Jost for name, headings, nav, and buttons: an open
  Futura revival, and Futura is the space-age face (the Apollo 11
  plaque). Source Serif 4, roman and italic, for prose: the
  philosophy-minor half of "why before how", and the bio's `<em>`
  needs a real italic because `font-synthesis` is `none`.
  Self-hosted via `@fontsource-variable/*`; the browser fetches only
  the latin files through `unicode-range`. No preload (Vite hashes
  the names and the page is client-rendered).
- **One bold element: the hero.** His rainbow line-art mark, cropped
  to the artwork, above the name with explicit `width` and `height`.
  One load animation written as a keyframe `from { opacity: 0 }`
  with no base `opacity: 0`, so content shows if animation fails.
- **Starfield.** Fewer than 20 CSS `radial-gradient` dots tiled on
  `body` with the default (scrolling) attachment. No image or JS.
- **Color.** `--color-text-muted` rises to at least 5.5:1.
  `--color-accent-text` (lighter blue, at least 4.5:1) is used where
  accent colors text; `--color-accent` stays for borders. Add
  `--color-focus` and `--nav-h`.
- **Layout.** Section order, 1100px container, centered headings,
  and the 700px reading column stay. Projects keep 2 x 450px on
  desktop and go fluid below.
- **Copy.** Hero line: "Applied AI engineer — multi-agent systems
  and LLM infrastructure." Contact shows the email address. Footer
  names the stack and links the source.
- Avoided on purpose: all-caps labels (skill categories drop
  uppercase), numbered markers, per-section reveals, hover lifts.

### Components touched

`index.html`; `src/App.tsx` (`<main id="main" tabindex="-1">`, skip
link, footer); `src/components/Navbar.*`; new
`src/components/ExternalLink.tsx` (about 15 lines: `href`,
`context`, `children`); new `src/components/Footer.*`; new
`src/lib/activeSection.ts` (pure); `src/sections/*`;
`src/data/experience.ts`; new `scripts/pinned.ts` (pure) with
`scripts/fetch-pinned.ts` as a dependency-injected shell; new
`.github/workflows/ci.yml`; `deploy.yml`.

### Active nav link

The IntersectionObserver is replaced by a scroll handler that calls
a pure `pickActive(tops, offset, atBottom)`: the last section whose
top is at or above `offset` (the nav's measured height plus a small
margin), none above the first, and the last when scrolled to the
bottom. `scroll-padding-top` uses `--nav-h`.

### CI shape

`ci.yml` triggers on `pull_request`, pushes to non-main branches,
and `workflow_call`; token is `contents: read`; no secrets.
`deploy.yml` keeps its three triggers and has three jobs: `ci`
(`uses: ./.github/workflows/ci.yml`), `deploy` (`needs: ci`, the
only job with `pages: write` and `id-token: write`), and `keepalive`
(schedule only, only `actions: write`, no checkout, no npm) which
re-enables the workflow through the API so the 60-day inactivity
rule does not disable the schedule. Actions are pinned to commit
SHAs with a version comment; Dependabot keeps them and npm fresh
monthly. Node is pinned by `.nvmrc` (24), which runs
`scripts/*.ts` directly, so `tsx` is not needed.

## Tooling added, with reasons

| Package | Why |
|---------|-----|
| `vitest`, `jsdom` | Unit runner that reuses the Vite config |
| `@testing-library/react`, `/jest-dom` | Query by role |
| `@playwright/test` | Layout, focus, scroll need a real browser |
| `@axe-core/playwright` | ARIA and contrast in a real browser |
| `@fontsource-variable/jost`, `/source-serif-4` | Self-hosted fonts |

## PR breakdown

All work stacks: every PR needs the test harness from PR 1, and they
share `README.md`, `index.css`, and `App.tsx`, so parallel branches
would conflict. Each PR targets the branch below it; the stack
reaches `main` bottom-up after `fix/project` does. Fixes to a lower
branch are merged upward (no rebase).

| PR | Branch | One concern |
|----|--------|-------------|
| 1 | `chore/test-harness` | Vitest + Playwright harness |
| 2 | `chore/file-limits` | Limit check + reflow |
| 3 | `chore/ci-gates` | CI gate, least privilege |
| 4 | `fix/pinned-pipeline` | Safe, tested generator |
| 5 | `fix/responsive-layout` | Works at 320px and up |
| 6 | `fix/accessibility` | WCAG AA |
| 7 | `feature/typography` | Typefaces |
| 8 | `feature/hero-identity` | Hero mark + starfield |
| 9 | `feature/footer-content` | Footer, hackathons, copy |
| 10 | `feature/seo-sharing` | Metadata, icons, 404 |

PR 1's base is `fix/project`; every other PR's base is the PR
above it. The docs each PR must correct are listed per task in
`portfolio-polish-tasks.md`.

`npm audit fix` (no `--force`) is its own commit in PR 3 so the
lockfile change reverts cleanly. PRs 7 and 8 are taste calls:
dropping them drops only AC21 and the mark and summary parts of
AC17; the hero Email link lives in PR 9 for that reason. PR 10 is last so
`og.png` shows the final look.

## Test plan

Commits never land red: each task commits its failing-first tests
together with the code that passes them. PR 1 tests characterize
current behavior (green on arrival) and assert only invariants.

| AC | Layer | Test file |
|----|-------|-----------|
| AC1-AC4 | Playwright | `e2e/layout.spec.ts` |
| AC5, AC6 | Vitest on `dist/` | `scripts/dist.test.ts` |
| AC7, AC8 | Playwright | `e2e/keyboard.spec.ts` |
| AC9 | Playwright | `e2e/motion.spec.ts` |
| AC10 | Playwright | `e2e/a11y.spec.ts` |
| AC10 | Vitest | `src/contrast.test.ts` |
| AC11 | Vitest | `src/lib/activeSection.test.ts` |
| AC11 | Playwright | `e2e/nav.spec.ts` |
| AC12, AC13, AC20 | Vitest | `scripts/pinned.test.ts` |
| AC14 | Vitest | `scripts/fetch-pinned.test.ts` |
| AC15 | Vitest (text) | `scripts/workflows.test.ts` |
| AC16 | Vitest (spawns bash) | `scripts/check-limits.test.ts` |
| AC17, AC19 | Vitest + RTL | `src/**/*.test.tsx` |
| AC18 | Playwright, JS off | `e2e/noscript.spec.ts` |
| AC21 | Playwright | `e2e/fonts.spec.ts` |

E2E rules: web-first assertions only, no `waitForTimeout`;
`reducedMotion: 'reduce'` and `document.fonts.ready` before geometry
or axe; Chromium only; `workers: 1` in CI; `page.goto('./')`.
A README test asserts every npm script is documented.

## Risks

- **Font weight.** Three latin variable files. Measured and
  recorded in PR 7; dropped with PR 7 if judged too heavy.
- **Keepalive is unverified here.** It mirrors the documented
  API-mode of the keepalive-workflow action. README documents the
  manual `gh workflow enable` fallback.
- **Stack depth.** Ten branches. Merge-up after any low fix.
- **Playwright in CI** adds a browser download, pinned exactly.
- **Taste.** Type and hero are judgment calls, isolated.
- **Live pins change Projects** on next deploy. Zero usable repos
  fails the deploy, which keeps the last good site.

## Rollback

Each PR reverts on its own. The site is static; a revert plus one
deploy restores the previous build. The regenerated `projects.ts`
and the `npm audit fix` lockfile are separate commits. Nothing is
pushed until Michael says so.

## Exemptions from file limits

One explicit path list in `scripts/check-limits.sh`:
`package-lock.json`, `public/*` binaries, and the generated
`src/data/projects.ts`. Everything else, including `index.html`,
workflow YAML, and `src/data/experience.ts`, must comply (wrap
attributes onto lines, fold YAML, concatenate strings).

## Review log

Five Sonnet reviewers (correctness, tests, security and CI,
accessibility and performance, docs and PR structure). Blockers and
majors, all accepted unless noted:

- Briefs too thin, PRs bundled (blocker): split into 10 PRs and a
  separate task file with allowed files, ACs, and test cases.
- AC7 to AC11 untestable in jsdom (blocker): moved to Playwright;
  active-link logic extracted to a pure function.
- Unvalidated `liveUrl` from a third-party pin: AC20.
- Workflow least privilege, fork safety, deploy gated on CI,
  SHA-pinned actions, token never logged: CI shape, AC14, AC15.
- Skip rule and ids must use owner and name: AC13.
- Observer never clears; last section may never activate: AC11.
- No italic with `font-synthesis: none`: italic file added.
- Fixed starfield would repaint under the blurred nav: scrolling
  attachment.
- Repeated "Code" and "Live" link text: AC19 context suffix.
- Nav height hard-coded in two places: `--nav-h`, measured in JS.
- Logo-only brand needs a name: brand keeps its text for
  assistive tech.
- AC5 and AC6 must test `dist/`, not source: `dist.test.ts`.
- Config gaps (tsconfig, ESLint globals, Vitest include,
  Playwright base URL), `.nvmrc`, `engines`, scripts: PR 1.
- `404.html` cannot follow `base`: it hardcodes `/portfolio/`.

Rejected, with reasons:

- Render-time URL check in `ExternalLink`: the generator is the
  single trust boundary and its output is committed and reviewed.
- `eslint-plugin-react` for `jsx-no-target-blank`: a new dependency
  for what one unit test already asserts.
- `.npmrc ignore-scripts`: breaks esbuild and Playwright installs.
- Metric-adjusted fallback fonts: over-engineering for one page.
- Asserting axe `incomplete` is empty: axe cannot resolve text over
  gradients; the token contrast test is the oracle instead.
- AAA 7:1 muted text: flattens hierarchy; 5.5:1 chosen.
- Generating `og.png` in CI: rendered once and committed.

Second pass (one reviewer, revised sections only): no blockers.
Five majors fixed in the task file: the `dist` test no longer
forbids the `<noscript>` mailto; the focus-not-obscured check
exempts the nav's own links; T1 stubs `IntersectionObserver` and
adds DOM types for e2e; the hero Email link moved to PR 9; T10
builds before the unit step.
