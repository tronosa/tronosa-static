module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm start --port 3200",
      startServerReadyPattern: "Ready",
      startServerReadyTimeout: 60_000,

      numberOfRuns: 3,

      url: [
        "http://localhost:3200/",
        "http://localhost:3200/proizvodi",
        "http://localhost:3200/o-nama",
        "http://localhost:3200/blog",
      ],
    },

    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.95 }],

        "categories:accessibility": ["warn", { minScore: 1 }],

        "categories:best-practices": ["warn", { minScore: 0.95 }],

        "categories:seo": ["warn", { minScore: 1 }],

        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],

        "first-contentful-paint": ["warn", { maxNumericValue: 1800 }],

        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.1 }],

        "total-blocking-time": ["warn", { maxNumericValue: 200 }],

        "speed-index": ["warn", { maxNumericValue: 3400 }],
      },
    },

    upload: {
      target: "filesystem",
      outputDir: "./reports/lighthouse",
    },
  },
};
