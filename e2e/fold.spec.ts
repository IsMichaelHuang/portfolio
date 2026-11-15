import { test, expect, type Page } from '@playwright/test'

async function open(page: Page, width: number, height: number) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width, height })
  await page.goto('./')
  await page.evaluate(() => document.fonts.ready)
}

const top = (page: Page, sel: string) =>
  page.locator(sel).first().evaluate((e) => e.getBoundingClientRect().top)

for (const [w, h] of [
  [1280, 800],
  [375, 812],
]) {
  test(`hero fits the first view at ${w}x${h}`, async ({ page }) => {
    await open(page, w, h)
    for (const sel of [
      '#hero [data-figure] > span[aria-hidden]',
      '#hero [data-figure] > span:last-child',
      '#hero h1',
      '#hero a >> nth=0',
    ]) {
      const r = await page
        .locator(sel)
        .first()
        .evaluate((e) => e.getBoundingClientRect().toJSON())
      expect(r.top, sel).toBeGreaterThanOrEqual(0)
      expect(r.bottom, sel).toBeLessThanOrEqual(h)
      expect(r.left, sel).toBeGreaterThanOrEqual(0)
      expect(r.right, sel).toBeLessThanOrEqual(w)
    }
    const m = await page.locator('#hero').evaluate((e) => ({
      h: e.getBoundingClientRect().height,
      f: parseFloat(
        getComputedStyle(e.querySelector('[data-figure] [aria-hidden]')!)
          .fontSize,
      ),
    }))
    expect(m.f).toBeGreaterThanOrEqual(90)
    if (w === 375) expect(m.h).toBeLessThanOrEqual(h)
  })

  test(`hero h1 clears the nav at ${w}x${h}`, async ({ page }) => {
    await open(page, w, h)
    const nav = await page
      .locator('nav')
      .first()
      .evaluate((e) => e.getBoundingClientRect().bottom)
    expect(await top(page, '#hero h1')).toBeGreaterThanOrEqual(nav)
  })
}

test('phone sections and ledger rows are tight', async ({ page }) => {
  await open(page, 375, 812)
  const pad = (sel: string, side: string) =>
    page
      .locator(sel)
      .nth(1)
      .evaluate((e, s) => getComputedStyle(e).getPropertyValue(s), side)
  expect(await pad('section', 'padding-top')).toBe('88px')
  // second row of each ledger: its top padding is the row rhythm
  expect(await pad('#experience article', 'padding-top')).toBe('40px')
  expect(await pad('#projects article', 'padding-top')).toBe('40px')
})
