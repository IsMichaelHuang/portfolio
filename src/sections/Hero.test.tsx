import { render, screen } from '@testing-library/react'
import Hero from './Hero'
import { heroFigure } from '../data/experience'

describe('Hero', () => {
  it('has no image', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('img')).toBeNull()
  })

  it('renders name and summary', () => {
    render(<Hero />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Michael Huang' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Software Engineer')).toBeNull()
    expect(
      screen.getByText(
        'Applied AI engineer — multi-agent systems and LLM ' +
          'infrastructure.',
      ),
    ).toBeInTheDocument()
  })

  it('opens on the hero figure, with no Now line', () => {
    const { container } = render(<Hero />)
    const fig = container.querySelector('[data-figure]')!
    expect(fig).not.toBeNull()
    expect(fig).not.toHaveAttribute('aria-hidden')
    expect(fig).toHaveTextContent('about 70')
    expect(fig).toHaveTextContent(heroFigure.unit!)
    expect(screen.queryByText(/Now:/)).toBeNull()
    expect(container.querySelectorAll('h1')).toHaveLength(1)
    expect(container.querySelectorAll('h2')).toHaveLength(0)
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
