import { defineConfig } from '@playwright/test';
import { config } from './configs/config';

export default defineConfig({
  timeout: config.globalTimeout,
  testDir: './tests',
  outputDir: 'test-results',
  retries: 0,
  reporter: [['list'], ['allure-playwright']],

  use: {
    headless: config.headless,
    baseURL: config.baseURL,
    viewport: null, // enables real maximized window behavior
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  // ✅ Supported browsers
  projects: [
    {
      name: 'msedge',
      use: {
        // The browserName is set to 'chromium' because Edge uses the Chromium engine
        browserName: 'chromium',
        channel: 'msedge',
        launchOptions: {
          args: [
            '--start-maximized',
            // 🔧 Use this option when you need to test a specific screen resolution
            //'--window-size=1920,1080',
          ],
        },
      },
    },
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        launchOptions: {
          args: [
            '--start-maximized',
            // 🔧 Use this option when you need to test a specific screen resolution
            //'--window-size=1920,1080',
          ],
          ignoreDefaultArgs: ['--disable-extensions'], // workaround for Chrome-based browsers
        },
      },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        viewport: null,
        launchOptions: {
          // Firefox does not support --start-maximized;  
        },
      },
    },
  ],

  workers: 4,
});
