# Tasks — Figures revamp

Plan: `figures-revamp.md`.

Rules for every task: one Sonnet dev agent; failing test first,
shown failing for the expected reason; 400 lines and 80 columns;
tests query by role and text, or `[data-figure]` for figures; e2e
uses reduced motion and `document.fonts.ready` before geometry; do
not touch `docs/plans/`, `.claude/`, or files outside "May touch";
fix the README section named in the same commit, present tense;
run lint, test, test:e2e, check:limits; never push or open a PR.

### T1 — Tokens, grounds, globals (PR 1)

- ACs: F4, F10 (ratchet, selection), F12. Depends on: none.
- May touch: `src/index.css`, every `*.module.css` (token swaps
  and the five `rgba` literals only: Hero 30 and 130, Contact 58,
  Navbar 34, `::selection`), `src/contrast.test.ts`, new
  `e2e/type.spec.ts`, `e2e/hero.spec.ts` (38-47),
  `e2e/polish.spec.ts` (94-102, 123-136), `README.md`.
- Tests first: F4 pairs; no body image; at most 16 sizes (the
  baseline's 13 plus three figure sizes; T10 tightens to nine);
  Resume is the only filled hero link; hovered Code link is ink and
  underlined; `::selection` contrast.
- Do: palette and role tokens; `[data-ground]` blocks, which also
  paint `background-color: var(--color-bg)` and `color:
  var(--color-text)`; remove `--color-accent`,
  `--color-accent-text`, `--color-surface`, `--color-focus`, the
  starfield, and `color-scheme: dark`; full-bleed `section` by
  `padding-inline`; define the spacing tokens; nav bar reads
  `--color-bg`, no blur. Vertical section padding and the layout
  inside sections are unchanged: the 880px columns stay.
- README: Theme lines 152-171 and 195-203.

### T2 — Meta, noscript, 404 (PR 1)

- ACs: F11. Depends on: T1.
- May touch: `index.html`, `public/404.html`,
  `scripts/dist.test.ts` (83-84 and new cases).
- Tests first: `theme-color`, `color-scheme` in both files, no
  `#0a0a0f`. Do: light inline styles; noscript content unchanged.

### T3 — Figure data (PR 2)

- ACs: F3. Depends on: T1.
- May touch: `src/data/experience.ts`, `src/data/work.ts`, new
  `src/data/figures.test.ts`, `README.md` (lines 101-109, 287).
- Tests first: F3 for every entry and the hero.
- Do: `export interface Figure { value: string; unit: string }`
  and `export const heroFigure` in `experience.ts`; optional
  `figure?: Figure` on `Experience` and `Featured`. The Hackathons
  figure is `hackathons[0].place`; no new field.

### T4 — Figure component (PR 2)

- ACs: F5 (markup). Depends on: T3.
- May touch: new `src/components/Figure.tsx`, `.module.css`,
  `.test.tsx`, `README.md` (structure tree).
- Tests first: renders `data-figure`, hidden final value,
  `aria-hidden` display span, unit; `decorative` hides the whole
  figure; no `<strong>`.
- Do: `Figure({ value, unit?, size, decorative? })`, `size` one of
  `hero | row | band`; it owns the three figure font sizes. No
  motion yet.

### T5 — Hero (PR 2)

- ACs: F1, F2, F4 (amber), F10 (jump). Depends on: T4.
- May touch: `src/sections/Hero.*`, `src/index.css` (section
  padding, scroll margin), `e2e/fold.spec.ts` (17-51),
  `e2e/hero.spec.ts` (6-13, ground case), `e2e/nav.spec.ts` (new
  jump case), `README.md` (line 38).
- Existing cases: `Hero.test.tsx` 5-11 and 27-39 become figure and
  caption; `fold.spec` 17-22 becomes F2 and 34-38 is deleted;
  `hero.spec` 6-13 points at `nav img`. Kept as is: link order
  (41-58), 2x2 links at 375px, 44px targets, hero height cap.
- Do: `data-ground="amber"`; drop the hero's own inline padding
  so it runs full bleed; keep the `rise` keyframes; apply
  `--space-section` to `section` and a negative
  `scroll-margin-top` to linked sections (`fold.spec` 47 follows).

### T6 — Nav ground (PR 2)

- ACs: F9. Depends on: T5.
- May touch: `src/components/Navbar.tsx`, `Navbar.module.css`,
  `e2e/nav.spec.ts`, `README.md` (lines 118-141).
- Tests first: F9 for all six sections; no running animation after
  scrolling to Contact under reduced motion.
- Tests scroll each section at least 20px past the nav's bottom
  edge; the spy flips 8px early.
- Do: in the existing `update()`, make a second, separate
  `pickActive(tops, offset, false)` call over a six-id list. Set
  the nav's `data-ground` to that section's when it has one, else
  remove the attribute. The first `update()` runs in a layout
  effect so the nav never paints white over the hero. `links`,
  `sectionIds`, and `aria-current` logic are untouched.

### T7 — Shared row and Experience (PR 3)

- ACs: F5. Depends on: T4.
- May touch: `src/index.css` (`.ledger-*`), `Experience.*`,
  `About.module.css` (the `.group` columns only),
  `e2e/ledger.spec.ts`, `e2e/fold.spec.ts` (49),
  `e2e/polish.spec.ts` (148, 156: the Experience half),
  `e2e/layout.spec.ts` (new figure-fit cases), `README.md`
  (173-181, 279-281).
- Existing cases: `Experience.test.tsx` 104-113 gains the leading
  figure and asserts it is `aria-hidden`; `ledger.spec` 26-50
  becomes figure-left; 52-68 and 95-118 keep their intent.
- Do: one `--row-cols` token in `fr` units and one gap token, so
  About's `.group` lines up without being a container;
  `.ledger-row` uses them, is a size container, and places
  `[data-figure]` and `.ledger-meta` in column 1; bullets are
  18px; Experience uses `.ledger-row` and drops its own grid;
  period and location move under the role.

### T8 — Projects and pins (PR 4)

- ACs: F5, F7. Depends on: T7.
- May touch: `Projects.*`, `e2e/projects.spec.ts` (59-88),
  `e2e/layout.spec.ts` (48-62), `e2e/polish.spec.ts` (25-83),
  `e2e/fold.spec.ts` (50), `README.md` (188, 279-285).
- Existing cases: `Projects.test.tsx` 89-91 scopes `249` to the
  bullet; the stack list stays the first list in each article.

### T9 — Hackathons band (PR 5)

- ACs: F6, F4 (teal). Depends on: T4.
- May touch: `Hackathons.*`, `e2e/projects.spec.ts` (10-57),
  `README.md` (272-275).
- Existing cases: `Hackathons.test.tsx` 21-33 expects four "2nd";
  `projects.spec` 13-44 becomes F6.
- Do: `data-ground="teal"`; sticky `top` is the nav height plus a
  group gap, `align-self: start`, gated at 720px wide and 600px
  tall.

### T10 — About and Contact (PR 6)

- ACs: F4 (ink), F10. Depends on: T7.
- May touch: `About.*`, `Contact.*`, `Footer.*`,
  `e2e/ledger.spec.ts`, `e2e/polish.spec.ts` (138-147: the About
  half), `e2e/type.spec.ts` (tighten to nine), `src/index.css`
  (delete what nothing uses), `README.md` (110-116, 175-185).
- Do: `data-ground="ink"` on Contact and the footer; remove
  Contact's 700px `max-width` and the footer's 1100px cap so both
  grounds run full bleed.

### T11 — Count-up (PR 7)

- ACs: F8. Depends on: T4.
- May touch: new `src/lib/figure.ts` and test, `Figure.tsx`,
  `Figure.module.css`, `Figure.test.tsx`, `e2e/motion.spec.ts`,
  `README.md` (structure tree, Theme motion line).
- Tests first: `countFrame` cases; a `MutationObserver` added by
  `addInitScript` records every `[data-figure]` text (only finals
  under reduced motion; a smaller value, then `~70`, with motion);
  width constant.
- Do: initial state is the final value. If `matchMedia` or
  `IntersectionObserver` is missing, or motion is reduced, stop.
  Otherwise a layout effect sets frame 0 before paint, observes,
  runs one `requestAnimationFrame` loop, and on cleanup cancels
  and restores the final value (safe under StrictMode). Reserve
  the final width; `tabular-nums`; `Intl.NumberFormat` for commas.

### T12 — Share image (PR 8)

- ACs: F11. Depends on: T10.
- May touch: `public/og.png`. Do: screenshot the built hero at
  1200x630 with the project's Playwright; no script is committed.

### T13 — Final sweep (PR 8)

- ACs: F10, F12. Depends on: T12.
- May touch: `README.md` (read-through; SEO lines 78-88), comments
  that still say "space theme". No behaviour change.

The plan files in `docs/plans/` are the main agent's; the
reasoning ledger passes the skill's `ledger-check.mjs`.

## Verification record

Filled per PR: suite counts, capture findings, audit counts.

## The four questions

Answered after the build.
