import { test, expect, type Page } from '@playwright/test'

async function open(page: Page, width: number, height = 800) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width, height })
  await page.goto('./')
  await page.evaluate(() => document.fonts.ready)
}

const box = (page: Page, sel: string) =>
  page.locator(sel).first().evaluate((el) => {
    const r = el.getBoundingClientRect()
    return { left: r.left, right: r.right, top: r.top, bottom: r.bottom }
  })

const dds = [
  'LLMs, Agent Orchestration, Multi-Agent Systems, MCP, Claude, ' +
    'Gemini, PyTorch, Scikit-learn',
  'Python, TypeScript, JavaScript (ES6+), C/C++, SQL',
  'React, Node.js, Express, PostgreSQL, MongoDB, REST APIs, HTML5, CSS3',
  'GCP (BigQuery, GCS), Docker, Kubernetes/k3s, Redis, nginx, ' +
    'Uvicorn, CI/CD',
  'Git, Linux, Vitest, pytest, Firecrawl, Jira, Confluence, Agile/Scrum',
]

test('experience rows are ledgers at 1280px', async ({ page }) => {
  await open(page, 1280)
  const rows = await page.locator('#experience article').evaluateAll((as) =>
    as.map((a) => {
      const h = a.querySelector('h3')!.getBoundingClientRect()
      const p = a.querySelector('span')!.getBoundingClientRect()
      return { hLeft: h.left, hTop: h.top, pRight: p.right, pTop: p.top }
    }),
  )
  expect(rows).toHaveLength(3)
  for (const r of rows) {
    expect(r.pRight).toBeLessThan(r.hLeft)
    expect(Math.abs(r.pTop - r.hTop)).toBeLessThanOrEqual(8)
    expect(Math.abs(r.hLeft - rows[0].hLeft)).toBeLessThanOrEqual(1)
  }
})

test('experience entry stacks at 375px', async ({ page }) => {
  await open(page, 375, 812)
  const r = await page.locator('#experience article').first().evaluate((a) => ({
    h: a.querySelector('h3')!.getBoundingClientRect().bottom,
    p: a.querySelector('span')!.getBoundingClientRect().top,
  }))
  expect(r.h).toBeLessThan(r.p)
})

test('section h2 left edges match the row left edge', async ({ page }) => {
  await open(page, 1280)
  const row = (await box(page, '#experience article')).left
  for (const id of ['experience', 'about', 'projects'])
    expect(
      Math.abs((await box(page, `#${id} > h2`)).left - row),
    ).toBeLessThanOrEqual(1)
})

test('about skills are a dl of text rows', async ({ page }) => {
  await open(page, 1280)
  expect(await page.locator('#about dl dt').allTextContents()).toEqual([
    'AI/ML',
    'Languages',
    'Web',
    'Infrastructure',
    'Tools',
  ])
  expect(await page.locator('#about dl dd').allTextContents()).toEqual(dds)
  await expect(page.locator('#about [data-pill]')).toHaveCount(0)
})

test('about shows education', async ({ page }) => {
  await open(page, 1280)
  const about = page.locator('#about')
  for (const t of [
    'California Polytechnic State University, San Luis Obispo',
    'Bachelor of Science in Computer Science, Minor in Philosophy',
    "Dean's List — Fall 2024 & Spring 2025 (Senior Year)",
    'AWS Academy Cloud Security Foundations',
  ])
    await expect(about.getByText(t)).toBeVisible()
})

for (const [width, left] of [
  [1280, true],
  [375, false],
] as const) {
  test(`graduation sits ${left ? 'left of' : 'above'} school at ${width}px`, async ({
    page,
  }) => {
    await open(page, width, 812)
    const g = await page
      .getByText('Graduated Aug 2025')
      .evaluate((e) => e.getBoundingClientRect().right)
    const s = await page
      .getByText('California Polytechnic State University, San Luis Obispo')
      .evaluate((e) => e.getBoundingClientRect().left)
    if (left) expect(g).toBeLessThan(s)
    else expect(g).toBeGreaterThan(s)
  })
}

test('bold run matches the company colour', async ({ page }) => {
  await open(page, 1280)
  const [s, h] = await Promise.all(
    ['#experience li strong', '#experience h3'].map((q) =>
      page.locator(q).first().evaluate((e) => getComputedStyle(e).color),
    ),
  )
  expect(s).toBe(h)
})

for (const width of [320, 720, 880, 1280]) {
  test(`no horizontal scroll at ${width}px`, async ({ page }) => {
    await open(page, width)
    const over = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    )
    expect(over).toBeLessThanOrEqual(0)
  })
}
