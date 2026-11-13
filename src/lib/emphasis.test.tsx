import { render } from '@testing-library/react'
import { renderEmphasis } from './emphasis'

const html = (text: string) => {
  const { container } = render(<p>{renderEmphasis(text)}</p>)
  return container.firstElementChild!.innerHTML
}

describe('renderEmphasis', () => {
  it('leaves text without markers unchanged', () => {
    expect(html('plain text')).toBe('plain text')
  })

  it('renders one run in strong and drops the markers', () => {
    expect(html('a **b** c')).toBe('a <strong>b</strong> c')
  })

  it('renders several runs', () => {
    expect(html('**a** and **b**')).toBe(
      '<strong>a</strong> and <strong>b</strong>',
    )
  })

  it('renders adjacent runs', () => {
    expect(html('**a****b**')).toBe('<strong>a</strong><strong>b</strong>')
  })

  it('renders a mid-word run', () => {
    expect(html('re**act**ive')).toBe('re<strong>act</strong>ive')
  })

  it('renders an odd number of markers literally', () => {
    expect(html('a **b c')).toBe('a **b c')
    expect(html('**a** b **c')).toBe('**a** b **c')
  })

  it('drops empty strong runs', () => {
    expect(html('a****b')).toBe('ab')
  })

  it('passes ~, .env, {{PLACEHOLDER}} and quotes through', () => {
    const s =
      'Implemented **.env secret injection** to keep it out, using a ' +
      'custom {{PLACEHOLDER}} system, ~70 PRs "a day"'
    const { container } = render(<p>{renderEmphasis(s)}</p>)
    expect(container.querySelector('strong')).toHaveTextContent(
      '.env secret injection',
    )
    expect(container).toHaveTextContent(s.replaceAll('**', ''))
  })

  it('logs no React key warning', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<p>{renderEmphasis('**a** b **c** d **e**')}</p>)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
