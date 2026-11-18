import path from "node:path";

import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import type { Page } from "@/content/schemas/page.schema";

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
} from "@/lib/content/registry";

const root = path.join(process.cwd(), "src", "content");

const pagesDirectory = path.join(root, "pages", "en");

let pageFixture: Page;

let files: Map<string, string>;

function createPage(overrides: Partial<Page> = {}): Page {
  return {
    ...structuredClone(pageFixture),
    id: "test-page",
    slug: "test-page",
    ...overrides,
  };
}

function addPage(filename: string, page: Page): void {
  files.set(path.join(pagesDirectory, filename), JSON.stringify(page));
}

function createFileSystemError(code: string): Error {
  return Object.assign(new Error(code), { code });
}

beforeAll(async () => {
  const actualFs = await vi.importActual<typeof import("node:fs")>("node:fs");

  const filenames = actualFs
    .readdirSync(pagesDirectory)
    .filter((filename) => filename.endsWith(".json"));

  const pages = filenames.map(
    (filename) =>
      JSON.parse(
        actualFs.readFileSync(path.join(pagesDirectory, filename), "utf8"),
      ) as Page,
  );

  const fixture = pages.find((page) => page.content.sections.length > 0);

  if (!fixture) {
    throw new Error("Missing valid page fixture");
  }

  pageFixture = fixture;
});

beforeEach(() => {
  files = new Map<string, string>();

  vi.resetAllMocks();

  readdirMock.mockImplementation((directory) => {
    if (directory !== pagesDirectory) {
      throw createFileSystemError("ENOENT");
    }

    return [...files.keys()]
      .filter((filename) => path.dirname(filename) === directory)
      .map((filename) => path.basename(filename));
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
    files.set(path.join(pagesDirectory, "invalid.json"), JSON.stringify({}));

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
    addPage(
      "blog.json",
      createPage({
        id: "blog",
        slug: "articles",
      }),
    );

    expect(() => getContentRegistry()).toThrow(
      'Blog listing must use slug "blog"',
    );
  });

  it("accepts a blog listing with the correct slug", () => {
    addPage(
      "blog.json",
      createPage({
        id: "blog",
        slug: "blog",
      }),
    );

    expect(getContentRegistry()).toHaveLength(1);
  });

  it("rejects duplicate section IDs", () => {
    const page = createPage();
    const section = page.content.sections[0];

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
