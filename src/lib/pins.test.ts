import { remainingPins } from './pins'

const p = (id: string, repoUrl?: string) => ({ id, title: id, tags: [], repoUrl })

describe('remainingPins', () => {
  const urls = ['https://github.com/o/Alpha']

  it('drops an exact match', () => {
    const out = remainingPins([p('a', 'https://github.com/o/Alpha')], urls)
    expect(out).toEqual([])
  })

  it('matches ignoring case, trailing slash and .git', () => {
    const pins = [
      p('a', 'https://GITHUB.com/o/alpha'),
      p('b', 'https://github.com/o/Alpha/'),
      p('c', 'https://github.com/o/Alpha.git'),
    ]
    expect(remainingPins(pins, urls)).toEqual([])
    expect(
      remainingPins([p('d', 'https://github.com/o/x')], [
        'https://github.com/o/X.git/',
      ]),
    ).toEqual([])
  })

  it('keeps non-matching and URL-less pins', () => {
    const pins = [p('a', 'https://github.com/o/beta'), p('b')]
    expect(remainingPins(pins, urls)).toEqual(pins)
  })

  it('returns empty for empty input', () => {
    expect(remainingPins([], urls)).toEqual([])
    expect(remainingPins([], [])).toEqual([])
  })
})
