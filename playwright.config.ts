import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: "list",

  use: {
    baseURL,
    trace: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: `pnpm start:test --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,

    env: {
      NODE_ENV: "production",
      APP_ENV: "staging",
      SITE_URL: "https://example.com",
      NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT:
        "https://ik.imagekit.io/tronosastaging",
    },
  },
});
