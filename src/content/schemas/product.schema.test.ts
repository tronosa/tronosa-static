import { describe, expect, it } from "vitest";

import {
  productSchema,
  productCatalogSchema,
  productTranslationSchema,
  productTranslationsSchema,
} from "./product.schema";

const product = {
  id: "test-product",
  category: "still",
  waterType: "still",
  volumeMl: 500,

  image: {
    src: "/test/product.webp",
    width: 600,
    height: 1200,
  },

  appearance: {
    backgroundColor: "#DCEBF0",
    accentColor: "#246B68",
  },
};

const translation = {
  id: "test-product",
  slug: "test-product",
  title: "Test product",
  description: "Test description",
  imageAlt: "Test product packaging",

  seo: {
    title: "Test product",
    description: "Test description",
  },
};

describe("productSchema", () => {
  it("parses a valid product with defaults", () => {
    const result = productSchema.parse(product);

    expect(result.status).toBe("draft");
    expect(result.featured).toBe(false);
    expect(result.sortOrder).toBe(0);
  });

  it("accepts a published product", () => {
    expect(
      productSchema.safeParse({
        ...product,
        status: "published",
      }).success,
    ).toBe(true);
  });

  it.each([0, -100, 0.5])("rejects invalid volume %s", (volumeMl) => {
    expect(
      productSchema.safeParse({
        ...product,
        volumeMl,
      }).success,
    ).toBe(false);
  });

  it("rejects an unknown product category", () => {
    expect(
      productSchema.safeParse({
        ...product,
        category: "unknown",
      }).success,
    ).toBe(false);
  });

  it("rejects an unknown water type", () => {
    expect(
      productSchema.safeParse({
        ...product,
        waterType: "unknown",
      }).success,
    ).toBe(false);
  });

  it("rejects invalid image dimensions", () => {
    expect(
      productSchema.safeParse({
        ...product,
        image: {
          ...product.image,
          width: 0,
        },
      }).success,
    ).toBe(false);
  });

  it("rejects invalid colors", () => {
    expect(
      productSchema.safeParse({
        ...product,
        appearance: {
          ...product.appearance,
          backgroundColor: "turquoise",
        },
      }).success,
    ).toBe(false);
  });

  it("rejects invalid identifiers", () => {
    expect(
      productSchema.safeParse({
        ...product,
        id: "Invalid ID",
      }).success,
    ).toBe(false);
  });

  it("rejects unknown properties", () => {
    expect(
      productSchema.safeParse({
        ...product,
        price: 100,
      }).success,
    ).toBe(false);
  });
});

describe("productCatalogSchema", () => {
  it("accepts an empty catalogue", () => {
    expect(productCatalogSchema.parse([])).toEqual([]);
  });

  it("accepts unique identifiers", () => {
    expect(
      productCatalogSchema.safeParse([
        product,
        {
          ...product,
          id: "second-product",
        },
      ]).success,
    ).toBe(true);
  });

  it("rejects duplicate identifiers", () => {
    const result = productCatalogSchema.safeParse([product, product]);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: [1, "id"],
          }),
        ]),
      );
    }
  });
});

describe("productTranslationSchema", () => {
  it("accepts a valid translation", () => {
    expect(productTranslationSchema.safeParse(translation).success).toBe(true);
  });

  it("rejects invalid slugs", () => {
    expect(
      productTranslationSchema.safeParse({
        ...translation,
        slug: "invalid/slug",
      }).success,
    ).toBe(false);
  });

  it("rejects empty image alt text", () => {
    expect(
      productTranslationSchema.safeParse({
        ...translation,
        imageAlt: "",
      }).success,
    ).toBe(false);
  });

  it("accepts complete product information", () => {
    expect(
      productTranslationSchema.safeParse({
        ...translation,
        declaration: "Test declaration",
        storageInstructions: "Test instructions",
        availability: "Test availability",
      }).success,
    ).toBe(true);
  });
});

describe("productTranslationsSchema", () => {
  it("accepts unique translations", () => {
    expect(
      productTranslationsSchema.safeParse([
        translation,
        {
          ...translation,
          id: "second-product",
          slug: "second-product",
        },
      ]).success,
    ).toBe(true);
  });

  it("rejects duplicate translation identifiers", () => {
    expect(
      productTranslationsSchema.safeParse([
        translation,
        {
          ...translation,
          slug: "second-slug",
        },
      ]).success,
    ).toBe(false);
  });

  it("rejects duplicate translation slugs", () => {
    expect(
      productTranslationsSchema.safeParse([
        translation,
        {
          ...translation,
          id: "second-product",
        },
      ]).success,
    ).toBe(false);
  });
});
