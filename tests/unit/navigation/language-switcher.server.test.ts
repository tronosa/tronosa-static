import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Locale } from "@/i18n/config";

import type {
  ArticleEntry,
  ContentEntry,
  PageEntry,
} from "@/lib/content/registry";

const { getPublishedContentMock } = vi.hoisted(() => ({
  getPublishedContentMock: vi.fn<() => ContentEntry[]>(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/content/registry", () => ({
  getPublishedContent: getPublishedContentMock,
}));

import {
  standardPageSchema,
  blogPageSchema,
} from "@/content/schemas/page.schema";

import { articleSchema } from "@/content/schemas/article.schema";

import { getLanguageRoutes } from "@/components/navigation/LanguageSwitcher/language-switcher.server";

const DATE = "2026-01-01T10:00:00+01:00";

const SEO = {
  title: "Test title",
  description: "Test description.",
};

function createPage(locale: Locale, id: string, slug: string): PageEntry {
  return {
    kind: "page",
    locale,
    data: standardPageSchema.parse({
      id,
      slug,
      status: "published",
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
      status: "published",
      seo: SEO,
      content: {
        sections: [],
      },
    }),
  };
}

function createArticle(locale: Locale, id: string, slug: string): ArticleEntry {
  return {
    kind: "article",
    locale,
    data: articleSchema.parse({
      id,
      slug,
      status: "published",
      createdAt: DATE,
      modifiedAt: DATE,
      publishedAt: DATE,
      category: "nature",
      featured: false,
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

describe("getLanguageRoutes", () => {
  beforeEach(() => {
    getPublishedContentMock.mockReset();
    getPublishedContentMock.mockReturnValue([]);
  });

  it("returns an empty object when no published content exists", () => {
    expect(getLanguageRoutes()).toEqual({});
  });

  it("reads published content from the registry", () => {
    getLanguageRoutes();

    expect(getPublishedContentMock).toHaveBeenCalledTimes(1);
  });

  it("generates language alternatives for homepage routes", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("sr-Cyrl", "home", ""),
      createPage("sr-Latn", "home", ""),
      createPage("en", "home", ""),
    ]);

    const expected = {
      "sr-Cyrl": "/",
      "sr-Latn": "/",
      en: "/",
    };

    expect(getLanguageRoutes()).toEqual({
      "sr-Cyrl:/": expected,
      "sr-Latn:/": expected,
      "en:/": expected,
    });
  });

  it("generates alternatives for localized standard pages", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("sr-Cyrl", "test-page", "test-stranica"),
      createPage("sr-Latn", "test-page", "test-stranica"),
      createPage("en", "test-page", "test-page"),
    ]);

    const expected = {
      "sr-Cyrl": "/test-stranica",
      "sr-Latn": "/test-stranica",
      en: "/test-page",
    };

    expect(getLanguageRoutes()).toEqual({
      "sr-Cyrl:/test-stranica": expected,
      "sr-Latn:/test-stranica": expected,
      "en:/test-page": expected,
    });
  });

  it("generates alternatives for localized nested pages", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("sr-Cyrl", "test-child", "roditelj/dete"),
      createPage("sr-Latn", "test-child", "roditelj/dete"),
      createPage("en", "test-child", "parent/child"),
    ]);

    const expected = {
      "sr-Cyrl": "/roditelj/dete",
      "sr-Latn": "/roditelj/dete",
      en: "/parent/child",
    };

    expect(getLanguageRoutes()).toEqual({
      "sr-Cyrl:/roditelj/dete": expected,
      "sr-Latn:/roditelj/dete": expected,
      "en:/parent/child": expected,
    });
  });

  it("generates alternatives for localized journal listings", () => {
    getPublishedContentMock.mockReturnValue([
      createBlog("sr-Cyrl", "price-sa-izvora"),
      createBlog("sr-Latn", "price-sa-izvora"),
      createBlog("en", "stories-from-the-spring"),
    ]);

    const expected = {
      "sr-Cyrl": "/price-sa-izvora",
      "sr-Latn": "/price-sa-izvora",
      en: "/stories-from-the-spring",
    };

    expect(getLanguageRoutes()).toEqual({
      "sr-Cyrl:/price-sa-izvora": expected,
      "sr-Latn:/price-sa-izvora": expected,
      "en:/stories-from-the-spring": expected,
    });
  });

  it("generates alternatives for localized articles", () => {
    getPublishedContentMock.mockReturnValue([
      createArticle("sr-Cyrl", "test-article", "test-clanak"),
      createArticle("sr-Latn", "test-article", "test-clanak"),
      createArticle("en", "test-article", "test-article"),
    ]);

    const expected = {
      "sr-Cyrl": "/price-sa-izvora/test-clanak",
      "sr-Latn": "/price-sa-izvora/test-clanak",
      en: "/stories-from-the-spring/test-article",
    };

    expect(getLanguageRoutes()).toEqual({
      "sr-Cyrl:/price-sa-izvora/test-clanak": expected,
      "sr-Latn:/price-sa-izvora/test-clanak": expected,
      "en:/stories-from-the-spring/test-article": expected,
    });
  });

  it("does not associate pages with different content IDs", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("sr-Cyrl", "first-page", "prva-stranica"),
      createPage("en", "second-page", "second-page"),
    ]);

    expect(getLanguageRoutes()).toEqual({
      "sr-Cyrl:/prva-stranica": {
        "sr-Cyrl": "/prva-stranica",
      },
      "en:/second-page": {
        en: "/second-page",
      },
    });
  });

  it("does not associate articles with different content IDs", () => {
    getPublishedContentMock.mockReturnValue([
      createArticle("sr-Cyrl", "first-article", "prvi-clanak"),
      createArticle("en", "second-article", "second-article"),
    ]);

    expect(getLanguageRoutes()).toEqual({
      "sr-Cyrl:/price-sa-izvora/prvi-clanak": {
        "sr-Cyrl": "/price-sa-izvora/prvi-clanak",
      },
      "en:/stories-from-the-spring/second-article": {
        en: "/stories-from-the-spring/second-article",
      },
    });
  });

  it("does not associate pages and articles with the same content ID", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("sr-Cyrl", "shared-id", "test-stranica"),
      createArticle("en", "shared-id", "test-article"),
    ]);

    expect(getLanguageRoutes()).toEqual({
      "sr-Cyrl:/test-stranica": {
        "sr-Cyrl": "/test-stranica",
      },
      "en:/stories-from-the-spring/test-article": {
        en: "/stories-from-the-spring/test-article",
      },
    });
  });

  it("includes only available language alternatives", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("sr-Cyrl", "test-child", "roditelj/dete"),
      createPage("en", "test-child", "parent/child"),
    ]);

    const expected = {
      "sr-Cyrl": "/roditelj/dete",
      en: "/parent/child",
    };

    const routes = getLanguageRoutes();

    expect(routes).toEqual({
      "sr-Cyrl:/roditelj/dete": expected,
      "en:/parent/child": expected,
    });

    expect(routes["en:/parent/child"]).not.toHaveProperty("sr-Latn");
  });

  it("keeps parent and nested child routes independent", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("sr-Cyrl", "test-parent", "roditelj"),
      createPage("en", "test-parent", "parent"),
      createPage("sr-Cyrl", "test-child", "roditelj/dete"),
      createPage("en", "test-child", "parent/child"),
    ]);

    const parentAlternatives = {
      "sr-Cyrl": "/roditelj",
      en: "/parent",
    };

    const childAlternatives = {
      "sr-Cyrl": "/roditelj/dete",
      en: "/parent/child",
    };

    expect(getLanguageRoutes()).toEqual({
      "sr-Cyrl:/roditelj": parentAlternatives,
      "en:/parent": parentAlternatives,
      "sr-Cyrl:/roditelj/dete": childAlternatives,
      "en:/parent/child": childAlternatives,
    });
  });

  it("resolves alternatives independently of registry entry order", () => {
    getPublishedContentMock.mockReturnValue([
      createArticle("en", "test-article", "test-article"),
      createPage("sr-Latn", "test-page", "test-stranica"),
      createArticle("sr-Cyrl", "test-article", "test-clanak"),
      createPage("en", "test-page", "test-page"),
    ]);

    const routes = getLanguageRoutes();

    expect(routes["en:/stories-from-the-spring/test-article"]).toEqual({
      en: "/stories-from-the-spring/test-article",
      "sr-Cyrl": "/price-sa-izvora/test-clanak",
    });

    expect(routes["sr-Latn:/test-stranica"]).toEqual({
      "sr-Latn": "/test-stranica",
      en: "/test-page",
    });
  });

  it("does not add locale prefixes to internal language paths", () => {
    getPublishedContentMock.mockReturnValue([
      createBlog("sr-Cyrl", "price-sa-izvora"),
      createBlog("sr-Latn", "price-sa-izvora"),
      createBlog("en", "stories-from-the-spring"),
    ]);

    const routes = getLanguageRoutes();

    expect(routes["sr-Latn:/price-sa-izvora"]?.["sr-Latn"]).toBe(
      "/price-sa-izvora",
    );

    expect(routes["en:/stories-from-the-spring"]?.en).toBe(
      "/stories-from-the-spring",
    );
  });
});
