import { render, screen } from '@testing-library/react'
import Hero from './Hero'
import Projects from './Projects'

vi.mock('../data/projects', () => ({
  projects: [
    {
      id: 'a',
      title: 'Alpha',
      tags: [],
      repoUrl: 'https://github.com/o/alpha',
      liveUrl: 'https://alpha.test',
    },
  ],
}))

describe('link purpose', () => {
  it('points Resume at the base-path PDF and says PDF', () => {
    render(<Hero />)
    const a = screen.getByRole('link', { name: /^Resume/ })
    expect(a).toHaveAttribute(
      'href',
      `${import.meta.env.BASE_URL}resume.pdf`,
    )
    expect(a).toHaveAccessibleName(/PDF/)
  })

  it('names the project in Code and Live links', () => {
    render(<Projects />)
    expect(
      screen.getByRole('link', { name: /^Code.*Alpha/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /^Live.*Alpha/ }),
    ).toBeInTheDocument()
  })
})
