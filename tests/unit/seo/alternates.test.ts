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
});
