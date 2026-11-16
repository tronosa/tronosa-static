import { describe, expect, it } from "vitest";

import { getEnvironment } from "./environment";

describe("Application environment", () => {
  const siteUrl = "https://example.com";

  it("defaults to development", () => {
    expect(getEnvironment({})).toEqual({
      appEnv: "development",
      siteUrl: "http://localhost:3000",
      isProduction: false,
      isIndexable: false,
    });
  });

  it("identifies production correctly", () => {
    const environment = getEnvironment({
      APP_ENV: "production",
      SITE_URL: siteUrl,
    });

    expect(environment.appEnv).toBe("production");
    expect(environment.isProduction).toBe(true);
  });

  it("identifies staging correctly", () => {
    const environment = getEnvironment({
      APP_ENV: "staging",
      SITE_URL: siteUrl,
    });

    expect(environment.appEnv).toBe("staging");
    expect(environment.isProduction).toBe(false);
  });

  it("enables indexing with explicit production opt-in", () => {
    expect(
      getEnvironment({
        APP_ENV: "production",
        SITE_URL: siteUrl,
        SEO_INDEXING_ENABLED: "true",
      }).isIndexable,
    ).toBe(true);
  });

  it.each(["development", "staging"])("disables indexing in %s", (appEnv) => {
    expect(
      getEnvironment({
        APP_ENV: appEnv,
        SITE_URL: siteUrl,
        SEO_INDEXING_ENABLED: "true",
      }).isIndexable,
    ).toBe(false);
  });

  it("disables indexing in production by default", () => {
    expect(
      getEnvironment({
        APP_ENV: "production",
        SITE_URL: siteUrl,
      }).isIndexable,
    ).toBe(false);
  });

  it.each(["false", "", "TRUE", "1"])(
    "rejects indexing opt-in value %s",
    (value) => {
      expect(
        getEnvironment({
          APP_ENV: "production",
          SITE_URL: siteUrl,
          SEO_INDEXING_ENABLED: value,
        }).isIndexable,
      ).toBe(false);
    },
  );

  it.each(["staging", "production"])("requires SITE_URL in %s", (appEnv) => {
    expect(() =>
      getEnvironment({
        APP_ENV: appEnv,
      }),
    ).toThrow("SITE_URL is required");
  });

  it("requires HTTPS in production", () => {
    expect(() =>
      getEnvironment({
        APP_ENV: "production",
        SITE_URL: "http://example.com",
      }),
    ).toThrow("must use HTTPS");
  });

  it("allows HTTP for development", () => {
    expect(
      getEnvironment({
        APP_ENV: "development",
        SITE_URL: "http://localhost:3000",
      }).siteUrl,
    ).toBe("http://localhost:3000");
  });

  it("normalizes the site origin", () => {
    expect(
      getEnvironment({
        APP_ENV: "staging",
        SITE_URL: "https://example.com/",
      }).siteUrl,
    ).toBe(siteUrl);
  });

  it.each(["testing", "deploy-preview", "branch-deploy", "Production"])(
    "rejects invalid APP_ENV %s",
    (appEnv) => {
      expect(() =>
        getEnvironment({
          APP_ENV: appEnv,
          SITE_URL: siteUrl,
        }),
      ).toThrow(`Invalid APP_ENV: ${appEnv}`);
    },
  );

  it("rejects paths in SITE_URL", () => {
    expect(() =>
      getEnvironment({
        SITE_URL: "https://example.com/page",
      }),
    ).toThrow("SITE_URL must be a valid origin");
  });

  it("rejects query parameters", () => {
    expect(() =>
      getEnvironment({
        SITE_URL: "https://example.com/?test=1",
      }),
    ).toThrow("SITE_URL must be a valid origin");
  });

  it("rejects unsupported protocols", () => {
    expect(() =>
      getEnvironment({
        SITE_URL: "ftp://example.com",
      }),
    ).toThrow("SITE_URL must use HTTP or HTTPS");
  });

  it("rejects malformed URLs", () => {
    expect(() =>
      getEnvironment({
        SITE_URL: "invalid-url",
      }),
    ).toThrow("SITE_URL must be a valid URL");
  });
});
