import { render, screen, within } from '@testing-library/react'
import Projects from './Projects'

const RB = 'https://github.com/IsMichaelHuang/resumeBuilder'

vi.mock('../data/projects', () => ({
  projects: [
    { id: 'a', title: 'Alpha', description: 'About alpha', tags: ['t'] },
    { id: 'b', title: 'Beta', tags: [] },
    {
      id: 'r',
      title: 'ResumeBuilder',
      tags: [],
      repoUrl: 'https://github.com/ismichaelhuang/resumebuilder/',
    },
  ],
}))

const featuredLis: Record<string, string[]> = {
  BudgetTracker: [
    'Built a full-stack budget management app with JWT ' +
      'authentication, expense tracking, and a visual spending ' +
      'dashboard with dark/light mode toggle',
    'Designed a REST API with Express and PostgreSQL, enforcing ' +
      'per-user authorization on every query and zod input validation',
    'Migrated the data layer from MongoDB to PostgreSQL, backed by ' +
      '249 Vitest and Supertest tests',
  ],
  'Modular Resume Build System': [
    'Built a Python build pipeline that assembles tailored ' +
      'single-page resumes from shared LaTeX snippets and ' +
      'version-specific content, outputting compiled PDFs to a ' +
      'clean output directory',
    'Implemented .env secret injection to keep personal info out ' +
      'of version control, using a custom {{PLACEHOLDER}} ' +
      'templating system with no external dependencies',
    'Wrote 61 pytest tests covering env loading, template ' +
      'injection, snippet assembly, document structure, and ' +
      'config integrity',
  ],
  'Laser-Based Audio Injection ("Light Commands")': [
    'Replicated the published "Light Commands" attack, ' +
      'engineering a portable device capable of injecting ' +
      'malicious audio commands into MEMS microphones via ' +
      'modulated laser light',
  ],
}

const heads = () =>
  screen
    .getAllByRole('heading')
    .map((h) => [h.tagName, h.textContent])

describe('Projects', () => {
  it('orders headings: hackathons, featured, also on GitHub', () => {
    render(<Projects />)
    expect(heads().slice(0, 2)).toEqual([
      ['H2', 'Projects'],
      ['H3', 'Hackathons'],
    ])
    const rest = heads().filter(([t]) => t === 'H3').map(([, x]) => x)
    expect(rest).toEqual([
      'Hackathons',
      'BudgetTracker',
      'Modular Resume Build System',
      'Laser-Based Audio Injection ("Light Commands")',
      'Also on GitHub',
    ])
  })

  it('shows lede, takeaway, three 2nd and three events', () => {
    render(<Projects />)
    expect(
      screen.getByText('Second place at three hackathons.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'My biggest lesson from these hackathons so far: clarity ' +
          'wins. Simple idea, strong execution, clear story.',
      ),
    ).toBeInTheDocument()
    expect(screen.getAllByText('2nd')).toHaveLength(3)
    const events = screen
      .getAllByRole('heading', { level: 4 })
      .slice(0, 3)
      .map((h) => h.textContent)
    expect(events).toEqual([
      'Claude Code Hack Day @ AWS',
      'Before the Ballot',
      'Lovable × Vapi',
    ])
  })

  it('renders each featured bullet as its literal text', () => {
    render(<Projects />)
    for (const [title, lines] of Object.entries(featuredLis)) {
      const row = screen
        .getByRole('heading', { level: 3, name: title })
        .closest('article')!
      // lists in a row: the stack, then the highlights
      const items = within(within(row).getAllByRole('list')[1])
        .getAllByRole('listitem')
      expect(items.map((li) => li.textContent)).toEqual(lines)
    }
  })

  it('bolds the numbers', () => {
    render(<Projects />)
    for (const t of ['249', '.env secret injection', '61 pytest tests']) {
      expect(screen.getByText(t).tagName).toBe('STRONG')
    }
  })

  it('links Code only where a repository exists', () => {
    render(<Projects />)
    const row = (n: string) =>
      screen.getByRole('heading', { name: n }).closest('article')!
    expect(within(row('BudgetTracker')).queryByRole('link')).toBeNull()
    expect(
      within(row('Modular Resume Build System')).getByRole('link', {
        name: /^Code/,
      }),
    ).toHaveAttribute('href', RB)
  })

  it('leaves featured repositories out of the pins', () => {
    render(<Projects />)
    const h4 = screen
      .getAllByRole('heading', { level: 4 })
      .map((h) => h.textContent)
    expect(h4).toContain('Alpha')
    expect(h4).toContain('Beta')
    expect(h4).not.toContain('ResumeBuilder')
  })

  it('renders a description only when one exists', () => {
    const { container } = render(<Projects />)
    const pinned = container.querySelector('#pinned')!
    expect(within(pinned as HTMLElement).getByText('About alpha'))
      .toBeInTheDocument()
    expect(pinned.querySelectorAll('p')).toHaveLength(1)
  })
})
