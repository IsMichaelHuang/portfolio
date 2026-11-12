import { run } from './fetch-pinned.ts'

const TOKEN = 'ghp_SECRET_TOKEN_123'
const node = {
  name: 'x',
  nameWithOwner: 'Someone/x',
  description: 'd',
  url: 'https://github.com/Someone/x',
  homepageUrl: null,
  primaryLanguage: null,
  repositoryTopics: { nodes: [] },
}
const reply = (body: unknown, status = 200) =>
  Promise.resolve(
    new Response(JSON.stringify(body), { status }),
  ) as Promise<Response>
const ok = (nodes: unknown[]) =>
  reply({ data: { user: { pinnedItems: { nodes } } } })

function setup(fetchFn: typeof fetch, env: Record<string, string> = {
  GITHUB_TOKEN: TOKEN,
}) {
  const writeFile = vi.fn()
  const logs: string[] = []
  const log = (...a: unknown[]) => logs.push(a.join(' '))
  return { writeFile, logs, go: () => run({ env, fetchFn, writeFile, log }) }
}

describe('run', () => {
  const fails: [string, () => Promise<Response>, Record<string, string>?][] = [
    ['missing token', () => ok([node]), {}],
    ['non-2xx', () => reply({ message: 'Bad credentials' }, 401)],
    ['graphql errors', () => reply({ errors: [{ message: 'boom' }] })],
    ['null user', () => reply({ data: { user: null } })],
    ['zero usable repos', () => ok([null, { ...node, url: 'http://x' }])],
  ]
  it.each(fails)('rejects on %s without writing', async (_n, f, env) => {
    const s = setup(vi.fn(f) as unknown as typeof fetch, env)
    await expect(s.go()).rejects.toThrow()
    expect(s.writeFile).not.toHaveBeenCalled()
    expect(s.logs.join('\n')).not.toContain(TOKEN)
  })

  it('writes once on success', async () => {
    const s = setup(vi.fn(() => ok([node])) as unknown as typeof fetch)
    await s.go()
    expect(s.writeFile).toHaveBeenCalledTimes(1)
    expect(s.writeFile.mock.calls[0][1]).toContain('someone-x')
    expect(s.logs.join('\n')).not.toContain(TOKEN)
  })
})
