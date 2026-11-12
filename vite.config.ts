/**
 * Vite Configuration
 *
 * - react() plugin enables JSX transform and Fast Refresh in dev.
 * - base is set to '/portfolio/' because GitHub Pages serves the site
 *   at https://ismichaelhuang.github.io/portfolio/. Without this,
 *   asset paths (CSS, JS, images) would resolve against the root
 *   domain and return 404s.
 *
 * - test configures Vitest (jsdom, globals, jest-dom setup).
 * - singleLineMeta joins meta content values that index.html wraps
 *   across lines, so link previews never show stray whitespace.
 *
 * @see https://vite.dev/config/
 */
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

const singleLineMeta: Plugin = {
  name: 'single-line-meta',
  transformIndexHtml: (html) =>
    html.replace(
      /(<meta\b[^>]*?\bcontent=")([^"]*)"/g,
      (_m, head: string, value: string) =>
        `${head}${value.replace(/\s+/g, ' ').trim()}"`,
    ),
}

export default defineConfig({
  plugins: [react(), singleLineMeta],
  base: '/portfolio/',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
