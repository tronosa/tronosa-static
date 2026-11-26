import { beforeEach, describe, expect, it, vi } from "vitest";

import { standardPageSchema } from "@/content/schemas/page.schema";

import type { Locale } from "@/i18n/config";

import type { ContentEntry, PageEntry } from "@/lib/content/registry";

const { getPublishedContentMock } = vi.hoisted(() => ({
  getPublishedContentMock: vi.fn<() => ContentEntry[]>(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/content/registry", () => ({
  getPublishedContent: getPublishedContentMock,
}));

vi.mock("@/components/navigation/navigation.config", () => ({
  navigationItems: [
    {
      id: "home",
      translationKey: "home",
    },
    {
      id: "test-parent",
      translationKey: "parent",
    },
  ],
}));

import { getNavigationItems } from "@/components/navigation/navigation.server";

function createPage(locale: Locale, id: string, slug: string): PageEntry {
  return {
    kind: "page",
    locale,
    data: standardPageSchema.parse({
      id,
      slug,
      status: "published",
      seo: {
        title: "Test page",
        description: "Test description.",
      },
      content: {
        sections: [],
      },
    }),
  };
}

describe("getNavigationItems", () => {
  beforeEach(() => {
    getPublishedContentMock.mockReset();
    getPublishedContentMock.mockReturnValue([]);
  });

  it("returns no navigation items when content is unavailable", () => {
    expect(getNavigationItems("en")).toEqual([]);
  });

  it("preserves the explicitly configured navigation order", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("en", "test-parent", "parent"),
      createPage("en", "home", ""),
    ]);

    expect(getNavigationItems("en").map(({ id }) => id)).toEqual([
      "home",
      "test-parent",
    ]);
  });

  it("does not add nested pages as independent navigation items", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("en", "test-parent", "parent"),
      createPage("en", "test-child", "parent/child"),
    ]);

    expect(getNavigationItems("en")).toEqual([
      {
        id: "test-parent",
        translationKey: "parent",
        href: "/parent",
        relatedPaths: ["/parent/child"],
      },
    ]);
  });

  it("includes descendants at multiple nesting levels", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("en", "test-parent", "parent"),
      createPage("en", "test-child", "parent/child"),
      createPage("en", "test-nested", "parent/child/nested"),
    ]);

    expect(getNavigationItems("en")[0]?.relatedPaths).toEqual([
      "/parent/child",
      "/parent/child/nested",
    ]);
  });

  it("does not match unrelated paths with a similar prefix", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("en", "test-parent", "parent"),
      createPage("en", "another-page", "parent-extra/child"),
    ]);

    expect(getNavigationItems("en")[0]?.relatedPaths).toEqual([]);
  });

  it("does not associate all website paths with the homepage", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("en", "home", ""),
      createPage("en", "test-parent", "parent"),
      createPage("en", "test-child", "parent/child"),
    ]);

    expect(getNavigationItems("en")[0]).toEqual({
      id: "home",
      translationKey: "home",
      href: "/",
      relatedPaths: [],
    });
  });

  it("includes only content belonging to the requested locale", () => {
    getPublishedContentMock.mockReturnValue([
      createPage("en", "test-parent", "parent"),
      createPage("en", "test-child", "parent/child"),
      createPage("sr-Latn", "test-parent", "drugi-roditelj"),
      createPage("sr-Latn", "test-child", "drugi-roditelj/dete"),
    ]);

    expect(getNavigationItems("en")).toEqual([
      {
        id: "test-parent",
        translationKey: "parent",
        href: "/parent",
        relatedPaths: ["/parent/child"],
      },
    ]);
  });

  it("omits configured items without corresponding published content", () => {
    getPublishedContentMock.mockReturnValue([createPage("en", "home", "")]);

    expect(getNavigationItems("en")).toEqual([
      {
        id: "home",
        translationKey: "home",
        href: "/",
        relatedPaths: [],
      },
    ]);
  });
});
