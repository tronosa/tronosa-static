import { sleep } from "k6";
import type { Options } from "k6/options";

import { routes } from "../config/routes.ts";
import { thresholds } from "../config/thresholds.ts";
import { requestRoute } from "../helpers/request.ts";

const diagnosticRoute = __ENV.DIAGNOSTIC_ROUTE;

const pages = routes.filter((route) =>
  diagnosticRoute ? route.path === diagnosticRoute : route.kind === "page",
);

if (pages.length === 0) {
  throw new Error("No matching routes found.");
}

export const options: Options = {
  scenarios: {
    load: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 10 },
        { duration: "1m", target: 50 },
        { duration: "3m", target: 50 },
        { duration: "30s", target: 0 },
      ],
      gracefulRampDown: "15s",
    },
  },
  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
  thresholds: thresholds.load,
};

export default function lightLoadTest(): void {
  const index = Math.floor(Math.random() * pages.length);

  requestRoute(pages[index]);

  sleep(1 + Math.random() * 2);
}
