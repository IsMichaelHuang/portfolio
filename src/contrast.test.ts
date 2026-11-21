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

const [ink, white, amber, teal] = ['ink', 'white', 'amber', 'teal'].map(token)
const muted = token('muted')
const mutedOnInk = token('muted-on-ink')

describe('colour contrast', () => {
  it.each([
    ['ink on white', ink, white],
    ['ink on amber', ink, amber],
    ['ink on teal', ink, teal],
    ['white on ink', white, ink],
    ['muted on white', muted, white],
    ['muted-on-ink on ink', mutedOnInk, ink],
  ] as const)('%s is at least 4.5:1', (_, fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5)
  })

  it('muted on white is at least 5.5:1', () => {
    expect(ratio(muted, white)).toBeGreaterThanOrEqual(5.5)
  })
})
