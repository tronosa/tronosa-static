import { check } from "k6";
import http from "k6/http";

import { environment } from "../config/environment.ts";
import type { ReliabilityRoute } from "../config/routes.ts";

export function requestRoute(route: ReliabilityRoute): void {
  const response = http.get(`${environment.baseUrl}${route.path}`, {
    timeout: environment.requestTimeout,
    redirects: 0,
    headers: {
      "Accept-Encoding": "gzip",
    },
    tags: {
      name: route.path,
      route: route.path,
      kind: route.kind,
    },
  });

  check(
    response,
    {
      "status is 200": (res) => res.status === 200,

      "response body is not empty": (res) => {
        if (res.body === null) {
          return false;
        }

        return typeof res.body === "string"
          ? res.body.length > 0
          : res.body.byteLength > 0;
      },

      "content type is valid": (res) => {
        if (route.kind !== "page") {
          return true;
        }

        return res.headers["Content-Type"]?.includes("text/html") ?? false;
      },
    },
    {
      route: route.path,
      kind: route.kind,
    },
  );
}
