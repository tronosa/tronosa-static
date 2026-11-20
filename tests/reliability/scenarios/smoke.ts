import type { Options } from "k6/options";

import { routes } from "../config/routes.ts";
import { thresholds } from "../config/thresholds.ts";
import { requestRoute } from "../helpers/request.ts";

export const options: Options = {
  scenarios: {
    smoke: {
      executor: "shared-iterations",
      vus: 1,
      iterations: 3,
      maxDuration: "2m",
    },
  },
  thresholds: thresholds.smoke,
};

export default function smokeTest(): void {
  for (const route of routes) {
    if (route.path === "/sitemap.xml") {
      continue;
    }

    requestRoute(route);
  }
}
