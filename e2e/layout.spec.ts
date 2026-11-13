import { test, expect, type Page } from '@playwright/test'

async function open(page: Page, width: number) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width, height: 800 })
  await page.goto('./')
  await page.evaluate(() => document.fonts.ready)
}

// Cards are the h4 parents inside #pinned (CSS class names are hashed).
const cards = (page: Page) =>
  page.locator('#pinned h4').locator('xpath=..')

// Clone a card until there are `n`; skip when no pins are rendered.
async function ensureCards(page: Page, n: number) {
  const have = await page.locator('#pinned h4').count()
  test.skip(have === 0, '#pinned is absent: no pins left to test')
  await page.evaluate((n) => {
    const first = document.querySelector('#pinned h4')!.parentElement!
    while (document.querySelectorAll('#pinned h4').length < n)
      first.parentElement!.append(first.cloneNode(true))
  }, n)
}

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

test('AC3 cards fill the 880px column two per row, equal height', async ({
  page,
}) => {
  await open(page, 1280)
  await ensureCards(page, 2)
  const all = await cards(page).all()
  expect(all.length).toBeGreaterThanOrEqual(2)
  const a = (await all[0].boundingBox())!
  const b = (await all[1].boundingBox())!
  // two columns of (880 - 24px gap) / 2
  expect(a.width).toBe(428)
  expect(b.width).toBe(428)
  expect(a.y).toBe(b.y)
  expect(a.height).toBe(b.height)
})

test('AC4 long unbroken text grows the card at 320px', async ({ page }) => {
  await open(page, 320)
  await ensureCards(page, 1)
  await page.evaluate(() => {
    const card = document.querySelector('#pinned h4')!.parentElement!
    const word = 'x'.repeat(60)
    card.querySelector('h4')!.textContent = word
    let p = card.querySelector('p')
    if (!p) card.querySelector('h4')!.after((p = document.createElement('p')))
    p.textContent = word
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
