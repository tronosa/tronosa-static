import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("SEO routes", () => {
  it("does not advertise a sitemap in development", () => {
    vi.stubEnv("NETLIFY", undefined);
    vi.stubEnv("CONTEXT", undefined);
    vi.stubEnv("SITE_URL", "https://example.com");

    expect(robots().sitemap).toBeUndefined();
    expect(sitemap()).toEqual([]);
  });

  it("generates a production sitemap", () => {
    vi.stubEnv("NETLIFY", "true");
    vi.stubEnv("CONTEXT", "production");
    vi.stubEnv("SITE_URL", "https://example.com");
    vi.stubEnv("SEO_INDEXING_ENABLED", "true");

    const routes = sitemap();
    const urls = routes.map((route) => route.url);

    expect(urls).toContain("https://example.com/");
    expect(urls).toContain("https://example.com/en");

    expect(new Set(urls).size).toBe(urls.length);

    expect(robots().sitemap).toBe("https://example.com/sitemap.xml");
  });

  it("does not advertise a sitemap on branch deploys", () => {
    vi.stubEnv("NETLIFY", "true");
    vi.stubEnv("CONTEXT", "branch-deploy");
    vi.stubEnv("SITE_URL", "https://example.com");

    expect(sitemap()).toEqual([]);
    expect(robots().sitemap).toBeUndefined();
  });

  it("does not advertise a sitemap on deploy previews", () => {
    vi.stubEnv("NETLIFY", "true");
    vi.stubEnv("CONTEXT", "deploy-preview");
    vi.stubEnv("SITE_URL", "https://example.com");

    expect(sitemap()).toEqual([]);
    expect(robots().sitemap).toBeUndefined();
  });
});
