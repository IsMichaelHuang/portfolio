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
      '#experience',
      '#projects',
      '#about',
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

describe('Navbar ground', () => {
  const ground = () =>
    screen.getByRole('navigation').getAttribute('data-ground')

  it('reads a section that is not in the links list', () => {
    render(
      <>
        <Navbar />
        <main>
          <section id="extra" data-ground="teal" />
        </main>
      </>,
    )
    expect(ground()).toBe('teal')
  })

  it('takes the ground of the last section in main', () => {
    render(
      <>
        <Navbar />
        <main>
          <section id="a" data-ground="amber" />
          <section id="b" data-ground="teal" />
        </main>
      </>,
    )
    expect(ground()).toBe('teal')
  })

  it('ignores sections outside main', () => {
    render(
      <>
        <Navbar />
        <main>
          <section id="in" data-ground="teal" />
        </main>
        <section id="out" data-ground="ink" />
      </>,
    )
    expect(ground()).toBe('teal')
  })

  it('sets no ground when main is empty', () => {
    render(
      <>
        <Navbar />
        <main />
      </>,
    )
    expect(ground()).toBeNull()
  })
})
