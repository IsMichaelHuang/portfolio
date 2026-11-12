import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const readme = readFileSync('README.md', 'utf8')

// pre/post hooks run implicitly with their base script.
const hook = (k: string) => {
  const base = k.replace(/^(pre|post)/, '')
  return base !== k && base in pkg.scripts
}
const runnable = Object.keys(pkg.scripts).filter((k) => !hook(k))

describe('README', () => {
  it.each(runnable)('documents script %s', (key) => {
    // Boundary so "test" is not satisfied by "npm run test:e2e".
    const run = new RegExp(`npm run ${key}(?![\\w:-])`)
    const documented =
      run.test(readme) || (key === 'test' && /npm test(?![\w:-])/.test(readme))
    expect(documented).toBe(true)
  })
})
