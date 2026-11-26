import { beforeEach, describe, expect, it, vi } from "vitest";

import { pageSchema } from "@/content/schemas/page.schema";
import { articleSchema } from "@/content/schemas/article.schema";

import type { ContentEntry } from "@/lib/content/registry";
import type { Locale } from "@/i18n/config";

import { ContentPageRenderer } from "@/components/pages/content-page-renderer";

vi.mock("server-only", () => ({}));

vi.mock("@/components/pages/ContentPage/ContentPage", () => ({
  ContentPage: () => null,
}));

vi.mock("@/components/pages/BlogPage/BlogPage", () => ({
  BlogPage: () => null,
}));

vi.mock("@/components/pages/ArticlePage/ArticlePage", () => ({
  ArticlePage: () => null,
}));

import { ContentPage } from "@/components/pages/ContentPage/ContentPage";
import { BlogPage } from "@/components/pages/BlogPage/BlogPage";
import { ArticlePage } from "@/components/pages/ArticlePage/ArticlePage";

const seo = {
  title: "Test content",
  description: "Test content description.",
};

function createStandardPage(locale: Locale = "en"): ContentEntry {
  return {
    kind: "page",
    locale,
    data: pageSchema.parse({
      id: "test-page",
      slug: "test-page",
      status: "published",
      seo,
      content: {
        sections: [],
      },
    }),
  };
}

function createBlogPage(locale: Locale = "en"): ContentEntry {
  return {
    kind: "page",
    locale,
    data: pageSchema.parse({
      id: "blog",
      slug: locale === "en" ? "stories-from-the-spring" : "price-sa-izvora",
      status: "published",
      seo,
      content: {
        sections: [],
      },
    }),
  };
}

function createArticle(locale: Locale = "en"): ContentEntry {
  return {
    kind: "article",
    locale,
    data: articleSchema.parse({
      id: "test-article",
      slug: "test-article",
      category: "nature",
      status: "published",
      featured: false,
      author: {
        name: "Test author",
      },
      createdAt: "2026-01-01T10:00:00+01:00",
      publishedAt: "2026-01-02T10:00:00+01:00",
      modifiedAt: "2026-01-03T10:00:00+01:00",
      seo,
      preview: {
        title: "Test article",
        description: "Test article description.",
      },
      content: {
        sections: [],
      },
    }),
  };
}

describe("Content page renderer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each<Locale>(["sr-Cyrl", "sr-Latn", "en"])(
    "selects the standard page renderer for %s",
    async (locale) => {
      const entry = createStandardPage(locale);

      const result = await ContentPageRenderer({ entry });

      expect(result).toMatchObject({
        type: ContentPage,
        props: {
          entry,
        },
      });
    },
  );

  it.each<Locale>(["sr-Cyrl", "sr-Latn", "en"])(
    "selects the blog page renderer for %s",
    async (locale) => {
      const entry = createBlogPage(locale);

      const result = await ContentPageRenderer({ entry });

      expect(result).toMatchObject({
        type: BlogPage,
        props: {
          entry,
        },
      });
    },
  );

  it.each<Locale>(["sr-Cyrl", "sr-Latn", "en"])(
    "selects the article page renderer for %s",
    async (locale) => {
      const entry = createArticle(locale);

      const result = await ContentPageRenderer({ entry });

      expect(result).toMatchObject({
        type: ArticlePage,
        props: {
          entry,
        },
      });
    },
  );

  it("preserves the original standard page entry reference", async () => {
    const entry = createStandardPage();

    const result = await ContentPageRenderer({ entry });

    expect(result).toHaveProperty("props.entry", entry);
  });

  it("preserves the original blog page entry reference", async () => {
    const entry = createBlogPage();

    const result = await ContentPageRenderer({ entry });

    expect(result).toHaveProperty("props.entry", entry);
  });

  it("preserves the original article entry reference", async () => {
    const entry = createArticle();

    const result = await ContentPageRenderer({ entry });

    expect(result).toHaveProperty("props.entry", entry);
  });

  it("selects the standard renderer for a nested page", async () => {
    const entry: ContentEntry = {
      kind: "page",
      locale: "en",
      data: pageSchema.parse({
        id: "nested-test-page",
        slug: "parent/child",
        status: "published",
        seo,
        content: {
          sections: [],
        },
      }),
    };

    const result = await ContentPageRenderer({ entry });

    expect(result).toMatchObject({
      type: ContentPage,
      props: {
        entry,
      },
    });
  });

  it("selects the article renderer independently of the article ID", async () => {
    const entry = createArticle();

    entry.data.id = "blog";

    const result = await ContentPageRenderer({ entry });

    expect(result).toMatchObject({
      type: ArticlePage,
      props: {
        entry,
      },
    });
  });
});
