# Plan — Figures revamp

Task briefs, the verification record, and the four questions:
`figures-revamp-tasks.md`. Direction notes:
`figures-revamp-direction.md`. Reasoning ledger:
`figures-revamp-reasoning.md`.

## Context

Michael asked for the site to be revamped with the Unparalleled
design skills (installed in `.claude/skills/`, excluded from git).
The baseline audit and captures show a clean, accessible page that
is also the default developer portfolio: near-black with one
electric blue, largest type 76px, no large visual, nothing moving.
He picked **Figures**: the resume already bolds its numbers, so the
page sets them at scale, on a light page whose section colours come
from his logo.

## Goal

A recruiter sees one proof number before anything else and can scan
each role and project by its figure. A screenshot of any one
section is recognisably this site.

## Non-goals

- No new facts. Every figure is a number the resume already bolds.
- No new dependencies (no animation, icon, or font packages).
- No change to stack, hosting, URLs, section ids and order, the
  nav's links, the pinned-repo pipeline, the resume PDF, the logo
  mark, the page title, meta description, JSON-LD, or the noscript
  block's content.
- No rewording of resume bullets. No dark variant.
- No Resume link in the nav. It doubled the "Resume" link name and
  broke the phone nav; the hero keeps the lead action and the brand
  link returns there.
- No push, PR, or merge without Michael.

## Earlier decisions this plan overrules

All were the main agent's calls under hands-off briefs, including
the phrase "Michael's deep-space theme": "No light theme" and
"token names stay" (`portfolio-polish.md`); "No stat tiles,
counters, or new animation", "No change to color tokens", and "Hero
role and summary stay" (`recruiter-redesign.md`). The verbatim-copy
rule still holds except for the strings under "New words".

## Design

Needs N1-N6 are ranked in the direction notes.

- **Opening.** `~70` fills the first view on amber, with a caption
  saying what it counts. Beside it: the name (the one `h1`), the
  summary line verbatim, and the four links in today's order. The
  existing load-in rise stays. Because: N1, proof first.
- **Palette tokens.** `--ink #14110f`, `--white #fff`, `--amber
  #eca358`, `--teal #47c2c0`, `--muted #5c5650`. Amber and teal are
  sampled from the logo mark.
- **Grounds, one mechanism.** A section carries `data-ground`
  (`amber`, `teal`, `ink`; none means white). `index.css` maps each
  ground to the role tokens the modules already read
  (`--color-bg`, `--color-text`, `--color-text-muted`,
  `--color-border`). On amber and teal the muted role is ink; on
  ink, text is white and muted is a light grey of at least 4.5:1.
  Hero amber; Hackathons teal; Contact and footer ink; the rest
  white.
- **Nav ground.** The nav takes the `data-ground` of the section
  under its bottom edge, read from the DOM by the existing scroll
  handler over all six sections. `aria-current` keeps today's rules
  and its four links.
- **Full bleed without wrappers.** `section` spans the page and
  centres its content with `padding-inline: max(gutter, (100% -
  1360px) / 2)`. No markup change; `#x > h2` stays a direct child.
- **No accent colour.** The accent, surface, and focus tokens and
  the four blue `rgba` literals are removed. Links are underlined
  ink; Resume is the one filled button. Focus ring: `2px solid
  currentColor`.
- **Type.** Jost 600 for figures and headings, Source Serif 4 for
  prose, both already installed. At most nine rendered sizes (the
  baseline has 13). Body 18px, meta 16px.
- **Figure.** One component. It renders `data-figure`, the value in
  a visually hidden span, the displayed value in an `aria-hidden`
  span, and an optional unit; never `<strong>`. In rows it repeats
  a bullet, so the whole figure is `aria-hidden`; it is the row's
  first child.
- **Rows.** Experience, Projects, and About share the global
  `.ledger-row` grid, widened to two fluid columns: figure or meta
  left, content right, from 720px. Rows size their figure from the
  row's own width (container query units) so `~15,000` fits its
  column even with WCAG text-spacing applied. A row with no figure
  leaves the left cell empty.
- **Hackathons.** Teal band. From 720px wide and 600px tall, the
  `2nd` figure and lede stay pinned below the nav (CSS sticky)
  while the takeaway and three stacked entries scroll past. Each
  entry keeps "2nd" as its first, visually hidden text.
- **Pins.** Two columns from 988px as today; no fills, borders, or
  topic pills; a top rule per item.
- **About, Contact.** Bio as a reading column with a lead first
  paragraph. Contact on ink; the email address is the display text.
- **Rhythm.** `--space-in 16px`, `--space-group 56px`,
  `--space-section 144px` (88px below 600px). Nav jumps land the
  heading one group gap below the nav.
- **Motion.** "Moves like a test run finishing": a figure of 10 or
  more counts up once, in under a second, when it enters view, in a
  reserved width so nothing shifts. The nav ground eases between
  colours. No infinite animation. With reduced motion or no
  IntersectionObserver the final value shows at first paint.
- **Removed.** Starfield, hero logo image and glow (the mark stays
  in the nav), the hero's "Software Engineer" and "Now:" lines,
  pills and topic tags, card boxes, the visible "2nd" per entry.

### Figures

| Where | Figure | Unit |
|---|---|---|
| Hero | `~70` | caption below |
| Intuit Credit Karma | `~15,000` | AI workflow runs per day |
| Dynamic Experts | `157` | unit tests |
| Solidigm | `~30%` | fewer false-positive failures |
| Hackathons | `2nd` | the existing lede |
| BudgetTracker | `249` | Vitest and Supertest tests |
| Resume Build System | `61` | pytest tests |
| Light Commands | none | left cell empty |

### New words (approving this plan approves them)

- Hero caption: "pull requests a day, reviewed by an AI code review
  agent I built at Intuit Credit Karma." It restates the removed
  "Now:" line in the first person.
- Solidigm unit: "fewer false-positive failures".

## Acceptance criteria

- F1: Given the hero, then it shows `~70`, the caption, one `h1`
  "Michael Huang", the summary verbatim, and links Resume, GitHub,
  LinkedIn, Email in that order; no "Now:" line, role line, or image.
- F2: Given 1280x800 or 375x812 at default text settings, then the
  figure, caption, `h1`, and Resume link are fully inside the first
  view; the hero is no taller than the viewport at 375x812; the
  figure's font size is at least five times the body size.
- F3: Given an entry with a `figure`, then its value is the leading
  token of one `**bold**` run in that entry's highlights (the
  hero's, of `credit-karma`), and values and units equal the table.
  The Hackathons figure equals every entry's `place`.
- F4: Given the palette, then ink on white, amber, and teal, white
  on ink, muted on white, and the ink ground's muted on ink are
  each at least 4.5:1, and muted on white at least 5.5:1. `body`
  has no background image. Computed grounds are amber (hero), teal
  (hackathons), ink (contact, footer), white (others). axe passes
  at 320, 375, and 1280.
- F5: Given 720px or wider, then each `[data-figure]` in Experience
  and Projects is left of its title; below 720px it is above it. It
  is `aria-hidden` and the row's first child. No figure overflows
  its column at 320, 375, 768, 1280, 1920, nor at 320 and 768 with
  the WCAG text-spacing overrides.
- F6: Given 1280x800, when the page scrolls until the second
  hackathon entry crosses the figure, then the figure's top is
  within 2px of where it sat when the first entry crossed it, and
  the entries' tops have moved. Entries stack; each starts with
  "2nd". At 375px the figure scrolls with the page.
- F7: Given Projects, then pins have no border, fill, or
  `[data-pill]`, sit in two columns from 988px, and long unbroken
  text does not overflow at 320px. Headings and Code/Live link
  rules are unchanged.
- F8: Given `countFrame(value, t)`, then `t = 1` returns the value
  exactly, `t = 0` returns the prefix, `0`, and the suffix, frames
  never decrease, grouping commas are kept, and `2nd` or a value
  under 10 is returned unchanged for every `t`. Given reduced
  motion, then no `[data-figure]` ever shows any text but its final
  value. Given motion, then the hero figure shows at least one
  smaller value and ends on `~70`, and its box width never changes.
- F9: Given any of the six sections under the nav's bottom edge,
  then the nav's computed background equals that section's. The
  brand and four links, their order, and the `aria-current` rules
  (Experience stays current through Hackathons) are unchanged.
- F10: Given 1280px, then at most nine distinct font sizes render;
  targets are at least 24px (44px on phones, as today);
  `::selection` is at least 4.5:1; after a nav click the section's
  `h2` sits one group gap (within 8px) below the nav.
- F11: Given the built site, then `theme-color` is `#eca358`,
  `color-scheme` is `light` in `index.html` and `404.html`, neither
  file contains `#0a0a0f`, and `og.png` is 1200x630. Checked by
  eye: `og.png` shows the figure.
- F12: Given the page, then these existing cases pass unchanged:
  same-origin fonts and loaded faces (`fonts.spec`), the noscript
  content (`noscript.spec`), scroll-spy (`nav.spec`), skip link and
  2px solid ring (`keyboard.spec`), zero running animations under
  reduced motion and smooth scroll otherwise (`motion.spec`), the
  copy oracles in the section unit tests, and all of `scripts/`
  except the two colour lines in `dist.test.ts`.
- F13 (main agent, recorded, not automated): the skill's audit
  passes with `--strict` or each remaining finding is recorded with
  its reason; a capture critique loop per PR and one neutral review
  are recorded.

## Existing tests whose intent changes

Approving the plan approves exactly these; each is named again in
the task that changes it. Nothing else is loosened.

- `e2e/fold.spec.ts`: "Experience heading in the first screen"
  becomes F2; the role-line size case is deleted with the line;
  the 48px and 24px paddings become the new tokens.
- `e2e/hero.spec.ts`: the starfield case becomes "no body
  background image"; the image case points at the nav mark.
- `src/sections/Hero.test.tsx`: the "Now:" line, role line, and
  image cases become the figure and caption cases.
- `e2e/polish.spec.ts`: Resume border colour and hover colour
  become "Resume is the only filled link" and "links are underlined
  ink"; card geometry cases (lines 25-83) are replaced by F7; the
  16px bullet size becomes 18px.
- `e2e/layout.spec.ts`: card width and height cases (48-62) are
  replaced by F7; the long-text case (64-87) is kept.
- `e2e/ledger.spec.ts`: "period left of the title" becomes "figure
  left of the title, period under the role"; alignment cases keep
  their intent on the new grid.
- `e2e/projects.spec.ts`: the three-column hackathon cases (13-44)
  become F6; "stack left of the title" becomes "figure left of the
  title, stack below it".
- `Experience.test.tsx`: article child order gains a leading
  figure. `Projects.test.tsx`: the `249` lookup is scoped to the
  bullet. `Hackathons.test.tsx`: "2nd" appears four times.
- `src/contrast.test.ts`: the dark pairs become the F4 pairs.
  `scripts/dist.test.ts`: `theme-color` and `color-scheme`.

## PR breakdown

Each PR targets the branch before it. When all eight are approved
they fold down, last into first, and PR 1 merges into `main` once:
one deploy, one revert. Tasks run in sequence, one Sonnet dev agent
each.

| PR | Branch (base) | One concern | Tasks |
|---|---|---|---|
| 1 | `feature/figures-foundation` (`main`) | page turns light | T1, T2 |
| 2 | `feature/figures-hero` (PR 1) | figure and hero | T3-T6 |
| 3 | `feature/figures-experience` (PR 2) | shared row | T7 |
| 4 | `feature/figures-projects` (PR 3) | projects, pins | T8 |
| 5 | `feature/figures-hackathons` (PR 4) | pinned band | T9 |
| 6 | `feature/figures-about-contact` (PR 5) | closing sections | T10 |
| 7 | `feature/figures-countup` (PR 6) | count-up motion | T11 |
| 8 | `feature/figures-ship` (PR 7) | share image, sweep | T12, T13 |

PR 1 may pass 400 changed lines: the token flip must land with
every file that reads a removed token. Every PR passes the full
suite and leaves a coherent page.

## Test plan

| AC | Layer | File |
|---|---|---|
| F1 | unit | `Hero.test.tsx` |
| F2 | e2e | `fold.spec.ts` |
| F3 | unit | `figures.test.ts` |
| F4 | unit, e2e | `contrast.test.ts`, `hero.spec.ts`, `a11y.spec.ts` |
| F5 | unit, e2e | section tests, `ledger.spec.ts`, `layout.spec.ts` |
| F6 | unit, e2e | `Hackathons.test.tsx`, `projects.spec.ts` |
| F7 | unit, e2e | `Projects.test.tsx`, `polish.spec.ts` |
| F8 | unit, e2e | `figure.test.ts`, `motion.spec.ts` |
| F9 | e2e | `nav.spec.ts` |
| F10 | e2e | `type.spec.ts`, `polish.spec.ts`, `nav.spec.ts` |
| F11 | unit, eye | `dist.test.ts`; `og.png` by eye |
| F12 | all | the cases F12 names |
| F13 | record | Verification record (tasks file) |

## Verification

On every branch: `npm run lint`, `npm test`, `npm run test:e2e`,
`npm run check:limits`. The main agent then captures 1440 and 390
with the skill's `capture.mjs`, opens the images, runs one critique
loop and `audit.mjs`, and sends fixes back as tasks. After PR 8: a
neutral review by a fresh Sonnet agent, `audit.mjs --strict`, a
keyboard pass and a reduced-motion pass in the browser pane.
Captures and reports stay in the scratchpad, uncommitted; the
skill is not in dev worktrees, so F13 is the main agent's.

## Risks

- **Rewritten tests hide a regression.** Every intent change is
  listed above and in its task; other cases stay untouched.
- **Figures overflow.** Container-sized type and the F5 checks,
  including text-spacing.
- **Count-up janks or reads as gimmick.** It is alone in PR 7 and
  can be dropped without touching the rest.
- **`index.css` passes 400 lines.** If it nears 380, T1 moves the
  token and ground blocks to `src/tokens.css` and points
  `contrast.test.ts` there.
- **Empty left cell on Light Commands looks like a hole.** Judged
  on the PR 4 capture; the fix, if needed, is a task.
- **No dark variant; cached share previews.** Accepted.

## Rollback

Revert the one merge commit on `main` (`git revert -m 1`); the
deploy workflow republishes the previous site. Share previews of
the new `og.png` may stay cached elsewhere. No data or URLs change.

## Review log

Four Sonnet reviewers (correctness and accessibility; tests and
sequencing; architecture; docs and process). Blockers, all fixed:

- Nav ground could not see Hackathons and lagged at the bottom:
  now read from the section under the nav, over all six sections.
- Flipping token values under old names broke every non-white
  ground: `data-ground` maps role tokens per ground.
- T1 left `polish.spec` and `a11y.spec` red: T1 now removes the
  accent tokens and literals and owns those cases.
- Merging five PRs published five states: fold down, merge once.
- The nav Resume link broke `smoke`, `layout`, and `polish`:
  dropped (Non-goals).

Majors fixed: no wrapper divs; one shared row grid that About joins
in T7 so alignment cases stay green; figure first in the DOM, no
`<strong>`, `data-figure` hook; column-sized type and text-spacing
cases; sticky gated by height with a geometry test; count-up
specified against StrictMode, flash, width shift, and jsdom;
`2nd` exempt from the bold-run rule; `type.spec.ts` starts in T1
as a ratchet; README edits assigned to the task that makes each
section false; briefs carry branch, dependencies, and exact cases;
eight PRs for size; direction notes saved straight to `docs/plans`.

Second pass (one Sonnet reviewer, revised sections only), all
fixed: section padding moves from T1 to T5 so `fold.spec` stays
green; T7 owns the Experience half of `polish.spec` 138-157; the
ground blocks paint background and colour, and Hero, Contact, and
footer drop the overrides that would box them; the nav removes its
`data-ground` over white sections and uses a separate six-id pick;
`--row-cols` is `fr`-based. Token coverage, `nav.spec`, and
`smoke.spec` checked out.

Rejected: a listener for reduced motion changing mid-count (the
window is under a second); a separate `docs/` branch for plan
files (the SOP saves them on the first branch); a second layout for
the row with no figure (left empty, judged on capture).

## The four questions

Answered in `figures-revamp-tasks.md`, with the verification
record and the deviations from this plan.
