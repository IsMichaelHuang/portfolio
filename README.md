# Michael Huang — Portfolio

Personal portfolio site built with React, TypeScript, and Vite. Single-page layout with smooth anchor-based navigation between sections.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Bundler | Vite |
| Styles | CSS Modules |
| Linter | ESLint + typescript-eslint |

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx          # Fixed top navigation bar
│   └── Navbar.module.css
├── sections/
│   ├── Hero.tsx            # Full-viewport intro (id="hero")
│   ├── About.tsx           # About me (id="about")
│   ├── Experience.tsx      # Work history (id="experience")
│   ├── Projects.tsx        # Project showcase (id="projects")
│   └── Contact.tsx         # Contact links (id="contact")
├── App.tsx                 # Composition root — section order lives here
├── main.tsx                # React entry point
└── index.css               # Global styles, theme variables, shared patterns
public/
└── resume.pdf              # Served statically; linked from Hero
```

## Navigation

The navbar uses plain HTML anchor links (`href="#section-id"`). No client-side router is involved. Scroll behavior is controlled by two CSS properties on `html` in `index.css`:

- `scroll-behavior: smooth` — animates the scroll
- `scroll-padding-top: 64px` — prevents the fixed navbar from covering the scroll target

To add a new section:
1. Create the component in `src/sections/` with a unique `id` on the root `<section>` element.
2. Import and place it in `App.tsx`.
3. Add a matching entry to the `links` array in `Navbar.tsx`.

## Theme

Dark space aesthetic defined entirely through CSS custom properties in `index.css`:

| Variable | Purpose |
|---|---|
| `--color-bg` | Page background (`#0a0a0f`) |
| `--color-text` | Primary text |
| `--color-text-muted` | Secondary / de-emphasized text |
| `--color-accent` | Interactive highlight (`#4a6cf7`) |
| `--color-surface` | Card / pill backgrounds |
| `--color-border` | Subtle element borders |

## Development

```bash
npm install
npm run dev       # Start dev server with HMR
npm run build     # Type-check + production build
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```
