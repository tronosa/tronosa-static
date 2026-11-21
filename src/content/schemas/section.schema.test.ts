import { describe, expect, it } from "vitest";

import {
  allSectionSchema,
  standardPageSectionSchema,
  blogSectionSchema,
  articleSectionSchema,
} from "./section.schema";

const blogSections = [
  {
    id: "journal-opening",
    type: "journal-opening",
  },
  {
    id: "featured-chapter",
    type: "featured-chapter",
  },
  {
    id: "story-explorer",
    type: "story-explorer",
  },
  {
    id: "journal-index",
    type: "journal-index",
  },
  {
    id: "source-closing",
    type: "source-closing",
    content: {
      pageId: "about",
    },
  },
];

const articleSections = [
  {
    id: "article-metadata",
    type: "article-metadata",
  },
  {
    id: "share-article",
    type: "share-article",
  },
  {
    id: "related-posts",
    type: "related-posts",
  },
];

describe("section access boundaries", () => {
  describe.each(blogSections)("blog-specific section: $type", (section) => {
    it("allows the section on the blog listing", () => {
      expect(blogSectionSchema.safeParse(section).success).toBe(true);
    });

    it("rejects the section on standard pages", () => {
      expect(standardPageSectionSchema.safeParse(section).success).toBe(false);
    });

    it("rejects the section on article pages", () => {
      expect(articleSectionSchema.safeParse(section).success).toBe(false);
    });

    it("includes the section in the complete catalogue", () => {
      expect(allSectionSchema.safeParse(section).success).toBe(true);
    });
  });

  describe.each(articleSections)(
    "article-specific section: $type",
    (section) => {
      it("allows the section on article pages", () => {
        expect(articleSectionSchema.safeParse(section).success).toBe(true);
      });

      it("rejects the section on standard pages", () => {
        expect(standardPageSectionSchema.safeParse(section).success).toBe(
          false,
        );
      });

      it("rejects the section on the blog listing", () => {
        expect(blogSectionSchema.safeParse(section).success).toBe(false);
      });

      it("includes the section in the complete catalogue", () => {
        expect(allSectionSchema.safeParse(section).success).toBe(true);
      });
    },
  );

  it("rejects unknown section types", () => {
    expect(
      allSectionSchema.safeParse({
        id: "unknown",
        type: "unknown-section",
      }).success,
    ).toBe(false);
  });

  it("rejects unexpected properties in system sections", () => {
    expect(
      blogSectionSchema.safeParse({
        id: "featured-chapter",
        type: "featured-chapter",
        content: {
          title: "Unexpected title",
        },
      }).success,
    ).toBe(false);
  });

  it("rejects invalid system section IDs", () => {
    expect(
      blogSectionSchema.safeParse({
        id: "Invalid section ID",
        type: "journal-opening",
      }).success,
    ).toBe(false);
  });

  it("requires a page ID for source closing", () => {
    expect(
      blogSectionSchema.safeParse({
        id: "source-closing",
        type: "source-closing",
      }).success,
    ).toBe(false);
  });
});

describe("related posts section configuration", () => {
  it("defaults to three related articles", () => {
    const result = articleSectionSchema.parse({
      id: "related-posts",
      type: "related-posts",
    });

    expect(result).toEqual({
      id: "related-posts",
      type: "related-posts",
      content: {
        limit: 3,
      },
    });
  });

  it("defaults an empty configuration to three articles", () => {
    const result = articleSectionSchema.parse({
      id: "related-posts",
      type: "related-posts",
      content: {},
    });

    expect(result).toMatchObject({
      content: {
        limit: 3,
      },
    });
  });

  it("supports a custom article limit", () => {
    const result = articleSectionSchema.parse({
      id: "related-posts",
      type: "related-posts",
      content: {
        limit: 5,
      },
    });

    expect(result).toMatchObject({
      content: {
        limit: 5,
      },
    });
  });

  it.each([-1, 0, 11, 1.5, "3"])("rejects invalid limit: %s", (limit) => {
    expect(
      articleSectionSchema.safeParse({
        id: "related-posts",
        type: "related-posts",
        content: {
          limit,
        },
      }).success,
    ).toBe(false);
  });
});
