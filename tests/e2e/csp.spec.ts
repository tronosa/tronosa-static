import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/en",
  "/sr-Latn",
  "/proizvodi",
  "/en/products",
  "/sr-Latn/proizvodi",
  "/o-nama",
  "/en/about-us",
  "/sr-Latn/o-nama",
  "/blog",
  "/en/blog",
  "/sr-Latn/blog",
];

test.describe("Content Security Policy @security @csp", () => {
  for (const route of routes) {
    test(`enforces CSP on ${route}`, async ({ request }) => {
      const response = await request.get(route);

      expect(response.status()).toBe(200);

      const headers = response.headers();
      const policy = headers["content-security-policy"];

      expect(policy).toBeDefined();
      expect(policy).toContain("default-src 'self'");
      expect(policy).toContain("object-src 'none'");
      expect(policy).toContain("frame-ancestors 'none'");
      expect(policy).not.toContain("'unsafe-eval'");

      expect(headers["content-security-policy-report-only"]).toBeUndefined();
    });
  }

  test("enforces CSP on unknown routes", async ({ request }) => {
    const response = await request.get("/non-existing-csp-test");

    expect(response.status()).toBe(404);

    expect(response.headers()["content-security-policy"]).toBeDefined();
  });

  test("blocks execution of untrusted external scripts", async ({ page }) => {
    const untrustedScript =
      "https://untrusted.example.invalid/security-test.js";

    let networkRequests = 0;

    await page.route(untrustedScript, async (route) => {
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

    await page.goto("/");

    const violation = await page.evaluate(async (src) => {
      return new Promise<{
        disposition: string;
        effectiveDirective: string;
        blockedURI: string;
      }>((resolve, reject) => {
        const timeout = window.setTimeout(() => {
          window.removeEventListener("securitypolicyviolation", onViolation);

          reject(new Error("Expected CSP violation was not detected."));
        }, 5_000);

        function onViolation(event: SecurityPolicyViolationEvent) {
          if (
            !event.blockedURI.startsWith("https://untrusted.example.invalid")
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

        const script = document.createElement("script");

        script.src = src;

        document.head.appendChild(script);
      });
    }, untrustedScript);

    expect(violation.disposition).toBe("enforce");

    expect(violation.effectiveDirective).toMatch(/^script-src/);

    expect(violation.blockedURI).toContain("https://untrusted.example.invalid");

    expect(networkRequests).toBe(0);

    expect(
      await page.locator("html").getAttribute("data-security-probe"),
    ).toBeNull();
  });

  test("blocks JavaScript eval execution", async ({ page }) => {
    await page.goto("/");

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
});
