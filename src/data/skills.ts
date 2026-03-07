/**
 * Skills Data
 *
 * Typed array of skill groups consumed by the About section.
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
    category: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "C", "C++", "SML/NJ"],
  },
  {
    category: "Frontend",
    items: ["React", "HTML5", "CSS3", "Vite"],
  },
  {
    category: "Backend & AI",
    items: ["Node.js", "FastAPI", "LLMs", "Multi-Agent Systems"],
  },
  {
    category: "Infrastructure",
    items: ["Docker", "Kubernetes", "Git"],
  },
];
