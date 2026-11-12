/// <reference types="node" />
import { readFileSync } from 'node:fs'

const css = readFileSync('src/index.css', 'utf8')

type RGBA = [number, number, number, number]

function token(name: string): RGBA {
  const m = css.match(new RegExp(`--${name}:\\s*([^;]+);`))
  if (!m) throw new Error(`missing token --${name}`)
  const v = m[1].trim()
  if (v.startsWith('#')) {
    const n = parseInt(v.slice(1), 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1]
  }
  const [r, g, b, a = 1] = v.match(/[\d.]+/g)!.map(Number)
  return [r, g, b, a]
}

// Composite a translucent colour over an opaque backdrop.
const over = ([r, g, b, a]: RGBA, bg: RGBA): RGBA => [
  r * a + bg[0] * (1 - a),
  g * a + bg[1] * (1 - a),
  b * a + bg[2] * (1 - a),
  1,
]

const lum = ([r, g, b]: RGBA) => {
  const [R, G, B] = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

function ratio(fg: RGBA, bg: RGBA) {
  const [hi, lo] = [lum(over(fg, bg)), lum(bg)].sort((a, b) => b - a)
  return (hi + 0.05) / (lo + 0.05)
}

const bg = token('color-bg')
const surface = over(token('color-surface'), bg)
const text = token('color-text')
const muted = token('color-text-muted')
const accent = token('color-accent-text')

describe('colour contrast', () => {
  it.each([
    ['text', text],
    ['text-muted', muted],
    ['accent-text', accent],
  ] as const)('%s is at least 4.5:1 on bg and surface', (_, fg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5)
    expect(ratio(fg, surface)).toBeGreaterThanOrEqual(4.5)
  })

  it('text-muted is at least 5.5:1 on bg', () => {
    expect(ratio(muted, bg)).toBeGreaterThanOrEqual(5.5)
  })

  it('text-muted stays visibly below text', () => {
    expect(ratio(text, bg) - ratio(muted, bg)).toBeGreaterThanOrEqual(3)
  })
})
