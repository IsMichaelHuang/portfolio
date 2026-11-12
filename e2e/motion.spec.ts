import { test, expect } from '@playwright/test'

const behavior = () =>
  getComputedStyle(document.documentElement).scrollBehavior

test('reduced motion: auto scrolling, nothing animating', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  expect(await page.evaluate(behavior)).toBe('auto')
  const running = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter((a) => a.playState === 'running').length,
  )
  expect(running).toBe(0)
})

test('no preference: smooth scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('./')
  expect(await page.evaluate(behavior)).toBe('smooth')
})
