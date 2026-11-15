import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('./')
  await page.evaluate(() => document.fonts.ready)
})

test('distinct font sizes stay within the ratchet', async ({ page }) => {
  const sizes = await page.evaluate(() => {
    const out = new Set<string>()
    for (const el of Array.from(document.body.querySelectorAll('*'))) {
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) continue
      const own = Array.from(el.childNodes).some(
        (n) => n.nodeType === 3 && n.textContent!.trim(),
      )
      if (own) out.add(getComputedStyle(el).fontSize)
    }
    return [...out]
  })
  expect(sizes.length).toBeLessThanOrEqual(16)
})

for (const sel of ['#about p', 'footer']) {
  test(`::selection contrast on ${sel} is at least 4.5:1`, async ({
    page,
  }) => {
    const ratio = await page.locator(sel).first().evaluate((el) => {
      const rgb = (c: string) => c.match(/[\d.]+/g)!.map(Number)
      const lum = ([r, g, b]: number[]) => {
        const f = (c: number) => {
          const s = c / 255
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
        }
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
      }
      const fg = lum(rgb(getComputedStyle(el, '::selection').color))
      const bg = lum(rgb(getComputedStyle(el).backgroundColor))
      const [hi, lo] = [fg, bg].sort((a, b) => b - a)
      return (hi + 0.05) / (lo + 0.05)
    })
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })
}
