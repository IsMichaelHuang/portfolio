/**
 * Skills Data
 *
 * Typed array of skill groups rendered by About as a <dl>, in order.
 * Each group has a category label and a list of individual skills.
 *
 * Adding a new category or skill means editing this array —
 * no JSX or style changes needed.
 */

export interface SkillGroup {
  /** Category name displayed as the group heading */
  category: string;
  /** Individual skills within this category */
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    category: "AI/ML",
    items: [
      "LLMs",
      "Agent Orchestration",
      "Multi-Agent Systems",
      "MCP",
      "Claude",
      "Gemini",
      "PyTorch",
      "Scikit-learn",
    ],
  },
  {
    category: "Languages",
    items: ["Python", "TypeScript", "JavaScript (ES6+)", "C/C++", "SQL"],
  },
  {
    category: "Web",
    items: [
      "React",
      "Node.js",
      "Express",
      "PostgreSQL",
      "MongoDB",
      "REST APIs",
      "HTML5",
      "CSS3",
    ],
  },
  {
    category: "Infrastructure",
    items: [
      "GCP (BigQuery, GCS)",
      "Docker",
      "Kubernetes/k3s",
      "Redis",
      "nginx",
      "Uvicorn",
      "CI/CD",
    ],
  },
  {
    category: "Tools",
    items: [
      "Git",
      "Linux",
      "Vitest",
      "pytest",
      "Firecrawl",
      "Jira",
      "Confluence",
      "Agile/Scrum",
    ],
  },
];
