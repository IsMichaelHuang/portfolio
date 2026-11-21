# Direction — Figures revamp

The reasoning behind the revamp: the job, the ranked needs, the
facts, the measured baseline, and the three directions considered.
Michael picked direction 1, Figures. Plan: `figures-revamp.md`.

## The job

- Achieve: a recruiter who gives the page thirty seconds knows what
  Michael does now, what he shipped (with numbers), how to reach him.
- For: recruiters first, hiring engineers second.
- One action: open the resume. Email is the second.
- In five seconds: applied AI engineer, at Intuit Credit Karma, built
  an agent that reviews about 70 pull requests a day.
- Fixed: every fact comes from the resume, LinkedIn, or the site
  (`docs/plans/recruiter-redesign-content.md`); React, Vite, CSS
  Modules; self-hosted fonts, no third-party requests; the logo
  mark; WCAG 2.2 AA; the existing test suite.

## Needs, ranked

1. A recruiter needs to learn what he does now and one proof number,
   in the first view.
2. A recruiter needs the resume and email within reach from anywhere.
3. A hiring engineer needs the evidence of rigor (results, test
   counts) scannable in Experience and Projects.
4. A recruiter on their fortieth portfolio needs to remember this
   one from a single screenshot.
5. A reader needs to feel the way he works: clarity, "why before
   how", code that reads well after he has left the room.
6. A reader needs to see he ships under pressure: three second
   places, one demo built in a 5-hour sprint.

## Facts no one else has

- About 70 pull requests a day reviewed by his agent, across 3
  repos, 600+ issues caught.
- About 15,000 AI workflow runs tracked per day; a marketplace used
  by about 500 non-technical employees.
- 157 unit tests delivered; 90-minute timeout handling for 60+
  minute inference.
- 600+ production-line tests migrated; false positives down about
  30%; 8 hours of manual verification saved per SKU.
- 249 tests behind BudgetTracker; 61 pytest tests behind the resume
  builder. He counts his tests.
- Second place at three hackathons; one of 25 teams at AWS.
- Computer Science with a minor in Philosophy; his line: "always
  asking why before how".
- His words: "clarity wins. Simple idea, strong execution, clear
  story."
- A laser that injects audio commands into microphones.
- The mark holds a full spectrum (red `#e1494d`, magenta `#cf347f`,
  amber `#eca358`, teal `#47c2c0`, indigo `#6162c3`); the site uses
  none of it, only one blue.

## Baseline (measured on the current site)

- Audit: 0 blockers. Majors: the palette reads as the developer-tools
  default (near-black slate with electric blue); `::selection`
  contrast is 1.58:1.
- Capture: largest type 76px on 20px body; no large visual on a
  5652px page; visuals cover 2% of the first view; nothing moves on
  scroll; 13 font sizes; 9 actions in the first view; 6 targets
  under 24px.
- What works and must survive: the content and its order, the
  two-column ledger rows, the resume as lead action, the pinned
  repos pipeline, accessibility, the mark.

## The default to beat

Dark near-black page, centred logo and name, role line, a row of
outlined buttons, blue accent, sections of evenly spaced text. This
is the current site, and most developer portfolios.

Web research on live portfolios was not done for these notes.

## Three directions

### 1. Figures (chosen)

The resume already bolds its numbers; the page sets them at scale.
The first view is "~70" filling the viewport, captioned by what it
counts and who built it. Each role and project leads with its own
figure. Grounds come from the mark and change by section; light
overall.

- Need 1: the proof number is the first thing seen.
- Need 3: a figure heads every entry, so scanning is the layout.
- Need 4: no other portfolio opens on this number.
- Risk: the name is second in the first view, not first.

### 2. Orbit (keeps the night sky)

Keep the dark ground and the mark, and draw the mark's rings at
viewport scale: one orbit per role, the numbers as satellites, each
role in one of the mark's hues. The name is set large beside it.

- Need 1: name and role first; the numbers ride the orbits.
- Need 4: the opening is his own mark, enlarged and made of his data.
- Need 5: least direct; the diagram is atmosphere more than proof.
- Risk: stays closest to today, and to the dark developer look.

### 3. Why before how (quiet, editorial)

A white page in two inks, set in the serif. The first view is his
own line about asking why before how. Each section is headed by the
question a recruiter arrives with, answered in his facts, with
dates and figures in the margin.

- Need 1: the "now" answer is the first question, one scroll down.
- Need 5: the page itself reads the way he says he works.
- Need 4: distinct by voice, not by image.
- Risk: the calmest of the three; least visual.
