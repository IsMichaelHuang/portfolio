import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const SITE = 'https://ismichaelhuang.github.io/portfolio/'
const OG = SITE + 'og.png'
const EMAIL = 'michael.micah.huang@gmail.com'

const indexPath = 'dist/index.html'
if (!existsSync(indexPath)) {
  throw new Error('dist/ is missing. Run `npm run build` before `npm test`.')
}
const html = readFileSync(indexPath, 'utf8')
const parse = (s: string) => new DOMParser().parseFromString(s, 'text/html')
const doc = parse(html)

// Long values wrap across lines in the source; whitespace collapses.
const meta = (attr: string, key: string) =>
  doc
    .querySelector(`meta[${attr}="${key}"]`)
    ?.getAttribute('content')
    ?.replace(/\s+/g, ' ')
const link = (rel: string) =>
  doc.querySelector(`link[rel="${rel}"]`)?.getAttribute('href')

function png(file: string) {
  const b = readFileSync(`dist/${file}`)
  return [b.readUInt32BE(16), b.readUInt32BE(20)]
}

describe('dist/index.html', () => {
  it('has the title and language', () => {
    expect(doc.title).toBe('Michael Huang — Software Engineer')
    expect(doc.documentElement.lang).toBe('en')
  })

  it('has a descriptive meta description', () => {
    const d = meta('name', 'description')!
    expect(d.length).toBeGreaterThanOrEqual(110)
    expect(d.length).toBeLessThanOrEqual(160)
    expect(d).toContain('Michael Huang')
    expect(d).toContain('AI')
  })

  it('has the canonical link', () => {
    expect(link('canonical')).toBe(SITE)
  })

  it('has Open Graph tags', () => {
    expect(meta('property', 'og:type')).toBe('website')
    expect(meta('property', 'og:title')).toBeTruthy()
    expect(meta('property', 'og:description')).toBeTruthy()
    expect(meta('property', 'og:url')).toBe(SITE)
    expect(meta('property', 'og:image')).toBe(OG)
    expect(meta('property', 'og:image:width')).toBe('1200')
    expect(meta('property', 'og:image:height')).toBe('630')
    expect(meta('property', 'og:image:alt')).toBeTruthy()
    expect(meta('property', 'og:site_name')).toBeTruthy()
  })

  it('has Twitter card tags', () => {
    expect(meta('name', 'twitter:card')).toBe('summary_large_image')
    expect(meta('name', 'twitter:title')).toBeTruthy()
    expect(meta('name', 'twitter:description')).toBeTruthy()
    expect(meta('name', 'twitter:image')).toBe(OG)
  })

  it('has theme, scheme and referrer metas', () => {
    expect(meta('name', 'theme-color')).toBe('#0a0a0f')
    expect(meta('name', 'color-scheme')).toBe('dark')
    expect(meta('name', 'referrer')).toBe('strict-origin-when-cross-origin')
  })

  it('links the icons under the base path', () => {
    expect(link('icon')).toBe('/portfolio/favicon.png')
    expect(link('apple-touch-icon')).toBe('/portfolio/apple-touch-icon.png')
  })

  it('has one minimal Person JSON-LD block', () => {
    const blocks = doc.querySelectorAll('script[type="application/ld+json"]')
    expect(blocks).toHaveLength(1)
    const ld = JSON.parse(blocks[0].textContent!)
    expect(Object.keys(ld).sort()).toEqual(
      ['@context', '@type', 'jobTitle', 'name', 'sameAs', 'url'].sort(),
    )
    expect(ld['@type']).toBe('Person')
    expect(ld.sameAs).toContain('https://github.com/IsMichaelHuang')
    expect(ld.sameAs).toContain(
      'https://www.linkedin.com/in/michael-micah-huang/',
    )
  })

  it('exposes no phone number and email only inside noscript', () => {
    expect(html).not.toMatch(/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/)
    const outside = html.replace(/<noscript>[\s\S]*?<\/noscript>/, '')
    expect(html).toContain(EMAIL)
    expect(outside).not.toContain(EMAIL)
  })

  it('keeps the resume', () => {
    expect(existsSync('dist/resume.pdf')).toBe(true)
  })
})

describe('dist/404.html', () => {
  const path = 'dist/404.html'
  it('exists with the required head', () => {
    expect(existsSync(path)).toBe(true)
    const d = parse(readFileSync(path, 'utf8'))
    expect(d.title).not.toBe('')
    expect(d.documentElement.lang).toBe('en')
    expect(d.querySelector('meta[name="viewport"]')).not.toBeNull()
    expect(
      d.querySelector('meta[name="robots"]')?.getAttribute('content'),
    ).toContain('noindex')
    expect(d.querySelector('a[href="/portfolio/"]')).not.toBeNull()
    for (const el of Array.from(d.querySelectorAll('[href], [src]'))) {
      const u = el.getAttribute('href') ?? el.getAttribute('src')!
      if (/^(https:\/\/|mailto:)/.test(u)) continue
      expect(u.startsWith('/portfolio/')).toBe(true)
    }
  })
})

describe('dist images', () => {
  it('have the required sizes', () => {
    expect(png('og.png')).toEqual([1200, 630])
    const [w, h] = png('favicon.png')
    expect(w).toBe(h)
    expect(png('apple-touch-icon.png')).toEqual([180, 180])
  })
})
