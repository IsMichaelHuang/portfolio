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

test('pins sit in two columns from 988px and one below', async ({
  page,
}) => {
  await open(page, 1280)
  await ensureCards(page, 2)
  let all = await cards(page).all()
  const a = (await all[0].boundingBox())!
  const b = (await all[1].boundingBox())!
  expect(a.x).not.toBe(b.x)
  expect(a.y).toBe(b.y)
  await page.setViewportSize({ width: 900, height: 800 })
  all = await cards(page).all()
  const c = (await all[0].boundingBox())!
  const d = (await all[1].boundingBox())!
  expect(c.x).toBe(d.x)
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

// Row figures: the visible numeral stays inside its grid cell.
const SPACING = `* { line-height: 1.5 !important;
  letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
  p { margin-bottom: 2em !important; }`

async function figuresFit(page: Page) {
  const rows = page.locator('#experience article, #projects article')
  return rows.evaluateAll((as) =>
    as.flatMap((a) => {
      const f = a.querySelector('[data-figure]')
      if (!f) return []
      // the numeral is a block: measure its glyphs, not its box
      const rg = document.createRange()
      rg.selectNodeContents(f.querySelector('[aria-hidden="true"]')!)
      const n = rg.getBoundingClientRect()
      const h = a.querySelector('h3')!.getBoundingClientRect()
      return [
        {
          over: n.right - f.getBoundingClientRect().right,
          hOver: innerWidth >= 720 ? n.right - h.left : -1,
        },
      ]
    }),
  )
}

// The band figure's glyphs stay inside its column (the viewport
// below 720px, where the column is the full width).
async function bandFits(page: Page) {
  return page.evaluate(() => {
    const f = document.querySelector('#hackathons [data-figure]')!
    const rg = document.createRange()
    rg.selectNodeContents(f.querySelector('[aria-hidden="true"]')!)
    const n = rg.getBoundingClientRect()
    const col = f.parentElement!.getBoundingClientRect()
    return { over: n.right - col.right, vOver: n.right - innerWidth }
  })
}

for (const [width, spacing] of [
  [320, false],
  [375, false],
  [768, false],
  [1280, false],
  [1920, false],
  [320, true],
  [720, true],
  [768, true],
] as const) {
  test(`F5 row figures fit at ${width}px${spacing ? ' spaced' : ''}`, async ({
    page,
  }) => {
    await open(page, width)
    if (spacing) await page.addStyleTag({ content: SPACING })
    const fits = await figuresFit(page)
    expect(fits.length).toBeGreaterThan(0)
    for (const f of fits) {
      expect(f.over).toBeLessThanOrEqual(0.5)
      expect(f.hOver).toBeLessThanOrEqual(0)
    }
    const b = await bandFits(page)
    expect(b.over).toBeLessThanOrEqual(0.5)
    expect(b.vOver).toBeLessThanOrEqual(0)
  })
}
