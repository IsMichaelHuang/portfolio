import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

test('first Tab reveals the skip link; Enter focuses main', async ({
  page,
}) => {
  await page.goto('./')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeInViewport({ ratio: 1 })
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
})

test('320px: every focusable shows an outline, clear of the nav', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('./')
  const count = await page.evaluate(
    () =>
      document.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex="0"]',
      ).length,
  )
  expect(count).toBeGreaterThan(5)
  for (let i = 0; i < count; i++) {
    await page.keyboard.press('Tab')
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const el = document.activeElement!
            const nav = document.querySelector('nav')!
            const exempt =
              nav.contains(el) || el.textContent === 'Skip to content'
            return {
              outline: getComputedStyle(el).outlineStyle,
              width: getComputedStyle(el).outlineWidth,
              clear:
                exempt ||
                el.getBoundingClientRect().top >=
                  nav.getBoundingClientRect().bottom,
              text: el.textContent,
            }
          }),
        { message: `focus stop ${i + 1}` },
      )
      .toMatchObject({ clear: true, outline: 'solid', width: '2px' })
  }
})

test('focus ring never matches the ground behind it', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('./')
  const count = await page.evaluate(
    () => document.querySelectorAll('a[href], button').length,
  )
  for (let i = 0; i < count; i++) {
    await page.keyboard.press('Tab')
    const stop = await page.evaluate(() => {
      const el = document.activeElement!
      const ground = el.closest('[data-ground]') ?? document.body
      return {
        ring: getComputedStyle(el).outlineColor,
        ground: getComputedStyle(ground).backgroundColor,
        text: el.textContent,
      }
    })
    expect(stop.ring, `ring on ${stop.text}`).not.toBe(stop.ground)
  }
})
