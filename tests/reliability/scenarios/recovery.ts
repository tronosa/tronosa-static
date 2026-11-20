import type { Options } from "k6/options";

import { routes } from "../config/routes.ts";
import { thresholds } from "../config/thresholds.ts";
import { requestRoute } from "../helpers/request.ts";

const pages = routes.filter((route) => route.kind === "page");

export const options: Options = {
  scenarios: {
    recovery: {
      executor: "constant-arrival-rate",
      rate: 100,
      timeUnit: "1s",
      duration: "2m",
      preAllocatedVUs: 100,
      maxVUs: 300,
      gracefulStop: "30s",
    },
  },

  thresholds: thresholds.recovery,

  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
};

export default function recoveryTest(): void {
  const route = pages[Math.floor(Math.random() * pages.length)];

  requestRoute(route);
}
