import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getPublishedContent } from "@/lib/content/registry";

import { getLanguageAlternates } from "@/lib/seo/alternates";
import { createSeoMetadata } from "@/lib/seo/metadata";

import { isCanonicalIndexable } from "@/lib/seo/indexability";

import { getCanonicalUrl, getContentUrl } from "@/lib/seo/urls";

import sitemap from "@/app/sitemap";

const SITE_URL = "https://example.com";

beforeAll(() => {
  vi.stubEnv("APP_ENV", "production");
  vi.stubEnv("SITE_URL", SITE_URL);
  vi.stubEnv("SEO_INDEXING_ENABLED", "true");
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe("SEO consistency across published content", () => {
  it("generates valid canonical URLs", () => {
    for (const entry of getPublishedContent()) {
      const canonical = new URL(getCanonicalUrl(entry));

      expect(canonical.origin).toBe(SITE_URL);
      expect(canonical.search).toBe("");
      expect(canonical.hash).toBe("");
    }
  });

  it("generates consistent canonical metadata", () => {
    for (const entry of getPublishedContent()) {
      const metadata = createSeoMetadata(entry);

      expect(metadata.alternates?.canonical).toBe(getCanonicalUrl(entry));
    }
  });

  it("contains only canonical indexable URLs in sitemap", () => {
    const expectedUrls = getPublishedContent()
      .filter(isCanonicalIndexable)
      .map(getContentUrl)
      .sort();

    const actualUrls = sitemap()
      .map(({ url }) => url)
      .sort();

    expect(actualUrls).toEqual(expectedUrls);
  });

  it("does not contain duplicate sitemap URLs", () => {
    const urls = sitemap().map(({ url }) => url);

    expect(new Set(urls).size).toBe(urls.length);
  });

  it("includes self-referencing hreflang URLs", () => {
    for (const entry of getPublishedContent()) {
      if (!isCanonicalIndexable(entry)) {
        continue;
      }

      const alternates = getLanguageAlternates(entry);

      expect(alternates[entry.locale]).toBe(getContentUrl(entry));
    }
  });

  it("generates reciprocal hreflang references", () => {
    const entries = getPublishedContent().filter(isCanonicalIndexable);

    const entriesByUrl = new Map(
      entries.map((entry) => [getContentUrl(entry), entry]),
    );

    for (const entry of entries) {
      const alternates = getLanguageAlternates(entry);

      for (const [locale, url] of Object.entries(alternates)) {
        if (locale === "x-default") {
          continue;
        }

        const translation = entriesByUrl.get(url);

        expect(translation).toBeDefined();

        if (!translation) {
          throw new Error(`Missing hreflang target: ${url}`);
        }

        expect(translation.locale).toBe(locale);
        expect(translation.kind).toBe(entry.kind);
        expect(translation.data.id).toBe(entry.data.id);

        const reciprocal = getLanguageAlternates(translation);

        expect(reciprocal[entry.locale]).toBe(getContentUrl(entry));
      }
    }
  });

  it("keeps sitemap and hreflang metadata consistent", () => {
    const entries = getPublishedContent().filter(isCanonicalIndexable);

    const sitemapByUrl = new Map(sitemap().map((route) => [route.url, route]));

    for (const entry of entries) {
      const route = sitemapByUrl.get(getContentUrl(entry));

      const metadata = createSeoMetadata(entry);

      expect(route).toBeDefined();

      expect(route?.alternates?.languages).toEqual(
        metadata.alternates?.languages,
      );
    }
  });
});
