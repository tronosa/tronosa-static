import type { Options } from "k6/options";

import { routes } from "../config/routes.ts";
import { thresholds } from "../config/thresholds.ts";
import { requestRoute } from "../helpers/request.ts";

const pages = routes.filter((route) => route.kind === "page");

export const options: Options = {
  scenarios: {
    business_spike: {
      executor: "ramping-arrival-rate",
      startRate: 50,
      timeUnit: "1s",
      preAllocatedVUs: 250,
      maxVUs: 500,
      stages: [
        { duration: "1m", target: 50 },
        { duration: "10s", target: 500 },
        { duration: "1m", target: 500 },
        { duration: "10s", target: 50 },
        { duration: "2m40s", target: 50 },
      ],
      gracefulStop: "30s",
    },
  },

  thresholds: thresholds.businessSpike,

  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
};

export default function businessSpikeTest(): void {
  const route = pages[Math.floor(Math.random() * pages.length)];

  requestRoute(route);
}
