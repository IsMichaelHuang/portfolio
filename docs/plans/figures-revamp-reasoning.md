# Reasoning ledger — Figures revamp

Nine steps, in order, each from a measured or computed value to one
decision. Plan: `figures-revamp.md`.

## 1. Intent
Engine: intent read of the brief; lightness 0.60 (light) from "clarity wins:
  simple idea"; technicality 0.73; formality 0.68; expressiveness 0.38
Decision: accept light, technical, formal; reject restrained expression, set
  one display figure per view at 5x body or more
Because: direction notes, need 1 (proof number in the first view) and need 4
  (recognisable from one screenshot)
Check: capture at 1440 and 390; e2e F2 asserts the figure is at least five
  times the body size

## 2. Color
Engine: typical palette #455479 to #b7ead7 and a house-palette warning; logo
  sample red #e1494d, magenta #cf347f, amber #eca358, teal #47c2c0, indigo
  #6162c3
Decision: canvas white; two chromatic grounds, amber #eca358 (hero) and teal
  #47c2c0 (hackathons); ink #14110f for text and for the closing ground; zero
  accent hues
Because: the logo mark is the only brand asset; amber and teal are its two
  hues that carry ink text above 8:1
Check: audit color dimension; e2e F4 computed section grounds

## 3. Contrast
Engine: contrast axis 0.61 (strong); computed ink on white 18.8, on amber 8.9,
  on teal 8.7; muted #5c5650 on white 7.2
Decision: AA for every pair, 7:1 or more for body text on every ground; muted
  text on white only, ink replaces it on amber and teal
Because: muted on amber computes to 3.4:1 and on teal to 3.4:1, under the
  4.5:1 floor
Check: src/contrast.test.ts pairs; axe at 320, 375, 1280

## 4. Brightness and depth
Engine: light theme; baseline used translucent white surfaces on #0a0a0f
Decision: two lightness levels only, white and ink; no surface fills, no
  shadows; separation by 1px ink rules; the brightest area in a view is its
  ground
Because: baseline capture counted 0 shadows and the audit flagged the dark-
  slate developer default
Check: capture noise line reports 0 shadows; e2e F7 asserts pins have no fill
  or border

## 5. Typography scale
Engine: suggested ratio 1.333 on 16px with display clamp 37 to 67px; baseline
  rendered 13 sizes, largest 76px on 20px body
Decision: Jost 600 for figures and headings, Source Serif 4 for prose; body
  18px, meta 16px, lead 22px, heading 28px, statement clamp 26 to 44px, three
  figure sizes up to 720px; nine sizes at most
Because: both faces are already self-hosted, so no new request; the engine's
  67px display is the default to beat (need 4)
Check: e2e type.spec.ts counts distinct rendered sizes; fonts.spec.ts stays
  unchanged

## 6. Rhythm
Engine: suggested 8px base with 144px sections; baseline had 14 spacing values
  and 5 sections with equal padding
Decision: three levels, 16px inside a group, 56px between groups, 144px
  between sections (88px below 600px); ratio 9:1 section to component
Because: art-direction reference levels are 8 to 24, 48 to 96, 128 to 200px,
  each about 3x apart
Check: tokens in src/index.css; e2e fold.spec.ts reads section padding

## 7. Negative space
Engine: baseline first-view ink 29% with 9 actions and 31 text blocks;
  suggested band 22 to 44%
Decision: 1 focal point per view, the figure; first-view ink 22 to 44%;
  removed the starfield, hero logo and glow, role line, "Now:" line,
  pills, topic tags, card boxes, and the visible per-entry "2nd"
Because: each removed element repeated another or served no ranked need
Check: capture first-view ink and competing-focal-points findings at 1440 and
  390

## 8. Motion
Engine: motion profile composed, 664ms, power2.out; baseline 0 moving elements
  per 1000px
Decision: composed; figures of 10 or more count up once in under 1000ms on
  entering view; nav ground eases between section colours; one CSS-sticky set
  piece in Hackathons; no inertia scroll, no page transitions; reduced motion
  shows final values at first paint
Because: his work counts tests (157, 249, 61), so the page moves like a test
  run finishing
Check: e2e motion.spec.ts records every figure text under reduced motion;
  hero.spec.ts awaits all animations finishing

## 9. Voice and words
Engine: copy score 100; one generic-copy flag; 13 em dashes in resume text
Decision: keep resume copy verbatim; add two strings only, the hero caption
  and the Solidigm unit; lead action wording "Resume"; reading level grade 9;
  em dashes in dates and the bio stay as written
Because: the verbatim-copy rule in recruiter-redesign-content.md; every figure
  is a number the resume already bolds
Check: src/data/figures.test.ts ties each figure to a bold run; section copy
  oracles stay unchanged
