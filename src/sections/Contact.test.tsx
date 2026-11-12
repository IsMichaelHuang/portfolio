import { render, screen } from '@testing-library/react'
import Contact from './Contact'

describe('Contact', () => {
  it('shows the address as a mailto link', () => {
    render(<Contact />)
    const a = screen.getByRole('link', {
      name: 'michael.micah.huang@gmail.com',
    })
    expect(a).toHaveAttribute('href', 'mailto:michael.micah.huang@gmail.com')
    expect(a).not.toHaveAttribute('target')
  })
})
