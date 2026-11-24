import { describe, expect, it } from "vitest";

import {
  getContentSecurityPolicy,
  getContentSecurityPolicyHeader,
} from "./csp";

const HCAPTCHA_ORIGINS = [
  "https://hcaptcha.com",
  "https://*.hcaptcha.com",
] as const;

const HCAPTCHA_DIRECTIVES = [
  "script-src",
  "style-src",
  "connect-src",
  "frame-src",
] as const;

const WEB3FORMS_ORIGIN = "https://api.web3forms.com";
const IMAGEKIT_ORIGIN = "https://ik.imagekit.io";

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

  it("does not contain duplicate sources within directives", () => {
    for (const sources of Object.values(getDirectives())) {
      expect(new Set(sources).size).toBe(sources.length);
    }
  });

  it("does not contain header injection characters", () => {
    expect(getContentSecurityPolicy()).not.toMatch(/[\r\n]/);
  });

  it("restricts default resources to the same origin", () => {
    expect(getDirectives()["default-src"]).toEqual(["'self'"]);
  });

  it.each(["object-src", "frame-ancestors"])("disables %s", (directive) => {
    expect(getDirectives()[directive]).toEqual(["'none'"]);
  });

  it.each(["base-uri", "form-action", "font-src", "manifest-src"])(
    "restricts %s to the same origin",
    (directive) => {
      expect(getDirectives()[directive]).toEqual(["'self'"]);
    },
  );

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

  it("does not allow unrestricted wildcard sources", () => {
    for (const [directive, sources] of Object.entries(getDirectives())) {
      for (const source of sources) {
        if (!source.includes("*")) {
          continue;
        }

        expect(source).toBe("https://*.hcaptcha.com");

        expect(HCAPTCHA_DIRECTIVES).toContain(directive);
      }
    }
  });

  it("does not allow insecure HTTP origins", () => {
    expect(getContentSecurityPolicy()).not.toContain("http:");
  });

  it("restricts script execution to approved sources", () => {
    expect(getDirectives()["script-src"]).toEqual([
      "'self'",
      "'unsafe-inline'",
      ...HCAPTCHA_ORIGINS,
    ]);
  });

  it("restricts styles to approved sources", () => {
    expect(getDirectives()["style-src"]).toEqual([
      "'self'",
      "'unsafe-inline'",
      ...HCAPTCHA_ORIGINS,
    ]);
  });

  it("restricts frame sources to hCaptcha", () => {
    expect(getDirectives()["frame-src"]).toEqual([...HCAPTCHA_ORIGINS]);
  });

  it("restricts network connections to approved origins", () => {
    expect(getDirectives()["connect-src"]).toEqual([
      "'self'",
      "https://tiles.openfreemap.org",
      WEB3FORMS_ORIGIN,
      ...HCAPTCHA_ORIGINS,
    ]);
  });

  describe("hCaptcha integration", () => {
    it.each(HCAPTCHA_DIRECTIVES)(
      "allows required hCaptcha origins in %s",
      (directive) => {
        const sources = getDirectives()[directive];

        for (const origin of HCAPTCHA_ORIGINS) {
          expect(sources).toContain(origin);
        }
      },
    );

    it("does not grant hCaptcha unrelated resource permissions", () => {
      for (const [directive, sources] of Object.entries(getDirectives())) {
        if (HCAPTCHA_DIRECTIVES.some((allowed) => allowed === directive)) {
          continue;
        }

        for (const origin of HCAPTCHA_ORIGINS) {
          expect(sources).not.toContain(origin);
        }
      }
    });

    it("preserves clickjacking protection", () => {
      expect(getDirectives()["frame-ancestors"]).toEqual(["'none'"]);
    });

    it("does not allow arbitrary external frames", () => {
      const sources = getDirectives()["frame-src"];

      expect(sources).not.toContain("*");
      expect(sources).not.toContain("https:");
      expect(sources).not.toContain("https://example.com");
    });
  });

  describe("Web3Forms integration", () => {
    it("allows connection to the Web3Forms API", () => {
      expect(getDirectives()["connect-src"]).toContain(WEB3FORMS_ORIGIN);
    });

    it("does not grant Web3Forms unrelated resource permissions", () => {
      for (const [directive, sources] of Object.entries(getDirectives())) {
        if (directive !== "connect-src") {
          expect(sources).not.toContain(WEB3FORMS_ORIGIN);
        }
      }
    });

    it("preserves same-origin native form submission", () => {
      expect(getDirectives()["form-action"]).toEqual(["'self'"]);
    });
  });

  describe("ImageKit delivery", () => {
    it("allows ImageKit image delivery", () => {
      expect(getDirectives()["img-src"]).toContain(IMAGEKIT_ORIGIN);
    });

    it("allows ImageKit video delivery", () => {
      expect(getDirectives()["media-src"]).toContain(IMAGEKIT_ORIGIN);
    });

    it("restricts media to approved origins", () => {
      expect(getDirectives()["media-src"]).toEqual(["'self'", IMAGEKIT_ORIGIN]);
    });

    it("does not allow arbitrary media origins", () => {
      const sources = getDirectives()["media-src"];

      expect(sources).not.toContain("*");
      expect(sources).not.toContain("https:");
      expect(sources).not.toContain("http:");
      expect(sources).not.toContain("https://example.com");
    });

    it("does not grant ImageKit unrelated resource permissions", () => {
      const allowedDirectives = ["img-src", "media-src"];

      for (const [directive, sources] of Object.entries(getDirectives())) {
        if (allowedDirectives.includes(directive)) {
          continue;
        }

        expect(sources).not.toContain(IMAGEKIT_ORIGIN);
      }
    });

    it("does not allow the legacy UploadThing origin", () => {
      for (const sources of Object.values(getDirectives())) {
        expect(sources.join(" ")).not.toContain("ufs.sh");
      }
    });

    it("does not allow ImageKit in script or frame sources", () => {
      expect(getDirectives()["script-src"]).not.toContain(IMAGEKIT_ORIGIN);
      expect(getDirectives()["frame-src"]).not.toContain(IMAGEKIT_ORIGIN);
    });

    it.each(["report-only", "enforce"] as const)(
      "allows ImageKit media in %s mode",
      (mode) => {
        const header = getContentSecurityPolicyHeader(mode);
        const directives = getDirectives(header.value);

        expect(directives["media-src"]).toEqual(["'self'", IMAGEKIT_ORIGIN]);

        expect(directives["img-src"]).toContain(IMAGEKIT_ORIGIN);
      },
    );
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
