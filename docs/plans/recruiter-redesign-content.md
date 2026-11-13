# Content — recruiter redesign

The exact text the site shows. Every line comes from one of three
sources Michael supplied: his resume (R), his public LinkedIn
profile (L), or text already on the site (S). Copy it verbatim.
`**x**` marks emphasis, taken from the bold runs in the resume.
Nothing here may be reworded, extended, or added to by a dev agent.
No other person is named anywhere on the site. In data files each
string is a single line of text: join the wrapped lines below with
one space. Allowed normalisations from the resume: `~` for the
approximate sign, abbreviated months, `React` for React.js, `REST
APIs` for RESTful APIs, a comma in the school name.

## Hero

- Name: `Michael Huang` (S)
- Role: `Software Engineer` (S, unchanged)
- Summary: `Applied AI engineer — multi-agent systems and LLM
  infrastructure.` (S, unchanged)
- Now (R): `Now: Contract AI Engineer at Intuit Credit Karma in
  Oakland, CA. Built an AI code review agent that reviews about 70
  pull requests a day.`
- Links, in order: Resume, GitHub, LinkedIn, Email.

## Experience (R)

### credit-karma

- role: `Contract AI Engineer`
- company: `Intuit Credit Karma`
- period: `Apr 2026 — Present`
- location: `Oakland, CA`
- highlights:
  1. `Built an AI code review agent pairing LLMs with static
     analysis (AST parsing, call graphs) and context engineering,
     reviewing **~70 PRs/day** across **3 repos** and catching
     **600+ issues**`
  2. `Built usage telemetry for internal AI tooling on Google
     Cloud, tracking **~15,000** AI workflow runs per day (**~30**
     per user)`
  3. `Maintain an internal marketplace of AI workflows used by
     **~500** non-technical employees and streamline their
     onboarding to AI tools`

### dynamic-experts

- role: `Contract AI Engineer`
- company: `Dynamic Experts`
- period: `Dec 2025 — Jan 2026`
- location: `Remote`
- highlights:
  1. `Built a production-grade MCP (Model Context Protocol) server
     using Gemini deep-research, integrating Gemini 2.5 Pro with
     markdown sanitization and automated citation handling`
  2. `Built async polling architecture with **90-minute timeout
     handling** to support long-running inference tasks (**60+
     minutes**)`
  3. `Delivered a fully documented codebase with **157 unit
     tests** (Vitest)`

### solidigm

- role: `Automation and Product Engineering Intern`
- company: `Solidigm (Formerly Intel NAND)`
- period: `Jun 2022 — Aug 2023`
- location: `Folsom, CA`
- highlights:
  1. `Migrated legacy Python 2.7 automation frameworks to Python
     3.x, modernizing the codebase for **600+ production-line
     tests** and reducing false-positive failures by **~30%**`
  2. `Developed automation scripts that increased test coverage,
     saving the engineering team approximately **8 hours of manual
     verification per SKU** during testing cycles`
  3. `Triaged and fixed failing test tickets across the production
     line, identifying root causes in both test scripts and
     hardware setup`

The old `hackathons` entry leaves Experience; see Hackathons.

## Projects section order

Hackathons first (the AI work), then featured projects, then
"Also on GitHub".

## Hackathons (R, L)

- heading: `Hackathons`
- lede (R): `Second place at three hackathons.`
- takeaway (L, his own words, first person, plain paragraph):
  `My biggest lesson from these hackathons so far: clarity wins.
  Simple idea, strong execution, clear story.`

Entries in resume order. `place` is always `2nd`.

1. id `claude-code-hack-day` — event `Claude Code Hack Day @ AWS`
   — detail `Jan 2026, of 25 teams` — project `SkepticScript` —
   text: `A real-time speech fact-checker. As technical lead I
   owned the orchestration of four microservices and built a JSON
   Schema validation layer with Gemini so live transcription could
   feed the verification engine without breaking the UI.` —
   repoUrl `https://github.com/IsMichaelHuang/live-fact-checker`
2. id `before-the-ballot` — event `Before the Ballot` — detail
   `Jan 2026` — project `SkepticScript, rebuilt` — text: `Rebuilt
   to counter election misinformation: Gemini search grounding
   pulls live sources and flags contradictions as claims are made.
   Shipped a fully working demo in a 5-hour sprint.`
3. id `lovable-vapi` — event `Lovable × Vapi` — no detail —
   project `CareLink` — text: `Nurses log quick daily updates;
   families call a 24/7 AI care assistant for real-time updates on
   a loved one or to schedule a callback with a nurse.`

## Featured projects

`stack` is a list; each item is one technology.

### budget-tracker (R) — no link; the repository is not public

- title: `BudgetTracker`
- stack: `React 19`, `TypeScript`, `Node.js`, `Express`,
  `PostgreSQL`, `JWT`, `Vitest`
- highlights:
  1. `Built a full-stack budget management app with JWT
     authentication, expense tracking, and a visual spending
     dashboard with dark/light mode toggle`
  2. `Designed a REST API with Express and PostgreSQL, enforcing
     per-user authorization on every query and zod input
     validation`
  3. `Migrated the data layer from MongoDB to PostgreSQL, backed
     by **249** Vitest and Supertest tests`

### resume-builder (R)

- title: `Modular Resume Build System`
- stack: `Python`, `LaTeX`, `pytest`
- repoUrl: `https://github.com/IsMichaelHuang/resumeBuilder`
- highlights:
  1. `Built a Python build pipeline that assembles tailored
     single-page resumes from shared LaTeX snippets and
     version-specific content, outputting compiled PDFs to a clean
     output directory`
  2. `Implemented **.env secret injection** to keep personal info
     out of version control, using a custom {{PLACEHOLDER}}
     templating system with no external dependencies`
  3. `Wrote **61 pytest tests** covering env loading, template
     injection, snippet assembly, document structure, and config
     integrity`

### light-commands (L, shortened; the cited authors are omitted)

- title: `Laser-Based Audio Injection ("Light Commands")`
- stack: `Hardware security research`, `Arduino`, `3D printing`
- period: `Jan 2025 — Jun 2025`
- highlights:
  1. `Replicated the published "Light Commands" attack,
     engineering a portable device capable of injecting malicious
     audio commands into MEMS microphones via modulated laser
     light`

## Also on GitHub

The generated pins from `src/data/projects.ts`, minus any whose
`repoUrl` is already a featured project or hackathon `repoUrl`.
Heading: `Also on GitHub`. Hidden when nothing is left.

## About

Bio: the three existing paragraphs, unchanged (S).

### Education (R, L)

- school: `California Polytechnic State University, San Luis
  Obispo`
- degree: `Bachelor of Science in Computer Science, Minor in
  Philosophy`
- detail: `Graduated Aug 2025`
- honor: `Dean's List — Fall 2024 & Spring 2025 (Senior Year)`
- certification: `AWS Academy Cloud Security Foundations` —
  `Amazon Web Services, Dec 2024`

### Skills (R; AI/ML first, otherwise resume order)

- AI/ML: `LLMs, Agent Orchestration, Multi-Agent Systems, MCP,
  Claude, Gemini, PyTorch, Scikit-learn`
- Languages: `Python, TypeScript, JavaScript (ES6+), C/C++, SQL`
- Web: `React, Node.js, Express, PostgreSQL, MongoDB, REST APIs,
  HTML5, CSS3`
- Infrastructure: `GCP (BigQuery, GCS), Docker, Kubernetes/k3s,
  Redis, nginx, Uvicorn, CI/CD`
- Tools: `Git, Linux, Vitest, pytest, Firecrawl, Jira, Confluence,
  Agile/Scrum`

## Contact

Unchanged (S).

## Metadata

- title, JSON-LD, `<noscript>` block: unchanged.
- description: `Michael Huang is a software engineer in Oakland, CA
  building applied AI: multi-agent systems and LLM infrastructure.
  Now at Intuit Credit Karma.`
- og and twitter description: `Applied AI engineer: multi-agent
  systems and LLM infrastructure. Now at Intuit Credit Karma.`

## Resume file

`public/resume.pdf` is replaced by the resume Michael supplied on
12 Nov 2026 (already copied in by the main agent).
