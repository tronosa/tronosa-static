import type { Options } from "k6/options";

import { routes } from "../config/routes.ts";
import { thresholds } from "../config/thresholds.ts";
import { requestRoute } from "../helpers/request.ts";

const pages = routes.filter((route) => route.kind === "page");

export const options: Options = {
  scenarios: {
    heavyLoad: {
      executor: "constant-arrival-rate",
      rate: 500,
      timeUnit: "1s",
      duration: "10m",
      preAllocatedVUs: 250,
      maxVUs: 500,
      gracefulStop: "30s",
    },
  },

  thresholds: thresholds.heavyLoad,

  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
};

export default function heavyLoadTest(): void {
  const index = Math.floor(Math.random() * pages.length);

  requestRoute(pages[index]);
}
