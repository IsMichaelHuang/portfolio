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

  it('renders the Now line under the summary', () => {
    const { container } = render(<Hero />)
    const now =
      'Now: Contract AI Engineer at Intuit Credit Karma in Oakland, ' +
      'CA. Built an AI code review agent that reviews about 70 pull ' +
      'requests a day.'
    const el = screen.getByText('Now:').parentElement!
    expect(el.textContent).toBe(now)
    expect(el.previousElementSibling).toHaveTextContent(
      /^Applied AI engineer/,
    )
    expect(container.querySelectorAll('h1, h2')).toHaveLength(1)
  })

  it('renders the four links in order', () => {
    render(<Hero />)
    const names = screen.getAllByRole('link').map((a) => a.textContent)
    expect(names[0]).toMatch(/^Resume/)
    expect(names[1]).toMatch(/^GitHub/)
    expect(names[2]).toMatch(/^LinkedIn/)
  })

  it('adds a plain Email link after LinkedIn', () => {
    render(<Hero />)
    const links = screen.getAllByRole('link')
    expect(links[3]).toHaveAccessibleName('Email')
    expect(links[3]).toHaveAttribute(
      'href',
      'mailto:michael.micah.huang@gmail.com',
    )
    expect(links[3]).not.toHaveAttribute('target')
  })
})
