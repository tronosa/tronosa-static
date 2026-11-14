import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },

  test: {
    environment: "node",

    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "tests/integration/**/*.{test,spec}.{ts,tsx}",
    ],

    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      exclude: ["src/**/*.d.ts", "src/app/**", "tests/**"],
    },
  },
});
