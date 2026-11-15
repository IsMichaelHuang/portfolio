import { test, expect, type Page } from '@playwright/test'

const ids = ['experience', 'projects', 'about', 'contact']
const current = (page: Page) => page.locator('nav [aria-current]')

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  // Web fonts resize the page; settle layout before measuring scroll.
  await page.evaluate(() => document.fonts.ready)
})

test('no link is current at load', async ({ page }) => {
  await expect(current(page)).toHaveCount(0)
})

for (const id of ids) {
  test(`clicking #${id} makes only it current`, async ({ page }) => {
    await page.locator(`nav a[href="#${id}"]`).click()
    const link = page.locator(`nav a[href="#${id}"]`)
    await expect(link).toHaveAttribute('aria-current', 'location')
    await expect(current(page)).toHaveCount(1)
  })
}

for (const id of ids) {
  test(`#${id} heading lands one group gap below the nav`, async ({
    page,
  }) => {
    await page.locator(`nav a[href="#${id}"]`).click()
    await page.waitForTimeout(300)
    const m = await page.evaluate((i) => {
      const h = document.querySelector(`#${i} > h2`)!.getBoundingClientRect()
      const n = document.querySelector('nav')!.getBoundingClientRect()
      return { top: h.top, nav: n.bottom, vh: innerHeight }
    }, id)
    if (id === 'contact') {
      expect(m.top).toBeGreaterThanOrEqual(0)
      expect(m.top).toBeLessThan(m.vh)
    } else {
      expect(Math.abs(m.top - m.nav - 56)).toBeLessThanOrEqual(8)
    }
  })
}

test('bottom marks Contact; top clears it', async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect(page.locator('nav a[href="#contact"]')).toHaveAttribute(
    'aria-current',
    'location',
  )
  await expect(current(page)).toHaveCount(1)
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(current(page)).toHaveCount(0)
})

const grounds = [
  'hero',
  'experience',
  'hackathons',
  'projects',
  'about',
  'contact',
]
const bg = (page: Page, sel: string) =>
  page.evaluate(
    (s) => getComputedStyle(document.querySelector(s)!).backgroundColor,
    sel,
  )

for (const id of grounds) {
  test(`nav takes the ground of #${id} under it`, async ({ page }) => {
    await page.evaluate((i) => {
      const nav = document.querySelector('nav')!.offsetHeight
      const top = (document.getElementById(i) as HTMLElement).offsetTop
      window.scrollTo(0, top + nav)
    }, id)
    const grounded = await page.evaluate(
      (i) => !!document.getElementById(i)!.dataset.ground,
      id,
    )
    const want = grounded ? await bg(page, `#${id}`) : 'rgb(255, 255, 255)'
    await expect
      .poll(() => bg(page, 'nav'), { timeout: 3000 })
      .toBe(want)
  })
}

test('nav starts on the hero ground', async ({ page }) => {
  expect(await bg(page, 'nav')).toBe('rgb(236, 163, 88)')
})

test('no animation lingers after a round trip', async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.getAnimations().filter((a) => a.playState === 'running')
            .length,
      ),
    )
    .toBe(0)
})
