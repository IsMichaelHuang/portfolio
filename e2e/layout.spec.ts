import { test, expect, type Page } from '@playwright/test'

async function open(page: Page, width: number) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width, height: 800 })
  await page.goto('./')
  await page.evaluate(() => document.fonts.ready)
}

// Cards are the h3 parents inside #projects (CSS class names are hashed).
const cards = (page: Page) =>
  page.locator('#projects h3').locator('xpath=..')

for (const width of [320, 375, 768, 1280, 1920]) {
  test(`AC1 no horizontal scroll at ${width}px`, async ({ page }) => {
    await open(page, width)
    const [sw, cw] = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      document.documentElement.clientWidth,
    ])
    expect(sw).toBeLessThanOrEqual(cw)
  })
}

test('AC2 brand and nav links fit at 320px', async ({ page }) => {
  await open(page, 320)
  const items = page.locator('nav a')
  expect(await items.count()).toBe(5)
  for (const el of await items.all()) {
    const box = (await el.boundingBox())!
    expect(box.x).toBeGreaterThanOrEqual(0)
    expect(box.x + box.width).toBeLessThanOrEqual(320)
    expect(box.height).toBeGreaterThanOrEqual(24)
  }
})

test('AC3 cards are 450px wide, two per row, equal height', async ({
  page,
}) => {
  await open(page, 1280)
  const all = await cards(page).all()
  expect(all.length).toBeGreaterThanOrEqual(2)
  const a = (await all[0].boundingBox())!
  const b = (await all[1].boundingBox())!
  expect(a.width).toBe(450)
  expect(b.width).toBe(450)
  expect(a.y).toBe(b.y)
  expect(a.height).toBe(b.height)
})

test('AC4 long unbroken text grows the card at 320px', async ({ page }) => {
  await open(page, 320)
  await page.evaluate(() => {
    const card = document.querySelector('#projects h3')!.parentElement!
    const word = 'x'.repeat(60)
    card.querySelector('h3')!.textContent = word
    card.querySelector('p')!.textContent = word
  })
  for (const card of await cards(page).all()) {
    const [sh, ch] = await card.evaluate((e) => [
      e.scrollHeight,
      e.clientHeight,
    ])
    expect(sh).toBeLessThanOrEqual(ch + 1)
  }
  const [sw, cw] = await page.evaluate(() => [
    document.documentElement.scrollWidth,
    document.documentElement.clientWidth,
  ])
  expect(sw).toBeLessThanOrEqual(cw)
})
