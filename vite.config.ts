/**
 * Vite Configuration
 *
 * - react() plugin enables JSX transform and Fast Refresh in dev.
 * - base is set to '/portfolio/' because GitHub Pages serves the site
 *   at https://ismichaelhuang.github.io/portfolio/. Without this,
 *   asset paths (CSS, JS, images) would resolve against the root
 *   domain and return 404s.
 *
 * @see https://vite.dev/config/
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',
})
