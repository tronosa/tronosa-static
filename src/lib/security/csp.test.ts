import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getContentSecurityPolicy,
  getContentSecurityPolicyHeader,
} from "./csp";

describe("Content Security Policy", () => {
  function getDirectives(policy = getContentSecurityPolicy()) {
    return Object.fromEntries(
      policy.split(";").map((entry) => {
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

  describe("UploadThing media delivery", () => {
    beforeEach(() => {
      vi.resetModules();
    });

    afterEach(() => {
      vi.unstubAllEnvs();
      vi.resetModules();
    });

    async function getPolicyWithAppId(appId: string | undefined) {
      vi.stubEnv("UPLOADTHING_APP_ID", appId);

      const { getContentSecurityPolicy } = await import("./csp");

      return getContentSecurityPolicy();
    }

    it("restricts media to the same origin when app ID is missing", async () => {
      const policy = await getPolicyWithAppId(undefined);

      expect(getDirectives(policy)["media-src"]).toEqual(["'self'"]);
    });

    it.each(["", " ", "   "])(
      "restricts media to the same origin for empty app ID %j",
      async (appId) => {
        const policy = await getPolicyWithAppId(appId);

        expect(getDirectives(policy)["media-src"]).toEqual(["'self'"]);
      },
    );

    it("allows the configured UploadThing application origin", async () => {
      const policy = await getPolicyWithAppId("tronosa123");

      expect(getDirectives(policy)["media-src"]).toEqual([
        "'self'",
        "https://tronosa123.ufs.sh",
      ]);
    });

    it("supports valid application IDs containing hyphens", async () => {
      const policy = await getPolicyWithAppId("tronosa-media");

      expect(getDirectives(policy)["media-src"]).toEqual([
        "'self'",
        "https://tronosa-media.ufs.sh",
      ]);
    });

    it("normalizes surrounding whitespace", async () => {
      const policy = await getPolicyWithAppId("  tronosa123  ");

      expect(getDirectives(policy)["media-src"]).toEqual([
        "'self'",
        "https://tronosa123.ufs.sh",
      ]);
    });

    it.each([
      "*",
      "*.ufs.sh",
      "https://example.com",
      "example.com",
      "tronosa/path",
      "tronosa app",
      "tronosa; script-src *",
      "tronosa\r\nX-Injection: true",
      "tronosa\ninjection",
      "tronosa@evil",
      "tronosa?query=value",
      "tronosa#fragment",
      "tronosa:443",
    ])("rejects invalid application ID %j", async (appId) => {
      await expect(getPolicyWithAppId(appId)).rejects.toThrow(
        "Invalid UploadThing application ID.",
      );
    });

    it("does not allow wildcard media origins", async () => {
      const policy = await getPolicyWithAppId("tronosa123");

      expect(getDirectives(policy)["media-src"].join(" ")).not.toContain("*");
    });

    it("does not grant UploadThing additional resource permissions", async () => {
      const policy = await getPolicyWithAppId("tronosa123");

      const directives = getDirectives(policy);
      const uploadThingOrigin = "https://tronosa123.ufs.sh";

      for (const [directive, sources] of Object.entries(directives)) {
        if (directive !== "media-src") {
          expect(sources).not.toContain(uploadThingOrigin);
        }
      }
    });

    it("preserves all other security directives", async () => {
      vi.stubEnv("UPLOADTHING_APP_ID", undefined);

      const baselineModule = await import("./csp");

      const baselineDirectives = getDirectives(
        baselineModule.getContentSecurityPolicy(),
      );

      vi.resetModules();

      const policy = await getPolicyWithAppId("tronosa123");

      const configuredDirectives = getDirectives(policy);

      for (const [directive, sources] of Object.entries(baselineDirectives)) {
        if (directive !== "media-src") {
          expect(configuredDirectives[directive]).toEqual(sources);
        }
      }
    });

    it("includes the configured media origin in both CSP modes", async () => {
      vi.stubEnv("UPLOADTHING_APP_ID", "tronosa123");

      const { getContentSecurityPolicyHeader } = await import("./csp");

      const reportOnly = getContentSecurityPolicyHeader("report-only");
      const enforce = getContentSecurityPolicyHeader("enforce");

      expect(reportOnly.value).toContain("https://tronosa123.ufs.sh");

      expect(enforce.value).toBe(reportOnly.value);

      expect(reportOnly.key).toBe("Content-Security-Policy-Report-Only");

      expect(enforce.key).toBe("Content-Security-Policy");
    });
  });
});
