import { expect, test, type Page } from "@playwright/test";

import { defaultLocale } from "@/i18n/config";

import {
  getContentTestRoutes,
  getNegativeTestRoutes,
} from "../../shared/routes";

const contentRoutes = getContentTestRoutes();

const negativeRoutes = getNegativeTestRoutes(contentRoutes);

const homeRoute = contentRoutes.find(
  (route) =>
    route.kind === "page" &&
    route.id === "home" &&
    route.locale === defaultLocale,
);

if (!homeRoute) {
  throw new Error("Default locale home route is missing.");
}

const homePathname = homeRoute.pathname;

const HCAPTCHA_ORIGINS = [
  "https://hcaptcha.com",
  "https://*.hcaptcha.com",
] as const;

const HCAPTCHA_DIRECTIVES = [
  "script-src",
  "style-src",
  "frame-src",
  "connect-src",
] as const;

const WEB3FORMS_ORIGIN = "https://api.web3forms.com";

interface CspViolation {
  disposition: string;
  effectiveDirective: string;
  blockedURI: string;
}

function parsePolicy(policy: string) {
  return Object.fromEntries(
    policy.split(";").map((entry) => {
      const [directive, ...sources] = entry.trim().split(/\s+/);

      return [directive, sources];
    }),
  );
}

function expectValidPolicy(policy: string) {
  const directives = parsePolicy(policy);

  expect(directives["default-src"]).toEqual(["'self'"]);

  expect(directives["object-src"]).toEqual(["'none'"]);

  expect(directives["frame-ancestors"]).toEqual(["'none'"]);

  expect(directives["base-uri"]).toEqual(["'self'"]);

  expect(directives["form-action"]).toEqual(["'self'"]);

  expect(directives["script-src"]).toEqual([
    "'self'",
    "'unsafe-inline'",
    ...HCAPTCHA_ORIGINS,
  ]);

  expect(directives["style-src"]).toEqual([
    "'self'",
    "'unsafe-inline'",
    ...HCAPTCHA_ORIGINS,
  ]);

  expect(directives["frame-src"]).toEqual([...HCAPTCHA_ORIGINS]);

  expect(directives["connect-src"]).toEqual([
    "'self'",
    "https://tiles.openfreemap.org",
    WEB3FORMS_ORIGIN,
    ...HCAPTCHA_ORIGINS,
  ]);

  expect(policy).not.toContain("'unsafe-eval'");
  expect(policy).not.toContain("http:");

  for (const [directive, sources] of Object.entries(directives)) {
    expect(new Set(sources).size).toBe(sources.length);

    if (directive !== "connect-src") {
      expect(sources).not.toContain(WEB3FORMS_ORIGIN);
    }

    if (!HCAPTCHA_DIRECTIVES.some((allowed) => allowed === directive)) {
      for (const origin of HCAPTCHA_ORIGINS) {
        expect(sources).not.toContain(origin);
      }
    }

    for (const source of sources) {
      if (source.includes("*")) {
        expect(source).toBe("https://*.hcaptcha.com");

        expect(HCAPTCHA_DIRECTIVES).toContain(directive);
      }
    }
  }
}

async function navigateToHome(page: Page) {
  const response = await page.goto(homePathname);

  expect(response?.status()).toBe(200);
}

async function detectBlockedResource(
  page: Page,
  url: string,
  resourceType: "script" | "frame" | "connect",
): Promise<CspViolation> {
  return page.evaluate(
    ({ url, resourceType }) => {
      return new Promise<CspViolation>((resolve, reject) => {
        const expectedOrigin = new URL(url).origin;

        const timeout = window.setTimeout(() => {
          window.removeEventListener("securitypolicyviolation", onViolation);

          reject(new Error(`Expected CSP violation for ${url}.`));
        }, 5_000);

        function onViolation(event: SecurityPolicyViolationEvent) {
          if (
            event.blockedURI !== expectedOrigin &&
            !event.blockedURI.startsWith(`${expectedOrigin}/`)
          ) {
            return;
          }

          window.clearTimeout(timeout);

          window.removeEventListener("securitypolicyviolation", onViolation);

          resolve({
            disposition: event.disposition,
            effectiveDirective: event.effectiveDirective,
            blockedURI: event.blockedURI,
          });
        }

        window.addEventListener("securitypolicyviolation", onViolation);

        switch (resourceType) {
          case "script": {
            const script = document.createElement("script");

            script.src = url;

            document.head.appendChild(script);

            break;
          }

          case "frame": {
            const iframe = document.createElement("iframe");

            iframe.title = "Security test probe";
            iframe.src = url;

            document.body.appendChild(iframe);

            break;
          }

          case "connect": {
            void fetch(url, {
              credentials: "omit",
            }).catch(() => undefined);

            break;
          }
        }
      });
    },
    { url, resourceType },
  );
}

test.describe("Content Security Policy @security @csp", () => {
  test.describe("Published content", () => {
    for (const route of contentRoutes) {
      test(`enforces CSP on ${route.pathname}`, async ({ request }) => {
        const response = await request.get(route.pathname);

        expect(response.status()).toBe(route.expectedStatus);

        const headers = response.headers();

        const policy = headers["content-security-policy"];

        expect(policy).toBeDefined();

        expect(headers["content-security-policy-report-only"]).toBeUndefined();

        expectValidPolicy(policy);
      });
    }
  });

  test.describe("Unknown routes", () => {
    for (const route of negativeRoutes) {
      test(`preserves CSP on ${route.pathname}`, async ({ request }) => {
        const response = await request.get(route.pathname);

        expect(response.status()).toBe(route.expectedStatus);

        const headers = response.headers();

        const policy = headers["content-security-policy"];

        expect(policy).toBeDefined();

        expect(headers["content-security-policy-report-only"]).toBeUndefined();

        expectValidPolicy(policy);
      });
    }
  });

  test.describe("Browser enforcement", () => {
    test("blocks execution of untrusted external scripts", async ({ page }) => {
      const scriptUrl = "https://untrusted.example.invalid/security-test.js";

      let networkRequests = 0;

      await page.route(scriptUrl, async (route) => {
        networkRequests++;

        await route.fulfill({
          status: 200,
          contentType: "application/javascript",
          body: `
                  document.documentElement.setAttribute(
                    "data-security-probe",
                    "executed"
                  );
                `,
        });
      });

      await navigateToHome(page);

      const violation = await detectBlockedResource(page, scriptUrl, "script");

      expect(violation.disposition).toBe("enforce");

      expect(violation.effectiveDirective).toMatch(/^script-src/);

      expect(violation.blockedURI).toContain(
        "https://untrusted.example.invalid",
      );

      expect(networkRequests).toBe(0);

      expect(
        await page.locator("html").getAttribute("data-security-probe"),
      ).toBeNull();
    });

    test("blocks JavaScript eval execution", async ({ page }) => {
      await navigateToHome(page);

      const session = await page.context().newCDPSession(page);

      try {
        const { result, exceptionDetails } = await session.send(
          "Runtime.evaluate",
          {
            expression: `
                    (() => {
                      try {
                        window.eval("1 + 1");

                        return {
                          blocked: false,
                          errorName: null
                        };
                      } catch (error) {
                        return {
                          blocked: true,
                          errorName: error.name
                        };
                      }
                    })()
                  `,
            returnByValue: true,
            allowUnsafeEvalBlockedByCSP: false,
          },
        );

        expect(exceptionDetails).toBeUndefined();

        expect(result.value).toEqual({
          blocked: true,
          errorName: "EvalError",
        });
      } finally {
        await session.detach();
      }
    });

    test("allows scripts from approved hCaptcha origins", async ({ page }) => {
      const scriptUrl = "https://js.hcaptcha.com/csp-probe.js";

      let networkRequests = 0;

      await page.route(scriptUrl, async (route) => {
        networkRequests++;

        await route.fulfill({
          status: 200,
          contentType: "application/javascript",
          body: `
                  document.documentElement.setAttribute(
                    "data-hcaptcha-csp-probe",
                    "executed"
                  );
                `,
        });
      });

      await navigateToHome(page);

      await page.addScriptTag({
        url: scriptUrl,
      });

      await expect(page.locator("html")).toHaveAttribute(
        "data-hcaptcha-csp-probe",
        "executed",
      );

      expect(networkRequests).toBe(1);
    });

    test("allows styles from approved hCaptcha origins", async ({ page }) => {
      const styleUrl = "https://assets.hcaptcha.com/csp-probe.css";

      let networkRequests = 0;

      await page.route(styleUrl, async (route) => {
        networkRequests++;

        await route.fulfill({
          status: 200,
          contentType: "text/css",
          body: `
                  #hcaptcha-style-probe {
                    color: rgb(12, 34, 56);
                  }
                `,
        });
      });

      await navigateToHome(page);

      await page.evaluate(() => {
        const probe = document.createElement("div");

        probe.id = "hcaptcha-style-probe";

        probe.textContent = "CSP style probe";

        document.body.appendChild(probe);
      });

      await page.addStyleTag({
        url: styleUrl,
      });

      await expect(page.locator("#hcaptcha-style-probe")).toHaveCSS(
        "color",
        "rgb(12, 34, 56)",
      );

      expect(networkRequests).toBe(1);
    });

    test("allows frames from approved hCaptcha origins", async ({ page }) => {
      const frameUrl = "https://assets.hcaptcha.com/csp-probe.html";

      let networkRequests = 0;

      await page.route(frameUrl, async (route) => {
        networkRequests++;

        await route.fulfill({
          status: 200,
          contentType: "text/html",
          body: `
                  <!doctype html>
                  <html lang="en">
                    <body>
                      <p>hCaptcha CSP probe</p>
                    </body>
                  </html>
                `,
        });
      });

      await navigateToHome(page);

      await page.evaluate((src) => {
        const iframe = document.createElement("iframe");

        iframe.id = "hcaptcha-csp-probe";
        iframe.title = "hCaptcha CSP probe";
        iframe.src = src;

        document.body.appendChild(iframe);
      }, frameUrl);

      await expect(
        page
          .frameLocator("#hcaptcha-csp-probe")
          .getByText("hCaptcha CSP probe"),
      ).toBeVisible();

      expect(networkRequests).toBe(1);
    });

    test("allows connections to the Web3Forms API", async ({ page }) => {
      const apiUrl = "https://api.web3forms.com/submit";

      let networkRequests = 0;

      await page.route(apiUrl, async (route) => {
        const headers = {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "POST, OPTIONS",
          "access-control-allow-headers": "content-type",
        };

        if (route.request().method() === "OPTIONS") {
          await route.fulfill({
            status: 204,
            headers,
          });

          return;
        }

        networkRequests++;

        await route.fulfill({
          status: 200,
          headers,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
          }),
        });
      });

      await navigateToHome(page);

      const result = await page.evaluate(async (url) => {
        const response = await fetch(url, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "omit",

          body: JSON.stringify({
            probe: true,
          }),
        });

        return {
          status: response.status,
          data: await response.json(),
        };
      }, apiUrl);

      expect(result).toEqual({
        status: 200,
        data: {
          success: true,
        },
      });

      expect(networkRequests).toBe(1);
    });

    test("blocks untrusted external frames", async ({ page }) => {
      const frameUrl = "https://untrusted.example.invalid/frame.html";

      let networkRequests = 0;

      await page.route(frameUrl, async (route) => {
        networkRequests++;

        await route.fulfill({
          status: 200,
          contentType: "text/html",
          body: "<p>Untrusted frame</p>",
        });
      });

      await navigateToHome(page);

      const violation = await detectBlockedResource(page, frameUrl, "frame");

      expect(violation.disposition).toBe("enforce");

      expect(violation.effectiveDirective).toBe("frame-src");

      expect(violation.blockedURI).toContain(
        "https://untrusted.example.invalid",
      );

      expect(networkRequests).toBe(0);
    });

    test("blocks connections to untrusted external APIs", async ({ page }) => {
      const apiUrl = "https://untrusted.example.invalid/api";

      let networkRequests = 0;

      await page.route(apiUrl, async (route) => {
        networkRequests++;

        await route.fulfill({
          status: 200,

          headers: {
            "access-control-allow-origin": "*",
          },

          contentType: "application/json",

          body: JSON.stringify({
            success: true,
          }),
        });
      });

      await navigateToHome(page);

      const violation = await detectBlockedResource(page, apiUrl, "connect");

      expect(violation.disposition).toBe("enforce");

      expect(violation.effectiveDirective).toBe("connect-src");

      expect(violation.blockedURI).toContain(
        "https://untrusted.example.invalid",
      );

      expect(networkRequests).toBe(0);
    });
  });
});
