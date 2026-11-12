import { test, expect, type Page } from '@playwright/test'

async function open(page: Page, width: number, height = 800) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width, height })
  await page.goto('./')
  await page.evaluate(() => document.fonts.ready)
}

const hackathons = (page: Page) =>
  page.locator('#projects article').filter({ hasText: /^2nd/ })

test('hackathons share a top at 1280px', async ({ page }) => {
  await open(page, 1280)
  const tops = await hackathons(page).evaluateAll((as) =>
    as.map((a) => a.getBoundingClientRect().top),
  )
  expect(tops).toHaveLength(3)
  for (const t of tops) expect(Math.abs(t - tops[0])).toBeLessThanOrEqual(1)
})

test('hackathons stack at 375px', async ({ page }) => {
  await open(page, 375, 812)
  const boxes = await hackathons(page).evaluateAll((as) =>
    as.map((a) => {
      const r = a.getBoundingClientRect()
      return { top: r.top, bottom: r.bottom }
    }),
  )
  expect(boxes).toHaveLength(3)
  for (let i = 1; i < boxes.length; i++)
    expect(boxes[i].top).toBeGreaterThan(boxes[i - 1].bottom)
})

for (const [width, left] of [
  [1280, true],
  [375, false],
] as const) {
  const where = left ? 'left of' : 'below'
  test(`featured stack sits ${where} title at ${width}px`, async ({
    page,
  }) => {
    await open(page, width, 812)
    const rows = await page
      .locator('#projects article:has(ul)')
      .evaluateAll((as) =>
        as.map((a) => {
          const h = a.querySelector('h3')!.getBoundingClientRect()
          const s = a.querySelector('ul')!.getBoundingClientRect()
          return {
            hLeft: h.left,
            hBottom: h.bottom,
            sRight: s.right,
            sTop: s.top,
          }
        }),
      )
    expect(rows).toHaveLength(3)
    for (const r of rows) {
      if (left) expect(r.sRight).toBeLessThan(r.hLeft)
      else expect(r.sTop).toBeGreaterThanOrEqual(r.hBottom)
    }
  })
}

test('projects links are 44px tall at 375px', async ({ page }) => {
  await open(page, 375)
  const links = page.locator('#projects a')
  expect(await links.count()).toBeGreaterThan(0)
  for (const el of await links.all())
    expect((await el.boundingBox())!.height).toBeGreaterThanOrEqual(44)
})

test('heading levels in projects never skip', async ({ page }) => {
  await open(page, 1280)
  const levels = await page
    .locator('#projects :is(h2, h3, h4)')
    .evaluateAll((hs) => hs.map((h) => Number(h.tagName[1])))
  expect(levels[0]).toBe(2)
  for (let i = 1; i < levels.length; i++)
    expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1)
})
