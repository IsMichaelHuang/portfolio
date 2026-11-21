import { countFrame } from './figure'

const values = ['~15,000', '157', '~30%', '249', '61', '~70']
const num = (s: string) => Number(s.replace(/[^\d]/g, ''))

describe('countFrame', () => {
  it('returns the value exactly at t = 1', () => {
    for (const v of values) expect(countFrame(v, 1)).toBe(v)
  })

  it('keeps prefix and suffix and starts from 0', () => {
    expect(countFrame('~15,000', 0)).toBe('~0')
    expect(countFrame('157', 0)).toBe('0')
    expect(countFrame('~30%', 0)).toBe('~0%')
  })

  it('never decreases as t rises', () => {
    for (const v of values) {
      let last = -1
      for (let i = 0; i <= 10; i++) {
        const n = num(countFrame(v, i / 10))
        expect(n).toBeGreaterThanOrEqual(last)
        last = n
      }
    }
  })

  it('keeps grouping commas', () => {
    expect(countFrame('~15,000', 0.5)).toBe('~7,500')
  })

  it('leaves 2nd, values under 10 and digitless values alone', () => {
    for (const v of ['2nd', '7', 'n/a']) {
      for (const t of [0, 0.5, 1]) expect(countFrame(v, t)).toBe(v)
    }
  })

  it('clamps t', () => {
    expect(countFrame('157', -3)).toBe('0')
    expect(countFrame('157', 4)).toBe('157')
  })
})
