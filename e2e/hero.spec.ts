import { test, expect } from '@playwright/test'

test('hero mark is visible and sharp on 2x screens', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('./')
  const img = page.locator('#hero img')
  await expect(img).toBeVisible()
  const m = await img.evaluate((el: HTMLImageElement) => ({
    natural: el.naturalWidth,
    rendered: el.getBoundingClientRect().width,
  }))
  expect(m.natural).toBeGreaterThan(0)
  expect(m.natural).toBeGreaterThanOrEqual(2 * m.rendered)
})

test('reduced motion: hero does not animate', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  const running = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter((a) => a.playState === 'running').length,
  )
  expect(running).toBe(0)
  await expect(page.locator('#hero h1')).toHaveCSS('opacity', '1')
})

test('load animation ends with the heading visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('./')
  await page.evaluate(() =>
    Promise.all(document.getAnimations().map((a) => a.finished)),
  )
  await expect(page.locator('#hero h1')).toHaveCSS('opacity', '1')
})

test('body has no background image', async ({ page }) => {
  await page.goto('./')
  const img = await page.evaluate(
    () => getComputedStyle(document.body).backgroundImage,
  )
  expect(img).toBe('none')
})

test('no horizontal scroll at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('./')
  const over = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  )
  expect(over).toBe(false)
})
