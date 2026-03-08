/**
 * Experience Data
 *
 * Typed array of work experience entries consumed by the Experience section.
 * Adding a new role means appending an object to the array below —
 * no JSX or style changes needed.
 *
 * Entries are rendered in array order, so list them in reverse
 * chronological order (most recent first).
 */

export interface Experience {
  /** Unique identifier, used as the React key when rendering the list */
  id: string;
  /** Job title / role name */
  role: string;
  /** Company or organization name */
  company: string;
  /** Time period (e.g. "Jan 2024 — Present" or "2022 — 2023") */
  period: string;
  /** Bullet points describing what you did — each string is one bullet */
  highlights: string[];
}

export const experience: Experience[] = [
  {
    id: "dynamic-experts",
    role: "Contract AI Engineer",
    company: "Dynamic Experts",
    period: "Dec 2025 — Jan 2026",
    highlights: [
      "Architected a production-grade MCP server to expose deep-research capabilities, integrating Gemini 2.5 Pro with markdown sanitization and automated citation handling",
      "Delivered a fully documented, production-ready codebase with 157 unit tests (Vitest), ensuring seamless handoff to the client engineering team",
      "Optimized async polling architecture with 90-minute timeout handling to support long-running inference tasks (60+ minutes), solving critical timeout issues in standard HTTP request flows",
    ],
  },
  {
    id: "solidigm",
    role: "Automation and Product Engineering Intern",
    company: "Solidigm (Formerly Intel NAND)",
    period: "Jun 2022 — Aug 2023",
    highlights: [
      "Migrated legacy Python 2.7 automation frameworks to Python 3.x, modernizing the codebase for 600+ production-line tests and significantly reducing false-positive failures",
      "Engineered end-to-end automation scripts that increased test coverage, saving the engineering team approximately 8 hours of manual verification per SKU during testing cycles",
      "Performed root cause analysis on non-product failures, implementing patch fixes that improved overall testing stability and reduced infrastructure downtime",
    ],
  },
];
