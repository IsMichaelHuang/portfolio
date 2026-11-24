# Plan — Figures polish

This plan follows the Figures redesign in `figures-revamp.md`.

## Context

Michael likes the redesigned site but calls it "pretty rough". The
numbers and words are correct. The craft is not finished. This plan
polishes the page and keeps its identity: the colors, the two
typefaces, the layout, the copy and the figures stay.

The main agent measured the live page first, as the skill's `polish`
command requires. It captured the page at five widths, ran the
design audit, and opened a screenshot of each section at full size.

## What reads as rough

1. Row figures are small in a wide column. `157`, `249`, `61` and
   `~30%` render at 94px in a 530px column, because one size must fit
   the longest figure, `~15,000`. The left column looks empty.
2. The caption under a row figure is 16px and regular weight. It
   looks like a footnote, not a label.
3. Section headings are 28px and entry titles are 22px. The step is
   too small to read as two levels.
4. Headings have default letter spacing. The audit flags it seven
   times.
5. The "Code" and "Live" links have no underline. They look like
   stray labels.
6. Bullet text is indented 20px past its title, and it is gray. The
   text column has a ragged left edge and long text looks washed out.
7. Spacing inside an entry has no rule. The grid adds 8px between
   every child, and each module adds its own margins on top. The
   audit counts 15 spacing values.
8. In Hackathons, the lede under `2nd` is 16px. It is the caption of
   the largest figure on the page after the hero.

## Goal

Each section looks finished at 1440px and at 390px. A row figure
fills its column. Text aligns on two grid lines. Links look like
links. The identity is the same in a before and after comparison.

## Non-goals

- No change to copy, facts, figures, section order, colors or
  typefaces.
- No new sections, no Resume link in the navigation bar, and no new
  motion. Those are separate decisions.
- No change to the hero, to the row with no figure (its left cell
  stays empty), or to Contact and the footer links.
- No new dependencies.
- No push, PR or merge without Michael.

## Design

- **Row figures fill the column.** A pure function `figureWidth`
  estimates the width of a value in digit widths: a digit counts 1,
  `,` and `~` count 0.4, `%` counts 1.4. `Figure` sets it as a `--w`
  custom property on a `row` figure only. The `row` size is
  `calc(<constant>cqi / var(--w, 6))` inside the existing clamp of
  3.5rem to 10.5rem. `~15,000` keeps about its size. Short figures
  grow, up to the 168px cap. The hero and band sizes do not change.
- **Captions.** A row caption uses `--text-body` (18px) at weight
  500, 1rem under the numeral.
- **Headings.** The `h2` of Experience, Hackathons, Projects and
  About uses the larger of `--text-heading` and `--text-statement`:
  38px at 1280px and 28px on phones, with 3.5rem under it. Contact
  keeps its 1rem gap. `h1` to `h4` get `letter-spacing: -0.01em`.
  Statement-size text (those `h2`s, the hero caption, the email
  link) gets `-0.02em`. The hero `h1` stays 28px: the figure is the
  hero's display text and the name is its label.
- **Hackathons lede.** `--text-lead` (22px), weight 500.
- **Links.** The Code and Live links in Projects and Hackathons are
  underlined at rest, with a 2px underline on hover.
- **Bullets.** From 720px the markers hang outside the text column,
  in the column gap, so bullet text and titles share a left edge.
  Bullet text is ink. Meta lines stay muted. Below 720px the list
  keeps its indent.
- **Rhythm inside an entry.** `.ledger-row` sets `row-gap: 0`.
  Margins own every gap, at every width: title to the next line
  0.25rem, between meta lines 0.25rem, meta to bullets 1rem, between
  bullets 0.5rem, bullets to link 1rem.

## Acceptance criteria

- K1: Given 1280px, then the `157` figure renders at least 1.5 times
  the font size of `~15,000`, and `~15,000` renders at 85px or more.
  At most eight distinct sizes render inside figures: the hero, the
  band, three row sizes, and three `~` marks.
- K2: Given 320, 375, 720, 768, 1280 and 1920px, then no row figure
  overflows its column, also with the WCAG text-spacing overrides at
  320, 720 and 768px.
- K3: Given a row figure with a caption, then the caption computes
  18px and weight 500.
- K4: Given `figureWidth`, then `157` gives 3, `61` gives 2,
  `~30%` gives 3.8 and `~15,000` gives 5.8.
- K5: Given 1280px, then at most five distinct font sizes render
  outside figure numerals. The `h2` of each of the four content
  sections has the font size of the hero caption and 56px under it.
  Given 375px, then those `h2`s compute 28px.
- K6: Given any `h1` to `h4`, then its computed letter spacing is
  negative.
- K7: Given a link in `main` outside the hero, or in the footer,
  then it is underlined at rest. Navigation links and hero buttons
  are not. Given hover on a Code link in Projects and in Hackathons,
  then its underline is 2px.
- K8: Given 1280px, then the left edge of the first bullet's text
  equals the left edge of its entry title within 1px, in Experience
  and Projects, and bullet text has the color of the title. Given
  720px, then no marker overlaps a figure. Given 320px, then the
  page has no horizontal scroll.
- K9: Given 375px and 1280px, then in Experience and Projects the
  gap from the last meta line to the bullet list is 16px and the gap
  from the title to the next line is 4px.
- K10: Given Hackathons, then the lede computes 22px, weight 500.
- K11 (main agent, recorded): the audit after the change has no new
  finding and no more spacing values than before (15). The before
  and after captures show the same identity.

## Existing tests whose intent changes

Approval of this plan approves this change and no other.

- `e2e/type.spec.ts`: "at most ten font sizes" becomes K5 plus the
  numeral cap in K1. Figure numerals and their `~` marks get their
  own count, because their size now follows the width of the value.

## PR breakdown

Two PRs. Part 2 stacks on part 1 because both edit
`Projects.module.css`, `e2e/type.spec.ts` and `README.md`. After
Michael approves both, part 2 merges into the branch of part 1 with
a normal merge, CI runs again on part 1, and part 1 merges into
`main` one time.

| PR | Branch (base) | One concern | Tasks |
|---|---|---|---|
| 1 | `feature/polish-figures` (`main`) | figure size | T1 |
| 2 | `feature/polish-type` (PR 1) | type, links, rhythm | T2, T3 |

## Tasks

Rules for every task: the rules in `figures-revamp-tasks.md`. One
Sonnet dev agent per task, in sequence. Failing test first. All prose
in Simple English. Do not touch `docs/plans/`, `.claude/`, data
files, or any file outside "May touch".

### T1 — Row figures fill their column (PR 1)

- ACs: K1, K2, K3, K4. Depends on: none.
- May touch: `src/lib/figure.ts`, `src/lib/figure.test.ts`,
  `src/components/Figure.tsx`, `Figure.module.css`,
  `Figure.test.tsx`, `e2e/layout.spec.ts` (new K1 and K3 cases, and
  720px without text spacing in the fit list), `e2e/type.spec.ts`
  (the ceiling case), `README.md` (lines 229-232).
- Tests first: K4 unit cases. `Figure` sets `--w` on a `row` figure
  and not on a `hero` or `band` figure. K1 and K3 at 1280px. In
  `type.spec.ts`, split the ceiling case in two: at most five sizes
  outside `el.closest('[data-figure] [aria-hidden="true"]')`, and at
  most eight sizes inside it. Both halves pass before the change.
  K1, K3 and K4 are the red cases.
- Do: `style={{ "--w": figureWidth(value) } as CSSProperties}` for
  `size === "row"`. One constant from 720px and one below it. The
  720px case with text spacing binds: fit it first, then K1. The
  review estimates a constant between 42 and 49 from 720px and
  between 100 and 120 below it. Measure with the real font.

### T2 — Headings and the Hackathons lede (PR 2)

- ACs: K5 (heading size and gap), K6, K10. Depends on: T1.
- May touch: `src/index.css` (heading rules only),
  `Figure.module.css` (the hero caption's letter spacing),
  `Contact.module.css` (the email link's letter spacing),
  `Hackathons.module.css` (the lede), `e2e/type.spec.ts` (new K5 and
  K6 cases), `e2e/projects.spec.ts` (new K10 case), `README.md`
  (lines 205-207).
- Tests first: K5 at 1280px and 375px for the four `h2`s. K6 for
  every `h1` to `h4` on the page. K10.
- Do: size the four headings with the selector `#experience > h2,
  #hackathons > h2, #projects > h2, #about > h2`. Do not widen
  `section > h2`, so the Contact heading stays 28px.
- Must stay green unedited: the jump case in `e2e/nav.spec.ts`, the
  first-view cases in `e2e/fold.spec.ts`, `e2e/closing.spec.ts`.

### T3 — Links, bullets and rhythm (PR 2)

- ACs: K7, K8, K9. Depends on: T2.
- May touch: `src/index.css` (`.ledger-row` row gap only),
  `Experience.module.css`, `Projects.module.css`,
  `Hackathons.module.css`, `About.module.css` (margins that the row
  gap supplied), `e2e/polish.spec.ts` (new K7 cases),
  `e2e/ledger.spec.ts` (new K8 and K9 cases), `README.md` (lines 218
  and 234-236).
- Tests first: K7 at rest with the selector `main a:not(#hero a),
  footer a`, the negative case for `nav a` and `#hero a`, and hover
  on a Projects link and a Hackathons link (a pin link when pins
  exist). K8 with a `Range` on the bullet text, the marker case at
  720px, and the color. K9 at both widths.
- Do: phones have no row gap today, so the margins also give phones
  the same steps. Experience needs a top margin on the meta line and
  on the bullet list. Projects needs 1rem above its link. About's
  Education lines need 0.25rem margins.
- Must stay green unedited: the hovered Code link case and the link
  size case in `e2e/polish.spec.ts`, the `#experience li strong`
  color case and the About alignment cases in `e2e/ledger.spec.ts`,
  the padding cases in `e2e/fold.spec.ts`.

The main agent, not a dev agent: saves this plan on branch 1. After
each PR it captures 1440 and 390 and opens the images. After PR 2 it
runs the audit again, compares it with the "before" report, compares
the section screenshots side by side, and writes the verification
record and the four questions into this file.

## Test plan

| AC | Layer | File |
|---|---|---|
| K1, K2, K3 | e2e | `layout.spec.ts`, `type.spec.ts` |
| K4 | unit | `figure.test.ts`, `Figure.test.tsx` |
| K5, K6 | e2e | `type.spec.ts` |
| K7 | e2e | `polish.spec.ts` |
| K8, K9 | e2e | `ledger.spec.ts` |
| K10 | e2e | `projects.spec.ts` |
| K11 | record | Verification record in this file |

## Verification

On each branch: `npm run lint`, `npm test`, `npm run test:e2e`,
`npm run check:limits`. Then the main agent opens the page in the
browser pane at 1440px and 390px, and makes a keyboard pass.

## Risks

- **Uneven figure sizes look worse than one size.** `~15,000` stays
  near 94px beside 168px figures. The main agent judges this on the
  PR 1 capture. If it reads badly, T1 is reverted and the plan
  returns to Michael.
- **The section `h2` is larger than the hero `h1` on desktop.** This
  is a visual choice. The document outline does not change.
- **Hanging bullets clip on narrow screens.** They hang only from
  720px, where the column gap is 56px. K8 covers 720px and 320px.
- **Ink bullets reduce the emphasis of the bold numbers.** The bold
  weight stays. Judged on the PR 2 capture.
- **Row gap zero changes About.** Its Education row uses the same
  grid. T3 restores its gaps with margins, and the About alignment
  cases guard it.

## Rollback

Revert the one merge commit on `main` (`git revert -m 1`). The
deploy workflow publishes the previous site.

## Review log

Two Sonnet reviewers: correctness and accessibility, and tests and
process. One blocker and nine majors. All fixed, as follows.

- Blocker: moving the meta of the row with no figure broke an
  existing case and overflowed between 720px and 1000px. That change
  is dropped. The cell stays empty.
- Sizing by character count did not fit three-digit figures at
  720px with text spacing. Sizing now uses a weighted width, and K1
  no longer pins `~15,000` to an exact size.
- The rhythm rule ignored the grid row gap. The row gap is now zero
  and margins own the gaps. K9 tests two steps at two widths.
- The `h2` at statement size shrank on phones and K5 failed for
  Contact. The `h2` now takes the larger of two tokens, and K5 names
  the four sections.
- K3 named a band caption that does not exist. The lede is the
  caption of `2nd` and has its own criterion.
- T2 listed the wrong file for the hero caption. It now lists
  `Figure.module.css`.
- Contact and footer links were already underlined. Their files are
  out of T3. K7 has an exact selector and a negative case.
- The custom property needs a `CSSProperties` cast and a fallback.
- Each task now has a "tests first" list, the README lines it must
  fix, and the cases that must stay green.
- The numeral sizes get their own cap, so the size count still
  guards the page.

Second pass (one Sonnet reviewer, revised parts only). One blocker
and one major, both fixed: the cap of six figure sizes was too low,
because the `~` marks are sizes too, so it is eight. The sizing
constant has a narrow window, so T1 names the binding case and the
estimated range. Minor points fixed: the exact `h2` selector, the
K7 selector, and the margins each section needs when the row gap is
zero. The reviewer confirmed that no existing case measures a gap
that changes.

Rejected: raising the hero `h1` to statement size. It adds height to
the hero, and the first-view cases at short screens depend on it.

## Verification record

Final state, branch `feature/polish-type`, run by the main agent:
lint clean. 160 unit tests in 27 files pass. 158 end-to-end tests
pass. `check:limits` is clean.

The main agent opened a screenshot of each section before the
change, after T1, and after T3, at 1440px and at 390px.

- T1: at 1280px `157`, `249` and `61` render at 168px, `~30%` at
  143px and `~15,000` at 93px. Each figure spans a similar width, so
  the uneven heights read well. The change stays.
- T2: section headings compute 38px at 1280px and 28px at 375px.
- T3: bullet text starts on the title's left edge from 720px. Bullet
  text is ink. Code and Live links are underlined.

Design audit, before and after: no blockers, one major and three
minor findings both times. The spacing count is 15 both times. No
new finding. The major finding is the static reading of the `~`
mark at 6.72px. The smallest rendered text is 14.4px.

The audit still notes default letter spacing on display text at
720px. The headings now have negative spacing, and a test makes
sure of that. The note is about other text and is not acted on.

Keyboard pass at 1280px: 18 stops in page order. Each has a 2px
solid ring, and no ring has the color of the ground under it.

Identity: the before and after captures show the same colors,
typefaces, layout, copy and figures.

Deviations from the plan: none.

## The four questions

1. **Regressions.** The bullet text is ink, where it was gray. The
   bold numbers keep their weight. The row gap is zero, and margins
   replace it in Experience, Projects, Hackathons and About. The
   About alignment cases and the padding cases pass unedited. None
   found.
2. **Security.** The change is CSS, one pure function and one inline
   custom property that holds a number from bundled data. No new
   input, dependency or request. None found.
3. **Efficiency.** `figureWidth` runs one time per figure render.
   The change adds no script that runs on scroll and no dependency.
   No action.
4. **More tests before prod.** Added in this change: figure size
   ratio, caption size, heading size and spacing, letter spacing,
   underlines at rest and on hover, bullet alignment, entry rhythm,
   and the lede size. Not covered: browsers other than Chromium, as
   before. No open action.
