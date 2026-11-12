import { test, expect, type Page } from '@playwright/test'

async function open(page: Page, width: number, height = 800) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width, height })
  await page.goto('./')
  await page.evaluate(() => document.fonts.ready)
}

// Cards are the h4 parents inside #pinned (class names are hashed).
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

test('last odd card is centred, one column wide at 1280px', async ({
  page,
}) => {
  await open(page, 1280)
  await ensureCards(page, 3)
  // drop to exactly three cards so the last one is odd
  await page.evaluate(() => {
    const hs = document.querySelectorAll('#pinned h4')
    for (let i = hs.length - 1; i >= 3; i--) hs[i].parentElement!.remove()
  })
  const all = await cards(page).all()
  expect(all.length % 2).toBe(1)
  const last = (await all[all.length - 1].boundingBox())!
  const grid = (await cards(page).first().locator('xpath=..').boundingBox())!
  expect(last.width).toBe(428)
  expect(
    Math.abs(last.x + last.width / 2 - (grid.x + grid.width / 2)),
  ).toBeLessThanOrEqual(1)
})

test('row-mates match height and align their link rows', async ({
  page,
}) => {
  await open(page, 1280)
  await ensureCards(page, 2)
  const all = await cards(page).all()
  const [a, b] = [await all[0].boundingBox(), await all[1].boundingBox()]
  expect(a!.height).toBe(b!.height)
  const tops = await Promise.all(
    [all[0], all[1]].map((c) =>
      c.locator('a').first().evaluate((el) => el.getBoundingClientRect().top),
    ),
  )
  expect(Math.abs(tops[0] - tops[1])).toBeLessThanOrEqual(1)
})

test('cards without descriptions have no forced void', async ({ page }) => {
  await open(page, 1280)
  await ensureCards(page, 4)
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('#pinned h4')).map(
      (h) => h.parentElement!,
    )
    for (const c of [all[2], all[3]]) c.querySelector('p')?.remove()
  })
  const all = await cards(page).all()
  for (const i of [2, 3]) {
    expect((await all[i].boundingBox())!.height).toBeLessThan(200)
  }
})

test('last card matches the others at 375px', async ({ page }) => {
  await open(page, 375)
  await ensureCards(page, 3)
  const all = await cards(page).all()
  const first = (await all[0].boundingBox())!
  const last = (await all[all.length - 1].boundingBox())!
  expect(last.width).toBe(first.width)
})

for (const width of [375, 1280]) {
  test(`hero links are 44px tall at ${width}px`, async ({ page }) => {
    await open(page, width)
    for (const el of await page.locator('#hero a').all()) {
      expect((await el.boundingBox())!.height).toBeGreaterThanOrEqual(44)
    }
  })
}

test('Resume is the lead hero action', async ({ page }) => {
  await open(page, 1280)
  const border = (name: string) =>
    page
      .locator('#hero a', { hasText: name })
      .evaluate((el) => getComputedStyle(el).borderTopColor)
  expect(await border('Resume')).toBe('rgb(74, 108, 247)')
  expect(await border('GitHub')).not.toBe('rgb(74, 108, 247)')
})

test('links are 44px tall on phones, no scroll at 320px', async ({
  page,
}) => {
  await open(page, 375)
  const links = page.locator('nav a, #projects a, #contact a, footer a')
  expect(await links.count()).toBeGreaterThan(8)
  for (const el of await links.all()) {
    expect((await el.boundingBox())!.height).toBeGreaterThanOrEqual(44)
  }
  await page.setViewportSize({ width: 320, height: 800 })
  const [sw, cw] = await page.evaluate(() => [
    document.documentElement.scrollWidth,
    document.documentElement.clientWidth,
  ])
  expect(sw).toBeLessThanOrEqual(cw)
})

test('project links share one hover language', async ({ page }) => {
  await open(page, 1280)
  const link = page.locator('#projects a', { hasText: 'Code' }).first()
  await link.hover()
  await expect
    .poll(() => link.evaluate((el) => getComputedStyle(el).color))
    .toBe('rgb(128, 152, 255)')
  const s = await link.evaluate((el) => {
    const c = getComputedStyle(el)
    return [c.textDecorationLine, c.textShadow]
  })
  expect(s[0]).toContain('underline')
  expect(s[1]).toBe('none')
})

test('About lead paragraph and prose typography', async ({ page }) => {
  await open(page, 1280)
  const [p1, p2] = await page.locator('#about p').evaluateAll((els) =>
    els.slice(0, 2).map((el) => {
      const c = getComputedStyle(el)
      return { color: c.color, size: parseFloat(c.fontSize) }
    }),
  )
  expect(p1.color).not.toBe(p2.color)
  expect(p1.size).toBeGreaterThan(p2.size)
  const nowrap = await page
    .locator('#experience article span', { hasText: /20\d\d/ })
    .evaluateAll((els) => els.map((e) => getComputedStyle(e).whiteSpace))
  expect(nowrap.length).toBeGreaterThan(0)
  for (const w of nowrap) expect(w).toBe('nowrap')
  const sizes = await page
    .locator('#experience li')
    .evaluateAll((els) => els.map((e) => getComputedStyle(e).fontSize))
  for (const s of sizes) expect(s).toBe('16px')
})

test('hero is no taller than the phone viewport', async ({ page }) => {
  await open(page, 375, 812)
  const h = await page
    .locator('#hero')
    .evaluate((el) => el.getBoundingClientRect().height)
  expect(h).toBeLessThanOrEqual(812)
})

test('hero links form two rows of two, 44px tall, at 375px', async ({
  page,
}) => {
  await open(page, 375, 812)
  const boxes = await page
    .locator('#hero a')
    .evaluateAll((els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect()
        return { top: Math.round(r.top), width: r.width, h: r.height }
      }),
    )
  expect(boxes).toHaveLength(4)
  expect(new Set(boxes.map((b) => b.top)).size).toBe(2)
  expect(boxes[0].top).toBe(boxes[1].top)
  expect(boxes[2].top).toBe(boxes[3].top)
  expect(Math.abs(boxes[0].width - boxes[1].width)).toBeLessThan(1)
  for (const b of boxes) expect(b.h).toBeGreaterThanOrEqual(44)
})
