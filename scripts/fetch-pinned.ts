/**
 * Fetch Pinned Repos Script
 *
 * Build-time data pipeline that queries the GitHub GraphQL API for
 * the user's pinned repositories and writes them to src/data/projects.ts
 * in the exact typed format the Projects section expects.
 *
 * This keeps project data in sync with GitHub while the site remains
 * fully static — no client-side API calls, no runtime secrets.
 *
 * Pipeline:
 *   GitHub Pinned Repos → GraphQL API → this script → projects.ts → Vite build
 *
 * Authentication:
 *   GitHub's GraphQL endpoint requires a Bearer token even for public
 *   data. In CI the auto-generated GITHUB_TOKEN covers this. Locally,
 *   pass a fine-grained PAT with public_repo read access:
 *     GITHUB_TOKEN=ghp_xxx npx tsx scripts/fetch-pinned.ts
 *
 * Usage:
 *   npx tsx scripts/fetch-pinned.ts
 *
 * Exit codes:
 *   0 — success, projects.ts written
 *   1 — API error, network failure, or malformed response
 */

import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * ESM equivalent of CommonJS __dirname.
 * import.meta.url gives the file:// URL of this module;
 * fileURLToPath converts it to an OS path, and dirname
 * strips the filename to yield the containing directory.
 */
const __dirname = dirname(fileURLToPath(import.meta.url));

/** GitHub username whose pinned repos are fetched */
const GITHUB_USERNAME = "IsMichaelHuang";

/**
 * GraphQL query for the GitHub User → pinnedItems connection.
 *
 * - first: 6  — GitHub allows a maximum of 6 pinned repos.
 * - types: REPOSITORY — excludes pinned gists.
 * - repositoryTopics — the "topics" labels set in repo settings;
 *   these become tag pills on the project card.
 * - homepageUrl — the "Website" field in repo settings;
 *   maps to the "Live" link on the project card.
 */
const query = `{
  user(login: "${GITHUB_USERNAME}") {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          description
          url
          homepageUrl
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
        }
      }
    }
  }
}`;

/**
 * Shape of a single repository node returned by the GraphQL query.
 * Matches the fields requested in the query above — if you add fields
 * to the query, extend this interface to match.
 */
interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  repositoryTopics: {
    nodes: { topic: { name: string } }[];
  };
}

/**
 * Sends the GraphQL query to GitHub's API and returns the raw repo nodes.
 *
 * Authentication: reads GITHUB_TOKEN from the environment. In GitHub
 * Actions this is the auto-generated workflow token (no setup needed).
 * Locally, pass a fine-grained PAT as an env var.
 *
 * Error handling:
 *   - Non-2xx HTTP status → throws with status code and response body
 *   - GraphQL-level errors  → throws with the error array from GitHub
 *   Both cases cause the script to exit with code 1 via the catch in main().
 */
async function fetchPinnedRepos(): Promise<GitHubRepo[]> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      /**
       * Bearer token authentication.
       * GitHub's GraphQL API requires auth even for public data,
       * unlike the REST API which allows unauthenticated reads.
       */
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`GitHub API responded with ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();

  /** GraphQL can return 200 OK with errors in the body — check for that */
  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data.user.pinnedItems.nodes;
}

/**
 * Converts a repo name like "resumeBuilder" or "my-project" into a
 * URL-safe, lowercase slug: "resumebuilder", "my-project".
 * Used as the React key (project.id) when rendering the list.
 */
function toKebabCase(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/**
 * Transforms an array of GitHub repo nodes into a complete TypeScript
 * source file that exports a typed Project[] array.
 *
 * The generated file includes:
 *   - A file-level doc comment warning against manual edits
 *   - The Project interface (duplicated here so the generated file
 *     is self-contained and doesn't import from elsewhere)
 *   - The projects array with one entry per pinned repo
 *
 * Field mapping:
 *   GitHub repo name        → id (kebab-cased), title (Title Cased)
 *   GitHub description      → description (falls back to placeholder)
 *   GitHub topics            → tags[] (rendered as pills)
 *   GitHub repo URL          → repoUrl ("Code" link)
 *   GitHub homepage URL      → liveUrl ("Live" link, omitted if empty)
 */
function buildProjectsFile(repos: GitHubRepo[]): string {
  const entries = repos.map((repo) => {
    const tags = repo.repositoryTopics.nodes.map((n) => n.topic.name);
    const id = toKebabCase(repo.name);
    /** Convert "my-project_name" → "My Project Name" for display */
    const title = repo.name
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const description = repo.description ?? "No description provided.";

    /**
     * Build one object literal as a raw string.
     * Double quotes in descriptions are escaped to prevent syntax errors
     * in the generated file.
     */
    let entry = `  {\n`;
    entry += `    id: "${id}",\n`;
    entry += `    title: "${title}",\n`;
    entry += `    description:\n      "${description.replace(/"/g, '\\"')}",\n`;
    entry += `    tags: [${tags.map((t) => `"${t}"`).join(", ")}],\n`;
    entry += `    repoUrl: "${repo.url}",\n`;
    if (repo.homepageUrl) {
      entry += `    liveUrl: "${repo.homepageUrl}",\n`;
    }
    entry += `  }`;
    return entry;
  });

  return `/**
 * Project Data — Auto-generated
 *
 * This file is written by scripts/fetch-pinned.ts at build time.
 * It pulls pinned repositories from GitHub so the portfolio stays
 * in sync without manual updates.
 *
 * DO NOT EDIT MANUALLY — changes will be overwritten on next build.
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
}

export const projects: Project[] = [
${entries.join(",\n")},
];
`;
}

/**
 * Entry point — orchestrates fetch → transform → write.
 *
 * Logs progress to stdout so CI output is easy to follow.
 * On any error the process exits with code 1, which causes the
 * GitHub Actions step to fail and prevents a broken build from deploying.
 */
async function main() {
  console.log("Fetching pinned repos from GitHub...");
  const repos = await fetchPinnedRepos();
  console.log(`Found ${repos.length} pinned repo(s).`);

  const content = buildProjectsFile(repos);
  const outPath = resolve(__dirname, "../src/data/projects.ts");
  writeFileSync(outPath, content);
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
