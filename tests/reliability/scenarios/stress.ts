import type { Options } from "k6/options";

import { routes } from "../config/routes.ts";
import { thresholds } from "../config/thresholds.ts";
import { requestRoute } from "../helpers/request.ts";

const pages = routes.filter((route) => route.kind === "page");

export const options: Options = {
  scenarios: {
    stress: {
      executor: "ramping-arrival-rate",
      startRate: 100,
      timeUnit: "1s",
      preAllocatedVUs: 500,
      maxVUs: 2000,
      stages: [
        { duration: "2m", target: 500 },
        { duration: "3m", target: 1000 },
        { duration: "3m", target: 1500 },
        { duration: "3m", target: 2000 },
        { duration: "2m", target: 2000 },
        { duration: "1m", target: 100 },
        { duration: "1m", target: 100 },
      ],
      gracefulStop: "30s",
    },
  },

  thresholds: thresholds.stress,

  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
};

export default function stressTest(): void {
  const index = Math.floor(Math.random() * pages.length);

  requestRoute(pages[index]);
}
