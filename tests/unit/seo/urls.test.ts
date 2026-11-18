import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { defaultLocale, locales } from "@/i18n/config";

import {
  getBlogUrl,
  getContentPath,
  getContentUrl,
  getLocaleHomeUrl,
} from "@/lib/seo/urls";

import { createPageEntry, SITE_URL } from "./seo.fixtures";

beforeEach(() => {
  vi.stubEnv("APP_ENV", "production");
  vi.stubEnv("SITE_URL", SITE_URL);
  vi.stubEnv("SEO_INDEXING_ENABLED", "true");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Content paths", () => {
  it.each(locales)("generates the home path for %s", (locale) => {
    const entry = createPageEntry({
      locale,
      data: {
        id: "home",
        slug: "",
      },
    });

    expect(getContentPath(entry)).toBe(
      locale === defaultLocale ? "/" : `/${locale}`,
    );
  });

  it.each(locales)("generates a localized page path for %s", (locale) => {
    const entry = createPageEntry({
      locale,
      data: {
        slug: "about-us",
      },
    });

    const prefix = locale === defaultLocale ? "" : `/${locale}`;

    expect(getContentPath(entry)).toBe(`${prefix}/about-us`);
  });

  it("encodes special characters in a slug", () => {
    const entry = createPageEntry({
      locale: "en",
      data: {
        slug: "test page",
      },
    });

    expect(getContentPath(entry)).toBe("/en/test%20page");
  });

  it("preserves path separators when encoding a slug", () => {
    const entry = createPageEntry({
      locale: "en",
      data: {
        slug: "products/test page",
      },
    });

    expect(getContentPath(entry)).toBe("/en/products/test%20page");
  });
});

describe("Absolute content URLs", () => {
  it("generates an absolute page URL", () => {
    const entry = createPageEntry({
      locale: "en",
    });

    expect(getContentUrl(entry)).toBe(`${SITE_URL}/en/test-page`);
  });

  it.each(locales)("generates the home URL for %s", (locale) => {
    const expected =
      locale === defaultLocale ? `${SITE_URL}/` : `${SITE_URL}/${locale}`;

    expect(getLocaleHomeUrl(locale)).toBe(expected);
  });

  it.each(locales)("generates the blog listing URL for %s", (locale) => {
    const prefix = locale === defaultLocale ? "" : `/${locale}`;

    expect(getBlogUrl(locale)).toBe(`${SITE_URL}${prefix}/blog`);
  });
});
