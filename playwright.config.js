// End-to-end tests. Run: npm run test:e2e
// They build the site in demo mode (VITE_LOCAL_MODE=1: no Firebase, data in the browser)
// and run against `vite preview`, so they need no network or accounts.
import { defineConfig, devices } from '@playwright/test';

const PORT = 4174;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // One retry in CI to collect evidence, but a test that only passes on retry still fails the run.
  retries: process.env.CI ? 1 : 0,
  failOnFlakyTests: !!process.env.CI,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/`,
    trace: 'off',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 812 } }, grep: /@mobile/ },
  ],
  webServer: {
    command: `npx vite build --outDir dist-e2e --emptyOutDir && npx vite preview --outDir dist-e2e --port ${PORT} --strictPort`,
    env: { VITE_LOCAL_MODE: '1' },
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
