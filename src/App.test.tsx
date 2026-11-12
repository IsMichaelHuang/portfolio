import { render, screen } from '@testing-library/react'
import App from './App'

const headings = [
  'Experience',
  'Hackathons',
  'Projects',
  'About',
  'Get In Touch',
]

describe('App sections', () => {
  it('renders exactly one h1', () => {
    render(<App />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it.each(headings)('renders the h2 "%s"', (name) => {
    render(<App />)
    expect(
      screen.getByRole('heading', { level: 2, name }),
    ).toBeInTheDocument()
  })

  it('orders sections, nav links following their order', () => {
    const { container } = render(<App />)
    const ids = [...container.querySelectorAll('main section')].map(
      (s) => s.id,
    )
    expect(ids).toEqual([
      'hero',
      'experience',
      'hackathons',
      'projects',
      'about',
      'contact',
    ])
    const hrefs = [...container.querySelectorAll('nav a')]
      .map((a) => a.getAttribute('href')!)
      .filter((h) => h !== '#hero')
    expect(hrefs).toEqual([
      '#experience',
      '#projects',
      '#about',
      '#contact',
    ])
    // in section order, each resolving to a section
    const at = hrefs.map((h) => ids.indexOf(h.slice(1)))
    expect(at.every((i) => i >= 0)).toBe(true)
    expect(at).toEqual([...at].sort((a, b) => a - b))
  })

  it('gives every target=_blank link rel noopener noreferrer', () => {
    const { container } = render(<App />)
    const links = container.querySelectorAll('a[target="_blank"]')
    expect(links.length).toBeGreaterThan(0)
    links.forEach((a) => {
      const rel = (a.getAttribute('rel') ?? '').split(/\s+/)
      expect(rel).toContain('noopener')
      expect(rel).toContain('noreferrer')
    })
  })
})
