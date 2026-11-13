/**
 * Pins
 *
 * Pure helper behind "Also on GitHub": drops generated pins whose
 * repository is already shown as a hackathon or featured project.
 */

import type { Project } from "../data/projects";

const norm = (url: string) =>
  url
    .toLowerCase()
    .replace(/\/+$/, "")
    .replace(/\.git$/, "")
    .replace(/\/+$/, "");

/** Pins whose repoUrl matches none of `urls`; URL-less pins stay. */
export function remainingPins(projects: Project[], urls: string[]) {
  const seen = new Set(urls.map(norm));
  return projects.filter((p) => !p.repoUrl || !seen.has(norm(p.repoUrl)));
}
