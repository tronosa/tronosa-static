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
    expect(urls).toContain(`${siteUrl}/en`);
    expect(urls).toContain(`${siteUrl}/blog`);
    expect(urls).toContain(`${siteUrl}/en/blog`);

    expect(robots().sitemap).toBe(`${siteUrl}/sitemap.xml`);
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
