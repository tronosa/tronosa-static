import { describe, expect, it } from "vitest";

import { getEnvironment } from "./environment";

describe("Application environment", () => {
  const siteUrl = "https://example.com";

  it("enables indexing only in production", () => {
    expect(
      getEnvironment({
        NETLIFY: "true",
        CONTEXT: "production",
        SITE_URL: siteUrl,
      }).isIndexable,
    ).toBe(true);
  });

  it.each(["deploy-preview", "branch-deploy", "dev"])(
    "disables indexing in %s",
    (context) => {
      expect(
        getEnvironment({
          NETLIFY: "true",
          CONTEXT: context,
          SITE_URL: siteUrl,
        }).isIndexable,
      ).toBe(false);
    },
  );

  it("disables indexing locally", () => {
    expect(getEnvironment({}).isIndexable).toBe(false);
  });

  it("requires SITE_URL on Netlify", () => {
    expect(() =>
      getEnvironment({
        NETLIFY: "true",
        CONTEXT: "production",
      }),
    ).toThrow("SITE_URL is required");
  });

  it("requires HTTPS in production", () => {
    expect(() =>
      getEnvironment({
        NETLIFY: "true",
        CONTEXT: "production",
        SITE_URL: "http://example.com",
      }),
    ).toThrow("must use HTTPS");
  });

  it("normalizes the site origin", () => {
    expect(
      getEnvironment({
        SITE_URL: "https://example.com/",
      }).siteUrl,
    ).toBe("https://example.com");
  });
});
