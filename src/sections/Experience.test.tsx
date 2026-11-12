import { render, screen } from '@testing-library/react'
import Experience from './Experience'
import { experience } from '../data/experience'

describe('Experience hackathons', () => {
  it('sits second in the data', () => {
    expect(experience.map((e) => e.id).slice(0, 3)).toEqual([
      'dynamic-experts',
      'hackathons',
      'solidigm',
    ])
  })

  it('renders role, period and all four bullets', () => {
    render(<Experience />)
    expect(
      screen.getByRole('heading', { name: 'Hackathon Wins' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Jan 2026')).toBeInTheDocument()
    const e = experience.find((x) => x.id === 'hackathons')!
    expect(e.highlights).toHaveLength(4)
    expect(e.highlights[0]).toMatch(/^Won 2nd place at two hackathons/)
    expect(e.highlights[3]).toMatch(/^Led orchestration of four micro/)
    for (const h of e.highlights) {
      expect(screen.getByText(h)).toBeInTheDocument()
    }
  })
})
