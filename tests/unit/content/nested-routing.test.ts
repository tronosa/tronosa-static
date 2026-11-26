import path from "node:path";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Locale } from "@/i18n/config";
import type { ContentEntry } from "@/lib/content/registry";

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

import { getContentPath } from "@/lib/seo/urls";

import { getLanguageRoutes } from "@/components/navigation/LanguageSwitcher/language-switcher.server";

const root = path.join(process.cwd(), "src", "content");

let files: Map<string, string>;

function createFileSystemError(code: string): Error {
  return Object.assign(new Error(code), { code });
}

function addPage(locale: Locale, id: string, slug: string): void {
  const filename = path.join(root, "pages", locale, `${id}.json`);

  files.set(
    filename,
    JSON.stringify({
      id,
      slug,
      seo: {
        title: "Test page",
        description: "Test page description.",
      },
      content: {
        sections: [],
      },
    }),
  );
}

function requireContent(entry: ContentEntry | undefined): ContentEntry {
  if (!entry) {
    throw new Error("Expected content to exist.");
  }

  return entry;
}

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

describe("Nested page routing", () => {
  it.each([
    "partners",
    "partners/horeca",
    "our-story/preserving-values",
    "partners/services/distribution",
  ])("accepts the valid path %s", (slug) => {
    addPage("en", "test-page", slug);

    expect(getContentRegistry()).toHaveLength(1);

    expect(getContentBySlug("page", "en", slug)).toMatchObject({
      kind: "page",
      locale: "en",
      data: {
        id: "test-page",
        slug,
      },
    });
  });

  it.each([
    "",
    "/",
    "/partners/horeca",
    "partners/horeca/",
    "partners//horeca",
    "partners/../horeca",
    "partners/./horeca",
    "partners/HORECA",
    "partners/horeca service",
    "partners/horeca_service",
    "partners/horeca--service",
    "partners\\horeca",
    "partners/%2Fhoreca",
    "partners/horeca?draft=true",
    "partners/horeca#contact",
  ])("rejects the invalid path %s", (slug) => {
    addPage("en", "invalid-page", slug);

    expect(() => getContentRegistry()).toThrow(/Invalid slug/);
  });

  it.each([
    "api",
    "api/contact",
    "blog",
    "blog/custom-page",
    "blog/category/custom-page",
    "en",
    "en/partners",
    "sr-latn",
    "sr-latn/partners",
    "sr-cyrl",
    "sr-cyrl/partners",
  ])("rejects the reserved path %s", (slug) => {
    addPage("en", "reserved-page", slug);

    expect(() => getContentRegistry()).toThrow(`Reserved page slug "${slug}"`);
  });

  it("supports parent and child pages", () => {
    addPage("en", "partners", "partners");

    addPage("en", "horeca", "partners/horeca");

    expect(getContentRegistry()).toHaveLength(2);

    expect(getContentBySlug("page", "en", "partners")).toBeDefined();

    expect(getContentBySlug("page", "en", "partners/horeca")).toBeDefined();
  });

  it("rejects duplicate nested public URLs", () => {
    addPage("en", "first-page", "partners/horeca");

    addPage("en", "second-page", "partners/horeca");

    expect(() => getContentRegistry()).toThrow(
      "Duplicate public URL: /en/partners/horeca",
    );
  });

  it("resolves nested pages by their stable content ID", () => {
    addPage("en", "horeca", "partners/horeca");

    expect(getContentById("page", "en", "horeca")).toMatchObject({
      data: {
        id: "horeca",
        slug: "partners/horeca",
      },
    });
  });

  it("includes nested pages in published content", () => {
    addPage("en", "horeca", "partners/horeca");

    expect(getPublishedContent()).toHaveLength(1);
  });

  it("returns undefined for an unknown nested path", () => {
    addPage("en", "partners", "partners");

    expect(getContentBySlug("page", "en", "partners/unknown")).toBeUndefined();
  });
});

describe("Localized nested page routing", () => {
  beforeEach(() => {
    addPage("sr-Cyrl", "horeca", "za-partnere/horeca");

    addPage("sr-Latn", "horeca", "za-partnere/horeca");

    addPage("en", "horeca", "partners/horeca");
  });

  it.each([
    ["sr-Cyrl", "/za-partnere/horeca"],
    ["sr-Latn", "/sr-Latn/za-partnere/horeca"],
    ["en", "/en/partners/horeca"],
  ] as const)(
    "generates the correct public path for %s",
    (locale, expectedPath) => {
      const entry = requireContent(getContentById("page", locale, "horeca"));

      expect(getContentPath(entry)).toBe(expectedPath);
    },
  );

  it("resolves language alternatives using the stable content ID", () => {
    const routes = getLanguageRoutes();

    const expected = {
      "sr-Cyrl": "/za-partnere/horeca",
      "sr-Latn": "/za-partnere/horeca",
      en: "/partners/horeca",
    };

    expect(routes["sr-Cyrl:/za-partnere/horeca"]).toEqual(expected);

    expect(routes["sr-Latn:/za-partnere/horeca"]).toEqual(expected);

    expect(routes["en:/partners/horeca"]).toEqual(expected);
  });

  it("keeps localized nested pages independently addressable", () => {
    expect(getContentRegistry()).toHaveLength(3);

    expect(
      getContentBySlug(
        "sr-Cyrl" === "sr-Cyrl" ? "page" : "article",
        "sr-Cyrl",
        "za-partnere/horeca",
      ),
    ).toMatchObject({
      locale: "sr-Cyrl",
    });

    expect(
      getContentBySlug("page", "sr-Latn", "za-partnere/horeca"),
    ).toMatchObject({
      locale: "sr-Latn",
    });

    expect(getContentBySlug("page", "en", "partners/horeca")).toMatchObject({
      locale: "en",
    });
  });
});
