import { test, expect, type Page } from '@playwright/test'

async function open(page: Page, width: number, height = 800) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width, height })
  await page.goto('./')
  await page.evaluate(() => document.fonts.ready)
}

const css = (page: Page, sel: string, prop: string) =>
  page
    .locator(sel)
    .first()
    .evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop)

const left = (page: Page, sel: string) =>
  page
    .locator(sel)
    .first()
    .evaluate((el) => el.getBoundingClientRect().left)

test('Contact and footer sit on the ink ground', async ({ page }) => {
  await open(page, 1280)
  for (const sel of ['#contact', 'footer']) {
    expect(await css(page, sel, 'background-color')).toBe('rgb(20, 17, 15)')
  }
  for (const sel of ['#contact h2', '#contact p']) {
    expect(await css(page, sel, 'color')).toBe('rgb(255, 255, 255)')
  }
})

test('Contact and footer run edge to edge at 1280', async ({ page }) => {
  await open(page, 1280)
  for (const sel of ['#contact', 'footer']) {
    const b = await page
      .locator(sel)
      .evaluate((el) => el.getBoundingClientRect())
    expect(b.left).toBe(0)
    expect(b.right).toBe(1280)
  }
})

test('Contact heading shares the Experience heading edge', async ({
  page,
}) => {
  await open(page, 1280)
  const a = await left(page, '#contact > h2')
  const b = await left(page, '#experience > h2')
  expect(Math.abs(a - b)).toBeLessThanOrEqual(1)
})

test('About bio starts on the entry-title column at 1280', async ({
  page,
}) => {
  await open(page, 1280)
  const a = await left(page, '#about p')
  const b = await left(page, '#experience article h3')
  expect(Math.abs(a - b)).toBeLessThanOrEqual(1)
})

for (const w of [320, 375, 1280]) {
  test(`email is display size and fits at ${w}px`, async ({ page }) => {
    await open(page, w)
    const m = await page.locator('#contact a[href^="mailto:"]').evaluate(
      (el) => ({
        size: parseFloat(getComputedStyle(el).fontSize),
        right: el.getBoundingClientRect().right,
        sw: document.documentElement.scrollWidth,
        cw: document.documentElement.clientWidth,
      }),
    )
    expect(m.size).toBeGreaterThanOrEqual(24)
    expect(m.right).toBeLessThanOrEqual(w)
    expect(m.sw).toBeLessThanOrEqual(m.cw)
  })
}

test('email fits at 320px with text-spacing overrides', async ({ page }) => {
  await open(page, 320, 700)
  await page.addStyleTag({
    content: `* { line-height: 1.5 !important;
      letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
      p { margin-bottom: 2em !important; }`,
  })
  const m = await page.locator('#contact a[href^="mailto:"]').evaluate(
    (el) => ({
      right: el.getBoundingClientRect().right,
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }),
  )
  expect(m.right).toBeLessThanOrEqual(320)
  expect(m.sw).toBeLessThanOrEqual(m.cw)
})
