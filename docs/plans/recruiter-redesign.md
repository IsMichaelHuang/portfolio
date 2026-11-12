# Plan — recruiter redesign

Brief from Michael: "Look at my LinkedIn, and this resume and
anything else that is relevant to make this the most tasteful and
attractive website for recruiters. You own it. Go crazy." He is
hands-off again, so there is no approval gate; every call here is
the main agent's and is repeated in the hand-off.

Exact copy lives in `recruiter-redesign-content.md`.

## Goal

A recruiter who gives the page thirty seconds leaves knowing what
Michael does now, what he has shipped with numbers attached, and
how to reach him. The page says only what his resume and LinkedIn
say, in a layout that reads like a well-set resume, not a template.

## Intake findings

- The site trails the resume: no Credit Karma role, two hackathons
  instead of three, old skills, an outdated `resume.pdf`.
- The strongest material (quantified results, three second places,
  BudgetTracker, the Light Commands research) is absent or buried.
- Projects shows raw GitHub pins: thin descriptions, topic tags,
  and one repository that belongs to someone else.
- Skills are 17 pills; the resume lists 34 items in five groups.
- About comes before Experience, so proof arrives late.

## Non-goals

- No new facts, no names of other people, no employer logos.
- No stat tiles, counters, carousels, or new animation.
- No change to stack, hosting, color tokens, or typefaces.
- The pinned-repo pipeline stays; its output is shown, deduplicated.
- Hero role, summary, page title, JSON-LD, and `<noscript>` stay.
- No push or merge without Michael.

## Acceptance criteria

- R1: Given the hero, then it shows the name, role, summary, the
  "Now" line, and four links with Resume as the lead action.
- R2: Given Experience, then entries are Credit Karma, Dynamic
  Experts, Solidigm in that order, each with company, role, period,
  location, and its bullets verbatim; no hackathon entry.
- R3: Given a string with `**x**`, then `x` renders in `<strong>`
  and the markers vanish; with no markers it is unchanged; with an
  odd number of markers the whole string renders literally. `~`,
  `.env`, and `{{PLACEHOLDER}}` pass through untouched.
- R4: Given 720px or wider, then each Experience entry, featured
  project, and the Education block is a two-column row: metadata
  left, content right, tops aligned; below 720px one column with
  the heading first.
- R5: Given Projects, then it shows, in order: the hackathon block
  (lede, takeaway, three entries each marked 2nd), three featured
  projects, and "Also on GitHub".
- R6: Given pins and a list of featured URLs, then
  `remainingPins` drops pins whose `repoUrl` matches one (ignoring
  case, a trailing slash, and `.git`), keeps pins without a URL,
  and the "Also on GitHub" block is absent when none remain.
- R7: Given About, then it shows the bio, the Education block, and
  five skill groups as a `<dl>` of text rows with AI/ML first; no
  pill elements remain in About.
- R8: Given the page, then sections run Hero, Experience, Projects,
  About, Contact; the nav's four section links (the brand link
  excluded) are in that order and equal the section ids after Hero.
- R9: Given `dist/`, then `resume.pdf` is the new file (its
  inflated text, with kerning breaks removed, contains "Credit
  Karma") and the description and Open Graph copy match the
  content file.
- R10: Given 320px to 1920px, then there is no horizontal scroll,
  axe finds no WCAG A or AA violation, phone links are at least
  44px tall, and the keyboard, motion, fonts, and nav specs pass.
- R11: Given the rendered page, then every bullet's text equals its
  expected string (kept as literals in the tests) and the text
  "Sugawara" does not appear.

## Design

Tokens, typefaces, starfield, hero mark, and the centred hero and
Contact stay. What changes:

- **Reading order.** Hero, Experience, Projects, About, Contact.
- **Left-aligned section headings** for Experience, Projects, and
  About, on the same left edge as their rows.
- **One row layout, used three times.** At 720px and up:
  `grid-template-columns: 11rem minmax(0, 1fr)`, gap `0.5rem
  2.5rem`, inside an 880px column. Left: Jost 0.9rem, muted,
  tabular numerals. Right: the heading and serif bullets. DOM order
  is heading, metadata, bullets (so phones read heading first);
  the grid places metadata in column one without CSS `order`.
  Rows are separated by a hairline, no timeline marks.
  - Experience: left is period and location; right is company
    (h3, Jost 600, 1.25rem), role (muted), bullets. Company leads
    because recruiters scan employers and two roles share a title.
  - Featured project: left is the period, if any, and the stack as
    a list (one item per line on desktop, comma-separated inline
    on phones); right is the title (h3), bullets, and a Code link.
  - Education: left is "Graduated Aug 2025"; right is the school
    (h3), degree, honor, certification.
- **Numbers lead.** `strong` inside bullets: `--color-text`, weight
  600, no other change.
- **Hero.** The Now line sits under the summary: same size as the
  summary, muted, with "Now:" in Jost 500 at `--color-text`. No
  rule, dot, or uppercase. On phones the mark is 96px and the four
  buttons form a 2 x 2 grid. The load stagger covers the new child.
- **Hackathons.** Lede and takeaway as plain paragraphs. Three
  columns at 720px and up, stacked below. Each entry: a hairline on
  top, "2nd" in Jost 300 at `clamp(2rem, 4vw, 2.75rem)`, muted;
  event (h4, Jost 600); detail (muted, 0.9rem); project (Jost 500);
  text (serif, 0.95rem). No cards, fills, medals, or quote marks.
- **Skills.** `<dl>`; at 480px and up
  `grid-template-columns: 8rem minmax(0, 1fr)`; `dt` Jost 500,
  `dd` serif, muted.
- **Also on GitHub.** The existing cards under an h3, inside a
  plain `<div id="pinned">` (not a nested `<section>`, which the
  global section rules and the landmark test would catch); card
  titles become h4.

Heading levels: h2 section; h3 company, project title, "Hackathons",
"Education", "Skills", "Also on GitHub"; h4 hackathon event and pin
card title.

### Components and data

- `src/lib/emphasis.tsx` (new): `renderEmphasis(text)`, pure.
- `src/lib/pins.ts` (new): `remainingPins(projects, urls)`, pure.
- `src/data/experience.ts` (`location` added), `src/data/work.ts`
  (new), `src/data/education.ts` (new), `src/data/skills.ts`
  (rewritten). Shapes in `work.ts`:
  `Hackathon { id; place; event; detail?; project; text;
  repoUrl? }` and `Featured { id; title; stack: string[];
  period?; repoUrl?; highlights: string[] }`. A `repoUrl` renders
  a "Code" link through `ExternalLink` with the title or project
  as context; without one, no link.
- `src/sections/Experience.*`, `Projects.*`, `About.*`, `Hero.*`,
  `src/components/Navbar.tsx`, `src/App.tsx`, `src/index.css`.
- `index.html`: description and Open Graph copy.
- `public/resume.pdf`: replaced, in its own commit.

## PR breakdown

Stacked; base of PR 1 is `main`.

| PR | Branch | One concern | Tasks |
|----|--------|-------------|-------|
| 1 | `feature/resume-content` | Site matches the resume | T1, T2 |
| 2 | `feature/featured-work` | Projects tell the story | T3 |

A critique pass after PR 2 may add a polish PR.

## Tasks

The "Rules for every task" section of `portfolio-polish-tasks.md`
binds every task. Each task is one Sonnet dev agent. Tests query by
role and text, never by hashed class. Component tests mock the data
modules they are not testing; nothing may depend on the current
contents of the generated `src/data/projects.ts`.

### T1 — content, emphasis, order, hero (PR 1)

ACs: R1, R2, R3, R8, R9, R11 (experience).
May touch: `src/lib/emphasis.tsx` and its test,
`src/data/experience.ts`, `src/sections/Experience.tsx`,
`src/sections/Experience.module.css`, `src/sections/Hero.tsx`,
`src/sections/Hero.module.css`, `src/App.tsx`,
`src/components/Navbar.tsx`, `index.html`, `src/**/*.test.tsx`,
`scripts/dist.test.ts`, `e2e/*.spec.ts` whose assertions this
makes false, `README.md`.
Experience markup is final in this task, in this DOM order per
entry: `h3` company, `p` role, a metadata block holding the period
and the location, then the `ul`. T2 adds only layout CSS.
Hero: add the Now line; on phones the mark is 96px and the four
buttons are a 2 x 2 grid.
Known existing tests to update, intent kept: `Navbar.test` link
order; `landmarks.test` section order; `Experience.test` (both
tests are about the removed hackathon entry: rewrite);
`e2e/polish.spec.ts` "About lead paragraph and prose typography"
(the period is no longer `h3 + *`; keep the nowrap and 16px
checks) and "About heading peeks into the first phone screen"
(About is no longer second and the hero is taller: assert instead
that the hero is no taller than the 812px phone viewport).
Tests first: emphasis (none, one, several, adjacent, mid-word,
odd count literal, `.env` and `{{PLACEHOLDER}}` fixture, no React
key warning); Experience order and fields, each `li` text equal to
the expected literal with markers stripped, each expected bold run
inside a `strong`; the Now element's `textContent` equals the
content-file string; hero buttons form two rows of two at 375px;
nav hrefs equal section ids in DOM order; `dist` description and
Open Graph text; `dist/resume.pdf`: inflate each stream with
`node:zlib`, delete kerning breaks matching
`\)\s*-?\d+(\.\d+)?\s*\(`, and expect `/Credit\s*Karma/` (green
on arrival because the file is committed first).

### T2 — ledger layout, education, skills (PR 1)

ACs: R4, R7, R10.
May touch: `src/sections/Experience.module.css`,
`src/sections/About.*`, `src/data/education.ts`,
`src/data/skills.ts`, `src/index.css`, tests, `e2e/*.spec.ts`,
`README.md`.
Tests first (`e2e/ledger.spec.ts`): at 1280px the period is left
of the company heading and shares its top (within 8px); at 375px
the heading is above the period; section h2 left edges equal the
row left edge; About has Education text and a `dl` with five `dt`
in order, exact `dd` text, and zero `[data-pill]`; `strong` in a
bullet computes the `--color-text` color. All existing specs stay
green; update `#about p` indexes in `e2e/polish.spec.ts` if the
Education block shifts them.

### T3 — hackathons and featured work (PR 2)

ACs: R5, R6, R10, R11.
May touch: `src/data/work.ts`, `src/lib/pins.ts` and its test,
`src/sections/Projects.*`, tests, `e2e/*.spec.ts`, `README.md`.
Known existing tests to update, intent kept: every
`#projects h3` selector in `e2e/layout.spec.ts` and
`e2e/polish.spec.ts` (scope them to the cards inside `#pinned`,
whose titles are now `h4`, and have each test build the card count
it needs by cloning a card); `Projects.test` paragraph count.
Tests first: `remainingPins` with inline arrays; Projects with
mocked data renders the three blocks in order, three "2nd", each
featured `li` equal to its literal, no link for a project without
`repoUrl`, no "Also on GitHub" heading when no pins remain; no
string in `work.ts` or `experience.ts` contains "Sugawara"; e2e:
three hackathon entries share a top at 1280px and stack at 375px;
new links are 44px tall on phones.

## Test plan

| AC | Layer | File |
|----|-------|------|
| R3 | Vitest | `src/lib/emphasis.test.tsx` |
| R6 | Vitest | `src/lib/pins.test.ts` |
| R1, R2, R5, R7, R8, R11 | Vitest + RTL | `src/**/*.test.tsx` |
| R9 | Vitest on `dist/` | `scripts/dist.test.ts` |
| R4, R10 | Playwright | `e2e/ledger.spec.ts`, existing specs |

## Risks

- **Many existing tests change.** They are listed per task and are
  rewritten to the same intent, never deleted to go green.
- **Longer page.** Mitigation: Experience first, Light Commands cut
  to one sentence, hackathon text short.
- **Internal numbers.** The Credit Karma figures are on the resume
  Michael distributes, so they are treated as public. Flagged.
- **Phone number.** The new `resume.pdf` carries it, as the old one
  did. Flagged.
- **Dedup depends on URLs**; a renamed repository shows twice
  until `work.ts` is updated.

## Rollback

Each PR reverts on its own; PR 2 has no dependents. `resume.pdf`
is one binary in one commit.

## Review log

Three Sonnet reviewers: content accuracy, tests and sequencing,
design and accessibility. Accepted:

- Named author in a bullet and a persona name (blocker): both
  removed from the copy; R11 pins the check.
- PDF test could not be red-first (blocker): file committed alone,
  test inflates the PDF and matches text.
- Existing tests each task breaks: listed per task.
- Hackathons before featured projects; Light Commands shortened.
- "Now" line tense fixed and location added to it.
- Company leads each Experience row; headings left-align; skills
  as a `dl` with AI/ML first; hero phone layout; light "2nd".
- Emphasis semantics, pure seams, literal oracles for R11.

Rejected: a left accent border and figcaption on the takeaway
(stripe borders are a templated tell, and quoting oneself reads as
a testimonial); trimming the About paragraphs (they are Michael's
words); a denylist of other people's names in tests (it would
publish those names in the repository); `<time>` elements (no
machine value for "Present"); changing the hero role and summary
(kept, which also keeps title, JSON-LD, and noscript in step).


Second pass (one reviewer): two more fixes. The PDF text check
must remove kerning breaks before matching, and "Also on GitHub"
is a `div`, not a nested `section`. T1 now owns the final
Experience markup, the hero phone layout, and the two
`polish.spec` tests its changes break; data shapes are written
down.
