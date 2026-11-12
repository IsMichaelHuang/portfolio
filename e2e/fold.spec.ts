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
  test(`Experience heading is on the first screen at ${w}x${h}`, async ({
    page,
  }) => {
    await open(page, w, h)
    expect(await top(page, '#experience > h2')).toBeLessThan(h)
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

test('role line is 20px', async ({ page }) => {
  await open(page, 1280, 800)
  const role = page.getByText('Software Engineer', { exact: true })
  await expect(role).toHaveCSS('font-size', '20px')
})

test('phone sections and ledger rows are tight', async ({ page }) => {
  await open(page, 375, 812)
  const pad = (sel: string, side: string) =>
    page
      .locator(sel)
      .nth(1)
      .evaluate((e, s) => getComputedStyle(e).getPropertyValue(s), side)
  expect(await pad('section', 'padding-top')).toBe('48px')
  // second row of each ledger: its top padding is the row rhythm
  expect(await pad('#experience article', 'padding-top')).toBe('24px')
  expect(await pad('#projects article', 'padding-top')).toBe('24px')
})
