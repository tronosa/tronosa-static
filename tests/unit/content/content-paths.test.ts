import { describe, expect, it } from "vitest";

import {
  BLOG_PATH,
  getArticlePath,
  getContentHref,
  getContentPublicPath,
  getPagePath,
} from "@/lib/content/content-paths";

import { standardPageSchema } from "@/content/schemas/page.schema";

import { articleSchema } from "@/content/schemas/article.schema";

import type { Locale } from "@/i18n/config";

import type { PageEntry, ArticleEntry } from "@/lib/content/registry";

const SEO = {
  title: "Test title",
  description: "Test description.",
};

const DATE = "2026-01-01T10:00:00+01:00";

function createPage(locale: Locale, slug: string): PageEntry {
  return {
    kind: "page",
    locale,
    data: standardPageSchema.parse({
      id: slug === "" ? "home" : "test-page",
      slug,
      status: "published",
      seo: SEO,
      content: {
        sections: [],
      },
    }),
  };
}

function createArticle(locale: Locale, slug: string): ArticleEntry {
  return {
    kind: "article",
    locale,
    data: articleSchema.parse({
      id: "test-article",
      slug,
      status: "published",
      category: "nature",
      featured: false,
      createdAt: DATE,
      modifiedAt: DATE,
      publishedAt: DATE,
      author: {
        name: "Test author",
      },
      preview: {
        title: "Test article",
        description: "Test article description.",
      },
      seo: SEO,
      content: {
        sections: [],
      },
    }),
  };
}

describe("getPagePath", () => {
  it.each([
    ["", "/"],
    ["test-page", "/test-page"],
    ["parent/child", "/parent/child"],
    ["parent/child/nested", "/parent/child/nested"],
    ["test page", "/test%20page"],
    ["parent/test page", "/parent/test%20page"],
    ["test-č", "/test-%C4%8D"],
    ["test?value", "/test%3Fvalue"],
    ["test#value", "/test%23value"],
  ])("converts %s to %s", (slug, expected) => {
    expect(getPagePath(slug)).toBe(expected);
  });
});

describe("getArticlePath", () => {
  it("uses the configured blog namespace", () => {
    expect(BLOG_PATH).toBe("/blog");
  });

  it.each([
    ["test-article", "/blog/test-article"],
    ["test article", "/blog/test%20article"],
  ])("converts %s to %s", (slug, expected) => {
    expect(getArticlePath(slug)).toBe(expected);
  });
});

describe("getContentHref", () => {
  it.each(["sr-Cyrl", "sr-Latn", "en"] as const)(
    "generates a locale-relative home href for %s",
    (locale) => {
      expect(getContentHref(createPage(locale, ""))).toBe("/");
    },
  );

  it.each(["sr-Cyrl", "sr-Latn", "en"] as const)(
    "does not add a locale prefix to nested page hrefs for %s",
    (locale) => {
      expect(getContentHref(createPage(locale, "parent/child"))).toBe(
        "/parent/child",
      );
    },
  );

  it.each(["sr-Cyrl", "sr-Latn", "en"] as const)(
    "does not add a locale prefix to article hrefs for %s",
    (locale) => {
      expect(getContentHref(createArticle(locale, "test-article"))).toBe(
        "/blog/test-article",
      );
    },
  );
});

describe("getContentPublicPath", () => {
  it.each([
    ["sr-Cyrl", "/"],
    ["sr-Latn", "/sr-Latn"],
    ["en", "/en"],
  ] as const)("generates the public home path for %s", (locale, expected) => {
    expect(getContentPublicPath(createPage(locale, ""))).toBe(expected);
  });

  it.each([
    ["sr-Cyrl", "/test-page"],
    ["sr-Latn", "/sr-Latn/test-page"],
    ["en", "/en/test-page"],
  ] as const)("generates the public page path for %s", (locale, expected) => {
    expect(getContentPublicPath(createPage(locale, "test-page"))).toBe(
      expected,
    );
  });

  it.each([
    ["sr-Cyrl", "/parent/child"],
    ["sr-Latn", "/sr-Latn/parent/child"],
    ["en", "/en/parent/child"],
  ] as const)(
    "generates the public nested page path for %s",
    (locale, expected) => {
      expect(getContentPublicPath(createPage(locale, "parent/child"))).toBe(
        expected,
      );
    },
  );

  it.each([
    ["sr-Cyrl", "/blog/test-article"],
    ["sr-Latn", "/sr-Latn/blog/test-article"],
    ["en", "/en/blog/test-article"],
  ] as const)(
    "generates the public article path for %s",
    (locale, expected) => {
      expect(getContentPublicPath(createArticle(locale, "test-article"))).toBe(
        expected,
      );
    },
  );

  it("preserves nested path separators during encoding", () => {
    expect(getContentPublicPath(createPage("en", "parent/test page"))).toBe(
      "/en/parent/test%20page",
    );
  });
});
