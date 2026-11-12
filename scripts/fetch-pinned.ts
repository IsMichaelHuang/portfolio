// Build-time job: GitHub pinned repos -> src/data/projects.ts.
// Runs under Node's native type stripping: `node scripts/fetch-pinned.ts`.
// Needs GITHUB_TOKEN (the Actions token in CI, a PAT locally).
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  QUERY,
  buildProjectsFile,
  selectRepos,
  toProject,
  type GitHubRepo,
} from './pinned.ts'
import type { Project } from '../src/data/projects.ts'

const here = dirname(fileURLToPath(import.meta.url))
const OUT = join(here, '..', 'src', 'data', 'projects.ts')

interface Deps {
  env: Record<string, string | undefined>
  fetchFn: typeof fetch
  writeFile: (path: string, content: string) => void
  log: (...args: unknown[]) => void
}

const short = (s: unknown) => String(s).slice(0, 200)

export async function run({ env, fetchFn, writeFile, log }: Deps) {
  const token = env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN is not set')

  log('Fetching pinned repos from GitHub...')
  const res = await fetchFn('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: QUERY }),
  })
  if (!res.ok) throw new Error(`GitHub API responded with ${res.status}`)

  const json = await res.json()
  if (json.errors) {
    throw new Error(`GraphQL error: ${short(json.errors[0]?.message)}`)
  }
  const nodes: (GitHubRepo | null)[] | undefined =
    json.data?.user?.pinnedItems?.nodes
  if (!nodes) throw new Error('GitHub returned no pinned items')

  const projects = selectRepos(nodes)
    .map(toProject)
    .filter((p): p is Project => p !== null)
  if (projects.length === 0) throw new Error('No usable pinned repos')

  writeFile(OUT, buildProjectsFile(projects))
  log(`Wrote ${projects.length} project(s) to ${OUT}`)
}

const direct =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (direct) {
  const deps = {
    env: process.env,
    fetchFn: fetch,
    writeFile: writeFileSync,
    log: console.log,
  }
  run(deps).catch((err) => {
    console.error(err instanceof Error ? err.message : short(err))
    process.exit(1)
  })
}
