import { pickActive } from './activeSection'

const tops = [
  { id: 'about', top: 100 },
  { id: 'experience', top: 700 },
  { id: 'contact', top: 1500 },
]

describe('pickActive', () => {
  it('is empty for an empty list', () => {
    expect(pickActive([], 72, false)).toBe('')
    expect(pickActive([], 72, true)).toBe('')
  })

  it('is empty while every section is below the offset', () => {
    expect(pickActive(tops, 72, false)).toBe('')
  })

  it('picks the last section at or above the offset', () => {
    expect(pickActive(tops, 100, false)).toBe('about')
    expect(pickActive(tops, 800, false)).toBe('experience')
    expect(pickActive(tops, 5000, false)).toBe('contact')
  })

  it('picks the last section when at the bottom', () => {
    expect(pickActive(tops, 72, true)).toBe('contact')
  })
})
