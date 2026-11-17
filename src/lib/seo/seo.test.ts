import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { defaultLocale, locales } from "@/i18n/config";

import {
  getContentById,
  getContentRegistry,
  getPublishedContent,
} from "@/lib/content/registry";

import { getLanguageAlternates } from "./alternates";
import { createSeoMetadata } from "./metadata";
import { createStructuredData } from "./structured-data";
import { getContentUrl } from "./urls";

const SITE_URL = "https://example.com";

beforeAll(() => {
  vi.stubEnv("APP_ENV", "production");
  vi.stubEnv("SITE_URL", SITE_URL);
  vi.stubEnv("SEO_INDEXING_ENABLED", "true");
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe("SEO content registry", () => {
  it("validates every JSON document", () => {
    const entries = getContentRegistry();

    expect(entries.length).toBeGreaterThan(0);
  });

  it.each(locales)("contains a localized home page for %s", (locale) => {
    expect(getContentById("page", locale, "home")).toBeDefined();
  });

  it.each(locales)("generates the correct canonical URL for %s", (locale) => {
    const entry = getContentById("page", locale, "home");

    if (!entry) {
      throw new Error(`Missing home page for locale: ${locale}`);
    }

    const expectedUrl =
      locale === defaultLocale ? `${SITE_URL}/` : `${SITE_URL}/${locale}`;

    expect(getContentUrl(entry)).toBe(expectedUrl);
  });

  it.each(locales)("generates reciprocal hreflang links for %s", (locale) => {
    const entry = getContentById("page", locale, "home");

    if (!entry) {
      throw new Error(`Missing home page for locale: ${locale}`);
    }

    const expectedAlternates = {
      ...Object.fromEntries(
        locales.map((supportedLocale) => [
          supportedLocale,
          supportedLocale === defaultLocale
            ? `${SITE_URL}/`
            : `${SITE_URL}/${supportedLocale}`,
        ]),
      ),
      "x-default": `${SITE_URL}/`,
    };

    expect(getLanguageAlternates(entry)).toEqual(expectedAlternates);
  });

  it("provides metadata for every published page", () => {
    for (const entry of getPublishedContent()) {
      const metadata = createSeoMetadata(entry);

      expect(metadata.title).toBeTruthy();
      expect(metadata.description).toBeTruthy();
      expect(metadata.alternates?.canonical).toBeTruthy();
    }
  });

  it("generates structured data for every published page", async () => {
    for (const entry of getPublishedContent()) {
      const data = await createStructuredData(entry);

      expect(data["@context"]).toBe("https://schema.org");
      expect(data["@graph"].length).toBeGreaterThan(0);
    }
  });

  it("does not include draft articles as published content", () => {
    const entries = getPublishedContent();

    expect(
      entries.some(
        (entry) => entry.kind === "article" && entry.data.status === "draft",
      ),
    ).toBe(false);
  });
});
