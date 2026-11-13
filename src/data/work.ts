/**
 * Work Data
 *
 * Hackathons and featured projects shown in the Projects section.
 * Adding an entry means appending an object to the array below; no
 * JSX or style changes. Wrap the numbers worth noticing in a
 * highlight with `**double asterisks**` (see lib/emphasis.tsx).
 *
 * A `repoUrl` renders a "Code" link and removes the matching
 * repository from "Also on GitHub" (see lib/pins.ts). Leave it out
 * for work whose repository is not public.
 */

export interface Hackathon {
  /** Unique identifier, used as the React key */
  id: string;
  /** Finish, e.g. "2nd" */
  place: string;
  event: string;
  /** Date and field size, e.g. "Jan 2026, of 25 teams" */
  detail?: string;
  /** Name of what was built */
  project: string;
  text: string;
  repoUrl?: string;
}

export interface Featured {
  /** Unique identifier, used as the React key */
  id: string;
  title: string;
  /** One technology per item */
  stack: string[];
  period?: string;
  repoUrl?: string;
  highlights: string[];
}

export const hackathons: Hackathon[] = [
  {
    id: "claude-code-hack-day",
    place: "2nd",
    event: "Claude Code Hack Day @ AWS",
    detail: "Jan 2026, of 25 teams",
    project: "SkepticScript",
    text:
      "A real-time speech fact-checker. As technical lead I owned " +
      "the orchestration of four microservices and built a JSON " +
      "Schema validation layer with Gemini so live transcription " +
      "could feed the verification engine without breaking the UI.",
    repoUrl: "https://github.com/IsMichaelHuang/live-fact-checker",
  },
  {
    id: "before-the-ballot",
    place: "2nd",
    event: "Before the Ballot",
    detail: "Jan 2026",
    project: "SkepticScript, rebuilt",
    text:
      "Rebuilt to counter election misinformation: Gemini search " +
      "grounding pulls live sources and flags contradictions as " +
      "claims are made. Shipped a fully working demo in a 5-hour " +
      "sprint.",
  },
  {
    id: "lovable-vapi",
    place: "2nd",
    event: "Lovable × Vapi",
    project: "CareLink",
    text:
      "Nurses log quick daily updates; families call a 24/7 AI " +
      "care assistant for real-time updates on a loved one or to " +
      "schedule a callback with a nurse.",
  },
];

export const featured: Featured[] = [
  {
    id: "budget-tracker",
    title: "BudgetTracker",
    stack: [
      "React 19",
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "JWT",
      "Vitest",
    ],
    highlights: [
      "Built a full-stack budget management app with JWT " +
        "authentication, expense tracking, and a visual spending " +
        "dashboard with dark/light mode toggle",
      "Designed a REST API with Express and PostgreSQL, enforcing " +
        "per-user authorization on every query and zod input " +
        "validation",
      "Migrated the data layer from MongoDB to PostgreSQL, backed " +
        "by **249** Vitest and Supertest tests",
    ],
  },
  {
    id: "resume-builder",
    title: "Modular Resume Build System",
    stack: ["Python", "LaTeX", "pytest"],
    repoUrl: "https://github.com/IsMichaelHuang/resumeBuilder",
    highlights: [
      "Built a Python build pipeline that assembles tailored " +
        "single-page resumes from shared LaTeX snippets and " +
        "version-specific content, outputting compiled PDFs to a " +
        "clean output directory",
      "Implemented **.env secret injection** to keep personal info " +
        "out of version control, using a custom {{PLACEHOLDER}} " +
        "templating system with no external dependencies",
      "Wrote **61 pytest tests** covering env loading, template " +
        "injection, snippet assembly, document structure, and " +
        "config integrity",
    ],
  },
  {
    id: "light-commands",
    title: 'Laser-Based Audio Injection ("Light Commands")',
    stack: ["Hardware security research", "Arduino", "3D printing"],
    period: "Jan 2025 — Jun 2025",
    highlights: [
      'Replicated the published "Light Commands" attack, ' +
        "engineering a portable device capable of injecting " +
        "malicious audio commands into MEMS microphones via " +
        "modulated laser light",
    ],
  },
];
