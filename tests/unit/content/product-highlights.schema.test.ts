import { describe, expect, it } from "vitest";

import {
  productHighlightSchema,
  productHighlightsSchema,
  productTranslationSchema,
} from "@/content/schemas/product.schema";

const highlights = [
  {
    id: "first-highlight",

    title: "First highlight",

    description: "First highlight description",
  },

  {
    id: "second-highlight",

    title: "Second highlight",

    description: "Second highlight description",
  },

  {
    id: "third-highlight",

    title: "Third highlight",

    description: "Third highlight description",
  },
];

const translation = {
  id: "test-product",

  slug: "test-product",

  title: "Test product",

  description: "Test product description",

  imageAlt: "Test product packaging",

  seo: {
    title: "Test SEO title",

    description: "Test SEO description",
  },
};

describe("productHighlightSchema", () => {
  it("accepts a valid highlight", () => {
    expect(productHighlightSchema.parse(highlights[0])).toEqual(highlights[0]);
  });

  it("trims highlight text", () => {
    expect(
      productHighlightSchema.parse({
        id: "  test-highlight  ",

        title: "  Test highlight  ",

        description: "  Test description  ",
      }),
    ).toEqual({
      id: "test-highlight",

      title: "Test highlight",

      description: "Test description",
    });
  });

  it.each(["", " ", "Invalid ID", "invalid/id"])(
    "rejects invalid highlight identifier %j",
    (id) => {
      expect(
        productHighlightSchema.safeParse({
          ...highlights[0],

          id,
        }).success,
      ).toBe(false);
    },
  );

  it("rejects an empty highlight title", () => {
    expect(
      productHighlightSchema.safeParse({
        ...highlights[0],

        title: "",
      }).success,
    ).toBe(false);
  });

  it("rejects an empty highlight description", () => {
    expect(
      productHighlightSchema.safeParse({
        ...highlights[0],

        description: "",
      }).success,
    ).toBe(false);
  });
});

describe("productHighlightsSchema", () => {
  it("accepts exactly three unique highlights", () => {
    expect(productHighlightsSchema.parse(highlights)).toEqual(highlights);
  });

  it("preserves highlight order", () => {
    const reordered = [highlights[2], highlights[0], highlights[1]];

    expect(productHighlightsSchema.parse(reordered)).toEqual(reordered);
  });

  it("rejects an empty highlight collection", () => {
    expect(productHighlightsSchema.safeParse([]).success).toBe(false);
  });

  it("rejects fewer than three highlights", () => {
    expect(
      productHighlightsSchema.safeParse(highlights.slice(0, 2)).success,
    ).toBe(false);
  });

  it("rejects more than three highlights", () => {
    expect(
      productHighlightsSchema.safeParse([
        ...highlights,

        {
          id: "fourth-highlight",

          title: "Fourth highlight",

          description: "Fourth description",
        },
      ]).success,
    ).toBe(false);
  });

  it("rejects duplicate highlight identifiers", () => {
    const result = productHighlightsSchema.safeParse([
      highlights[0],

      highlights[0],

      highlights[2],
    ]);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: "Product highlight IDs must be unique.",
          }),
        ]),
      );
    }
  });
});

describe("product translation highlights", () => {
  it("accepts a translation without highlights", () => {
    const result = productTranslationSchema.parse(translation);

    expect(result.highlights).toBeUndefined();
  });

  it("accepts configured highlights", () => {
    const result = productTranslationSchema.parse({
      ...translation,

      highlights,
    });

    expect(result.highlights).toEqual(highlights);
  });

  it("rejects invalid configured highlights", () => {
    expect(
      productTranslationSchema.safeParse({
        ...translation,

        highlights: [],
      }).success,
    ).toBe(false);
  });
});
