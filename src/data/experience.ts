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
    id: "example-2",
    role: "Your Role",
    company: "Company Name",
    period: "Month Year — Present",
    highlights: [
      "Describe what you built or accomplished",
      "Quantify impact where possible (e.g. improved X by 30%)",
      "Mention key technologies used",
    ],
  },
  {
    id: "example-1",
    role: "Previous Role",
    company: "Previous Company",
    period: "Month Year — Month Year",
    highlights: [
      "Describe your responsibilities and achievements",
      "Focus on outcomes, not just duties",
    ],
  },
];
