# Plan: Simplify audit cleanup

## Context

A read-only simplify audit of the repository found six things that
the code does not need. Michael asked for all six to be planned and
done without his involvement. His message in chat is the approval of
this plan. The SOP still applies: Sonnet reviewers check the plan,
Sonnet dev agents build it test-first, and nothing is pushed.

Baseline on `main` at `b306aac`: lint passes, 160 unit tests in 27
files pass, and `check:limits` passes.

This plan lives at `docs/plans/simplify-audit.md` on the PR 1 branch
only. The review log, verification and four questions land there.
The other PRs name it in their descriptions.

## Goal

Remove dead code, a repeated CI step, dead configuration, a
hand-kept list, and comments that restate the code. The rendered
site and every existing behavior stay the same.

## Non-goals

- No change to copy, layout, styles, data values or section order.
- No shared component for the Experience and Projects rows. The audit
  found that it adds more code than it removes.
- No shared constant for the contact links. `index.html` keeps its
  own copies, so the gain is small.
- No change to the Playwright web server build. Local
  `npm run test:e2e` needs it.
- No push, PR or merge. Those wait for Michael.
- File-limit exemption: `src/data/projects.ts` is generated and
  exempt in `check-limits.sh`.

## Findings

1. Pin tags are fetched, generated and tested, but the page never
   shows them.
2. CI builds twice before unit tests. `ci.yml` has a Build step, and
   `pretest` builds again on `npm test`.
3. `Navbar.tsx` keeps `groundIds`, a hand-kept copy of the section
   order in `App.tsx`. The file header says "edit `links` only", which
   is false for a new section.
4. The Vitest `exclude` entries never match, because `include` only
   covers `src/**` and `scripts/**`.
5. `norm` in `src/lib/pins.ts` strips trailing slashes twice. One
   regex does the same work for every URL GitHub produces.
6. Some comments describe the code, not the reason for it.

## Acceptance criteria

- AC1: If `toProject` runs on a pinned repo, the project has no
  `tags` key.
- AC2: `QUERY` does not ask for `primaryLanguage` or
  `repositoryTopics`.
- AC3: The committed `src/data/projects.ts` has no `tags`, and its
  text is equal to `buildProjectsFile(projects)`.
- AC4: If the Projects section renders, the pins show the same title,
  description, Code and Live links as before, and no tags.
- AC5: No `run:` line in `ci.yml` is `npm run build`, the Unit tests
  step runs `npm test`, and `package.json` keeps
  `"pretest": "npm run build"`.
- AC6: If `vite.config.ts` has no `exclude`, Vitest lists the same
  test files as before.
- AC7: The bar takes the ground of the last section in `<main>` whose
  top is at or above the offset, for any section id. Sections outside
  `<main>` do not count. With no sections, the bar has no ground.
- AC8: If the reader scrolls the built page, the bar takes the ground
  of each section as before (e2e `nav.spec.ts`).
- AC9: For every URL in `pins.test.ts`, `remainingPins` returns the
  same result as before.
- AC10: Every doc and header comment describes the system as it is.
- AC11: On each branch and on all four merged together: lint, build,
  unit tests, e2e tests and `check:limits` pass.

## Design

### PR 1: Pins stop carrying unused tags

- `scripts/pinned.ts`: remove `primaryLanguage` and
  `repositoryTopics` from `GitHubRepo` and from `QUERY`. Remove the
  `topics`, `lang` and `tags` lines from `toProject`. Remove `tags`
  from the `Project` interface in the `buildProjectsFile` template.
- `src/data/projects.ts`: regenerate the committed file with
  `buildProjectsFile` from its current entries minus `tags`. Do not
  edit it by hand.
- README: delete "Tags are the repo topics, else the primary
  language, else none." In "a hairline above each, no tags", drop
  ", no tags".

### PR 2: Test setup runs each step once

- `ci.yml`: delete the Build step. Replace its comment with one above
  the Unit tests step: `# npm test builds dist/ first (pretest).
  dist.test.ts reads it.` The header line "Lint, build, unit, e2e"
  stays true.
- README "Deployment": "runs lint, build, unit tests" becomes "runs
  lint, unit tests (which build first)".
- `vite.config.ts`: delete the `exclude` line. Vitest then uses its
  default excludes, which `include` makes irrelevant.

### PR 3: The navbar reads the sections from the page

- `Navbar.tsx`: delete `groundIds` and its comment. Inside `update`,
  read the ids with
  `document.querySelectorAll<HTMLElement>("main > section[id]")`.
  This runs on every scroll and resize, as the old `getElementById`
  lookups did, so a section that mounts later still counts.
- Navbar header: if a new section has a nav link, it needs a
  `links` entry. Otherwise it needs nothing here.
  Delete the "Styles are scoped via CSS Modules" line.
- README lines 157-172: say that the bar reads the sections in
  `<main>` from the page. In "To add a new section", step 3 adds a
  `links` entry only for a nav link, and the bar ground needs
  nothing. Keep the sentence that `links` follows the document order.

### PR 4: Tidy comments and the URL normalizer

- `src/lib/pins.ts`: `norm` becomes
  `url.toLowerCase().replace(/(\.git)?\/*$/, "")`.
- Delete comments that restate the code. In `Hero.tsx`, these are
  the scroll-anchor and CSS Modules paragraphs of the header, and the
  h1 comment. Also delete the "Semantic list" comment in
  `Experience.tsx` and the Fragment paragraph in the `App.tsx` header.
- `App.tsx` header: "adding or reordering sections means editing only
  this file" becomes true. Add that a section with a nav link also
  needs an entry in the Navbar `links`.
- `scripts/check-limits.sh`: rejoin the header sentence about
  SHA-pinned `uses:` lines. Keep its meaning and keep every line at
  80 characters or fewer.

## Task breakdown

Each PR has its own branch from `main` and its own worktree. The
file sets do not overlap, except `README.md`. PR 1 edits lines 344
and 373, PR 2 edits line 309, and PR 3 edits lines 157-172. All four
dev agents run in parallel.

### T1 (PR 1, branch `chore/drop-pin-tags`, depends on: none)

Files: `scripts/pinned.ts`, `scripts/pinned.test.ts`,
`scripts/fetch-pinned.test.ts`, `src/data/projects.ts`,
`src/lib/pins.test.ts`, `src/sections/Projects.test.tsx`,
`src/sections/Projects.empty.test.tsx`,
`src/sections/links.test.tsx`, `README.md`.

Tests first, in `scripts/pinned.test.ts`. Each one is red today:
- `toProject(repo())` has no `tags` property (AC1).
- `QUERY` does not contain `primaryLanguage` or `repositoryTopics`
  (AC2).
- The text of `src/data/projects.ts` does not contain `tags` (AC3).

Also add a guard that is green today and stays green: the text of
`src/data/projects.ts` equals `buildProjectsFile(projects)` (AC3).
Its comment says that a local `fetch-pinned` run without a revert
makes it fail.

Then:
- Delete the `p.tags` assertion and the "falls back to the primary
  language" case. They test the removed behavior, and Michael
  approved their removal in chat.
- In the hostile round-trip case, remove `tags` from both projects.
  `nasty` still goes through `id`, `title`, `description`, `repoUrl`
  and `liveUrl`, so the injection coverage stays.
- Remove `primaryLanguage` and `repositoryTopics` from the typed
  `repo` fixture and from `fetch-pinned.test.ts`.
- Remove `tags` from the fixtures in `pins.test.ts`,
  `Projects.empty.test.tsx`, `links.test.tsx` and Beta in
  `Projects.test.tsx`. Keep `tags: ['t']` on Alpha in
  `Projects.test.tsx`, with a one-line comment. It makes "renders no
  tags on the pins" mean something (AC4). `vi.mock` is untyped, so it
  is no type error.

Evidence: `grep -n "Tags are the repo topics" README.md` is empty.

### T2 (PR 2, branch `chore/single-test-build`, depends on: none)

Files: `.github/workflows/ci.yml`, `scripts/workflows.test.ts`,
`README.md`.

Tests first, in `scripts/workflows.test.ts`:
- No line matches `/^\s*run: npm run build\s*$/m` in `ci.yml` (AC5).
  Red today.
- The Unit tests step runs `npm test` (AC5). Green guard.
- `package.json` has `"pretest": "npm run build"` (AC5). Green guard.

### T3 (PR 2, same branch, depends on: T2)

Files: `vite.config.ts`.

A removal with no behavior change, so no test can fail first.
Evidence instead: save the sorted output of
`npx vitest list --filesOnly` before and after, and show that `diff`
prints nothing (AC6). Put the file count in the commit body.

### T4 (PR 3, branch `chore/navbar-section-grounds`, depends on: none)

Files: `src/components/Navbar.tsx`,
`src/components/Navbar.test.tsx`, `README.md`.

Tests first, in `Navbar.test.tsx`. Render the Navbar and `<main>` as
siblings in one tree, `render(<><Navbar /><main>...</main></>)`. In
jsdom every top is 0 and the offset is 8, so the last section in
`<main>` wins.
- One section `extra` with `data-ground="teal"`: the `<nav>` has
  `data-ground="teal"`. Red today, because `extra` is not in
  `groundIds`.
- Sections `a` (amber) and `b` (teal): the `<nav>` has teal.
- A teal section in `<main>` and an ink section after `<main>`: the
  `<nav>` has teal.
- An empty `<main>`: the `<nav>` has no `data-ground`.

The two existing tests render the Navbar with no `<main>`. They stay
green unedited.

### T5 (PR 4, branch `chore/tidy-comments`, depends on: none)

Files: `src/lib/pins.ts`, `src/lib/pins.test.ts`.

Add one characterization case first, green on the old code:
`https://github.com/o/Alpha.git//` matches `Alpha` (AC9). Then
change `norm`. All cases stay green.

### T6 (PR 4, same branch, depends on: T5)

Files: `src/sections/Hero.tsx`, `src/sections/Experience.tsx`,
`src/App.tsx`, `scripts/check-limits.sh`.

Comments only. No test reads them. Lint, build, the full suite and
`check:limits` are the check.

## PR breakdown

| PR | Branch | Tasks | Concern |
|----|--------|-------|---------|
| 1 | `chore/drop-pin-tags` | T1 | Dead pin data |
| 2 | `chore/single-test-build` | T2, T3 | Repeated test setup |
| 3 | `chore/navbar-section-grounds` | T4 | Hand-kept list |
| 4 | `chore/tidy-comments` | T5, T6 | Code that restates itself |

PR 1 also carries this plan. T1 and T5 both edit `pins.test.ts`, in
different lines, and the merge is clean in any order.

## Test plan

| AC | Test |
|----|------|
| AC1, AC2, AC3 | New cases in `scripts/pinned.test.ts` |
| AC4 | Existing `Projects.test.tsx` and `links.test.tsx` |
| AC5 | New cases in `scripts/workflows.test.ts` |
| AC6 | `vitest list` diff, in the T3 commit body |
| AC7 | Four new cases in `Navbar.test.tsx` |
| AC8 | Existing e2e `nav.spec.ts` ground cases |
| AC9 | Existing `pins.test.ts` plus one new case |
| AC10 | Main agent greps and reads each docs diff |
| AC11 | Main agent runs every check per branch and merged |

The e2e ground cases are the only guard for the real six-section
order, because the unit tests use made-up sections.

Dev agents do not run e2e tests. The Playwright server uses port
4173 and reuses a running server, so parallel runs can test the
wrong build. The main agent runs e2e on each branch, one at a time.

## Risks

- The next deploy regenerates `projects.ts`. After PR 1 it has the
  same shape as the committed file, so the diff stays empty.
- A deploy of `main` before PR 1 merges still writes `tags`. The site
  ignores them, so nothing breaks.
- In CI, a build failure now shows under the "Unit tests" step name.
  The log still shows the `tsc` or Vite error first.
- `main > section[id]` misses a section placed outside `<main>`. All
  six sections are direct children of `<main>` today. The README
  says to place a new one there.
- The one-regex `norm` turns `x/.git` and `x/.git/` into `x/`, where
  the old one gave `x`. GitHub never produces those URLs.

## Rollback

Each PR is a few commits on its own branch. Revert the merge commit
of the PR that breaks. The PRs do not depend on each other.

## Review log

Three Sonnet reviewers checked the plan: correctness, tests and TDD,
and docs with structure. No blockers. Changes made:

- The plan lives on the PR 1 branch only. Copies on four branches
  drift once the later sections are filled in.
- The AC3 equality check passes today, so it is not a red test. A
  "no `tags` in the file" case is the red test, and equality stays
  as a guard.
- Alpha keeps `tags: ['t']`, or "renders no tags" proves nothing.
- The hostile round-trip case keeps `nasty` in five fields.
- The CI check matches `run:` lines only, and it also asserts the
  Unit tests step. A deleted step passes a "no build" check alone.
- The Navbar reads the sections on each update, not once, so a late
  section counts. Three more cases cover order, sections outside
  `<main>`, and no sections.
- T3 records a file-list diff, not only counts.
- T5 adds a `.git//` case, and the risk list adds `x/.git/`.
- Added doc edits: README lines 309 and 344, the README navbar text,
  the `ci.yml` comment, and the `App.tsx` header claim.

Rejected: none.

## Verification

To be filled in after Phase 4.

## The four questions

To be filled in after Phase 4.
