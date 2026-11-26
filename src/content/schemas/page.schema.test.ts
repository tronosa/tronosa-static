import { describe, expect, it } from "vitest";

import { standardPageSchema, blogPageSchema, pageSchema } from "./page.schema";

import { sectionSchema } from "./section.schema";

const journalOpening = {
  id: "journal-opening",
  type: "journal-opening",
};

const articleMetadata = {
  id: "article-metadata",
  type: "article-metadata",
};

describe("page section boundaries", () => {
  it("rejects the blog ID for standard pages", () => {
    expect(standardPageSchema.shape.id.safeParse("blog").success).toBe(false);
  });

  it("allows regular page IDs for standard pages", () => {
    expect(standardPageSchema.shape.id.safeParse("test-page").success).toBe(
      true,
    );
  });

  it("requires the blog ID for journal pages", () => {
    expect(blogPageSchema.shape.id.safeParse("test-page").success).toBe(false);

    expect(blogPageSchema.shape.id.safeParse("blog").success).toBe(true);
  });

  it.each(["price-sa-izvora", "stories-from-the-spring"])(
    "accepts the localized journal slug %s",
    (slug) => {
      expect(blogPageSchema.shape.slug.safeParse(slug).success).toBe(true);
    },
  );

  it.each([
    "",
    "blog",
    "stories",
    "stories-from-the-source",
    "unknown-page",
    "price-sa-izvora/article",
    "stories-from-the-spring/article",
  ])("rejects the invalid journal slug %s", (slug) => {
    expect(blogPageSchema.shape.slug.safeParse(slug).success).toBe(false);
  });

  it("rejects blog sections on standard pages", () => {
    expect(
      standardPageSchema.shape.content.safeParse({
        sections: [journalOpening],
      }).success,
    ).toBe(false);
  });

  it("allows blog sections on journal pages", () => {
    expect(
      blogPageSchema.shape.content.safeParse({
        sections: [journalOpening],
      }).success,
    ).toBe(true);
  });

  it("rejects article sections on journal pages", () => {
    expect(
      blogPageSchema.shape.content.safeParse({
        sections: [articleMetadata],
      }).success,
    ).toBe(false);
  });

  it("rejects article sections on standard pages", () => {
    expect(
      standardPageSchema.shape.content.safeParse({
        sections: [articleMetadata],
      }).success,
    ).toBe(false);
  });

  it("rejects unknown page structures", () => {
    expect(
      pageSchema.safeParse({
        id: "blog",
      }).success,
    ).toBe(false);
  });

  it("recognizes article sections in the renderer catalogue", () => {
    expect(sectionSchema.safeParse(articleMetadata).success).toBe(true);
  });
});
