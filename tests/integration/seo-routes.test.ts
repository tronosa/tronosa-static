import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("SEO routes", () => {
  const siteUrl = "https://example.com";

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("disables sitemap generation in development", () => {
    vi.stubEnv("APP_ENV", "development");
    vi.stubEnv("SITE_URL", "http://localhost:3000");
    vi.stubEnv("SEO_INDEXING_ENABLED", "false");

    const result = robots();

    expect(result.sitemap).toBeUndefined();
    expect(result.rules).toEqual({
      userAgent: "*",
      disallow: "/",
    });
    expect(sitemap()).toEqual([]);
  });

  it("generates a sitemap in production when indexing is enabled", () => {
    vi.stubEnv("APP_ENV", "production");
    vi.stubEnv("SITE_URL", siteUrl);
    vi.stubEnv("SEO_INDEXING_ENABLED", "true");

    const urls = sitemap().map((route) => route.url);

    expect(urls).toContain(`${siteUrl}/`);
    expect(urls).toContain(`${siteUrl}/sr-Latn`);
    expect(urls).toContain(`${siteUrl}/en`);

    expect(urls).toContain(`${siteUrl}/price-sa-izvora`);

    expect(urls).toContain(`${siteUrl}/sr-Latn/price-sa-izvora`);

    expect(urls).toContain(`${siteUrl}/en/stories-from-the-spring`);

    expect(robots().sitemap).toBe(`${siteUrl}/sitemap.xml`);
  });

  it("excludes obsolete journal URLs from the sitemap", () => {
    vi.stubEnv("APP_ENV", "production");
    vi.stubEnv("SITE_URL", siteUrl);
    vi.stubEnv("SEO_INDEXING_ENABLED", "true");

    const legacyPaths = ["/blog", "/sr-Latn/blog", "/sr-Cyrl/blog", "/en/blog"];

    const paths = sitemap().map(({ url }) => new URL(url).pathname);

    for (const legacyPath of legacyPaths) {
      expect(
        paths.some(
          (pathname) =>
            pathname === legacyPath || pathname.startsWith(`${legacyPath}/`),
        ),
      ).toBe(false);
    }
  });

  it("does not include duplicate URLs in the sitemap", () => {
    vi.stubEnv("APP_ENV", "production");
    vi.stubEnv("SITE_URL", siteUrl);
    vi.stubEnv("SEO_INDEXING_ENABLED", "true");

    const urls = sitemap().map(({ url }) => url);

    expect(new Set(urls).size).toBe(urls.length);
  });

  it("disables sitemap generation in production without opt-in", () => {
    vi.stubEnv("APP_ENV", "production");
    vi.stubEnv("SITE_URL", siteUrl);
    vi.stubEnv("SEO_INDEXING_ENABLED", "false");

    expect(sitemap()).toEqual([]);
    expect(robots().sitemap).toBeUndefined();
  });

  it("disables sitemap generation on branch deploys", () => {
    vi.stubEnv("APP_ENV", "staging");
    vi.stubEnv("SITE_URL", siteUrl);
    vi.stubEnv("SEO_INDEXING_ENABLED", "true");

    expect(sitemap()).toEqual([]);
    expect(robots().sitemap).toBeUndefined();
  });

  it("disables sitemap generation on deploy previews", () => {
    vi.stubEnv("APP_ENV", "staging");
    vi.stubEnv("SITE_URL", siteUrl);
    vi.stubEnv("SEO_INDEXING_ENABLED", "true");

    expect(sitemap()).toEqual([]);
    expect(robots().sitemap).toBeUndefined();
  });
});
