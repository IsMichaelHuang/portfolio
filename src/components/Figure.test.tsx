import { render } from '@testing-library/react'
import Figure from './Figure'

function setup(props: Partial<Parameters<typeof Figure>[0]> = {}) {
  const { container } = render(
    <Figure value="157" size="hero" {...props} />,
  )
  return container
}

describe('Figure', () => {
  it('renders one [data-figure] carrying the size', () => {
    const c = setup({ size: 'row' })
    const all = c.querySelectorAll('[data-figure]')
    expect(all).toHaveLength(1)
    expect(all[0]).toHaveAttribute('data-size', 'row')
  })

  it('speaks a leading ~ as "about" and shows the exact value', () => {
    const c = setup({ value: '~70' })
    expect(c.querySelector('.sr-only')).toHaveTextContent(/^about 70$/)
    const visible = c.querySelector('span[aria-hidden="true"]')
    expect(visible).toHaveTextContent(/^~70$/)
    expect(setup({}).querySelector('.sr-only')?.textContent).toBe('157')
  })

  it('renders the unit only when given', () => {
    const withUnit = setup({ unit: 'hours saved' })
    expect(withUnit).toHaveTextContent('hours saved')
    const bare = render(<Figure value="9" size="band" />).container
    expect(bare.querySelector('[data-figure]')?.children).toHaveLength(2)
  })

  it('is aria-hidden only when decorative', () => {
    const on = setup({ decorative: true })
    expect(on.querySelector('[data-figure]')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    const off = setup({})
    expect(off.querySelector('[data-figure]')).not.toHaveAttribute(
      'aria-hidden',
    )
  })

  it('never uses <strong>', () => {
    expect(setup({ unit: 'x' }).querySelector('strong')).toBeNull()
  })
})
