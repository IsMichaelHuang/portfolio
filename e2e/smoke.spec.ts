import { test, expect } from '@playwright/test'

test('loads with no console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('./')
  await expect(page.locator('h1')).toBeVisible()
  expect(errors).toEqual([])
})

for (const id of ['about', 'experience', 'projects', 'contact']) {
  test(`nav link #${id} brings its section into view`, async ({ page }) => {
    await page.goto('./')
    await page.locator(`nav a[href="#${id}"]`).click()
    await expect(page.locator(`#${id}`)).toBeInViewport()
  })
}

test('resume link target responds 200', async ({ page, request }) => {
  await page.goto('./')
  const link = page.getByRole('link', { name: 'Resume' })
  const href = await link.getAttribute('href')
  const res = await request.get(new URL(href!, page.url()).toString())
  expect(res.status()).toBe(200)
})
