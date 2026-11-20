import type { Options } from "k6/options";

import { routes } from "../config/routes.ts";
import { thresholds } from "../config/thresholds.ts";
import { requestRoute } from "../helpers/request.ts";

const pages = routes.filter((route) => route.kind === "page");

const rates = [500, 750, 1000, 1250, 1500, 1750, 2000] as const;

export const options: Options = {
  scenarios: Object.fromEntries(
    rates.map((rate, index) => [
      `capacity_${rate}`,
      {
        executor: "constant-arrival-rate" as const,
        rate,
        timeUnit: "1s",
        duration: "1m",
        startTime: `${index * 90}s`,
        preAllocatedVUs: 500,
        maxVUs: 2000,
        gracefulStop: "15s",
      },
    ]),
  ),

  thresholds: Object.fromEntries(
    rates.flatMap((rate) =>
      Object.entries(thresholds.capacity).map(([metric, conditions]) => [
        `${metric}{scenario:capacity_${rate}}`,
        conditions,
      ]),
    ),
  ),

  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
};

export default function capacityTest(): void {
  const route = pages[Math.floor(Math.random() * pages.length)];

  requestRoute(route);
}
