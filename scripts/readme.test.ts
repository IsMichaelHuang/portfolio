import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const readme = readFileSync('README.md', 'utf8')

describe('README', () => {
  it.each(Object.keys(pkg.scripts))('documents script %s', (key) => {
    // Boundary so "test" is not satisfied by "npm run test:e2e".
    const run = new RegExp(`npm run ${key}(?![\\w:-])`)
    const documented =
      run.test(readme) || (key === 'test' && /npm test(?![\w:-])/.test(readme))
    expect(documented).toBe(true)
  })
})
