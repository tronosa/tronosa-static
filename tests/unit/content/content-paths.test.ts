import { describe, expect, it } from "vitest";

import {
  BLOG_SLUGS,
  getBlogPath,
  getBlogSlug,
} from "@/lib/content/content-route.config";

import {
  getArticlePath,
  getContentHref,
  getContentPublicPath,
  getLocalizedPath,
  getPagePath,
} from "@/lib/content/content-paths";

import {
  standardPageSchema,
  blogPageSchema,
} from "@/content/schemas/page.schema";

import { articleSchema } from "@/content/schemas/article.schema";

import type { Locale } from "@/i18n/config";

import type { ArticleEntry, PageEntry } from "@/lib/content/registry";

const SEO = {
  title: "Test title",
  description: "Test description.",
};

const DATE = "2026-01-01T10:00:00+01:00";

const CASES = [
  {
    locale: "sr-Cyrl",
    prefix: "",
    blogSlug: "price-sa-izvora",
  },
  {
    locale: "sr-Latn",
    prefix: "/sr-Latn",
    blogSlug: "price-sa-izvora",
  },
  {
    locale: "en",
    prefix: "/en",
    blogSlug: "stories-from-the-spring",
  },
] as const;

function createPage(locale: Locale, slug: string): PageEntry {
  return {
    kind: "page",
    locale,
    data: standardPageSchema.parse({
      id: slug === "" ? "home" : "test-page",
      slug,
      seo: SEO,
      content: {
        sections: [],
      },
    }),
  };
}

function createBlog(locale: Locale, slug: string): PageEntry {
  return {
    kind: "page",
    locale,
    data: blogPageSchema.parse({
      id: "blog",
      slug,
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

describe("Journal route configuration", () => {
  it.each(CASES)(
    "defines the journal namespace for $locale",
    ({ locale, blogSlug }) => {
      expect(BLOG_SLUGS[locale]).toBe(blogSlug);

      expect(getBlogSlug(locale)).toBe(blogSlug);

      expect(getBlogPath(locale)).toBe(`/${blogSlug}`);
    },
  );
});

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
  it.each(CASES)(
    "generates article paths for $locale",
    ({ locale, blogSlug }) => {
      expect(getArticlePath(locale, "test-article")).toBe(
        `/${blogSlug}/test-article`,
      );
    },
  );

  it.each(CASES)(
    "encodes article slugs for $locale",
    ({ locale, blogSlug }) => {
      expect(getArticlePath(locale, "test article")).toBe(
        `/${blogSlug}/test%20article`,
      );
    },
  );
});

describe("getLocalizedPath", () => {
  it.each(CASES)("generates home paths for $locale", ({ locale, prefix }) => {
    expect(getLocalizedPath(locale, "/")).toBe(prefix || "/");
  });

  it.each(CASES)("preserves nested paths for $locale", ({ locale, prefix }) => {
    expect(getLocalizedPath(locale, "/parent/child")).toBe(
      `${prefix}/parent/child`,
    );
  });
});

describe("getContentHref", () => {
  it.each(CASES)("generates internal home paths for $locale", ({ locale }) => {
    expect(getContentHref(createPage(locale, ""))).toBe("/");
  });

  it.each(CASES)(
    "generates internal nested paths for $locale",
    ({ locale }) => {
      expect(getContentHref(createPage(locale, "parent/child"))).toBe(
        "/parent/child",
      );
    },
  );

  it.each(CASES)(
    "generates internal journal paths for $locale",
    ({ locale, blogSlug }) => {
      expect(getContentHref(createBlog(locale, blogSlug))).toBe(`/${blogSlug}`);
    },
  );

  it.each(CASES)(
    "generates internal article paths for $locale",
    ({ locale, blogSlug }) => {
      expect(getContentHref(createArticle(locale, "test-article"))).toBe(
        `/${blogSlug}/test-article`,
      );
    },
  );
});

describe("getContentPublicPath", () => {
  it.each(CASES)(
    "generates public home paths for $locale",
    ({ locale, prefix }) => {
      expect(getContentPublicPath(createPage(locale, ""))).toBe(prefix || "/");
    },
  );

  it.each(CASES)(
    "generates public nested paths for $locale",
    ({ locale, prefix }) => {
      expect(getContentPublicPath(createPage(locale, "parent/child"))).toBe(
        `${prefix}/parent/child`,
      );
    },
  );

  it.each(CASES)(
    "generates public journal paths for $locale",
    ({ locale, prefix, blogSlug }) => {
      expect(getContentPublicPath(createBlog(locale, blogSlug))).toBe(
        `${prefix}/${blogSlug}`,
      );
    },
  );

  it.each(CASES)(
    "generates public article paths for $locale",
    ({ locale, prefix, blogSlug }) => {
      expect(getContentPublicPath(createArticle(locale, "test-article"))).toBe(
        `${prefix}/${blogSlug}/test-article`,
      );
    },
  );

  it("preserves nested separators during encoding", () => {
    expect(getContentPublicPath(createPage("en", "parent/test page"))).toBe(
      "/en/parent/test%20page",
    );
  });
});
