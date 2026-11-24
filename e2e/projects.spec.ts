import { test, expect, type Page } from '@playwright/test'

async function open(page: Page, width: number, height = 800) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width, height })
  await page.goto('./')
  await page.evaluate(() => document.fonts.ready)
}

const hackathons = (page: Page) =>
  page.locator('#hackathons article').filter({ hasText: /^2nd/ })

test('hackathons stack at 1280px', async ({ page }) => {
  await open(page, 1280)
  const boxes = await hackathons(page).evaluateAll((as) =>
    as.map((a) => {
      const r = a.getBoundingClientRect()
      return { top: r.top, bottom: r.bottom }
    }),
  )
  expect(boxes).toHaveLength(3)
  for (let i = 1; i < boxes.length; i++)
    expect(boxes[i].top).toBeGreaterThanOrEqual(boxes[i - 1].bottom - 0.5)
})

test('hackathon figure stays pinned at 1280x800', async ({ page }) => {
  await open(page, 1280, 800)
  const fig = () =>
    page.locator('#hackathons [data-figure]').evaluate(
      (f) => f.getBoundingClientRect().top,
    )
  const entryTop = (i: number) =>
    hackathons(page).nth(i).evaluate((a) => a.getBoundingClientRect().top)
  const bring = async (i: number, y: number) => {
    const t = await entryTop(i)
    await page.evaluate((d) => scrollBy(0, d), t - y)
  }
  // pin first, then bring entry 1 to the figure's top, then entry 2
  await bring(0, 200)
  const first = await fig()
  await bring(0, first)
  const e1 = await entryTop(0)
  await bring(1, first)
  expect(Math.abs((await fig()) - first)).toBeLessThanOrEqual(2)
  expect(Math.abs((await entryTop(0)) - e1)).toBeGreaterThan(20)
})

test('hackathon figure scrolls with the page at 375px', async ({ page }) => {
  await open(page, 375, 812)
  const fig = () =>
    page.locator('#hackathons [data-figure]').evaluate(
      (f) => f.getBoundingClientRect().top,
    )
  await page.locator('#hackathons [data-figure]').scrollIntoViewIfNeeded()
  const before = await fig()
  await page.evaluate(() => scrollBy(0, 200))
  expect(before - (await fig())).toBeGreaterThan(180)
  expect(before - (await fig())).toBeLessThan(220)
})

test('hackathons band is teal', async ({ page }) => {
  await open(page, 1280)
  await expect(page.locator('#hackathons')).toHaveCSS(
    'background-color',
    'rgb(71, 194, 192)',
  )
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
    expect(boxes[i].top).toBeGreaterThanOrEqual(boxes[i - 1].bottom - 0.5)
})

for (const [width, left] of [
  [1280, true],
  [375, false],
] as const) {
  const where = left ? 'left of' : 'above'
  test(`featured figure sits ${where} title at ${width}px`, async ({
    page,
  }) => {
    await open(page, width, 812)
    const rows = await page
      .locator('#projects article:has(ul)')
      .evaluateAll((as) =>
        as.map((a) => {
          const h = a.querySelector('h3')!.getBoundingClientRect()
          const s = a.querySelector('ul')!.getBoundingClientRect()
          const f = a
            .querySelector('[data-figure]')
            ?.getBoundingClientRect()
          return {
            hLeft: h.left,
            hTop: h.top,
            hBottom: h.bottom,
            sTop: s.top,
            fRight: f?.right,
            fBottom: f?.bottom,
          }
        }),
      )
    expect(rows).toHaveLength(3)
    expect(rows.filter((r) => r.fRight !== undefined)).toHaveLength(2)
    for (const r of rows) {
      expect(r.sTop).toBeGreaterThanOrEqual(r.hBottom)
      if (r.fRight === undefined) continue
      if (left) expect(r.fRight).toBeLessThan(r.hLeft)
      else expect(r.fBottom).toBeLessThanOrEqual(r.hTop)
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

test('hackathons lede is a 22px medium caption', async ({ page }) => {
  await open(page, 1280)
  const s = await page
    .getByText('Second place at three hackathons.')
    .evaluate((e) => {
      const c = getComputedStyle(e)
      return [c.fontSize, c.fontWeight]
    })
  expect(s).toEqual(['22px', '500'])
})
