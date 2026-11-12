import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

const script = resolve('scripts/check-limits.sh')
let dir: string

function put(name: string, text: string) {
  const path = join(dir, name)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, text)
  execFileSync('git', ['add', name], { cwd: dir })
}

function run() {
  const r = spawnSync('bash', [script, dir], { encoding: 'utf8' })
  return { out: r.stdout + r.stderr, code: r.status }
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'limits-'))
  execFileSync('git', ['init', '-q'], { cwd: dir })
})
afterEach(() => rmSync(dir, { recursive: true, force: true }))

describe('check-limits.sh', () => {
  it('prints nothing for a compliant repo', () => {
    put('a.txt', `${'x'.repeat(80)}\n— ${'y'.repeat(78)}\n`)
    expect(run()).toEqual({ out: '', code: 0 })
  })

  it('flags an 81-column line as WIDE', () => {
    put('a.txt', `ok\n${'x'.repeat(81)}\n`)
    expect(run()).toEqual({ out: 'WIDE a.txt:2\n', code: 1 })
  })

  it('flags a 401-line file as LONG', () => {
    put('b.txt', 'x\n'.repeat(401))
    expect(run()).toEqual({ out: 'LONG b.txt (401)\n', code: 1 })
  })

  it('ignores exempt paths', () => {
    const wide = `${'x'.repeat(200)}\n`
    put('package-lock.json', wide)
    put('public/p.svg', wide)
    put('src/data/projects.ts', wide)
    expect(run()).toEqual({ out: '', code: 0 })
  })
})
