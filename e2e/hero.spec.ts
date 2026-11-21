import { test, expect } from '@playwright/test'

test('nav mark is visible and sharp on 2x screens', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('./')
  const img = page.locator('nav img')
  await expect(img).toBeVisible()
  const m = await img.evaluate((el: HTMLImageElement) => ({
    natural: el.naturalWidth,
    rendered: el.getBoundingClientRect().width,
  }))
  expect(m.natural).toBeGreaterThan(0)
  expect(m.natural).toBeGreaterThanOrEqual(2 * m.rendered)
})

test('hero sits on the amber ground', async ({ page }) => {
  await page.goto('./')
  await expect(page.locator('#hero')).toHaveCSS(
    'background-color',
    'rgb(236, 163, 88)',
  )
})

test('reduced motion: hero does not animate', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  const running = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter((a) => a.playState === 'running').length,
  )
  expect(running).toBe(0)
  await expect(page.locator('#hero h1')).toHaveCSS('opacity', '1')
})

test('load animation ends with the heading visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('./')
  await page.evaluate(() =>
    Promise.all(document.getAnimations().map((a) => a.finished)),
  )
  await expect(page.locator('#hero h1')).toHaveCSS('opacity', '1')
})

test('body has no background image', async ({ page }) => {
  await page.goto('./')
  const img = await page.evaluate(
    () => getComputedStyle(document.body).backgroundImage,
  )
  expect(img).toBe('none')
})

test('no horizontal scroll at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('./')
  const over = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  )
  expect(over).toBe(false)
})

test('the ~ glyph top meets the top of the digits', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  await page.evaluate(() => document.fonts.ready)
  const m = await page.evaluate(() => {
    const num = document.querySelector(
      '#hero [data-figure] > span[aria-hidden]',
    )!
    const markEl = num.firstElementChild as HTMLElement
    const ctx = document.createElement('canvas').getContext('2d')!
    // Glyph top = line-box top + font ascent - glyph ascent
    const glyphTop = (n: Node, el: HTMLElement) => {
      const cs = getComputedStyle(el)
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      const t = ctx.measureText(n.textContent!)
      const r = document.createRange()
      r.selectNodeContents(n)
      return (
        r.getBoundingClientRect().top +
        t.fontBoundingBoxAscent -
        t.actualBoundingBoxAscent
      )
    }
    return {
      mark: glyphTop(markEl.firstChild!, markEl),
      digits: glyphTop(num.lastChild!, num as HTMLElement),
      size: parseFloat(getComputedStyle(num).fontSize),
      navBottom: document.querySelector('nav')!.getBoundingClientRect().bottom,
    }
  })
  expect(Math.abs(m.mark - m.digits)).toBeLessThanOrEqual(0.04 * m.size)
  expect(m.mark).toBeGreaterThanOrEqual(m.navBottom)
})
