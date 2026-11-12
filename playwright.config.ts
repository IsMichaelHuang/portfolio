import { defineConfig, devices } from '@playwright/test'

const url = 'http://localhost:4173/portfolio/'

export default defineConfig({
  testDir: 'e2e',
  workers: process.env.CI ? 1 : undefined,
  use: { baseURL: url },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url,
    reuseExistingServer: !process.env.CI,
  },
})
