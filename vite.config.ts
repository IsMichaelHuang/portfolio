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
 *
 * @see https://vite.dev/config/
 */
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
