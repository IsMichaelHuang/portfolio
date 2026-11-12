import { existsSync, readFileSync } from 'node:fs'

const read = (f: string) =>
  existsSync(f) ? readFileSync(f, 'utf8') : ''
const ci = read('.github/workflows/ci.yml')
const deploy = read('.github/workflows/deploy.yml')

// Text of one top-level job: from "  name:" to the next job.
const job = (src: string, name: string) => {
  const m = src.match(new RegExp(`^  ${name}:\\n(?:(?:   |$).*\\n?)*`, 'm'))
  return m ? m[0] : ''
}

describe('ci.yml', () => {
  it('exists', () => expect(ci).not.toBe(''))
  it('runs on pull_request and workflow_call', () => {
    expect(ci).toMatch(/^ {2}pull_request:/m)
    expect(ci).toMatch(/^ {2}workflow_call:/m)
  })
  it('never uses pull_request_target', () => {
    expect(ci).not.toContain('pull_request_target')
  })
  it('only grants contents: read', () => {
    const perms = [...ci.matchAll(/^\s*([a-z-]+): (read|write|none)$/gm)]
    expect(perms.map((m) => m[0].trim())).toEqual(['contents: read'])
  })
})

describe('deploy.yml', () => {
  it('has no pull_request trigger', () => {
    expect(deploy).not.toMatch(/pull_request/)
  })
  it('calls ci.yml and deploy needs it', () => {
    expect(job(deploy, 'ci')).toContain('uses: ./.github/workflows/ci.yml')
    expect(job(deploy, 'deploy')).toMatch(/needs: ci\b/)
  })
  it('grants actions: write only in keepalive', () => {
    expect(job(deploy, 'keepalive')).toContain('actions: write')
    expect(deploy.match(/actions: write/g)).toHaveLength(1)
  })
  it('grants pages and id-token write only in deploy', () => {
    expect(job(deploy, 'deploy')).toContain('pages: write')
    expect(job(deploy, 'deploy')).toContain('id-token: write')
    expect(deploy.match(/pages: write/g)).toHaveLength(1)
    expect(deploy.match(/id-token: write/g)).toHaveLength(1)
  })
  it('keepalive runs on schedule and needs nothing', () => {
    const k = job(deploy, 'keepalive')
    expect(k).toContain("github.event_name == 'schedule'")
    expect(k).not.toContain('needs:')
    expect(k).not.toContain('checkout')
  })
  it('does not use npx tsx', () => {
    expect(deploy).not.toContain('npx tsx')
  })
})

describe('action pins', () => {
  it.each([
    ['ci.yml', ci],
    ['deploy.yml', deploy],
  ])('%s pins third-party actions to a 40-char SHA', (_n, src) => {
    // Join YAML double-quote line continuations first.
    const text = src
      .replace(/\\\n\s*/g, '')
      .replace(/uses: "(.*)"/g, 'uses: $1')
    const uses = [...text.matchAll(/^\s*(?:- )?uses: (\S+)/gm)].map(
      (m) => m[1],
    )
    for (const u of uses.filter((x) => !x.startsWith('./'))) {
      expect(u).toMatch(/^[\w.-]+\/[\w./-]+@[0-9a-f]{40}$/)
    }
  })
})
