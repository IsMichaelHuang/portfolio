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
│   ├── Footer.tsx          # Ink-ground footer: credit, source link
│   ├── Footer.module.css
│   ├── Footer.test.tsx     # Unit test
│   ├── ExternalLink.tsx    # New-tab link with sr-only notice
│   ├── ExternalLink.test.tsx
│   ├── Figure.tsx          # Large number with optional unit
│   ├── Figure.module.css
│   └── Figure.test.tsx
├── assets/
│   └── mark.webp           # Navbar logo mark
├── lib/
│   ├── activeSection.ts    # Pure scroll-spy picker
│   ├── emphasis.tsx        # Renders **bold** markers in data strings
│   ├── figure.ts           # Count-up frames and width of a figure
│   ├── pins.ts             # Drops pins already shown as featured work
│   └── *.test.ts(x)        # Unit tests beside each module
├── sections/
│   ├── Hero.tsx            # Figure-led first view (id="hero")
│   ├── Experience.tsx      # Work history ledger (id="experience")
│   ├── Hackathons.tsx      # Lede, takeaway, three entries (id="hackathons")
│   ├── Projects.tsx        # Featured work and pins (id="projects")
│   ├── About.tsx           # Bio column, Education, Skills (id="about")
│   └── Contact.tsx         # Ink-ground email and links (id="contact")
├── data/                   # experience, education, skills, work,
│                           # projects (generated), with tests
├── test/
│   └── setup.ts            # Vitest setup (jest-dom)
├── App.tsx                 # Composition root — section order lives here
├── App.test.tsx            # Unit tests for the composed page
├── landmarks.test.tsx      # One main holding six sections
├── contrast.test.ts        # Colour-token contrast ratios
├── main.tsx                # React entry point
└── index.css               # Global styles, theme variables, shared patterns
e2e/
├── smoke.spec.ts           # Smoke test against vite preview
├── hero.spec.ts            # Amber hero, nav mark, ~ glyph position
├── fold.spec.ts            # First screen, hero clears nav, phone rhythm
├── ledger.spec.ts          # Ledger rows, h2 alignment, About content
├── projects.spec.ts        # Hackathon pinning, featured rows, links
├── closing.spec.ts         # About column, ink Contact and footer
├── noscript.spec.ts        # Name, role and links with JS off
├── layout.spec.ts          # Responsive layout, 320 to 1920px
├── type.spec.ts            # Type scale ceiling, 12px floor, selection
├── fonts.spec.ts           # Self-hosted faces, same-origin requests
├── polish.spec.ts          # Link size and hover, pins, prose type
├── nav.spec.ts             # Scroll-spy / aria-current / nav ground
├── keyboard.spec.ts        # Skip link and focus ring
├── motion.spec.ts          # prefers-reduced-motion, count-up
└── a11y.spec.ts            # axe (WCAG 2.2 AA) and text spacing
scripts/
├── fetch-pinned.ts         # Writes src/data/projects.ts from pinned repos
├── pinned.ts               # Pure mapping/validation helpers for the above
├── check-limits.sh         # File size and line width check
├── dist.test.ts            # Checks the built dist/: metadata, 404, icons
├── readme.test.ts          # Fails if a package.json script is undocumented
└── *.test.ts               # Tests for the scripts and the workflows
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
shows the name, role, summary line and Resume, GitHub, LinkedIn and
Email links when JavaScript is off. Long `content` values wrap
across lines in the source; the `single-line-meta` plugin in
`vite.config.ts` joins them at build time.

Images live in `public/`: `favicon.png` (square, 64x64),
`apple-touch-icon.png` (180x180) and `og.png` (1200x630, a screenshot
of the built hero at that size, so the caption runs past the bottom
edge). Vite
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
`location` and `highlights`, plus an optional `figure` (`value` and
`unit`; the value is a bold run in `highlights`); no JSX changes are
needed. Wrap the
numbers worth noticing in a bullet in `**double asterisks**` and they
render in bold through `renderEmphasis` in `src/lib/emphasis.tsx`.
Text with an odd number of `**` markers renders literally.

## Education and skills

Education lives in `src/data/education.ts` (school, degree, detail,
honor, certification name and issuer) and skills in
`src/data/skills.ts` (an ordered list of `{ category, items }`).
About renders them as an Education row and a `<dl>` of text rows,
the items joined with ", "; edit the data and no JSX changes.

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
  only (4rem, 3.25rem below 600px) and must stay at or below the
  bar's real height

The active link is measured on scroll and resize: `pickActive` in
`src/lib/activeSection.ts` picks the last section whose top is at or
above the bar's height plus 8px, the last section at the page bottom,
and none above the first. The link gets `aria-current="location"`.

The bar also takes the ground of the section under its bottom edge: the
navbar sets `data-ground` on itself from that section's `data-ground`
(none means white), so its colours follow the same role tokens.

The sections run Hero, Experience, Hackathons, Projects, About,
Contact, and the navbar lists Experience, Projects, About, Contact in
that order. Hackathons has no nav entry, so Experience stays current
while it is on screen. The scroll-spy reads the `links` array in
order, so it must follow the document order in `App.tsx`.

To add a new section:
1. Create the component in `src/sections/` with a unique `id` on the
   root `<section>` element.
2. Import and place it in `App.tsx`.
3. Add a matching entry to the `links` array in `Navbar.tsx`; the
   scroll-spy and skip link need nothing else.

## Theme

The page is light: ink on white, with amber, teal and ink grounds
that a block selects with a `data-ground` attribute (`amber`, `teal`
or `ink`). The hero is one amber figure, `~70`, at viewport scale, with
the name, summary and links beside its caption. A figure of 10 or more
counts up once, in under a second, as it scrolls into view and rests
on its exact value; under reduced motion it never counts. There is no
background image. Sections pad `--space-section` top and bottom, and
a nav jump lands a heading one `--space-group` below the bar.

Everything is defined through CSS custom properties in `index.css`:

| Variable | Purpose |
|---|---|
| `--ink`, `--white` | Palette (`#14110f`, `#ffffff`) |
| `--amber`, `--teal` | Palette grounds (`#eca358`, `#47c2c0`) |
| `--muted` | Muted text on white, at least 5.5:1 |
| `--muted-on-ink` | Muted text on ink |
| `--color-bg` | Page background; `data-ground` re-points it |
| `--color-text` | Primary text |
| `--color-text-muted` | Secondary text |
| `--color-border` | Element borders |
| `--gutter` | Inline section padding; content stays within 1360px |
| `--space-in`, `--space-group`, `--space-section` | Spacing scale |
| `--row-cols`, `--row-gap` | Shared two-column row grid, from 720px |
| `--nav-h` | Fixed navbar height, used by `scroll-padding-top` |
| `--font-display` | Jost, then the OS sans |
| `--font-body` | Source Serif 4, then the OS serif |
| `--text-meta` | 16px: nav, links, role, period, units |
| `--text-body` | 18px: prose, bullets, descriptions |
| `--text-lead` | 22px: h3 and h4, takeaway, first About paragraph |
| `--text-heading` | 28px: the h1 and every section h2 |
| `--text-statement` | Fluid: hero caption and the email link |

Layout: every section starts at the page grid's left edge (the
section's `padding-inline`, content within 1360px); h2s are left-aligned
direct children. Experience and Education are resume-style ledger rows
on the global `.ledger-row` class in `index.css`, a size container at
every width. From 720px a row is a grid on `--row-cols`
(`minmax(0, 5fr) minmax(0, 7fr)`) with `--row-gap` (`3.5rem`): the
`[data-figure]` or `.ledger-meta` takes column 1 across the rows,
everything else column 2; below 720px one column in DOM order. An
Experience entry is its figure, company, role, period and location,
then 18px bullets, rows separated by a hairline. A row figure
fills its column: `figureWidth` gives its width in digit widths as
`--w`, so a short figure renders larger than a long one (3.5rem to
10.5rem). Its caption is 18px at weight 500. Skills are a `<dl>`
with an `8rem` label column from 480px and the same `--row-cols` /
`--row-gap` from 720px, so every right-hand column shares one left
edge.

Type: Jost, an open Futura revival, is the display and UI face for
the name, headings, nav, buttons, labels and dates. Source
Serif 4 (roman and italic) is the prose face for the bio, highlights,
project descriptions and contact message. Both ship as variable
fonts from `@fontsource-variable/*`, self-hosted with no third-party
requests; `unicode-range` makes the browser fetch only the subsets
the page's characters need. Every text size comes from the five
`--text-*` tokens (the nav links drop to 0.9rem below 600px so four
fit a 320px screen); the `Figure` numerals add their own sizes, so
at most eight distinct figure sizes render at 1280px and at most five
sizes render outside figures.

Code and Live links are muted at rest and turn ink with a thin
underline offset 0.25em on hover; the Contact profile links and the
footer link are underlined at rest and turn ink on hover. `a:active`
dims every link. The Resume button in the hero is the lead
action and the only filled link (ink fill, text in the ground's
colour); the other hero links are outlined. The focus ring is a 2px
solid outline in the text colour of the ground it sits on, so it
shows on a filled link too. Links and buttons are at least 24px in
both dimensions on desktop and at least 44px tall on phones.

`src/contrast.test.ts` reads the palette tokens and fails if any
text and ground pair drops below 4.5:1, or muted text on white below
5.5:1.

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

## Hackathons and Projects sections

Hackathons (`id="hackathons"`) is its own section between Experience
and Projects, a teal band. From 720px a very large "2nd" and the
lede stay pinned under the nav (CSS `position: sticky`, so no
ancestor may set `overflow`) while the takeaway and the three
entries, stacked, scroll past on the right; below that everything
stacks. Each entry's text starts with "2nd" (visually hidden).
Events are h3 under the section h2.

Projects (`id="projects"`) has two blocks in that column:

1. **Featured projects**: figure-led ledger rows like Experience: the
   figure on the left from 720px (above the title below), and the
   title, period, stack, highlights and "Code" link on the right.
   A featured project may carry an optional `figure` (`value` and
   `unit`; the value is a bold run in its `highlights`).
2. **Also on GitHub**: unboxed entries (a hairline above each, no
   tags) for the generated pins that are not already shown above or
   in Hackathons, in two columns from 988px. The block, heading
   included, is absent when none remain.

Hackathon and featured data live in `src/data/work.ts` (`hackathons`
and `featured`; shapes are typed there). To add one, append an
object. Wrap the numbers worth noticing in `**double asterisks**`.
A `repoUrl` adds a "Code" link; leave it out for a private repo.

De-duplication: `remainingPins` in `src/lib/pins.ts` removes every
generated pin whose `repoUrl` equals the `repoUrl` of a hackathon or
featured project, ignoring case, a trailing slash and `.git`. A
renamed repository shows twice until `work.ts` is updated.

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
