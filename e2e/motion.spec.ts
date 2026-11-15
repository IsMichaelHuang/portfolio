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

test('reduced motion: style changes create no transitions', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  const result = await page.evaluate(async () => {
    const nav = document.querySelector('nav') as HTMLElement
    void getComputedStyle(nav).maxWidth
    nav.style.maxWidth = '50%'
    nav.style.color = 'rgb(255, 0, 0)'
    const same = document.getAnimations().length
    await new Promise((r) => requestAnimationFrame(() => r(null)))
    return [same, document.getAnimations().length]
  })
  expect(result).toEqual([0, 0])
})
