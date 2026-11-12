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

  it('names the brand link "Michael Huang" with a decorative mark', () => {
    render(<Navbar />)
    const brand = screen.getByRole('link', { name: 'Michael Huang' })
    expect(brand).toHaveAttribute('href', '#hero')
    expect(brand.querySelector('img')).toHaveAttribute('alt', '')
  })
})
