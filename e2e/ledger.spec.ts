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

test('experience figures sit left of the title at 1280px', async ({
  page,
}) => {
  await open(page, 1280)
  const rows = await page.locator('#experience article').evaluateAll((as) =>
    as.map((a) => {
      const h = a.querySelector('h3')!.getBoundingClientRect()
      const f = a.querySelector('[data-figure]')!.getBoundingClientRect()
      return { hLeft: h.left, hTop: h.top, fRight: f.right, fTop: f.top }
    }),
  )
  expect(rows).toHaveLength(3)
  for (const r of rows) {
    expect(r.fRight).toBeLessThan(r.hLeft)
    expect(Math.abs(r.fTop - r.hTop)).toBeLessThanOrEqual(24)
    expect(Math.abs(r.hLeft - rows[0].hLeft)).toBeLessThanOrEqual(1)
  }
})

test('experience entry stacks at 375px', async ({ page }) => {
  await open(page, 375, 812)
  const r = await page.locator('#experience article').first().evaluate((a) => ({
    f: a.querySelector('[data-figure]')!.getBoundingClientRect().bottom,
    h: a.querySelector('h3')!.getBoundingClientRect().bottom,
    ht: a.querySelector('h3')!.getBoundingClientRect().top,
    p: a.querySelector('div > span')!.getBoundingClientRect().top,
  }))
  expect(r.f).toBeLessThan(r.ht)
  expect(r.h).toBeLessThan(r.p)
})

test('section h2 left edges match the row left edge', async ({ page }) => {
  await open(page, 1280)
  const row = (await box(page, '#experience article')).left
  for (const id of ['experience', 'hackathons', 'about', 'projects'])
    expect(
      Math.abs((await box(page, `#${id} > h2`)).left - row),
    ).toBeLessThanOrEqual(1)
})

test('skills values share the ledger right-column edge', async ({
  page,
}) => {
  await open(page, 1280)
  const dd = (await box(page, '#about dd')).left
  const h3 = (await box(page, '#experience article h3')).left
  expect(Math.abs(dd - h3)).toBeLessThanOrEqual(1)
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
  const rel = left ? 'left of' : 'above'
  test(`graduation sits ${rel} school at ${width}px`, async ({ page }) => {
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

test('skills label and value share a top', async ({ page }) => {
  await open(page, 1280)
  const dt = (await box(page, '#about dt')).top
  const dd = (await box(page, '#about dd')).top
  expect(Math.abs(dt - dd)).toBeLessThanOrEqual(2)
})

test('certification is as muted as the degree', async ({ page }) => {
  await open(page, 1280)
  const color = (t: string) =>
    page.getByText(t).evaluate((e) => getComputedStyle(e).color)
  expect(await color('AWS Academy Cloud Security Foundations')).toBe(
    await color('Bachelor of Science in Computer Science, Minor in Philosophy'),
  )
})

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

test('section headings are left-aligned', async ({ page }) => {
  await open(page, 1280)
  for (const id of ['experience', 'hackathons', 'projects', 'about'])
    expect(
      await page
        .locator(`#${id} > h2`)
        .evaluate((h) => getComputedStyle(h).textAlign),
    ).toMatch(/^(left|start)$/)
})

// The highlights list is the last ul of an entry (Projects has a stack
// list before it); class names are hashed.
for (const id of ['experience', 'projects']) {
  const articles = `#${id} article`

  test(`${id} bullet text starts at the title edge at 1280px`, async ({
    page,
  }) => {
    await open(page, 1280)
    const rows = await page.locator(articles).evaluateAll((as) =>
      as.map((a) => {
        const list = Array.from(a.querySelectorAll('ul')).pop()!
        const li = list.querySelector('li')!
        const range = document.createRange()
        range.selectNodeContents(li)
        const h = a.querySelector('h3')!
        return {
          text: range.getClientRects()[0].left,
          title: h.getBoundingClientRect().left,
          color: getComputedStyle(li).color,
          hColor: getComputedStyle(h).color,
        }
      }),
    )
    expect(rows.length).toBeGreaterThan(0)
    for (const r of rows) {
      expect(Math.abs(r.text - r.title)).toBeLessThanOrEqual(1)
      expect(r.color).toBe(r.hColor)
    }
  })

  test(`${id} bullets stay clear of the figure at 720px`, async ({
    page,
  }) => {
    await open(page, 720)
    const hits = await page.locator(articles).evaluateAll((as) =>
      as.flatMap((a) => {
        const f = a.querySelector('[data-figure]')
        if (!f) return []
        const fr = f.getBoundingClientRect()
        const hit = (e: Element) => {
          const r = e.getBoundingClientRect()
          return (
            r.left < fr.right && r.right > fr.left &&
            r.top < fr.bottom && r.bottom > fr.top
          )
        }
        const list = Array.from(a.querySelectorAll('ul')).pop()!
        return [list, ...Array.from(list.querySelectorAll('li'))]
          .filter(hit)
          .map((e) => e.tagName)
      }),
    )
    expect(hits).toEqual([])
  })

  for (const width of [375, 1280]) {
    test(`${id} entry rhythm is 4px and 16px at ${width}px`, async ({
      page,
    }) => {
      await open(page, width, 812)
      const gaps = await page.locator(articles).evaluateAll((as) =>
        as.map((a) => {
          const list = Array.from(a.querySelectorAll('ul')).pop()!
          const meta = list.previousElementSibling!
          const h = a.querySelector('h3')!
          return {
            title:
              h.nextElementSibling!.getBoundingClientRect().top -
              h.getBoundingClientRect().bottom,
            list:
              list.getBoundingClientRect().top -
              meta.getBoundingClientRect().bottom,
          }
        }),
      )
      expect(gaps.length).toBeGreaterThan(0)
      for (const g of gaps) {
        expect(Math.abs(g.title - 4)).toBeLessThanOrEqual(1)
        expect(Math.abs(g.list - 16)).toBeLessThanOrEqual(1)
      }
    })
  }
}

test('no horizontal scroll at 320px with bullets', async ({ page }) => {
  await open(page, 320)
  const over = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  )
  expect(over).toBeLessThanOrEqual(0)
})
