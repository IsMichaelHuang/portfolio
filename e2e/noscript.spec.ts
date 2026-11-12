import { test, expect } from '@playwright/test'

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('shows name, role and contact links', async ({ page }) => {
    await page.goto('./')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Michael Huang' }),
    ).toBeVisible()
    await expect(
      page.getByRole('paragraph').filter({ hasText: /^Software Engineer$/ }),
    ).toBeVisible()
    const hrefs = {
      Resume: '/portfolio/resume.pdf',
      GitHub: 'https://github.com/IsMichaelHuang',
      LinkedIn: 'https://www.linkedin.com/in/michael-micah-huang/',
      Email: 'mailto:michael.micah.huang@gmail.com',
    }
    for (const [name, href] of Object.entries(hrefs)) {
      const link = page.getByRole('link', { name })
      await expect(link).toBeVisible()
      await expect(link).toHaveAttribute('href', href)
    }
  })
})

test('with JavaScript the noscript block is not rendered', async ({
  page,
}) => {
  await page.goto('./')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Michael Huang' }),
  ).toHaveCount(1)
})
