import { test, expect, type Page } from '@playwright/test'

async function open(page: Page, width: number, height = 800) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width, height })
  await page.goto('./')
  await page.evaluate(() => document.fonts.ready)
}

const hackathons = (page: Page) =>
  page.locator('#hackathons article').filter({ hasText: /^2nd/ })

test('hackathons share a top at 1280px', async ({ page }) => {
  await open(page, 1280)
  const tops = await hackathons(page).evaluateAll((as) =>
    as.map((a) => a.getBoundingClientRect().top),
  )
  expect(tops).toHaveLength(3)
  for (const t of tops) expect(Math.abs(t - tops[0])).toBeLessThanOrEqual(1)
})

test('hackathons have equal heights at 1280px', async ({ page }) => {
  await open(page, 1280)
  const hs = await hackathons(page).evaluateAll((as) =>
    as.map((a) => a.getBoundingClientRect().height),
  )
  expect(hs).toHaveLength(3)
  for (const h of hs) expect(Math.abs(h - hs[0])).toBeLessThanOrEqual(1)
})

test('hackathon Code links share a bottom at 1280px', async ({ page }) => {
  await open(page, 1280)
  const [art, link] = await Promise.all([
    hackathons(page).evaluateAll((as) =>
      as.map((a) => a.getBoundingClientRect().bottom),
    ),
    page.locator('#hackathons a').evaluateAll((as) =>
      as.map((a) => a.getBoundingClientRect().bottom),
    ),
  ])
  // the one link row sits at the foot of its entry
  expect(link).toHaveLength(1)
  expect(art.some((b) => Math.abs(b - link[0]) <= 12)).toBe(true)
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
  const links = page.locator('#hackathons a, #projects a')
  expect(await links.count()).toBeGreaterThan(0)
  for (const el of await links.all())
    expect((await el.boundingBox())!.height).toBeGreaterThanOrEqual(44)
})

for (const id of ['hackathons', 'projects']) {
  test(`heading levels in ${id} never skip`, async ({ page }) => {
    await open(page, 1280)
    const levels = await page
      .locator(`#${id} :is(h2, h3, h4)`)
      .evaluateAll((hs) => hs.map((h) => Number(h.tagName[1])))
    expect(levels[0]).toBe(2)
    for (let i = 1; i < levels.length; i++)
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1)
  })
}

test('hackathon events are h3', async ({ page }) => {
  await open(page, 1280)
  await expect(page.locator('#hackathons h3')).toHaveCount(3)
  await expect(page.locator('#hackathons h4')).toHaveCount(0)
})
