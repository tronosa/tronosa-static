import type { Options } from "k6/options";

type Scenario =
  | "smoke"
  | "lightLoad"
  | "load"
  | "heavyLoad"
  | "stress"
  | "spike"
  | "capacity"
  | "businessSpike"
  | "soak"
  | "recovery";

type Thresholds = NonNullable<Options["thresholds"]>;

export const thresholds = {
  smoke: {
    http_req_duration: ["p(95)<200", "p(99)<500"],
    http_req_failed: ["rate==0"],
    checks: ["rate==1"],
  },

  lightLoad: {
    http_req_duration: ["p(95)<300", "p(99)<600"],
    http_req_failed: ["rate<0.01"],
    checks: ["rate>0.99"],
  },

  load: {
    http_req_duration: ["p(95)<300", "p(99)<600"],
    http_req_failed: ["rate<0.01"],
    checks: ["rate>0.99"],
    dropped_iterations: ["count==0"],
  },

  heavyLoad: {
    http_req_duration: ["p(95)<500", "p(99)<1000"],
    http_req_failed: ["rate<0.01"],
    checks: ["rate>0.99"],
    dropped_iterations: ["count==0"],
  },

  stress: {
    http_req_duration: ["p(95)<800", "p(99)<1500"],
    http_req_failed: ["rate<0.05"],
    checks: ["rate>0.95"],
    dropped_iterations: ["count==0"],
  },

  spike: {
    http_req_duration: ["p(95)<1000", "p(99)<2000"],
    http_req_failed: ["rate<0.05"],
    checks: ["rate>0.95"],
    dropped_iterations: ["count==0"],
  },

  capacity: {
    http_req_duration: ["p(95)<800", "p(99)<1500"],
    http_req_failed: ["rate<0.05"],
    checks: ["rate>0.95"],
    dropped_iterations: ["count==0"],
  },

  businessSpike: {
    http_req_duration: ["p(95)<500", "p(99)<1000"],
    http_req_failed: ["rate<0.01"],
    checks: ["rate>0.99"],
    dropped_iterations: ["count==0"],
  },

  soak: {
    http_req_duration: ["p(95)<300", "p(99)<600"],
    http_req_failed: ["rate<0.01"],
    checks: ["rate>0.99"],
    dropped_iterations: ["count==0"],
  },

  recovery: {
    http_req_duration: ["p(95)<300", "p(99)<600"],
    http_req_failed: ["rate<0.01"],
    checks: ["rate>0.99"],
    dropped_iterations: ["count==0"],
  },
} satisfies Record<Scenario, Thresholds>;
