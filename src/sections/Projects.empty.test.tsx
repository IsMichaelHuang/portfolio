import { render, screen } from '@testing-library/react'
import Projects from './Projects'

vi.mock('../data/projects', () => ({
  projects: [
    {
      id: 'r',
      title: 'ResumeBuilder',
      tags: [],
      repoUrl: 'https://github.com/IsMichaelHuang/resumeBuilder',
    },
  ],
}))

describe('Projects with every pin featured', () => {
  it('omits Also on GitHub', () => {
    const { container } = render(<Projects />)
    expect(screen.queryByText('Also on GitHub')).toBeNull()
    expect(container.querySelector('#pinned')).toBeNull()
  })
})
