import { act, render } from '@testing-library/react'
import Figure from './Figure'
import { figureWidth } from '../lib/figure'

function setup(props: Partial<Parameters<typeof Figure>[0]> = {}) {
  const { container } = render(<Figure value="157" size="hero" {...props} />)
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

  it('sets a leading ~ in its own span, only when present', () => {
    const c = setup({ value: '~70' })
    const visible = c.querySelector('span[aria-hidden="true"]')!
    expect(visible.children).toHaveLength(1)
    expect(visible.children[0].textContent).toBe('~')
    expect(visible.textContent).toBe('~70')
    const plain = setup({}).querySelector('span[aria-hidden="true"]')!
    expect(plain.children).toHaveLength(0)
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

describe('Figure --w', () => {
  it('is set on a row figure only', () => {
    const w = (size: 'hero' | 'row' | 'band') =>
      setup({ value: '~15,000', size })
        .querySelector<HTMLElement>('[data-figure]')!
        .style.getPropertyValue('--w')
    expect(w('row')).toBe(String(figureWidth('~15,000')))
    expect(w('hero')).toBe('')
    expect(w('band')).toBe('')
  })
})

describe('Figure count-up', () => {
  type IO = { cb: IntersectionObserverCallback; disconnect: () => void }
  let io: IO | undefined
  let frames: FrameRequestCallback[]
  let cancelled: number[]
  let reduced: boolean
  let inView: boolean

  function stub() {
    io = undefined
    frames = []
    cancelled = []
    vi.stubGlobal('matchMedia', () => ({ matches: reduced }))
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: IntersectionObserverCallback) {
          io = { cb, disconnect: vi.fn() }
        }
        observe() {}
        disconnect() {
          io!.disconnect()
        }
      },
    )
    vi.stubGlobal('requestAnimationFrame', (f: FrameRequestCallback) => {
      frames.push(f)
      return frames.length
    })
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      cancelled.push(id)
    })
  }
  const numeral = (c: HTMLElement) =>
    c.querySelector('span[aria-hidden="true"]')!
  const fire = () =>
    act(() =>
      io!.cb(
        [
          {
            isIntersecting: true,
            intersectionRatio: 1,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      ),
    )
  const tick = (ms: number) => act(() => frames.shift()!(ms))

  beforeEach(() => {
    reduced = false
    inView = false
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
      () =>
        (inView
          ? {
              top: 0,
              left: 0,
              bottom: 100,
              right: 100,
              width: 100,
              height: 100,
            }
          : {
              top: 5000,
              left: 0,
              bottom: 5100,
              right: 100,
              width: 100,
              height: 100,
            }) as DOMRect,
    )
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('shows the final value without the browser APIs', () => {
    const c = setup({ value: '~15,000' })
    expect(numeral(c)).toHaveTextContent('~15,000')
  })

  it('rests on the final value until seen, then counts up', () => {
    stub()
    const c = setup({ value: '~15,000' })
    expect(numeral(c).textContent).toBe('~15,000')
    expect(frames).toHaveLength(0)
    fire()
    expect(numeral(c).textContent).toBe('~0')
    expect(numeral(c).children[0].textContent).toBe('~')
    tick(0)
    tick(400)
    const mid = numeral(c).textContent!
    expect(mid).not.toBe('~0')
    expect(mid).not.toBe('~15,000')
    expect(c.querySelector('.sr-only')).toHaveTextContent('about 15,000')
    tick(900)
    expect(numeral(c).textContent).toBe('~15,000')
    expect(frames).toHaveLength(0)
  })

  it('starts at frame 0 at once when already in view', () => {
    inView = true
    stub()
    const c = setup({ value: '~15,000' })
    expect(numeral(c).textContent).toBe('~0')
    expect(frames).toHaveLength(1)
    tick(0)
    tick(900)
    expect(numeral(c).textContent).toBe('~15,000')
  })

  it('never leaves the final value under reduced motion', () => {
    reduced = true
    stub()
    const c = setup({ value: '157' })
    expect(numeral(c).textContent).toBe('157')
    expect(io).toBeUndefined()
  })

  it('leaves values with nothing to count alone', () => {
    stub()
    const c = setup({ value: '2nd' })
    expect(numeral(c).textContent).toBe('2nd')
    expect(io).toBeUndefined()
  })

  it('cancels the frame and restores the value on unmount', () => {
    stub()
    const { container, unmount } = render(<Figure value="157" size="hero" />)
    fire()
    tick(0)
    expect(numeral(container).textContent).not.toBe('157')
    unmount()
    expect(cancelled).toHaveLength(1)
    expect(io!.disconnect).toHaveBeenCalled()
  })
})
