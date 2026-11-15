import { test, expect } from '@playwright/test'

const behavior = () =>
  getComputedStyle(document.documentElement).scrollBehavior

test('reduced motion: auto scrolling, nothing animating', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  expect(await page.evaluate(behavior)).toBe('auto')
  const running = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter((a) => a.playState === 'running').length,
  )
  expect(running).toBe(0)
})

test('no preference: smooth scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('./')
  expect(await page.evaluate(behavior)).toBe('smooth')
})

test('reduced motion: style changes create no transitions', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  const result = await page.evaluate(async () => {
    const nav = document.querySelector('nav') as HTMLElement
    void getComputedStyle(nav).maxWidth
    nav.style.maxWidth = '50%'
    nav.style.color = 'rgb(255, 0, 0)'
    const same = document.getAnimations().length
    await new Promise((r) => requestAnimationFrame(() => r(null)))
    return [same, document.getAnimations().length]
  })
  expect(result).toEqual([0, 0])
})

// Records every text each [data-figure] numeral ever shows.
const record = () => {
  const seen = new Map<Element, string[]>()
  ;(window as unknown as { __seen: typeof seen }).__seen = seen
  new MutationObserver(() => {
    document.querySelectorAll('[data-figure]').forEach((fig) => {
      const text = fig.querySelector('[aria-hidden="true"]')?.textContent
      const list = seen.get(fig) ?? []
      if (text != null && list[list.length - 1] !== text) list.push(text)
      seen.set(fig, list)
    })
  }).observe(document, { subtree: true, characterData: true, childList: true })
}

const seen = () =>
  Object.fromEntries(
    [...(window as unknown as { __seen: Map<Element, string[]> })
      .__seen].map(([el, texts]) => [
      `${el.closest('section')?.id}:` +
        el.querySelector('[aria-hidden="true"]')?.textContent,
      texts,
    ]),
  )

test('reduced motion: every figure only ever shows its final value', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(record)
  await page.goto('./')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(1200)
  const all = await page.evaluate(seen)
  expect(Object.keys(all).length).toBeGreaterThan(0)
  for (const [key, texts] of Object.entries(all)) {
    const final = key.split(':')[1]
    expect(texts.every((t) => t === final)).toBe(true)
  }
})

test('motion: hero counts up to ~70, a row figure to its value', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.addInitScript(record)
  await page.goto('./')
  const hero = page.locator('#hero [data-figure] > [aria-hidden="true"]')
  await expect(hero).toHaveText('~70')
  const all = await page.evaluate(seen)
  const texts = Object.entries(all).find(([k]) => k.startsWith('hero:'))![1]
  expect(texts.some((t) => t !== '~70')).toBe(true)
  await page.locator('#experience').scrollIntoViewIfNeeded()
  await page.locator('#experience').evaluate((el) => el.scrollIntoView())
  const row = page
    .locator('#experience [data-figure] > [aria-hidden="true"]')
    .first()
  await expect(row).toHaveText('~15,000')
})

test('motion: counting shifts nothing', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('./')
  const num = page.locator('#hero [data-figure] > [aria-hidden="true"]')
  const cap = page.locator('#hero [data-figure] + *').first()
  // relative, so the hero's entrance translate cancels out
  const measure = async () => {
    const [n, c] = await Promise.all([num.boundingBox(), cap.boundingBox()])
    return [n!.width, n!.height, c!.x - n!.x, c!.y - n!.y]
  }
  const first = await measure()
  // caption offset is only stable once the entrance rise has finished
  await page.evaluate(() =>
    Promise.all(document.getAnimations().map((a) => a.finished)),
  )
  const risen = await measure()
  await expect(num).toHaveText('~70')
  await page.waitForTimeout(1000)
  const after = await measure()
  expect(after[0]).toBe(first[0])
  expect(Math.abs(after[1] - first[1])).toBeLessThan(1)
  expect(after).toEqual(risen)
})
