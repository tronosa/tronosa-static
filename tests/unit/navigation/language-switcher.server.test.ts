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

import { pageSchema } from "@/content/schemas/page.schema";
import { articleSchema } from "@/content/schemas/article.schema";

import { getLanguageRoutes } from "@/components/navigation/LanguageSwitcher/language-switcher.server";

const DATE = "2026-11-26T10:00:00+01:00";

function createPage(locale: Locale, id: string, slug: string): PageEntry {
  return {
    kind: "page",
    locale,
    data: pageSchema.parse({
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
        name: "Tronosa",
      },
      preview: {
        title: "Test article",
        description: "Test article description.",
      },
      seo: {
        title: "Test article",
        description: "Test article SEO description.",
      },
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
      createPage("sr-Cyrl", "products", "proizvodi"),
      createPage("sr-Latn", "products", "proizvodi"),
      createPage("en", "products", "products"),
    ]);

    const expected = {
      "sr-Cyrl": "/proizvodi",
      "sr-Latn": "/proizvodi",
      en: "/products",
    };

    expect(getLanguageRoutes()).toEqual({
      "sr-Cyrl:/proizvodi": expected,
      "sr-Latn:/proizvodi": expected,
      "en:/products": expected,
    });
  });

  it("generates alternatives for localized nested pages", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("sr-Cyrl", "corporate-water", "za-partnere/voda-za-kompanije"),
      createPage("sr-Latn", "corporate-water", "za-partnere/voda-za-kompanije"),
      createPage("en", "corporate-water", "partners/corporate-water"),
    ]);

    const expected = {
      "sr-Cyrl": "/za-partnere/voda-za-kompanije",
      "sr-Latn": "/za-partnere/voda-za-kompanije",
      en: "/partners/corporate-water",
    };

    expect(getLanguageRoutes()).toEqual({
      "sr-Cyrl:/za-partnere/voda-za-kompanije": expected,
      "sr-Latn:/za-partnere/voda-za-kompanije": expected,
      "en:/partners/corporate-water": expected,
    });
  });

  it("generates language alternatives for the blog listing", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("sr-Cyrl", "blog", "blog"),
      createPage("sr-Latn", "blog", "blog"),
      createPage("en", "blog", "blog"),
    ]);

    const expected = {
      "sr-Cyrl": "/blog",
      "sr-Latn": "/blog",
      en: "/blog",
    };

    expect(getLanguageRoutes()).toEqual({
      "sr-Cyrl:/blog": expected,
      "sr-Latn:/blog": expected,
      "en:/blog": expected,
    });
  });

  it("generates localized article routes with the blog prefix", () => {
    getPublishedContentMock.mockReturnValue([
      createArticle("sr-Cyrl", "natural-origin", "prirodno-poreklo"),
      createArticle("sr-Latn", "natural-origin", "prirodno-poreklo"),
      createArticle("en", "natural-origin", "natural-origin"),
    ]);

    const expected = {
      "sr-Cyrl": "/blog/prirodno-poreklo",
      "sr-Latn": "/blog/prirodno-poreklo",
      en: "/blog/natural-origin",
    };

    expect(getLanguageRoutes()).toEqual({
      "sr-Cyrl:/blog/prirodno-poreklo": expected,
      "sr-Latn:/blog/prirodno-poreklo": expected,
      "en:/blog/natural-origin": expected,
    });
  });

  it("does not associate pages with different content IDs", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("sr-Cyrl", "products", "proizvodi"),
      createPage("en", "contact", "contact"),
    ]);

    expect(getLanguageRoutes()).toEqual({
      "sr-Cyrl:/proizvodi": {
        "sr-Cyrl": "/proizvodi",
      },
      "en:/contact": {
        en: "/contact",
      },
    });
  });

  it("does not associate articles with different content IDs", () => {
    getPublishedContentMock.mockReturnValue([
      createArticle("sr-Cyrl", "natural-origin", "prirodno-poreklo"),
      createArticle("en", "seasonal-water", "water-through-the-seasons"),
    ]);

    expect(getLanguageRoutes()).toEqual({
      "sr-Cyrl:/blog/prirodno-poreklo": {
        "sr-Cyrl": "/blog/prirodno-poreklo",
      },
      "en:/blog/water-through-the-seasons": {
        en: "/blog/water-through-the-seasons",
      },
    });
  });

  it("does not associate pages and articles with the same content ID", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("sr-Cyrl", "our-water", "nasa-voda"),
      createArticle("en", "our-water", "our-water"),
    ]);

    expect(getLanguageRoutes()).toEqual({
      "sr-Cyrl:/nasa-voda": {
        "sr-Cyrl": "/nasa-voda",
      },
      "en:/blog/our-water": {
        en: "/blog/our-water",
      },
    });
  });

  it("includes only the available language alternatives", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("sr-Cyrl", "horeca", "za-partnere/horeca"),
      createPage("en", "horeca", "partners/horeca"),
    ]);

    const expected = {
      "sr-Cyrl": "/za-partnere/horeca",
      en: "/partners/horeca",
    };

    const routes = getLanguageRoutes();

    expect(routes).toEqual({
      "sr-Cyrl:/za-partnere/horeca": expected,
      "en:/partners/horeca": expected,
    });

    expect(routes["en:/partners/horeca"]).not.toHaveProperty("sr-Latn");
  });

  it("keeps parent and nested child routes independent", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("sr-Cyrl", "partners", "za-partnere"),
      createPage("en", "partners", "partners"),
      createPage("sr-Cyrl", "horeca", "za-partnere/horeca"),
      createPage("en", "horeca", "partners/horeca"),
    ]);

    const parentAlternatives = {
      "sr-Cyrl": "/za-partnere",
      en: "/partners",
    };

    const childAlternatives = {
      "sr-Cyrl": "/za-partnere/horeca",
      en: "/partners/horeca",
    };

    expect(getLanguageRoutes()).toEqual({
      "sr-Cyrl:/za-partnere": parentAlternatives,
      "en:/partners": parentAlternatives,
      "sr-Cyrl:/za-partnere/horeca": childAlternatives,
      "en:/partners/horeca": childAlternatives,
    });
  });
});
