import { render, screen, within } from '@testing-library/react'
import App from './App'

describe('App landmarks', () => {
  it('has one main containing all six sections', () => {
    const { container } = render(<App />)
    const mains = screen.getAllByRole('main')
    expect(mains).toHaveLength(1)
    const ids = [...mains[0].querySelectorAll('section')].map((s) => s.id)
    expect(ids).toEqual([
      'hero',
      'experience',
      'hackathons',
      'projects',
      'about',
      'contact',
    ])
    expect(container.querySelectorAll('main section')).toHaveLength(6)
  })

  it('keeps the nav outside main, labelled Primary', () => {
    render(<App />)
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    expect(within(screen.getByRole('main')).queryByRole('navigation'))
      .toBeNull()
    expect(nav).toBeInTheDocument()
  })

  it('starts with a skip link to main', () => {
    const { container } = render(<App />)
    const first = container.querySelector('a')!
    expect(first).toHaveTextContent('Skip to content')
    expect(first).toHaveAttribute('href', '#main')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1')
  })
})
