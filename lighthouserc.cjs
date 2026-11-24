/* eslint-disable @typescript-eslint/no-require-imports -- Lighthouse CI CommonJS configuration. */

const { execFileSync } = require("node:child_process");
const path = require("node:path");

const port = 3200;
const baseURL = `http://localhost:${port}`;

const profile = process.env.LIGHTHOUSE_PROFILE ?? "mobile";

if (!["mobile", "desktop"].includes(profile)) {
  throw new Error(`Unsupported Lighthouse profile: ${profile}`);
}

const isDesktop = profile === "desktop";

function discoverRoutes() {
  const output = execFileSync(
    process.execPath,
    [
      "--import",
      "tsx",
      path.resolve(__dirname, "tests/performance/lighthouse-routes.ts"),
    ],
    {
      cwd: __dirname,
      encoding: "utf8",
    },
  );

  const routes = JSON.parse(output);

  if (
    !Array.isArray(routes) ||
    routes.length === 0 ||
    routes.some(
      (route) =>
        typeof route !== "string" ||
        !route.startsWith("/") ||
        route.startsWith("//"),
    )
  ) {
    throw new Error("Lighthouse route discovery returned invalid routes.");
  }

  return routes;
}

const routes = discoverRoutes();

function scoreAssertion(minScore) {
  return [
    "warn",
    {
      minScore,
      aggregationMethod: "median",
    },
  ];
}

function metricAssertion(maxNumericValue) {
  return [
    "warn",
    {
      maxNumericValue,
      aggregationMethod: "median",
    },
  ];
}

module.exports = {
  ci: {
    collect: {
      startServerCommand: `pnpm start:test --port ${port}`,
      startServerReadyPattern: "Ready",
      startServerReadyTimeout: 120_000,

      numberOfRuns: 3,

      url: routes.map((pathname) => `${baseURL}${pathname}`),

      settings: {
        ...(isDesktop ? { preset: "desktop" } : {}),

        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
      },
    },

    assert: {
      assertions: {
        "categories:performance": scoreAssertion(0.95),

        "categories:accessibility": scoreAssertion(1),

        "categories:best-practices": scoreAssertion(0.95),

        "categories:seo": scoreAssertion(1),

        "is-crawlable": "off",

        "largest-contentful-paint": metricAssertion(2500),

        "first-contentful-paint": metricAssertion(1800),

        "cumulative-layout-shift": metricAssertion(0.1),

        "total-blocking-time": metricAssertion(200),

        "speed-index": metricAssertion(3400),
      },
    },

    upload: {
      target: "filesystem",
      outputDir: `./reports/lighthouse/${profile}`,
    },
  },
};
