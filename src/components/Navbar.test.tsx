import { render, screen, within } from '@testing-library/react'
import Navbar from './Navbar'

describe('Navbar', () => {
  it('renders four links to the section anchors', () => {
    render(<Navbar />)
    const nav = screen.getByRole('navigation')
    const hrefs = within(nav)
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'))
      .filter((h) => h !== '#hero')
    expect(hrefs).toEqual([
      '#about',
      '#experience',
      '#projects',
      '#contact',
    ])
  })
})
