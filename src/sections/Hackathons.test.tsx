import { render, screen } from '@testing-library/react'
import Hackathons from './Hackathons'

describe('Hackathons', () => {
  it('has an h2 and the events as h3, in resume order', () => {
    render(<Hackathons />)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Hackathons' }),
    ).toBeInTheDocument()
    const events = screen
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent)
    expect(events).toEqual([
      'Claude Code Hack Day @ AWS',
      'Before the Ballot',
      'Lovable × Vapi',
    ])
    expect(screen.queryAllByRole('heading', { level: 4 })).toHaveLength(0)
  })

  it('shows lede and takeaway', () => {
    render(<Hackathons />)
    expect(
      screen.getByText('Second place at three hackathons.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'My biggest lesson from these hackathons so far: clarity ' +
          'wins. Simple idea, strong execution, clear story.',
      ),
    ).toBeInTheDocument()
  })

  it('starts each entry with 2nd and pins one band figure', () => {
    const { container } = render(<Hackathons />)
    const arts = container.querySelectorAll('article')
    expect(arts).toHaveLength(3)
    for (const a of arts) expect(a.textContent).toMatch(/^2nd/)
    const figs = container.querySelectorAll('[data-figure]')
    expect(figs).toHaveLength(1)
    expect(figs[0]).toHaveAttribute('data-size', 'band')
    expect(figs[0]).toHaveAttribute('aria-hidden', 'true')
    expect(figs[0]).toHaveTextContent('2nd')
  })

  it('links Code once, to the live fact checker', () => {
    render(<Hackathons />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute(
      'href',
      'https://github.com/IsMichaelHuang/live-fact-checker',
    )
    expect(links[0]).toHaveAccessibleName(
      /^Code.*for SkepticScript.*opens in new tab/,
    )
  })
})
