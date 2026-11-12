import { render, screen } from '@testing-library/react'
import ExternalLink from './ExternalLink'

describe('ExternalLink', () => {
  it('opens safely in a new tab with an sr-only suffix', () => {
    render(<ExternalLink href="https://x.test">GitHub</ExternalLink>)
    const a = screen.getByRole('link')
    expect(a).toHaveAttribute('target', '_blank')
    expect(a).toHaveAttribute('rel', 'noopener noreferrer')
    expect(a).toHaveTextContent('GitHub (opens in new tab)')
    expect(a.querySelector('.sr-only')).toHaveTextContent(
      '(opens in new tab)',
    )
    expect(a.firstChild?.textContent).toBe('GitHub')
  })

  it('adds the context after the visible text', () => {
    render(
      <ExternalLink href="https://x.test" context="DiscordBot">
        Code
      </ExternalLink>,
    )
    expect(screen.getByRole('link').textContent).toBe(
      'Code for DiscordBot (opens in new tab)',
    )
  })

  it('puts a hint before the new-tab note and forwards className', () => {
    render(
      <ExternalLink href="https://x.test" hint="PDF" className="c">
        Resume
      </ExternalLink>,
    )
    const a = screen.getByRole('link')
    expect(a.textContent).toBe('Resume (PDF, opens in new tab)')
    expect(a).toHaveClass('c')
  })
})
