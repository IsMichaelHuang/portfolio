import { render, screen, within } from '@testing-library/react'
import App from '../App'

describe('Footer', () => {
  it('is the one contentinfo, outside main, naming the stack', () => {
    render(<App />)
    const foot = screen.getAllByRole('contentinfo')
    expect(foot).toHaveLength(1)
    expect(foot[0].tagName).toBe('FOOTER')
    expect(screen.getByRole('main')).not.toContainElement(foot[0])
    for (const word of ['React', 'TypeScript', 'Vite']) {
      expect(foot[0]).toHaveTextContent(word)
    }
  })

  it('links the source repo as an external link', () => {
    render(<App />)
    const a = within(screen.getByRole('contentinfo')).getByRole('link')
    expect(a).toHaveAttribute(
      'href',
      'https://github.com/IsMichaelHuang/portfolio',
    )
    expect(a).toHaveAttribute('target', '_blank')
    expect(a).toHaveAttribute('rel', 'noopener noreferrer')
    expect(a).toHaveAccessibleName(/^Source on GitHub.*\(opens in new tab\)$/)
  })
})
