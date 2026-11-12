import { test, expect, type Page } from '@playwright/test'

const family = (page: Page, sel: string) =>
  page.locator(sel).first().evaluate(
    (el) => getComputedStyle(el).fontFamily,
  )

async function ready(page: Page) {
  await page.goto('./')
  await page.evaluate(() => document.fonts.ready)
}

test('every request is same-origin', async ({ page }) => {
  const urls: string[] = []
  page.on('request', (r) => urls.push(r.url()))
  await ready(page)
  const origin = new URL(page.url()).origin
  const foreign = urls.filter((u) => !u.startsWith(origin))
  expect(foreign).toEqual([])
})

test('Jost and Source Serif 4 faces are loaded', async ({ page }) => {
  await ready(page)
  const faces = await page.evaluate(() => {
    const out: { family: string; style: string; status: string }[] = []
    document.fonts.forEach((f) =>
      out.push({ family: f.family, style: f.style, status: f.status }),
    )
    return out
  })
  const loaded = (name: string, style?: string) =>
    faces.some(
      (f) =>
        f.family.includes(name) &&
        f.status === 'loaded' &&
        (!style || f.style === style),
    )
  expect(loaded('Jost')).toBe(true)
  expect(loaded('Source Serif 4')).toBe(true)
  expect(loaded('Source Serif 4', 'italic')).toBe(true)
})

test('headings use Jost, prose uses Source Serif 4', async ({ page }) => {
  await ready(page)
  expect(await family(page, 'h1')).toMatch(/^"?Jost/)
  expect(await family(page, '#about p')).toMatch(/^"?Source Serif 4/)
  const style = await page
    .locator('#about em')
    .first()
    .evaluate((el) => getComputedStyle(el).fontStyle)
  expect(style).toBe('italic')
})

test('nav links and hero buttons use Jost', async ({ page }) => {
  await ready(page)
  for (const sel of ['nav a[href="#about"]', '#hero a']) {
    expect(await family(page, sel)).toMatch(/^"?Jost/)
  }
})
