# Michael Huang — Portfolio

Personal portfolio site built with React, TypeScript, and Vite.
Single-page layout with smooth anchor-based navigation between
sections.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Bundler | Vite |
| Styles | CSS Modules |
| Linter | ESLint + typescript-eslint |
| Unit tests | Vitest + Testing Library (jsdom) |
| E2E tests | Playwright (Chromium) |

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx          # Fixed top navigation bar
│   ├── Navbar.module.css
│   ├── Navbar.test.tsx     # Unit test
│   ├── Footer.tsx          # Page footer: stack credit, source link
│   ├── Footer.module.css
│   ├── Footer.test.tsx     # Unit test
│   └── ExternalLink.tsx    # New-tab link with sr-only notice
├── assets/
│   └── mark.webp           # Hero logo mark
├── lib/
│   ├── activeSection.ts    # Pure scroll-spy picker
│   └── emphasis.tsx        # Renders **bold** markers in data strings
├── sections/
│   ├── Hero.tsx            # Full-viewport intro (id="hero")
│   ├── Experience.tsx      # Work history (id="experience")
│   ├── Projects.tsx        # Project showcase (id="projects")
│   ├── About.tsx           # About me (id="about")
│   └── Contact.tsx         # Contact links (id="contact")
├── test/
│   └── setup.ts            # Vitest setup (jest-dom)
├── App.tsx                 # Composition root — section order lives here
├── App.test.tsx            # Unit tests for the composed page
├── contrast.test.ts        # Colour-token contrast ratios
├── main.tsx                # React entry point
└── index.css               # Global styles, theme variables, shared patterns
e2e/
├── smoke.spec.ts           # Smoke test against vite preview
├── noscript.spec.ts        # Name, role and links with JS off
├── layout.spec.ts          # Responsive layout, 320 to 1920px
├── nav.spec.ts             # Scroll-spy / aria-current
├── keyboard.spec.ts        # Skip link and focus ring
├── motion.spec.ts          # prefers-reduced-motion
└── a11y.spec.ts            # axe (WCAG 2.2 AA) and text spacing
scripts/
├── fetch-pinned.ts         # Writes src/data/projects.ts from pinned repos
├── pinned.ts               # Pure mapping/validation helpers for the above
├── dist.test.ts            # Checks the built dist/: metadata, 404, icons
└── readme.test.ts          # Fails if a package.json script is undocumented
playwright.config.ts        # Playwright config (preview on port 4173)
public/
├── resume.pdf              # Served statically; linked from Hero
├── 404.html                # Static not-found page (GitHub Pages)
├── favicon.png             # 64x64 tab icon
├── apple-touch-icon.png    # 180x180 home-screen icon
└── og.png                  # 1200x630 link-preview image
```

## SEO and sharing

`index.html` carries the page title, a meta description, a canonical
link, Open Graph and Twitter card tags (absolute URLs under
`https://ismichaelhuang.github.io/portfolio/`), `theme-color`,
`color-scheme`, a referrer policy, and a minimal Person JSON-LD block
(name, job title, URL, GitHub and LinkedIn). A `<noscript>` block
shows the name, role, focus line and Resume, GitHub, LinkedIn and
Email links when JavaScript is off. Long `content` values wrap
across lines in the source; the `single-line-meta` plugin in
`vite.config.ts` joins them at build time.

Images live in `public/`: `favicon.png` (square, 64x64),
`apple-touch-icon.png` (180x180) and `og.png` (1200x630). Vite
rewrites root-absolute `/favicon.png` style links in `index.html`
with the base path. `public/404.html` is copied verbatim, so it
hard-codes `/portfolio/`; update it if the deploy path changes.
`scripts/dist.test.ts` checks all of this against `dist/`.

There is deliberately no `robots.txt` or sitemap: a project site
cannot serve a root `robots.txt`, and a one-page site does not need a
sitemap.

## Experience entries

Work history lives in `src/data/experience.ts`. To add a role, append
an object (most recent first) with `id`, `company`, `role`, `period`,
`location` and `highlights`; no JSX changes are needed. Wrap the
numbers worth noticing in a bullet in `**double asterisks**` and they
render in bold through `renderEmphasis` in `src/lib/emphasis.tsx`.
Text with an odd number of `**` markers renders literally.

## Navigation

The navbar uses plain HTML anchor links (`href="#section-id"`). No
client-side router is involved. The bar is a "Primary" `nav`; the
sections live in one `main` (`id="main"`) that the "Skip to content"
link targets.

On `html` in `index.css`:

- `scroll-behavior: smooth` — animates the scroll; it is `auto`
  under `prefers-reduced-motion: reduce`
- `scroll-padding-top: var(--nav-h)` — keeps scroll targets and
  focused elements clear of the fixed bar. `--nav-h` is set in CSS
  only (4rem, 3.5rem below 600px) and must stay at or below the
  bar's real height

The active link is measured on scroll and resize: `pickActive` in
`src/lib/activeSection.ts` picks the last section whose top is at or
above the bar's height plus 8px, the last section at the page bottom,
and none above the first. The link gets `aria-current="location"`.

The sections run Hero, Experience, Projects, About, Contact, and the
navbar lists Experience, Projects, About, Contact in that order. The
scroll-spy reads the `links` array in order, so it must match the
document order in `App.tsx`.

To add a new section:
1. Create the component in `src/sections/` with a unique `id` on the
   root `<section>` element.
2. Import and place it in `App.tsx`.
3. Add a matching entry to the `links` array in `Navbar.tsx`; the
   scroll-spy and skip link need nothing else.

## Theme

The page sits on a static starfield: a dozen small dots layered on the
`body` background in three tile sizes, so there is no image file or
script. The hero opens with the logo mark above the name.

Dark space aesthetic defined entirely through CSS custom properties
in `index.css`:

| Variable | Purpose |
|---|---|
| `--color-bg` | Page background (`#0a0a0f`) |
| `--color-text` | Primary text |
| `--color-text-muted` | Secondary text; at least 5.5:1 on `--color-bg` |
| `--color-accent` | Borders and fills only (`#4a6cf7`) |
| `--color-accent-text` | Accent text; at least 4.5:1 on bg and surface |
| `--color-focus` | The 2px `:focus-visible` ring |
| `--nav-h` | Fixed navbar height, used by `scroll-padding-top` |
| `--color-surface` | Card / pill backgrounds |
| `--color-border` | Subtle element borders |
| `--font-display` | Jost, then the OS sans |
| `--font-body` | Source Serif 4, then the OS serif |

Type: Jost, an open Futura revival, is the display and UI face for
the name, headings, nav, buttons, pills, labels and dates. Source
Serif 4 (roman and italic) is the prose face for the bio, highlights,
project descriptions and contact message. Both ship as variable
fonts from `@fontsource-variable/*`, self-hosted with no third-party
requests; `unicode-range` makes the browser fetch only the subsets
the page's characters need.

Plain text links (project Code and Live, Contact profiles, footer)
share one hover: accent-text colour with a thin underline offset
0.25em, and `a:active` dims them. The Resume button in the hero is
the lead action: it keeps the accent border and text at rest, like the
Contact email button, while the other hero links stay neutral. Links
and buttons are at least 44px tall on phones.

`src/contrast.test.ts` reads these tokens and fails if text, muted
or accent-text drop below the ratios above.

## Getting started

Requires Node 24 (see `.nvmrc`).

```bash
npm ci
npx playwright install chromium   # one-time, for the e2e tests
npm run dev                       # Start dev server with HMR
```

## Development

```bash
npm run dev       # Start dev server with HMR
npm run build     # Type-check + production build
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

## Testing

```bash
npm test              # Builds, then unit tests (Vitest)
npm run test:e2e      # Playwright; builds and serves via vite preview
npm run check:limits  # Fails on files over 400 lines or 80 columns
```

`npm test` builds first (`pretest`) because `scripts/dist.test.ts`
reads `dist/`. Running `npx vitest` directly skips that step and
fails with a message saying so when `dist/` is missing.

Unit tests live beside the code as `*.test.ts(x)` and under
`scripts/`. E2E specs live in `e2e/` and run against the production
build on `http://localhost:4173/portfolio/`.

`check:limits` lists every tracked file with a line over 80
characters (`WIDE file:line`) or more than 400 lines
(`LONG file (n)`) and exits 1; it prints nothing when the repo is
compliant. Binary files, `package-lock.json`, `public/` and the
generated `src/data/projects.ts` are exempt, as are SHA-pinned
`uses:` lines in workflows, which cannot be wrapped.

## Deployment

`.github/workflows/deploy.yml` publishes the site to GitHub Pages. It
runs on a push to `main`, daily at 00:00 UTC (to refresh the pinned
repos), and on manual dispatch. Pull requests never deploy.

`.github/workflows/ci.yml` runs lint, build, unit tests, e2e tests
and the file-limit check with a read-only token. It runs on pull
requests, and deploy calls it first: the deploy job starts only if CI
passes.

GitHub disables scheduled workflows in public repos after 60 days
without repository activity. A `keepalive` job on the daily run calls
the API to re-enable the workflow. If the schedule ever stops, re-enable
it by hand:

```bash
gh workflow enable "Deploy to GitHub Pages"
```

Actions are pinned to commit SHAs. Dependabot opens one grouped PR a
month for GitHub Actions and one for npm.

## Projects data

`src/data/projects.ts` is generated by `scripts/fetch-pinned.ts` from
the GitHub profile's pinned repositories (GraphQL API). CI runs it on
each deploy with the workflow token. The pure logic lives in
`scripts/pinned.ts`.

Every field is treated as untrusted, because a pin can belong to
another user:

- Values are written with `JSON.stringify`, never string-escaped.
- `IsMichaelHuang/portfolio` is skipped (case-insensitive).
- Repos whose URL is not under `https://github.com/` are dropped.
- A homepage becomes the "Live" link only if it is a valid `https:`
  URL.
- Tags are the repo topics, else the primary language, else none.
- A missing token, API error, null user, or zero usable repos fails
  the run and leaves the file untouched.

Run it locally with a token that can read public data:

```
GITHUB_TOKEN=<your token> node scripts/fetch-pinned.ts
```
