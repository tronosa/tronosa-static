import type { Options } from "k6/options";

import { routes } from "../config/routes.ts";
import { thresholds } from "../config/thresholds.ts";
import { requestRoute } from "../helpers/request.ts";

const pages = routes.filter((route) => route.kind === "page");

export const options: Options = {
  scenarios: {
    spike: {
      executor: "ramping-arrival-rate",
      startRate: 50,
      timeUnit: "1s",
      preAllocatedVUs: 500,
      maxVUs: 2000,
      stages: [
        { duration: "1m", target: 50 },
        { duration: "10s", target: 2000 },
        { duration: "1m", target: 2000 },
        { duration: "10s", target: 50 },
        { duration: "2m40s", target: 50 },
      ],
      gracefulStop: "30s",
    },
  },

  thresholds: thresholds.spike,

  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
};

export default function spikeTest(): void {
  const index = Math.floor(Math.random() * pages.length);

  requestRoute(pages[index]);
}
