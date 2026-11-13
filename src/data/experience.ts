/**
 * Experience Data
 *
 * Typed array of work experience entries consumed by the Experience section.
 * Adding a new role means appending an object to the array below —
 * no JSX or style changes needed.
 *
 * Entries are rendered in array order, so list them in reverse
 * chronological order (most recent first). Wrap the numbers worth
 * noticing in a bullet with `**double asterisks**`; the section
 * renders them in bold (see lib/emphasis.tsx).
 */

export interface Experience {
  /** Unique identifier, used as the React key when rendering the list */
  id: string;
  /** Job title / role name */
  role: string;
  /** Employer, the prominent line of each entry */
  company: string;
  /** Time period (e.g. "Jan 2024 — Present" or "2022 — 2023") */
  period: string;
  /** Where the role was based (e.g. "Oakland, CA" or "Remote") */
  location: string;
  /** Bullet points describing what you did — each string is one bullet */
  highlights: string[];
}

export const experience: Experience[] = [
  {
    id: "credit-karma",
    role: "Contract AI Engineer",
    company: "Intuit Credit Karma",
    period: "Apr 2026 — Present",
    location: "Oakland, CA",
    highlights: [
      "Built an AI code review agent pairing LLMs with static analysis "
        + "(AST parsing, call graphs) and context engineering, reviewing "
        + "**~70 PRs/day** across **3 repos** and catching **600+ issues**",
      "Built usage telemetry for internal AI tooling on Google Cloud, "
        + "tracking **~15,000** AI workflow runs per day (**~30** per user)",
      "Maintain an internal marketplace of AI workflows used by "
        + "**~500** non-technical employees and streamline their "
        + "onboarding to AI tools",
    ],
  },
  {
    id: "dynamic-experts",
    role: "Contract AI Engineer",
    company: "Dynamic Experts",
    period: "Dec 2025 — Jan 2026",
    location: "Remote",
    highlights: [
      "Built a production-grade MCP (Model Context Protocol) server "
        + "using Gemini deep-research, integrating Gemini 2.5 Pro with "
        + "markdown sanitization and automated citation handling",
      "Built async polling architecture with **90-minute timeout "
        + "handling** to support long-running inference tasks (**60+ "
        + "minutes**)",
      "Delivered a fully documented codebase with **157 unit tests** "
        + "(Vitest)",
    ],
  },
  {
    id: "solidigm",
    role: "Automation and Product Engineering Intern",
    company: "Solidigm (Formerly Intel NAND)",
    period: "Jun 2022 — Aug 2023",
    location: "Folsom, CA",
    highlights: [
      "Migrated legacy Python 2.7 automation frameworks to Python 3.x, "
        + "modernizing the codebase for **600+ production-line tests** "
        + "and reducing false-positive failures by **~30%**",
      "Developed automation scripts that increased test coverage, "
        + "saving the engineering team approximately **8 hours of manual "
        + "verification per SKU** during testing cycles",
      "Triaged and fixed failing test tickets across the production "
        + "line, identifying root causes in both test scripts and "
        + "hardware setup",
    ],
  },
];
