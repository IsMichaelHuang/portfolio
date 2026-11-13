import { hackathons, featured } from './work'
import { experience } from './experience'

const strings = (v: unknown): string[] =>
  typeof v === 'string'
    ? [v]
    : v && typeof v === 'object'
      ? Object.values(v).flatMap(strings)
      : []

describe('work and experience data', () => {
  it('names no other people', () => {
    for (const s of strings([hackathons, featured, experience])) {
      expect(s).not.toMatch(/Sugawara|Riley/)
    }
  })

  it('marks every hackathon 2nd', () => {
    expect(hackathons.map((h) => h.place)).toEqual(['2nd', '2nd', '2nd'])
  })
})
