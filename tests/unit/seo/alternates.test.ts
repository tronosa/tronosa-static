import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/content/registry", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/content/registry")>();

  return {
    ...actual,
    getPublishedContent: vi.fn(),
  };
});

import { defaultLocale, locales } from "@/i18n/config";

import { getPublishedContent } from "@/lib/content/registry";

import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getContentUrl } from "@/lib/seo/urls";

import { createPageEntry, SITE_URL } from "./seo.fixtures";

const publishedContentMock = vi.mocked(getPublishedContent);

beforeEach(() => {
  vi.stubEnv("APP_ENV", "production");
  vi.stubEnv("SITE_URL", SITE_URL);
  vi.stubEnv("SEO_INDEXING_ENABLED", "true");

  publishedContentMock.mockReset();
  publishedContentMock.mockReturnValue([]);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Language alternates", () => {
  it("includes every indexable translation", () => {
    const entries = locales.map((locale) => createPageEntry({ locale }));

    const entry = entries[0];

    publishedContentMock.mockReturnValue(entries);

    const expected = Object.fromEntries(
      entries.map((translation) => [
        translation.locale,
        getContentUrl(translation),
      ]),
    );

    expected["x-default"] = getContentUrl(
      createPageEntry({
        locale: defaultLocale,
      }),
    );

    expect(getLanguageAlternates(entry)).toEqual(expected);
  });

  it("returns no alternates when translations are missing", () => {
    const entry = createPageEntry();

    expect(getLanguageAlternates(entry)).toEqual({});
  });

  it("excludes unrelated content", () => {
    const entry = createPageEntry();

    publishedContentMock.mockReturnValue([
      createPageEntry({
        data: {
          id: "another-page",
          slug: "another-page",
        },
      }),
    ]);

    expect(getLanguageAlternates(entry)).toEqual({});
  });

  it("excludes non-indexable translations", () => {
    const entry = createPageEntry();

    publishedContentMock.mockReturnValue([
      entry,
      createPageEntry({
        locale: "sr-Latn",
        seo: {
          index: false,
        },
      }),
    ]);

    expect(getLanguageAlternates(entry)).toEqual({
      en: getContentUrl(entry),
    });
  });

  it("excludes translations with a custom canonical", () => {
    const entry = createPageEntry();

    publishedContentMock.mockReturnValue([
      entry,
      createPageEntry({
        locale: "sr-Latn",
        seo: {
          canonical: "/another-page",
        },
      }),
    ]);

    expect(getLanguageAlternates(entry)).toEqual({
      en: getContentUrl(entry),
    });
  });

  it("omits x-default when the default translation is missing", () => {
    const entry = createPageEntry({
      locale: "en",
    });

    publishedContentMock.mockReturnValue([entry]);

    const result = getLanguageAlternates(entry);

    expect(result).toEqual({
      en: getContentUrl(entry),
    });

    expect(result).not.toHaveProperty("x-default");
  });

  it("omits x-default when the default translation is not indexable", () => {
    const entry = createPageEntry();

    publishedContentMock.mockReturnValue([
      entry,
      createPageEntry({
        locale: defaultLocale,
        seo: {
          index: false,
        },
      }),
    ]);

    expect(getLanguageAlternates(entry)).not.toHaveProperty("x-default");
  });

  it("returns no alternates when the requested entry is not indexable", () => {
    const entry = createPageEntry({
      seo: {
        index: false,
      },
    });

    const translations = locales.map((locale) => createPageEntry({ locale }));

    publishedContentMock.mockReturnValue(translations);

    expect(getLanguageAlternates(entry)).toEqual({});
  });

  it("does not access published content for a non-indexable entry", () => {
    const entry = createPageEntry({
      seo: {
        index: false,
      },
    });

    expect(getLanguageAlternates(entry)).toEqual({});

    expect(publishedContentMock).not.toHaveBeenCalled();
  });

  it("returns no alternates when the requested entry has a different canonical URL", () => {
    const entry = createPageEntry({
      seo: {
        canonical: "/another-page",
      },
    });

    const translations = locales.map((locale) => createPageEntry({ locale }));

    publishedContentMock.mockReturnValue(translations);

    expect(getLanguageAlternates(entry)).toEqual({});

    expect(publishedContentMock).not.toHaveBeenCalled();
  });

  it("accepts a custom canonical that matches the public content URL", () => {
    const original = createPageEntry();

    const entry = createPageEntry({
      seo: {
        canonical: getContentUrl(original),
      },
    });

    publishedContentMock.mockReturnValue([entry]);

    expect(getLanguageAlternates(entry)).toEqual({
      [entry.locale]: getContentUrl(entry),
    });
  });

  it("includes x-default when only the default locale is available", () => {
    const entry = createPageEntry({
      locale: defaultLocale,
    });

    publishedContentMock.mockReturnValue([entry]);

    expect(getLanguageAlternates(entry)).toEqual({
      [defaultLocale]: getContentUrl(entry),
      "x-default": getContentUrl(entry),
    });
  });

  it("uses the default locale URL as x-default regardless of the requested locale", () => {
    const entry = createPageEntry({
      locale: "en",
    });

    const defaultEntry = createPageEntry({
      locale: defaultLocale,
    });

    publishedContentMock.mockReturnValue([entry, defaultEntry]);

    expect(getLanguageAlternates(entry)).toEqual({
      en: getContentUrl(entry),
      [defaultLocale]: getContentUrl(defaultEntry),
      "x-default": getContentUrl(defaultEntry),
    });
  });

  it("does not use a non-canonical default translation as x-default", () => {
    const entry = createPageEntry({
      locale: "en",
    });

    const defaultEntry = createPageEntry({
      locale: defaultLocale,
      seo: {
        canonical: "/another-page",
      },
    });

    publishedContentMock.mockReturnValue([entry, defaultEntry]);

    expect(getLanguageAlternates(entry)).toEqual({
      en: getContentUrl(entry),
    });
  });

  it("supports localized slugs for the same content identity", () => {
    const entries = [
      createPageEntry({
        locale: "en",
        data: {
          id: "about",
          slug: "about",
        },
      }),
      createPageEntry({
        locale: "sr-Cyrl",
        data: {
          id: "about",
          slug: "o-nama",
        },
      }),
      createPageEntry({
        locale: "sr-Latn",
        data: {
          id: "about",
          slug: "o-nama",
        },
      }),
    ];

    publishedContentMock.mockReturnValue(entries);

    const expected = {
      en: getContentUrl(entries[0]),
      "sr-Cyrl": getContentUrl(entries[1]),
      "sr-Latn": getContentUrl(entries[2]),
      "x-default": getContentUrl(entries[1]),
    };

    for (const entry of entries) {
      expect(getLanguageAlternates(entry)).toEqual(expected);
    }
  });

  it("excludes content with the same slug but a different identity", () => {
    const entry = createPageEntry({
      locale: "en",
      data: {
        id: "about",
        slug: "about",
      },
    });

    const unrelatedEntry = createPageEntry({
      locale: "sr-Latn",
      data: {
        id: "different-page",
        slug: "about",
      },
    });

    publishedContentMock.mockReturnValue([entry, unrelatedEntry]);

    expect(getLanguageAlternates(entry)).toEqual({
      en: getContentUrl(entry),
    });
  });

  it("returns reciprocal alternates for every available translation", () => {
    const entries = locales.map((locale) => createPageEntry({ locale }));

    publishedContentMock.mockReturnValue(entries);

    const expected = Object.fromEntries(
      entries.map((entry) => [entry.locale, getContentUrl(entry)]),
    );

    const defaultEntry = entries.find(
      (entry) => entry.locale === defaultLocale,
    );

    if (!defaultEntry) {
      throw new Error("Expected a default locale translation");
    }

    expected["x-default"] = getContentUrl(defaultEntry);

    for (const entry of entries) {
      expect(getLanguageAlternates(entry)).toEqual(expected);
    }
  });
});
