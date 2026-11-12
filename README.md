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
│   └── Navbar.test.tsx     # Unit test
├── sections/
│   ├── Hero.tsx            # Full-viewport intro (id="hero")
│   ├── About.tsx           # About me (id="about")
│   ├── Experience.tsx      # Work history (id="experience")
│   ├── Projects.tsx        # Project showcase (id="projects")
│   └── Contact.tsx         # Contact links (id="contact")
├── test/
│   └── setup.ts            # Vitest setup (jest-dom, observer stub)
├── App.tsx                 # Composition root — section order lives here
├── App.test.tsx            # Unit tests for the composed page
├── main.tsx                # React entry point
└── index.css               # Global styles, theme variables, shared patterns
e2e/
└── smoke.spec.ts           # Playwright smoke test against vite preview
scripts/
├── fetch-pinned.ts         # Fetches pinned repos for the Projects data
└── readme.test.ts          # Fails if a package.json script is undocumented
playwright.config.ts        # Playwright config (preview on port 4173)
public/
└── resume.pdf              # Served statically; linked from Hero
```

## Navigation

The navbar uses plain HTML anchor links (`href="#section-id"`). No
client-side router is involved. Scroll behavior is controlled by two
CSS properties on `html` in `index.css`:

- `scroll-behavior: smooth` — animates the scroll
- `scroll-padding-top: 64px` — prevents the fixed navbar from
  covering the scroll target

To add a new section:
1. Create the component in `src/sections/` with a unique `id` on the
   root `<section>` element.
2. Import and place it in `App.tsx`.
3. Add a matching entry to the `links` array in `Navbar.tsx`.

## Theme

Dark space aesthetic defined entirely through CSS custom properties
in `index.css`:

| Variable | Purpose |
|---|---|
| `--color-bg` | Page background (`#0a0a0f`) |
| `--color-text` | Primary text |
| `--color-text-muted` | Secondary / de-emphasized text |
| `--color-accent` | Interactive highlight (`#4a6cf7`) |
| `--color-surface` | Card / pill backgrounds |
| `--color-border` | Subtle element borders |

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
npm test            # Unit tests (Vitest + Testing Library)
npm run test:e2e    # Playwright; builds and serves via vite preview
```

Unit tests live beside the code as `*.test.ts(x)` and under
`scripts/`. E2E specs live in `e2e/` and run against the production
build on `http://localhost:4173/portfolio/`.
