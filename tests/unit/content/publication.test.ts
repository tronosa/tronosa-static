import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  blogPageSchema,
  pageSchema,
  standardPageSchema,
} from "@/content/schemas/page.schema";

import { articleSchema } from "@/content/schemas/article.schema";

import type { Locale } from "@/i18n/config";

import type {
  ArticleEntry,
  ContentEntry,
  PageEntry,
} from "@/lib/content/registry";

const { loadContentRegistryMock } = vi.hoisted(() => ({
  loadContentRegistryMock: vi.fn<() => ContentEntry[]>(),
}));

vi.mock("server-only", () => ({}));

vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react")>()),
  cache: <T>(callback: T): T => callback,
}));

vi.mock("@/lib/content/content-loader", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/content/content-loader")>()),
  loadContentRegistry: loadContentRegistryMock,
}));

import { filterPublishedContent } from "@/lib/content/content-loader";

import {
  getContentRegistry,
  getContentById,
  getContentBySlug,
  getPublishedContent,
  getPublishedPostBySlug,
} from "@/lib/content/registry";

import { validateSectionReferences } from "@/lib/content/section-validation";

import { isPublished, isContentIndexable } from "@/lib/seo/indexability";

import { getLanguageRoutes } from "@/components/navigation/LanguageSwitcher/language-switcher.server";

type PublicationStatus = "draft" | "published";

const DATE = "2026-01-01T10:00:00+01:00";

const SEO = {
  title: "Test title",
  description: "Test description.",
  index: true,
  follow: true,
};

function createPage(
  status: PublicationStatus,
  locale: Locale = "en",
  id = "test-page",
  slug = "test-parent/test-child",
): PageEntry {
  return {
    kind: "page",
    locale,
    data: standardPageSchema.parse({
      id,
      slug,
      status,
      seo: SEO,
      content: {
        sections: [],
      },
    }),
  };
}

function createArticle(status: PublicationStatus): ArticleEntry {
  return {
    kind: "article",
    locale: "en",
    data: articleSchema.parse({
      id: "test-article",
      slug: "test-article",
      status,
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

function createSourcePage(
  status: PublicationStatus,
  targetPageId: string,
): PageEntry {
  return {
    kind: "page",
    locale: "en",
    data: blogPageSchema.parse({
      id: "blog",
      slug: "stories-from-the-spring",
      status,
      seo: SEO,
      content: {
        sections: [
          {
            id: "test-source-closing",
            type: "source-closing",
            content: {
              pageId: targetPageId,
            },
          },
        ],
      },
    }),
  };
}

beforeEach(() => {
  loadContentRegistryMock.mockReset();
  loadContentRegistryMock.mockReturnValue([]);
});

describe("Page publication schema", () => {
  const rawPage = {
    id: "test-page",
    slug: "test-page",
    seo: SEO,
    content: {
      sections: [],
    },
  };

  it("defaults existing pages to published", () => {
    expect(pageSchema.parse(rawPage).status).toBe("published");
  });

  it.each(["draft", "published"] as const)(
    "accepts the %s publication status",
    (status) => {
      expect(
        pageSchema.parse({
          ...rawPage,
          status,
        }).status,
      ).toBe(status);
    },
  );

  it.each(["archived", "private", "", null, 1, true])(
    "rejects an invalid publication status: %s",
    (status) => {
      expect(
        pageSchema.safeParse({
          ...rawPage,
          status,
        }).success,
      ).toBe(false);
    },
  );

  it("defaults existing blog pages to published", () => {
    expect(
      blogPageSchema.parse({
        ...rawPage,
        id: "blog",
        slug: "stories-from-the-spring",
      }).status,
    ).toBe("published");
  });

  it("supports draft blog pages", () => {
    expect(
      blogPageSchema.parse({
        ...rawPage,
        id: "blog",
        slug: "stories-from-the-spring",
        status: "draft",
      }).status,
    ).toBe("draft");
  });
});

describe("Published content filtering", () => {
  it("includes only published pages and articles", () => {
    const publishedPage = createPage("published");
    const draftPage = createPage("draft");

    const publishedArticle = createArticle("published");
    const draftArticle = createArticle("draft");

    expect(
      filterPublishedContent([
        publishedPage,
        draftPage,
        publishedArticle,
        draftArticle,
      ]),
    ).toEqual([publishedPage, publishedArticle]);
  });

  it("returns an empty collection when all entries are drafts", () => {
    expect(
      filterPublishedContent([createPage("draft"), createArticle("draft")]),
    ).toEqual([]);
  });

  it("does not mutate the original collection", () => {
    const entries = [createPage("published"), createPage("draft")];

    const snapshot = structuredClone(entries);

    filterPublishedContent(entries);

    expect(entries).toEqual(snapshot);
  });
});

describe("Page publication registry", () => {
  it("preserves draft pages in the internal registry", () => {
    const draft = createPage("draft");

    loadContentRegistryMock.mockReturnValue([draft]);

    expect(getContentRegistry()).toEqual([draft]);
  });

  it("resolves published pages by ID", () => {
    const published = createPage("published");

    loadContentRegistryMock.mockReturnValue([published]);

    expect(getContentById("page", "en", published.data.id)).toEqual(published);
  });

  it("resolves published pages by nested slug", () => {
    const published = createPage("published");

    loadContentRegistryMock.mockReturnValue([published]);

    expect(getContentBySlug("page", "en", published.data.slug)).toEqual(
      published,
    );
  });

  it("does not resolve draft pages by ID", () => {
    const draft = createPage("draft");

    loadContentRegistryMock.mockReturnValue([draft]);

    expect(getContentById("page", "en", draft.data.id)).toBeUndefined();
  });

  it("does not resolve draft pages by slug", () => {
    const draft = createPage("draft");

    loadContentRegistryMock.mockReturnValue([draft]);

    expect(getContentBySlug("page", "en", draft.data.slug)).toBeUndefined();
  });

  it("excludes draft pages from published content", () => {
    const published = createPage("published");
    const draft = createPage(
      "draft",
      "en",
      "draft-page",
      "test-parent/draft-page",
    );

    loadContentRegistryMock.mockReturnValue([published, draft]);

    expect(getPublishedContent()).toEqual([published]);
  });

  it("preserves direct registry lookup of draft articles", () => {
    const draft = createArticle("draft");

    loadContentRegistryMock.mockReturnValue([draft]);

    expect(getContentById("article", "en", draft.data.id)).toEqual(draft);

    expect(getContentBySlug("article", "en", draft.data.slug)).toEqual(draft);
  });

  it("does not expose draft articles through the published lookup", () => {
    const draft = createArticle("draft");

    loadContentRegistryMock.mockReturnValue([draft]);

    expect(getPublishedPostBySlug("en", draft.data.slug)).toBeUndefined();
  });

  it("excludes unpublished language alternatives", () => {
    const published = createPage(
      "published",
      "sr-Cyrl",
      "test-page",
      "test-parent/test-child",
    );

    const draft = createPage("draft", "en", "test-page", "parent/child");

    loadContentRegistryMock.mockReturnValue([published, draft]);

    expect(getLanguageRoutes()).toEqual({
      "sr-Cyrl:/test-parent/test-child": {
        "sr-Cyrl": "/test-parent/test-child",
      },
    });
  });
});

describe("Publication indexability", () => {
  it("recognizes published pages", () => {
    expect(isPublished(createPage("published"))).toBe(true);
  });

  it("recognizes draft pages", () => {
    expect(isPublished(createPage("draft"))).toBe(false);
  });

  it("recognizes published articles", () => {
    expect(isPublished(createArticle("published"))).toBe(true);
  });

  it("recognizes draft articles", () => {
    expect(isPublished(createArticle("draft"))).toBe(false);
  });

  it("allows indexable published pages", () => {
    expect(isContentIndexable(createPage("published"))).toBe(true);
  });

  it("prevents indexing draft pages even when SEO index is enabled", () => {
    expect(isContentIndexable(createPage("draft"))).toBe(false);
  });

  it("prevents indexing published pages with SEO index disabled", () => {
    const entry = createPage("published");

    entry.data.seo.index = false;

    expect(isContentIndexable(entry)).toBe(false);
  });
});

describe("Publication reference validation", () => {
  it("allows published content to reference a published page", () => {
    const source = createSourcePage("published", "test-page");
    const target = createPage("published");

    expect(() => validateSectionReferences([source, target])).not.toThrow();
  });

  it("rejects references from published content to draft pages", () => {
    const source = createSourcePage("published", "test-page");
    const target = createPage("draft");

    expect(() => validateSectionReferences([source, target])).toThrow(
      /Reference to draft page "test-page"/,
    );
  });

  it("allows draft content to reference a published page", () => {
    const source = createSourcePage("draft", "test-page");
    const target = createPage("published");

    expect(() => validateSectionReferences([source, target])).not.toThrow();
  });

  it("allows draft content to reference another draft page", () => {
    const source = createSourcePage("draft", "test-page");
    const target = createPage("draft");

    expect(() => validateSectionReferences([source, target])).not.toThrow();
  });

  it("rejects references to missing pages", () => {
    const source = createSourcePage("published", "missing-page");

    expect(() => validateSectionReferences([source])).toThrow(
      /Invalid page reference "missing-page"/,
    );
  });
});
