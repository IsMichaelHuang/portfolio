/**
 * Project Data
 *
 * Typed array of project entries consumed by the Projects section.
 * Adding a new project means appending an object to the array below —
 * no JSX or style changes needed.
 *
 * The Project interface enforces a consistent shape across all entries.
 * Both repoUrl and liveUrl are optional to accommodate proprietary
 * or in-progress work that may not have public links.
 */

export interface Project {
  /** Unique identifier, used as the React key when rendering the list */
  id: string;
  /** Project name displayed as the card heading */
  title: string;
  /** 1-2 sentence summary of what the project does */
  description: string;
  /** Technologies, frameworks, or domains (rendered as tags/pills) */
  tags: string[];
  /** Link to source code (optional — omit for proprietary work) */
  repoUrl?: string;
  /** Link to live/deployed project (optional — omit if not deployed) */
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    id: "placeholder-1",
    title: "Project One",
    description:
      "A short description of what this project does and why it matters.",
    tags: ["React", "TypeScript", "Vite"],
    repoUrl: "https://github.com",
  },
  {
    id: "placeholder-2",
    title: "Project Two",
    description:
      "Another project description. Replace with your actual projects.",
    tags: ["Python", "FastAPI", "LLM"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com",
  },
];
