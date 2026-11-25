import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { join, resolve } from 'node:path'
import { projects as generated } from '../src/data/projects.ts'
import {
  QUERY,
  buildProjectsFile,
  selectRepos,
  toProject,
  type GitHubRepo,
} from './pinned.ts'

const repo = (over: Partial<GitHubRepo> = {}): GitHubRepo => ({
  name: 'my-cool_repo',
  nameWithOwner: 'Someone/my-cool_repo',
  description: 'A thing',
  url: 'https://github.com/Someone/my-cool_repo',
  homepageUrl: null,
  ...over,
})

describe('toProject', () => {
  it('builds id from owner and name, and a title', () => {
    const p = toProject(repo())!
    expect(p.id).toBe('someone-my-cool-repo')
    expect(p.title).toBe('My Cool Repo')
    expect(p.repoUrl).toBe('https://github.com/Someone/my-cool_repo')
    expect(p.description).toBe('A thing')
  })

  it('makes ids unique across owners', () => {
    const a = toProject(repo({ nameWithOwner: 'A/x' }))!
    const b = toProject(repo({ nameWithOwner: 'B/x' }))!
    expect(a.id).not.toBe(b.id)
  })

  it('omits description when null', () => {
    expect(toProject(repo({ description: null }))).not.toHaveProperty(
      'description',
    )
  })

  it.each([
    ['javascript:alert(1)'],
    ['data:text/html,hi'],
    ['http://example.com'],
    ['not a url'],
  ])('drops unsafe homepage %s', (homepageUrl) => {
    expect(toProject(repo({ homepageUrl }))).not.toHaveProperty('liveUrl')
  })

  it('keeps an https homepage', () => {
    const p = toProject(repo({ homepageUrl: 'https://example.com/a' }))!
    expect(p.liveUrl).toBe('https://example.com/a')
  })

  it('returns null for a non-GitHub url', () => {
    expect(toProject(repo({ url: 'https://evil.com/x' }))).toBeNull()
    expect(toProject(repo({ url: 'javascript:alert(1)' }))).toBeNull()
  })
})

describe('tags are gone', () => {
  const file = readFileSync('src/data/projects.ts', 'utf8')

  it('toProject sets no tags', () => {
    expect(toProject(repo())).not.toHaveProperty('tags')
  })

  it('QUERY asks for no language or topics', () => {
    expect(QUERY).not.toContain('primaryLanguage')
    expect(QUERY).not.toContain('repositoryTopics')
  })

  // Field shapes only: a repo description may say "tags".
  it('projects.ts has no tags', () => {
    expect(file).not.toContain('"tags":')
    expect(file).not.toContain('tags: string[]')
  })

  // A local fetch-pinned run that is not reverted makes this fail.
  it('projects.ts matches buildProjectsFile(projects)', () => {
    expect(file).toBe(buildProjectsFile(generated))
  })
})

describe('selectRepos', () => {
  it('drops nulls and this portfolio, case-insensitively', () => {
    const keep = repo({ nameWithOwner: 'Other/portfolio' })
    const out = selectRepos([
      null,
      repo({ nameWithOwner: 'ismichaelhuang/PORTFOLIO' }),
      keep,
    ])
    expect(out).toEqual([keep])
  })
})

describe('buildProjectsFile', () => {
  it('round-trips hostile text through a real import', async () => {
    const nasty = 'q" b\\ n\n ${x} */ `t` // end'
    const projects = [
      {
        id: nasty,
        title: nasty,
        description: nasty,
        repoUrl: 'https://github.com/a/b?x=' + nasty,
        liveUrl: 'https://example.com/' + nasty,
      },
      { id: 'bare', title: 'Bare' },
    ]
    // Vite only imports inside the project root, so not os.tmpdir().
    mkdirSync('node_modules/.tmp', { recursive: true })
    const dir = mkdtempSync('node_modules/.tmp/pinned-')
    const file = join(dir, 'projects.ts')
    writeFileSync(file, buildProjectsFile(projects))
    try {
      const mod = await import(/* @vite-ignore */ resolve(file))
      expect(mod.projects).toEqual(projects)
    } finally {
      rmSync(dir, { recursive: true })
    }
  })
})
