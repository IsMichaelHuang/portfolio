import { render, screen } from '@testing-library/react'
import Projects from './Projects'

vi.mock('../data/projects', () => ({
  projects: [
    { id: 'a', title: 'Alpha', description: 'About alpha', tags: ['t'] },
    { id: 'b', title: 'Beta', tags: [] },
  ],
}))

describe('Projects', () => {
  it('renders a description only when one exists', () => {
    const { container } = render(<Projects />)
    expect(screen.getByText('About alpha')).toBeInTheDocument()
    expect(container.querySelectorAll('p')).toHaveLength(1)
  })
})
