import { render, screen } from '@testing-library/react'
import Hero from './Hero'

describe('Hero', () => {
  it('renders a decorative sized mark', () => {
    const { container } = render(<Hero />)
    const img = container.querySelector('img')!
    expect(img).toHaveAttribute('alt', '')
    expect(Number(img.getAttribute('width'))).toBeGreaterThan(0)
    expect(Number(img.getAttribute('height'))).toBeGreaterThan(0)
  })

  it('renders name, role and summary', () => {
    render(<Hero />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Michael Huang' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Applied AI engineer — multi-agent systems and LLM ' +
          'infrastructure.',
      ),
    ).toBeInTheDocument()
  })

  it('renders the three links in order', () => {
    render(<Hero />)
    const names = screen.getAllByRole('link').map((a) => a.textContent)
    expect(names[0]).toMatch(/^Resume/)
    expect(names[1]).toMatch(/^GitHub/)
    expect(names[2]).toMatch(/^LinkedIn/)
  })
})
