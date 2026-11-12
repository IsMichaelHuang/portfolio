import AxeBuilder from '@axe-core/playwright'
import { test, expect } from '@playwright/test'

const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

for (const [width, height] of [
  [320, 700],
  [375, 812],
  [1280, 800],
]) {
  test(`axe finds no violations at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width, height })
    await page.goto('./')
    const { violations } = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze()
    const report = violations.map(
      (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`,
    )
    expect(report, report.join('\n')).toEqual([])
  })
}

test('WCAG 1.4.12 text spacing keeps 320px free of h-scroll', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('./')
  await page.addStyleTag({
    content: `* { line-height: 1.5 !important;
      letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
      p { margin-bottom: 2em !important; }`,
  })
  const [sw, cw] = await page.evaluate(() => [
    document.documentElement.scrollWidth,
    document.documentElement.clientWidth,
  ])
  expect(sw).toBeLessThanOrEqual(cw)
})
