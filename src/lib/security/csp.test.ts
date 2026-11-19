import { describe, expect, it } from "vitest";

import {
  getContentSecurityPolicy,
  getContentSecurityPolicyHeader,
} from "./csp";

describe("Content Security Policy", () => {
  function getDirectives() {
    return Object.fromEntries(
      getContentSecurityPolicy()
        .split(";")
        .map((entry) => {
          const [directive, ...sources] = entry.trim().split(/\s+/);

          return [directive, sources];
        }),
    );
  }

  it("returns a non-empty policy", () => {
    expect(getContentSecurityPolicy().length).toBeGreaterThan(0);
  });

  it("does not contain duplicate directives", () => {
    const directives = getContentSecurityPolicy()
      .split(";")
      .map((entry) => entry.trim().split(/\s+/)[0]);

    expect(new Set(directives).size).toBe(directives.length);
  });

  it("does not contain header injection characters", () => {
    expect(getContentSecurityPolicy()).not.toMatch(/[\r\n]/);
  });

  it("restricts default resources to the same origin", () => {
    expect(getDirectives()["default-src"]).toEqual(["'self'"]);
  });

  it.each(["object-src", "frame-src", "frame-ancestors"])(
    "disables %s",
    (directive) => {
      expect(getDirectives()[directive]).toEqual(["'none'"]);
    },
  );

  it.each(["base-uri", "form-action", "font-src", "manifest-src"])(
    "restricts %s to the same origin",
    (directive) => {
      expect(getDirectives()[directive]).toEqual(["'self'"]);
    },
  );

  it("allows ImageKit image delivery", () => {
    expect(getDirectives()["img-src"]).toContain("https://ik.imagekit.io");
  });

  it("allows OpenFreeMap connections", () => {
    expect(getDirectives()["connect-src"]).toContain(
      "https://tiles.openfreemap.org",
    );
  });

  it("allows MapLibre blob workers", () => {
    expect(getDirectives()["worker-src"]).toContain("blob:");
  });

  it("does not allow unsafe eval", () => {
    expect(getContentSecurityPolicy()).not.toContain("'unsafe-eval'");
  });

  it("does not allow wildcard sources", () => {
    for (const sources of Object.values(getDirectives())) {
      expect(sources.join(" ")).not.toContain("*");
    }
  });

  it("does not allow insecure HTTP origins", () => {
    expect(getContentSecurityPolicy()).not.toContain("http:");
  });

  it("does not allow external script origins", () => {
    expect(getDirectives()["script-src"]).toEqual([
      "'self'",
      "'unsafe-inline'",
    ]);
  });

  it("defaults to report-only mode", () => {
    expect(getContentSecurityPolicyHeader().key).toBe(
      "Content-Security-Policy-Report-Only",
    );
  });

  it("supports report-only mode", () => {
    expect(getContentSecurityPolicyHeader("report-only").key).toBe(
      "Content-Security-Policy-Report-Only",
    );
  });

  it("supports enforcement mode", () => {
    expect(getContentSecurityPolicyHeader("enforce").key).toBe(
      "Content-Security-Policy",
    );
  });

  it("uses the same policy in both modes", () => {
    expect(getContentSecurityPolicyHeader("report-only").value).toBe(
      getContentSecurityPolicyHeader("enforce").value,
    );
  });
});
