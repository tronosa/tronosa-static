import { afterEach, describe, expect, it, vi } from "vitest";

import { getSecurityHeaders } from "./headers";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Security headers", () => {
  function getHeaders() {
    return Object.fromEntries(
      getSecurityHeaders().map(({ key, value }) => [key.toLowerCase(), value]),
    );
  }

  it("returns unique header names", () => {
    const headers = getSecurityHeaders();

    const names = headers.map(({ key }) => key.toLowerCase());

    expect(new Set(names).size).toBe(headers.length);
  });

  it("does not contain empty header names or values", () => {
    for (const { key, value } of getSecurityHeaders()) {
      expect(key.trim()).not.toBe("");
      expect(value.trim()).not.toBe("");
    }
  });

  it("prevents MIME type sniffing", () => {
    expect(getHeaders()["x-content-type-options"]).toBe("nosniff");
  });

  it("prevents clickjacking", () => {
    expect(getHeaders()["x-frame-options"]).toBe("DENY");
  });

  it("restricts referrer information", () => {
    expect(getHeaders()["referrer-policy"]).toBe(
      "strict-origin-when-cross-origin",
    );
  });

  it.each(["camera", "microphone", "payment", "usb"])(
    "disables access to %s",
    (permission) => {
      expect(getHeaders()["permissions-policy"]).toContain(`${permission}=()`);
    },
  );

  it("does not disable geolocation", () => {
    expect(getHeaders()["permissions-policy"]).not.toContain("geolocation=()");
  });

  it("restricts legacy cross-domain policies", () => {
    expect(getHeaders()["x-permitted-cross-domain-policies"]).toBe("none");
  });

  it("does not contain header injection characters", () => {
    for (const { key, value } of getSecurityHeaders()) {
      expect(key).not.toMatch(/[\r\n]/);
      expect(value).not.toMatch(/[\r\n]/);
    }
  });

  describe("CSP environment configuration", () => {
    it("enforces CSP in production", () => {
      vi.stubEnv("NODE_ENV", "production");

      const headers = getHeaders();

      expect(headers["content-security-policy"]).toBeDefined();

      expect(headers["content-security-policy-report-only"]).toBeUndefined();
    });

    it.each(["development", "test"])(
      "uses report-only CSP in %s",
      (environment) => {
        vi.stubEnv("NODE_ENV", environment);

        const headers = getHeaders();

        expect(headers["content-security-policy-report-only"]).toBeDefined();

        expect(headers["content-security-policy"]).toBeUndefined();
      },
    );

    it("does not weaken production CSP with unsafe eval", () => {
      vi.stubEnv("NODE_ENV", "production");

      expect(getHeaders()["content-security-policy"]).not.toContain(
        "'unsafe-eval'",
      );
    });
  });
});
