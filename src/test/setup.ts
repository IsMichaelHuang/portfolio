import '@testing-library/jest-dom/vitest'

// jsdom has no IntersectionObserver; Navbar constructs one on mount.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
globalThis.IntersectionObserver =
  IntersectionObserverStub as unknown as typeof IntersectionObserver
