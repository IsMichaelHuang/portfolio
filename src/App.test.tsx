import { render, screen } from '@testing-library/react'
import App from './App'

const headings = ['About', 'Experience', 'Projects', 'Get In Touch']

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
