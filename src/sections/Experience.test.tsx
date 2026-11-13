import { render, screen, within } from '@testing-library/react'
import Experience from './Experience'
import { experience } from '../data/experience'

// Independent oracle: the resume copy, with ** marking bold runs.
const expected = [
  {
    id: 'credit-karma',
    company: 'Intuit Credit Karma',
    role: 'Contract AI Engineer',
    period: 'Apr 2026 — Present',
    location: 'Oakland, CA',
    highlights: [
      'Built an AI code review agent pairing LLMs with static analysis ' +
        '(AST parsing, call graphs) and context engineering, reviewing ' +
        '**~70 PRs/day** across **3 repos** and catching **600+ issues**',
      'Built usage telemetry for internal AI tooling on Google Cloud, ' +
        'tracking **~15,000** AI workflow runs per day (**~30** per user)',
      'Maintain an internal marketplace of AI workflows used by ' +
        '**~500** non-technical employees and streamline their ' +
        'onboarding to AI tools',
    ],
  },
  {
    id: 'dynamic-experts',
    company: 'Dynamic Experts',
    role: 'Contract AI Engineer',
    period: 'Dec 2025 — Jan 2026',
    location: 'Remote',
    highlights: [
      'Built a production-grade MCP (Model Context Protocol) server ' +
        'using Gemini deep-research, integrating Gemini 2.5 Pro with ' +
        'markdown sanitization and automated citation handling',
      'Built async polling architecture with **90-minute timeout ' +
        'handling** to support long-running inference tasks (**60+ ' +
        'minutes**)',
      'Delivered a fully documented codebase with **157 unit tests** ' +
        '(Vitest)',
    ],
  },
  {
    id: 'solidigm',
    company: 'Solidigm (Formerly Intel NAND)',
    role: 'Automation and Product Engineering Intern',
    period: 'Jun 2022 — Aug 2023',
    location: 'Folsom, CA',
    highlights: [
      'Migrated legacy Python 2.7 automation frameworks to Python 3.x, ' +
        'modernizing the codebase for **600+ production-line tests** ' +
        'and reducing false-positive failures by **~30%**',
      'Developed automation scripts that increased test coverage, ' +
        'saving the engineering team approximately **8 hours of manual ' +
        'verification per SKU** during testing cycles',
      'Triaged and fixed failing test tickets across the production ' +
        'line, identifying root causes in both test scripts and ' +
        'hardware setup',
    ],
  },
]

const bold = (s: string) =>
  [...s.matchAll(/\*\*(.+?)\*\*/g)].map((m) => m[1])

describe('Experience data', () => {
  it('equals the resume copy, in order', () => {
    expect(
      experience.map(({ id, company, role, period, location, highlights }) => ({
        id, company, role, period, location, highlights,
      })),
    ).toEqual(expected)
  })
})

describe('Experience section', () => {
  it('lists the companies in order with no hackathon entry', () => {
    render(<Experience />)
    const names = screen
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent)
    expect(names).toEqual(expected.map((e) => e.company))
    expect(
      screen.queryByRole('heading', { name: 'Hackathon Wins' }),
    ).toBeNull()
  })

  it.each(expected)('renders $company fields and bullets', (e) => {
    render(<Experience />)
    const heading = screen.getByRole('heading', { name: e.company })
    const article = heading.closest('article')!
    const view = within(article)
    expect(view.getByText(e.role)).toBeInTheDocument()
    expect(view.getByText(e.period)).toBeInTheDocument()
    expect(view.getByText(e.location)).toBeInTheDocument()
    const items = view.getAllByRole('listitem')
    expect(items.map((li) => li.textContent)).toEqual(
      e.highlights.map((h) => h.replaceAll('**', '')),
    )
    const strongs = [...article.querySelectorAll('strong')]
    expect(strongs.map((s) => s.textContent)).toEqual(
      e.highlights.flatMap(bold),
    )
  })

  it('orders each entry: company, role, metadata, bullets', () => {
    render(<Experience />)
    const article = screen
      .getByRole('heading', { name: 'Intuit Credit Karma' })
      .closest('article')!
    const kids = [...article.children]
    expect(kids.map((k) => k.tagName)).toEqual(['H3', 'P', 'DIV', 'UL'])
    expect(kids[2]).toHaveTextContent('Apr 2026 — PresentOakland, CA')
    expect(kids[2].children).toHaveLength(2)
  })
})
