import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  blogPageSchema,
  standardPageSchema,
} from "@/content/schemas/page.schema";

import { articleSchema } from "@/content/schemas/article.schema";

import type { Locale } from "@/i18n/config";

import type {
  ContentEntry,
  PageEntry,
  ArticleEntry,
} from "@/lib/content/registry";

const { getPublishedContentMock } = vi.hoisted(() => ({
  getPublishedContentMock: vi.fn<() => ContentEntry[]>(),
}));

vi.mock("server-only", () => ({}));

vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react")>()),
  cache: <T>(callback: T): T => callback,
}));

vi.mock("@/lib/content/registry", () => ({
  getPublishedContent: getPublishedContentMock,
}));

import {
  getContentStaticParams,
  resolveContentRoute,
} from "@/lib/content/content-route-resolver";

const SEO = {
  title: "Test title",
  description: "Test description.",
};

const DATE = "2026-01-01T10:00:00+01:00";

function createPage(locale: Locale, slug: string, id = "test-page"): PageEntry {
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

function createArticle(locale: Locale, slug = "test-article"): ArticleEntry {
  return {
    kind: "article",
    locale,
    data: articleSchema.parse({
      id: "test-article",
      slug,
      status: "published",
      category: "nature",
      createdAt: DATE,
      publishedAt: DATE,
      modifiedAt: DATE,
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

beforeEach(() => {
  getPublishedContentMock.mockReset();
  getPublishedContentMock.mockReturnValue([]);
});

describe("resolveContentRoute", () => {
  it("returns undefined for an empty registry", () => {
    expect(resolveContentRoute("en", ["unknown"])).toBeUndefined();
  });

  it("resolves standard pages", () => {
    const entry = createPage("en", "test-page");

    getPublishedContentMock.mockReturnValue([entry]);

    expect(resolveContentRoute("en", ["test-page"])).toEqual(entry);
  });

  it("resolves nested pages", () => {
    const entry = createPage("en", "parent/child");

    getPublishedContentMock.mockReturnValue([entry]);

    expect(resolveContentRoute("en", ["parent", "child"])).toEqual(entry);
  });

  it("resolves deeply nested pages", () => {
    const entry = createPage("en", "parent/child/nested");

    getPublishedContentMock.mockReturnValue([entry]);

    expect(resolveContentRoute("en", ["parent", "child", "nested"])).toEqual(
      entry,
    );
  });

  it.each([
    ["sr-Cyrl", "price-sa-izvora"],
    ["sr-Latn", "price-sa-izvora"],
    ["en", "stories-from-the-spring"],
  ] as const)("resolves the journal listing for %s", (locale, slug) => {
    const entry = createBlog(locale, slug);

    getPublishedContentMock.mockReturnValue([entry]);

    expect(resolveContentRoute(locale, [slug])).toEqual(entry);
  });

  it.each([
    ["sr-Cyrl", "price-sa-izvora"],
    ["sr-Latn", "price-sa-izvora"],
    ["en", "stories-from-the-spring"],
  ] as const)("resolves an article for %s", (locale, namespace) => {
    const entry = createArticle(locale);

    getPublishedContentMock.mockReturnValue([entry]);

    expect(resolveContentRoute(locale, [namespace, "test-article"])).toEqual(
      entry,
    );
  });

  it("keeps localized routes independent", () => {
    const english = createPage("en", "test-page");

    const serbian = createPage("sr-Latn", "test-page");

    getPublishedContentMock.mockReturnValue([english, serbian]);

    expect(resolveContentRoute("en", ["test-page"])).toEqual(english);

    expect(resolveContentRoute("sr-Latn", ["test-page"])).toEqual(serbian);
  });

  it("rejects a journal namespace for the wrong locale", () => {
    getPublishedContentMock.mockReturnValue([
      createBlog("en", "stories-from-the-spring"),
    ]);

    expect(resolveContentRoute("en", ["price-sa-izvora"])).toBeUndefined();
  });

  it("rejects obsolete blog routes", () => {
    getPublishedContentMock.mockReturnValue([
      createBlog("en", "stories-from-the-spring"),
      createArticle("en"),
    ]);

    expect(resolveContentRoute("en", ["blog"])).toBeUndefined();

    expect(resolveContentRoute("en", ["blog", "test-article"])).toBeUndefined();
  });

  it("rejects unknown nested pages", () => {
    getPublishedContentMock.mockReturnValue([createPage("en", "parent/child")]);

    expect(resolveContentRoute("en", ["parent", "unknown"])).toBeUndefined();
  });

  it("rejects additional article segments", () => {
    getPublishedContentMock.mockReturnValue([createArticle("en")]);

    expect(
      resolveContentRoute("en", [
        "stories-from-the-spring",
        "test-article",
        "extra",
      ]),
    ).toBeUndefined();
  });
});

describe("getContentStaticParams", () => {
  it("returns no params for an empty registry", () => {
    expect(getContentStaticParams()).toEqual([]);
  });

  it("excludes homepage routes", () => {
    getPublishedContentMock.mockReturnValue([createPage("en", "", "home")]);

    expect(getContentStaticParams()).toEqual([]);
  });

  it("includes all supported content types", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("en", "", "home"),
      createPage("en", "test-page"),
      createPage("en", "parent/child", "test-child"),
      createBlog("en", "stories-from-the-spring"),
      createArticle("en"),
    ]);

    expect(getContentStaticParams()).toEqual([
      {
        locale: "en",
        slug: ["test-page"],
      },
      {
        locale: "en",
        slug: ["parent", "child"],
      },
      {
        locale: "en",
        slug: ["stories-from-the-spring"],
      },
      {
        locale: "en",
        slug: ["stories-from-the-spring", "test-article"],
      },
    ]);
  });

  it("preserves localized journal namespaces", () => {
    getPublishedContentMock.mockReturnValue([
      createBlog("sr-Cyrl", "price-sa-izvora"),
      createBlog("sr-Latn", "price-sa-izvora"),
      createBlog("en", "stories-from-the-spring"),
    ]);

    expect(getContentStaticParams()).toEqual([
      {
        locale: "sr-Cyrl",
        slug: ["price-sa-izvora"],
      },
      {
        locale: "sr-Latn",
        slug: ["price-sa-izvora"],
      },
      {
        locale: "en",
        slug: ["stories-from-the-spring"],
      },
    ]);
  });
});
