import path from "node:path";

import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import {
  standardPageSchema,
  type StandardPage,
  type Page,
} from "@/content/schemas/page.schema";

import { articleSchema, type Article } from "@/content/schemas/article.schema";

import type { Locale } from "@/i18n/config";

const { readFileMock, readdirMock } = vi.hoisted(() => ({
  readFileMock: vi.fn<(filename: string) => string>(),
  readdirMock: vi.fn<(directory: string) => string[]>(),
}));

vi.mock("server-only", () => ({}));

vi.mock("node:fs", async (importOriginal) => ({
  ...(await importOriginal<typeof import("node:fs")>()),
  readFileSync: readFileMock,
  readdirSync: readdirMock,
}));

vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react")>()),
  cache: <T>(callback: T): T => callback,
}));

import {
  getContentRegistry,
  getContentById,
  getContentBySlug,
  getPublishedContent,
  getPublishedPosts,
  getPublishedPostBySlug,
  getFeaturedPost,
  getRelatedPosts,
} from "@/lib/content/registry";

const root = path.join(process.cwd(), "src", "content");

const pagesDirectory = path.join(root, "pages", "en");

const blogDirectory = path.join(root, "blog", "en");

let pageFixture: StandardPage;

let articleFixture: Article;

let files: Map<string, string>;

function createPage(overrides: Partial<StandardPage> = {}): StandardPage {
  return {
    ...structuredClone(pageFixture),
    id: "test-page",
    slug: "test-page",
    ...overrides,
  };
}

function createArticle(overrides: Partial<Article> = {}): Article {
  return {
    ...structuredClone(articleFixture),
    id: "test-article",
    slug: "test-article",
    category: "nature",
    status: "published",
    featured: false,
    createdAt: "2026-01-01T10:00:00+01:00",
    publishedAt: "2026-01-02T10:00:00+01:00",
    modifiedAt: "2026-01-03T10:00:00+01:00",
    content: {
      sections: [
        {
          id: "article-metadata",
          type: "article-metadata",
        },
      ],
    },
    ...overrides,
  };
}

function addPage(filename: string, page: Page, locale: Locale = "en"): void {
  files.set(path.join(root, "pages", locale, filename), JSON.stringify(page));
}

function addRawPage(filename: string, page: unknown): void {
  files.set(path.join(pagesDirectory, filename), JSON.stringify(page));
}

function addArticle(
  filename: string,
  article: Article,
  locale: Locale = "en",
): void {
  files.set(path.join(root, "blog", locale, filename), JSON.stringify(article));
}

function addRawArticle(
  filename: string,
  article: unknown,
  locale: Locale = "en",
): void {
  files.set(path.join(root, "blog", locale, filename), JSON.stringify(article));
}

function createFileSystemError(code: string): Error {
  return Object.assign(new Error(code), { code });
}

beforeAll(async () => {
  const actualFs = await vi.importActual<typeof import("node:fs")>("node:fs");

  const filenames = actualFs
    .readdirSync(pagesDirectory)
    .filter((filename) => filename.endsWith(".json"))
    .sort();

  for (const filename of filenames) {
    const raw: unknown = JSON.parse(
      actualFs.readFileSync(path.join(pagesDirectory, filename), "utf8"),
    );

    const parsed = standardPageSchema.safeParse(raw);

    if (parsed.success && parsed.data.content.sections.length > 0) {
      pageFixture = parsed.data;

      return;
    }
  }

  throw new Error("Missing valid standard page fixture with content sections");
});

beforeAll(async () => {
  const actualFs = await vi.importActual<typeof import("node:fs")>("node:fs");

  const filenames = actualFs
    .readdirSync(blogDirectory)
    .filter((filename) => filename.endsWith(".json"))
    .sort();

  for (const filename of filenames) {
    const raw: unknown = JSON.parse(
      actualFs.readFileSync(path.join(blogDirectory, filename), "utf8"),
    );

    const parsed = articleSchema.safeParse(raw);

    if (parsed.success) {
      articleFixture = parsed.data;

      return;
    }
  }

  throw new Error("Missing valid article fixture");
});

beforeEach(() => {
  files = new Map<string, string>();

  vi.resetAllMocks();

  readdirMock.mockImplementation((directory) => {
    const filenames = [...files.keys()]
      .filter((filename) => path.dirname(filename) === directory)
      .map((filename) => path.basename(filename));

    if (filenames.length === 0) {
      throw createFileSystemError("ENOENT");
    }

    return filenames;
  });

  readFileMock.mockImplementation((filename) => {
    const content = files.get(filename);

    if (content === undefined) {
      throw createFileSystemError("ENOENT");
    }

    return content;
  });
});

describe("Content registry filesystem", () => {
  it("returns an empty registry for missing collections", () => {
    expect(getContentRegistry()).toEqual([]);
  });

  it("loads valid page content", () => {
    addPage("test-page.json", createPage());

    const result = getContentRegistry();

    expect(result).toHaveLength(1);

    expect(result[0]).toMatchObject({
      kind: "page",
      locale: "en",
      data: {
        id: "test-page",
        slug: "test-page",
      },
    });
  });

  it("ignores files without a JSON extension", () => {
    files.set(path.join(pagesDirectory, "README.md"), "Not JSON content");

    expect(getContentRegistry()).toEqual([]);

    expect(readFileMock).not.toHaveBeenCalled();
  });

  it("loads JSON files in filename order", () => {
    addPage(
      "z-page.json",
      createPage({
        id: "last-page",
        slug: "last-page",
      }),
    );

    addPage(
      "a-page.json",
      createPage({
        id: "first-page",
        slug: "first-page",
      }),
    );

    expect(getContentRegistry().map((entry) => entry.data.id)).toEqual([
      "first-page",
      "last-page",
    ]);
  });

  it("propagates unexpected filesystem errors", () => {
    readdirMock.mockImplementation(() => {
      throw createFileSystemError("EACCES");
    });

    expect(() => getContentRegistry()).toThrow("EACCES");
  });

  it("rejects malformed JSON content", () => {
    files.set(path.join(pagesDirectory, "invalid.json"), "{ invalid JSON");

    expect(() => getContentRegistry()).toThrow(
      /Invalid content:.*invalid\.json/,
    );
  });

  it("rejects invalid page content", () => {
    addRawPage("invalid.json", {});

    expect(() => getContentRegistry()).toThrow(
      /Invalid content:.*invalid\.json/,
    );
  });

  it("rejects unreadable content files", () => {
    addPage("test-page.json", createPage());

    readFileMock.mockImplementation(() => {
      throw createFileSystemError("EACCES");
    });

    expect(() => getContentRegistry()).toThrow(
      /Invalid content:.*test-page\.json/,
    );
  });
});

describe("Content registry validation", () => {
  it("accepts a home page with an empty slug", () => {
    addPage(
      "home.json",
      createPage({
        id: "home",
        slug: "",
      }),
    );

    expect(getContentRegistry()).toHaveLength(1);
  });

  it("rejects a home page with a non-empty slug", () => {
    addPage(
      "home.json",
      createPage({
        id: "home",
        slug: "homepage",
      }),
    );

    expect(() => getContentRegistry()).toThrow(
      "Home page must have an empty slug: en",
    );
  });

  it.each(["INVALID", "invalid slug", "invalid_slug", "a--b"])(
    "rejects invalid slug %s",
    (slug) => {
      addPage("invalid.json", createPage({ slug }));

      expect(() => getContentRegistry()).toThrow();
    },
  );

  it.each(["api", "blog"])("rejects the reserved page slug %s", (slug) => {
    addPage("reserved.json", createPage({ slug }));

    expect(() => getContentRegistry()).toThrow(`Reserved page slug "${slug}"`);
  });

  it("rejects a blog listing with an incorrect slug", () => {
    addRawPage("blog.json", {
      ...createPage(),
      id: "blog",
      slug: "articles",
    });

    expect(() => getContentRegistry()).toThrow(/Invalid content:.*blog\.json/);
  });

  it("accepts a blog listing with the correct slug", () => {
    addPage("blog.json", {
      ...createPage(),
      id: "blog",
      slug: "blog",
    });

    expect(getContentRegistry()).toHaveLength(1);
  });

  it("rejects duplicate section IDs", () => {
    const page = createPage();

    const section = page.content.sections[0];

    if (!section) {
      throw new Error("Expected fixture to contain a section");
    }

    addPage("duplicate-sections.json", {
      ...page,
      content: {
        ...page.content,
        sections: [section, structuredClone(section)],
      },
    });

    expect(() => getContentRegistry()).toThrow(/Duplicate section ID/);
  });

  it("rejects duplicate content identities", () => {
    addPage("first.json", createPage());

    addPage(
      "second.json",
      createPage({
        slug: "another-page",
      }),
    );

    expect(() => getContentRegistry()).toThrow(
      "Duplicate content identity: page:en:test-page",
    );
  });

  it("rejects duplicate public URLs", () => {
    addPage("first.json", createPage());

    addPage(
      "second.json",
      createPage({
        id: "another-page",
      }),
    );

    expect(() => getContentRegistry()).toThrow(/Duplicate public URL/);
  });
});

describe("Content registry section boundaries", () => {
  it("allows shared and blog-specific sections on the blog listing", () => {
    const page = createPage();

    addPage("blog.json", {
      ...page,
      id: "blog",
      slug: "blog",
      content: {
        sections: [
          ...page.content.sections,
          {
            id: "journal-opening",
            type: "journal-opening",
          },
          {
            id: "featured-chapter",
            type: "featured-chapter",
          },
        ],
      },
    });

    expect(getContentRegistry()).toHaveLength(1);
  });

  it("rejects blog-specific sections on standard pages", () => {
    addRawPage("invalid.json", {
      ...createPage(),
      content: {
        sections: [
          {
            id: "journal-opening",
            type: "journal-opening",
          },
        ],
      },
    });

    expect(() => getContentRegistry()).toThrow(
      /Invalid content:.*invalid\.json/,
    );
  });

  it("rejects article-specific sections on standard pages", () => {
    addRawPage("invalid.json", {
      ...createPage(),
      content: {
        sections: [
          {
            id: "article-metadata",
            type: "article-metadata",
          },
        ],
      },
    });

    expect(() => getContentRegistry()).toThrow(
      /Invalid content:.*invalid\.json/,
    );
  });

  it("rejects article-specific sections on the blog listing", () => {
    addRawPage("blog.json", {
      ...createPage(),
      id: "blog",
      slug: "blog",
      content: {
        sections: [
          {
            id: "article-metadata",
            type: "article-metadata",
          },
        ],
      },
    });

    expect(() => getContentRegistry()).toThrow(/Invalid content:.*blog\.json/);
  });

  it("rejects duplicate singleton sections with different IDs", () => {
    addPage("blog.json", {
      ...createPage(),
      id: "blog",
      slug: "blog",
      content: {
        sections: [
          {
            id: "featured-first",
            type: "featured-chapter",
          },
          {
            id: "featured-second",
            type: "featured-chapter",
          },
        ],
      },
    });

    expect(() => getContentRegistry()).toThrow(
      /Section "featured-chapter" can only appear once/,
    );
  });

  it("allows repeated shared sections with unique IDs", () => {
    const section = createPage().content.sections[0];

    if (!section) {
      throw new Error("Expected fixture to contain a section");
    }

    addPage("test-page.json", {
      ...createPage(),
      content: {
        sections: [
          {
            ...structuredClone(section),
            id: "first-section",
          },
          {
            ...structuredClone(section),
            id: "second-section",
          },
        ],
      },
    });

    expect(getContentRegistry()).toHaveLength(1);
  });

  it("rejects source closing references to missing pages", () => {
    addPage("blog.json", {
      ...createPage(),
      id: "blog",
      slug: "blog",
      content: {
        sections: [
          {
            id: "source-closing",
            type: "source-closing",
            content: {
              pageId: "missing-page",
            },
          },
        ],
      },
    });

    expect(() => getContentRegistry()).toThrow(
      /Invalid page reference "missing-page"/,
    );
  });

  it("accepts source closing references to existing pages", () => {
    addPage(
      "about.json",
      createPage({
        id: "about",
        slug: "about",
      }),
    );

    addPage("blog.json", {
      ...createPage(),
      id: "blog",
      slug: "blog",
      content: {
        sections: [
          {
            id: "source-closing",
            type: "source-closing",
            content: {
              pageId: "about",
            },
          },
        ],
      },
    });

    expect(getContentRegistry()).toHaveLength(2);
  });
});

describe("Content registry queries", () => {
  beforeEach(() => {
    addPage("test-page.json", createPage());
  });

  it("finds a page by ID", () => {
    expect(getContentById("page", "en", "test-page")?.data.id).toBe(
      "test-page",
    );
  });

  it("returns undefined for an unknown ID", () => {
    expect(getContentById("page", "en", "unknown")).toBeUndefined();
  });

  it("does not return content from another locale by ID", () => {
    expect(getContentById("page", "sr-Cyrl", "test-page")).toBeUndefined();
  });

  it("does not return a different content kind by ID", () => {
    expect(getContentById("article", "en", "test-page")).toBeUndefined();
  });

  it("finds a page by slug", () => {
    expect(getContentBySlug("page", "en", "test-page")?.data.slug).toBe(
      "test-page",
    );
  });

  it("returns undefined for an unknown slug", () => {
    expect(getContentBySlug("page", "en", "unknown")).toBeUndefined();
  });

  it("does not return content from another locale by slug", () => {
    expect(getContentBySlug("page", "sr-Cyrl", "test-page")).toBeUndefined();
  });

  it("does not return a different content kind by slug", () => {
    expect(getContentBySlug("article", "en", "test-page")).toBeUndefined();
  });

  it("includes pages in published content", () => {
    expect(getPublishedContent()).toEqual([
      expect.objectContaining({
        kind: "page",
        locale: "en",
      }),
    ]);
  });
});

describe("Content registry articles", () => {
  it("loads valid article content", () => {
    addArticle("article.json", createArticle());

    expect(getContentRegistry()).toEqual([
      expect.objectContaining({
        kind: "article",
        locale: "en",
        data: expect.objectContaining({
          id: "test-article",
          slug: "test-article",
          status: "published",
        }),
      }),
    ]);
  });

  it("rejects invalid article content", () => {
    addRawArticle("invalid.json", {});

    expect(() => getContentRegistry()).toThrow(
      /Invalid content:.*invalid\.json/,
    );
  });

  it("rejects malformed article JSON", () => {
    files.set(path.join(blogDirectory, "invalid.json"), "{ invalid JSON");

    expect(() => getContentRegistry()).toThrow(
      /Invalid content:.*invalid\.json/,
    );
  });

  it("rejects duplicate article identities", () => {
    addArticle("first.json", createArticle());

    addArticle(
      "second.json",
      createArticle({
        slug: "another-article",
      }),
    );

    expect(() => getContentRegistry()).toThrow(
      "Duplicate content identity: article:en:test-article",
    );
  });

  it("rejects duplicate article URLs", () => {
    addArticle("first.json", createArticle());

    addArticle(
      "second.json",
      createArticle({
        id: "another-article",
      }),
    );

    expect(() => getContentRegistry()).toThrow(/Duplicate public URL/);
  });

  it("allows the same article identity across locales", () => {
    addArticle("article.json", createArticle(), "en");

    addArticle("article.json", createArticle(), "sr-Cyrl");

    addArticle("article.json", createArticle(), "sr-Latn");

    expect(getContentRegistry()).toHaveLength(3);
  });

  it("allows article-specific sections on articles", () => {
    addArticle(
      "article.json",
      createArticle({
        content: {
          sections: [
            {
              id: "article-metadata",
              type: "article-metadata",
            },
            {
              id: "related-posts",
              type: "related-posts",
              content: {
                limit: 3,
              },
            },
          ],
        },
      }),
    );

    expect(getContentRegistry()).toHaveLength(1);
  });

  it("rejects blog-listing sections on articles", () => {
    addRawArticle("invalid.json", {
      ...createArticle(),
      content: {
        sections: [
          {
            id: "journal-opening",
            type: "journal-opening",
          },
        ],
      },
    });

    expect(() => getContentRegistry()).toThrow(
      /Invalid content:.*invalid\.json/,
    );
  });

  it("finds an article by ID", () => {
    addArticle("article.json", createArticle());

    expect(getContentById("article", "en", "test-article")).toMatchObject({
      kind: "article",
      locale: "en",
      data: {
        id: "test-article",
      },
    });
  });

  it("finds an article by slug", () => {
    addArticle("article.json", createArticle());

    expect(getContentBySlug("article", "en", "test-article")).toMatchObject({
      kind: "article",
      locale: "en",
      data: {
        slug: "test-article",
      },
    });
  });
});

describe("Content registry published content", () => {
  it("includes pages and published articles", () => {
    addPage("page.json", createPage());

    addArticle("article.json", createArticle());

    const result = getPublishedContent();

    expect(result).toHaveLength(2);

    expect(result.map(({ kind }) => kind)).toEqual(
      expect.arrayContaining(["page", "article"]),
    );
  });

  it("excludes draft articles from published content", () => {
    addPage("page.json", createPage());

    addArticle(
      "draft.json",
      createArticle({
        status: "draft",
      }),
    );

    expect(getPublishedContent()).toEqual([
      expect.objectContaining({
        kind: "page",
      }),
    ]);
  });

  it("returns an empty collection when no content exists", () => {
    expect(getPublishedContent()).toEqual([]);
  });

  it("allows direct registry lookup of draft articles", () => {
    addArticle(
      "draft.json",
      createArticle({
        status: "draft",
      }),
    );

    expect(getContentBySlug("article", "en", "test-article")).toMatchObject({
      data: {
        status: "draft",
      },
    });
  });
});

describe("Content registry published posts", () => {
  it("returns only published articles", () => {
    addPage("page.json", createPage());

    addArticle("published.json", createArticle());

    addArticle(
      "draft.json",
      createArticle({
        id: "draft-article",
        slug: "draft-article",
        status: "draft",
      }),
    );

    const result = getPublishedPosts();

    expect(result).toHaveLength(1);

    expect(result[0]?.data.id).toBe("test-article");
  });

  it("returns published articles across all locales", () => {
    addArticle("article.json", createArticle(), "en");

    addArticle("article.json", createArticle(), "sr-Cyrl");

    addArticle("article.json", createArticle(), "sr-Latn");

    const result = getPublishedPosts();

    expect(result).toHaveLength(3);

    expect(result.map(({ locale }) => locale)).toEqual(
      expect.arrayContaining(["en", "sr-Cyrl", "sr-Latn"]),
    );
  });

  it.each<Locale>(["en", "sr-Cyrl", "sr-Latn"])(
    "filters published articles by locale %s",
    (locale) => {
      addArticle("article.json", createArticle(), "en");

      addArticle("article.json", createArticle(), "sr-Cyrl");

      addArticle("article.json", createArticle(), "sr-Latn");

      const result = getPublishedPosts(locale);

      expect(result).toHaveLength(1);

      expect(result[0]?.locale).toBe(locale);
    },
  );

  it("sorts published articles by publication date descending", () => {
    addArticle(
      "older.json",
      createArticle({
        id: "older-article",
        slug: "older-article",
        publishedAt: "2026-01-01T11:00:00+01:00",
      }),
    );

    addArticle(
      "newer.json",
      createArticle({
        id: "newer-article",
        slug: "newer-article",
        publishedAt: "2026-01-02T11:00:00+01:00",
      }),
    );

    expect(getPublishedPosts("en").map(({ data }) => data.id)).toEqual([
      "newer-article",
      "older-article",
    ]);
  });

  it("uses article ID as a deterministic publication-date tie breaker", () => {
    addArticle(
      "a-file.json",
      createArticle({
        id: "z-article",
        slug: "z-article",
      }),
    );

    addArticle(
      "z-file.json",
      createArticle({
        id: "a-article",
        slug: "a-article",
      }),
    );

    expect(getPublishedPosts("en").map(({ data }) => data.id)).toEqual([
      "a-article",
      "z-article",
    ]);
  });

  it("returns an empty array when no articles exist", () => {
    expect(getPublishedPosts()).toEqual([]);
  });

  it("returns an empty array when the locale has no articles", () => {
    addArticle("article.json", createArticle(), "en");

    expect(getPublishedPosts("sr-Cyrl")).toEqual([]);
  });
});

describe("Content registry published post lookup", () => {
  it("returns a published article by locale and slug", () => {
    addArticle("article.json", createArticle());

    expect(getPublishedPostBySlug("en", "test-article")).toMatchObject({
      kind: "article",
      locale: "en",
      data: {
        status: "published",
        slug: "test-article",
      },
    });
  });

  it("does not return draft articles", () => {
    addArticle(
      "draft.json",
      createArticle({
        status: "draft",
      }),
    );

    expect(getPublishedPostBySlug("en", "test-article")).toBeUndefined();
  });

  it("returns undefined for an unknown slug", () => {
    addArticle("article.json", createArticle());

    expect(getPublishedPostBySlug("en", "unknown")).toBeUndefined();
  });

  it("does not return articles from another locale", () => {
    addArticle("article.json", createArticle(), "en");

    expect(getPublishedPostBySlug("sr-Cyrl", "test-article")).toBeUndefined();
  });

  it("does not return standard pages", () => {
    addPage("page.json", createPage());

    expect(getPublishedPostBySlug("en", "test-page")).toBeUndefined();
  });
});

describe("Content registry featured posts", () => {
  it("prioritizes an explicitly featured published article", () => {
    addArticle(
      "featured.json",
      createArticle({
        id: "featured-article",
        slug: "featured-article",
        featured: true,
        publishedAt: "2026-01-01T11:00:00+01:00",
      }),
    );

    addArticle(
      "latest.json",
      createArticle({
        id: "latest-article",
        slug: "latest-article",
        publishedAt: "2026-01-02T11:00:00+01:00",
      }),
    );

    expect(getFeaturedPost("en")?.data.id).toBe("featured-article");
  });

  it("falls back to the latest published article", () => {
    addArticle(
      "older.json",
      createArticle({
        id: "older-article",
        slug: "older-article",
        publishedAt: "2026-01-01T11:00:00+01:00",
      }),
    );

    addArticle(
      "latest.json",
      createArticle({
        id: "latest-article",
        slug: "latest-article",
        publishedAt: "2026-01-02T11:00:00+01:00",
      }),
    );

    expect(getFeaturedPost("en")?.data.id).toBe("latest-article");
  });

  it("selects the latest article when multiple articles are featured", () => {
    addArticle(
      "older.json",
      createArticle({
        id: "older-featured",
        slug: "older-featured",
        featured: true,
        publishedAt: "2026-01-01T11:00:00+01:00",
      }),
    );

    addArticle(
      "latest.json",
      createArticle({
        id: "latest-featured",
        slug: "latest-featured",
        featured: true,
        publishedAt: "2026-01-02T11:00:00+01:00",
      }),
    );

    expect(getFeaturedPost("en")?.data.id).toBe("latest-featured");
  });

  it("ignores featured draft articles", () => {
    addArticle(
      "draft.json",
      createArticle({
        id: "draft-featured",
        slug: "draft-featured",
        featured: true,
        status: "draft",
      }),
    );

    addArticle("published.json", createArticle());

    expect(getFeaturedPost("en")?.data.id).toBe("test-article");
  });

  it("does not return featured articles from another locale", () => {
    addArticle(
      "featured.json",
      createArticle({
        featured: true,
      }),
      "sr-Cyrl",
    );

    expect(getFeaturedPost("en")).toBeUndefined();
  });

  it("returns undefined when no published articles exist", () => {
    expect(getFeaturedPost("en")).toBeUndefined();
  });
});

describe("Content registry related posts", () => {
  beforeEach(() => {
    addArticle(
      "current.json",
      createArticle({
        id: "current-article",
        slug: "current-article",
        category: "nature",
      }),
    );
  });

  it("excludes the currently viewed article", () => {
    addArticle(
      "related.json",
      createArticle({
        id: "related-article",
        slug: "related-article",
      }),
    );

    const result = getRelatedPosts("en", "current-article");

    expect(result).toHaveLength(1);

    expect(result[0]?.data.id).toBe("related-article");
  });

  it("prioritizes articles from the same category over newer unrelated articles", () => {
    addArticle(
      "same-category.json",
      createArticle({
        id: "same-category",
        slug: "same-category",
        category: "nature",
        publishedAt: "2026-01-01T11:00:00+01:00",
      }),
    );

    addArticle(
      "different-category.json",
      createArticle({
        id: "different-category",
        slug: "different-category",
        category: "health",
        publishedAt: "2026-01-02T11:00:00+01:00",
      }),
    );

    expect(
      getRelatedPosts("en", "current-article").map(({ data }) => data.id),
    ).toEqual(["same-category", "different-category"]);
  });

  it("preserves publication-date order within the same category", () => {
    addArticle(
      "older.json",
      createArticle({
        id: "older-related",
        slug: "older-related",
        publishedAt: "2026-01-01T11:00:00+01:00",
      }),
    );

    addArticle(
      "newer.json",
      createArticle({
        id: "newer-related",
        slug: "newer-related",
        publishedAt: "2026-01-02T11:00:00+01:00",
      }),
    );

    expect(
      getRelatedPosts("en", "current-article").map(({ data }) => data.id),
    ).toEqual(["newer-related", "older-related"]);
  });

  it("excludes draft articles", () => {
    addArticle(
      "draft.json",
      createArticle({
        id: "draft-related",
        slug: "draft-related",
        status: "draft",
      }),
    );

    expect(getRelatedPosts("en", "current-article")).toEqual([]);
  });

  it("excludes articles from other locales", () => {
    addArticle(
      "foreign.json",
      createArticle({
        id: "foreign-article",
        slug: "foreign-article",
      }),
      "sr-Latn",
    );

    expect(getRelatedPosts("en", "current-article")).toEqual([]);
  });

  it("returns an empty array for an unknown current article", () => {
    expect(getRelatedPosts("en", "unknown")).toEqual([]);
  });

  it("returns an empty array when no related articles exist", () => {
    expect(getRelatedPosts("en", "current-article")).toEqual([]);
  });

  it("does not return related posts for a draft current article", () => {
    addArticle(
      "draft.json",
      createArticle({
        id: "draft-current",
        slug: "draft-current",
        status: "draft",
      }),
    );

    expect(getRelatedPosts("en", "draft-current")).toEqual([]);
  });

  it("limits related posts to three articles by default", () => {
    for (let index = 1; index <= 5; index++) {
      addArticle(
        `related-${index}.json`,
        createArticle({
          id: `related-${index}`,
          slug: `related-${index}`,
        }),
      );
    }

    expect(getRelatedPosts("en", "current-article")).toHaveLength(3);
  });

  it("respects an explicit related-post limit", () => {
    for (let index = 1; index <= 5; index++) {
      addArticle(
        `related-${index}.json`,
        createArticle({
          id: `related-${index}`,
          slug: `related-${index}`,
        }),
      );
    }

    expect(
      getRelatedPosts("en", "current-article", 2).map(({ data }) => data.id),
    ).toEqual(["related-1", "related-2"]);
  });

  it("returns fewer articles when the collection is smaller than the limit", () => {
    addArticle(
      "related.json",
      createArticle({
        id: "related-article",
        slug: "related-article",
      }),
    );

    expect(getRelatedPosts("en", "current-article", 10)).toHaveLength(1);
  });

  it("falls back to other categories when no matching category exists", () => {
    addArticle(
      "health.json",
      createArticle({
        id: "health-article",
        slug: "health-article",
        category: "health",
      }),
    );

    expect(
      getRelatedPosts("en", "current-article").map(({ data }) => data.id),
    ).toEqual(["health-article"]);
  });
});
