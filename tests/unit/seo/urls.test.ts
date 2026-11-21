import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { defaultLocale, locales } from "@/i18n/config";

import { absoluteUrl } from "@/lib/seo/config";

import {
  getBlogUrl,
  getCanonicalUrl,
  getContentPath,
  getContentUrl,
  getLocaleHomeUrl,
} from "@/lib/seo/urls";

import { isSelfCanonical } from "@/lib/seo/indexability";

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

describe("Absolute URL resolution", () => {
  it.each(["", "/"])("resolves the site root from %s", (value) => {
    expect(absoluteUrl(value)).toBe(`${SITE_URL}/`);
  });

  it.each(["en/test-page", "/en/test-page", "/en/test-page/", "en/test-page/"])(
    "normalizes an internal path: %s",
    (value) => {
      expect(absoluteUrl(value)).toBe(`${SITE_URL}/en/test-page`);
    },
  );

  it("preserves an absolute URL from the configured site", () => {
    const url = `${SITE_URL}/en/test-page`;

    expect(absoluteUrl(url)).toBe(url);
  });

  it("preserves external absolute URLs without changing their origin", () => {
    const url = "https://another-site.com/example";

    expect(absoluteUrl(url)).toBe(url);
  });

  it("preserves an explicit HTTP protocol", () => {
    const url = "http://example.com/test-page";

    expect(absoluteUrl(url)).toBe(url);
  });

  it("resolves protocol-relative URLs using the site protocol", () => {
    expect(absoluteUrl("//another-site.com/test-page")).toBe(
      "https://another-site.com/test-page",
    );
  });

  it("normalizes whitespace around relative paths", () => {
    expect(absoluteUrl("  /en/test-page  ")).toBe(`${SITE_URL}/en/test-page`);
  });

  it("normalizes whitespace around absolute URLs", () => {
    expect(absoluteUrl(`  ${SITE_URL}/en/test-page  `)).toBe(
      `${SITE_URL}/en/test-page`,
    );
  });

  it("preserves query parameters in absolute URLs", () => {
    const url = `${SITE_URL}/en/test-page?version=2`;

    expect(absoluteUrl(url)).toBe(url);
  });

  it("preserves fragments in absolute URLs", () => {
    const url = `${SITE_URL}/en/test-page#content`;

    expect(absoluteUrl(url)).toBe(url);
  });

  it("rejects malformed absolute URLs", () => {
    expect(() => absoluteUrl("https://[")).toThrow();
  });
});

describe("Canonical URLs", () => {
  it("defaults the canonical URL to the public content URL", () => {
    const entry = createPageEntry();

    expect(getCanonicalUrl(entry)).toBe(getContentUrl(entry));
  });

  it.each([undefined, null, "", "   "])(
    "falls back to the public URL when canonical is %s",
    (canonical) => {
      const entry = createPageEntry({
        seo: {
          canonical,
        },
      });

      expect(getCanonicalUrl(entry)).toBe(getContentUrl(entry));
    },
  );

  it.each(["/en/test-page", "en/test-page", "/en/test-page/", "en/test-page/"])(
    "accepts a relative canonical URL: %s",
    (canonical) => {
      const entry = createPageEntry({
        seo: {
          canonical,
        },
      });

      expect(getCanonicalUrl(entry)).toBe(`${SITE_URL}/en/test-page`);
    },
  );

  it("accepts an absolute canonical URL from the configured site", () => {
    const entry = createPageEntry({
      seo: {
        canonical: `${SITE_URL}/en/test-page`,
      },
    });

    expect(getCanonicalUrl(entry)).toBe(`${SITE_URL}/en/test-page`);
  });

  it("accepts a protocol-relative canonical URL from the configured site", () => {
    const entry = createPageEntry({
      seo: {
        canonical: "//example.com/en/test-page",
      },
    });

    expect(getCanonicalUrl(entry)).toBe(`${SITE_URL}/en/test-page`);
  });

  it("normalizes the trailing slash of an absolute canonical URL", () => {
    const entry = createPageEntry({
      seo: {
        canonical: `${SITE_URL}/en/test-page/`,
      },
    });

    expect(getCanonicalUrl(entry)).toBe(`${SITE_URL}/en/test-page`);
  });

  it("preserves the root canonical URL", () => {
    const entry = createPageEntry({
      locale: defaultLocale,
      data: {
        id: "home",
        slug: "",
      },
      seo: {
        canonical: SITE_URL,
      },
    });

    expect(getCanonicalUrl(entry)).toBe(`${SITE_URL}/`);
  });

  it("accepts a different internal canonical path", () => {
    const entry = createPageEntry({
      seo: {
        canonical: "/another-page",
      },
    });

    expect(getCanonicalUrl(entry)).toBe(`${SITE_URL}/another-page`);
  });

  it.each([
    "https://another-site.com/en/test-page",
    "https://example.com.another-site.com/en/test-page",
    "https://subdomain.example.com/en/test-page",
    "//another-site.com/en/test-page",
    "http://example.com/en/test-page",
    "https://example.com:8443/en/test-page",
    "javascript:alert(1)",
    "data:text/html,test",
    "ftp://example.com/en/test-page",
  ])("rejects a canonical URL with an invalid origin: %s", (canonical) => {
    const entry = createPageEntry({
      seo: {
        canonical,
      },
    });

    expect(() => getCanonicalUrl(entry)).toThrow(
      "Invalid canonical URL for en/test-page",
    );
  });

  it.each([
    "/en/test-page?version=2",
    `${SITE_URL}/en/test-page?version=2`,
    `${SITE_URL}/en/test-page?utm_source=test`,
  ])("rejects canonical URLs with query parameters: %s", (canonical) => {
    const entry = createPageEntry({
      seo: {
        canonical,
      },
    });

    expect(() => getCanonicalUrl(entry)).toThrow(
      "Invalid canonical URL for en/test-page",
    );
  });

  it.each(["/en/test-page#content", `${SITE_URL}/en/test-page#content`])(
    "rejects canonical URLs with fragments: %s",
    (canonical) => {
      const entry = createPageEntry({
        seo: {
          canonical,
        },
      });

      expect(() => getCanonicalUrl(entry)).toThrow(
        "Invalid canonical URL for en/test-page",
      );
    },
  );

  it.each([
    "https://user@example.com/en/test-page",
    "https://:password@example.com/en/test-page",
    "https://user:password@example.com/en/test-page",
  ])("rejects canonical URLs with credentials: %s", (canonical) => {
    const entry = createPageEntry({
      seo: {
        canonical,
      },
    });

    expect(() => getCanonicalUrl(entry)).toThrow(
      "Invalid canonical URL for en/test-page",
    );
  });

  it("rejects malformed canonical URLs with a content-specific error", () => {
    const entry = createPageEntry({
      seo: {
        canonical: "https://[",
      },
    });

    expect(() => getCanonicalUrl(entry)).toThrow(
      "Invalid canonical URL for en/test-page",
    );
  });
});

describe("Canonical identity", () => {
  it("identifies an implicit self-canonical entry", () => {
    const entry = createPageEntry();

    expect(isSelfCanonical(entry)).toBe(true);
  });

  it.each([
    "/en/test-page",
    "/en/test-page/",
    `${SITE_URL}/en/test-page`,
    `${SITE_URL}/en/test-page/`,
  ])("identifies an explicit self-canonical URL: %s", (canonical) => {
    const entry = createPageEntry({
      seo: {
        canonical,
      },
    });

    expect(isSelfCanonical(entry)).toBe(true);
  });

  it("does not identify content pointing to another page as self-canonical", () => {
    const entry = createPageEntry({
      seo: {
        canonical: "/another-page",
      },
    });

    expect(isSelfCanonical(entry)).toBe(false);
  });

  it("does not identify content pointing to another locale as self-canonical", () => {
    const entry = createPageEntry({
      locale: "en",
      seo: {
        canonical: "/sr-Latn/test-page",
      },
    });

    expect(isSelfCanonical(entry)).toBe(false);
  });

  it.each(locales)(
    "identifies the localized home page as self-canonical for %s",
    (locale) => {
      const entry = createPageEntry({
        locale,
        data: {
          id: "home",
          slug: "",
        },
      });

      expect(isSelfCanonical(entry)).toBe(true);
    },
  );
});
