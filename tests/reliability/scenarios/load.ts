import type { Options } from "k6/options";

import { routes } from "../config/routes.ts";
import { thresholds } from "../config/thresholds.ts";
import { requestRoute } from "../helpers/request.ts";

const pages = routes.filter((route) => route.kind === "page");

export const options: Options = {
  scenarios: {
    load: {
      executor: "constant-arrival-rate",
      rate: 100,
      timeUnit: "1s",
      duration: "5m",
      preAllocatedVUs: 100,
      maxVUs: 300,
      gracefulStop: "30s",
    },
  },

  thresholds: {
    ...thresholds.load,
    dropped_iterations: ["count==0"],
  },

  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
};

export default function loadTest(): void {
  const index = Math.floor(Math.random() * pages.length);

  requestRoute(pages[index]);
}
