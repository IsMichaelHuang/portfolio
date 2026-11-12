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

  it('allows a SHA-pinned action line, which cannot be wrapped', () => {
    const sha = 'a'.repeat(40)
    const pin = `      - uses: actions/upload-pages-artifact@${sha} # v5.0.0`
    put('.github/workflows/x.yml', `${pin}\n`)
    expect(pin.length).toBeGreaterThan(80)
    expect(run()).toEqual({ out: '', code: 0 })
  })

  it('skips binary files wherever they live', () => {
    // A long run of bytes, then a NUL: wide if read as text.
    const bytes = Buffer.concat([
      Buffer.alloc(300, 0x41),
      Buffer.from([0x0a, 0x00, 0x01, 0xff, 0x0a]),
    ])
    put('src/assets/mark.webp', '')
    writeFileSync(join(dir, 'src/assets/mark.webp'), bytes)
    expect(run()).toEqual({ out: '', code: 0 })
  })

  it('ignores exempt paths', () => {
    const wide = `${'x'.repeat(200)}\n`
    put('package-lock.json', wide)
    put('public/p.svg', wide)
    put('src/data/projects.ts', wide)
    expect(run()).toEqual({ out: '', code: 0 })
  })
})
