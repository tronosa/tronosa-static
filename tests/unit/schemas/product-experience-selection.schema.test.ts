import { describe, expect, it } from "vitest";

import {
  productExperienceContentSchema,
  productExperienceSectionSchema,
} from "@/components/sections/ProductExperience/product-experience.schema";

const product = {
  id: "test-product",

  title: "Test product",

  volume: "500 ml",

  description: "Test product description",

  highlights: [
    {
      id: "test-highlight",

      title: "Test highlight",

      description: "Test highlight description",
    },
  ],

  image: {
    src: "/test/product.webp",

    alt: "Test product packaging",

    width: 600,

    height: 1200,
  },
};

const baseContent = {
  appearance: {
    backgroundColor: "#DCEBF0",

    secondaryBackgroundColor: "#A8CDD4",

    accentColor: "#214C60",
  },

  reveal: {
    eyebrow: "Test eyebrow",

    title: "Test reveal",

    backgroundText: "TEST",

    description: "Test reveal description",

    scrollLabel: "Test scroll label",
  },

  composition: {
    eyebrow: "Test composition eyebrow",

    title: "Test composition",

    description: "Test composition description",

    minerals: [],
  },

  collection: {
    eyebrow: "Test collection eyebrow",

    title: "Test collection",

    description: "Test collection description",
  },
};

describe("ProductExperience product selection", () => {
  describe("registry product selection", () => {
    it("accepts one product reference", () => {
      const result = productExperienceContentSchema.parse({
        ...baseContent,

        productIds: ["test-product"],
      });

      expect(result.productIds).toEqual(["test-product"]);

      expect(result.products).toBeUndefined();
    });

    it("accepts multiple unique product references", () => {
      const productIds = ["test-product-a", "test-product-b", "test-product-c"];

      const result = productExperienceContentSchema.parse({
        ...baseContent,

        productIds,
      });

      expect(result.productIds).toEqual(productIds);
    });

    it("preserves the configured product order", () => {
      const productIds = ["test-product-c", "test-product-a", "test-product-b"];

      const result = productExperienceContentSchema.parse({
        ...baseContent,

        productIds,
      });

      expect(result.productIds).toEqual(productIds);
    });

    it("rejects duplicate product references", () => {
      const result = productExperienceContentSchema.safeParse({
        ...baseContent,

        productIds: ["test-product", "test-product"],
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ["productIds"],

              message: "Product IDs must be unique.",
            }),
          ]),
        );
      }
    });

    it("rejects an empty product reference list", () => {
      expect(
        productExperienceContentSchema.safeParse({
          ...baseContent,

          productIds: [],
        }).success,
      ).toBe(false);
    });

    it.each([
      "",

      " ",

      "Invalid Product",

      "invalid/product",

      "invalid_product",

      "INVALID-PRODUCT",
    ])("rejects invalid product reference %j", (productId) => {
      expect(
        productExperienceContentSchema.safeParse({
          ...baseContent,

          productIds: [productId],
        }).success,
      ).toBe(false);
    });

    it("trims product references", () => {
      const result = productExperienceContentSchema.parse({
        ...baseContent,

        productIds: ["  test-product  "],
      });

      expect(result.productIds).toEqual(["test-product"]);
    });
  });

  describe("inline product selection", () => {
    it("accepts existing inline products", () => {
      const result = productExperienceContentSchema.parse({
        ...baseContent,

        products: [product],
      });

      expect(result.products).toEqual([product]);

      expect(result.productIds).toBeUndefined();
    });

    it("accepts multiple unique inline products", () => {
      const products = [
        product,

        {
          ...product,

          id: "second-product",
        },
      ];

      const result = productExperienceContentSchema.parse({
        ...baseContent,

        products,
      });

      expect(result.products).toEqual(products);
    });

    it("rejects duplicate inline product identifiers", () => {
      const result = productExperienceContentSchema.safeParse({
        ...baseContent,

        products: [product, product],
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ["products"],

              message: "Product IDs must be unique.",
            }),
          ]),
        );
      }
    });

    it("rejects an empty inline product list", () => {
      expect(
        productExperienceContentSchema.safeParse({
          ...baseContent,

          products: [],
        }).success,
      ).toBe(false);
    });
  });

  describe("product source exclusivity", () => {
    it("rejects configurations without a product source", () => {
      const result = productExperienceContentSchema.safeParse(baseContent);

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ["productIds"],

              message: "Provide either productIds or products, but not both.",
            }),
          ]),
        );
      }
    });

    it("rejects configurations containing both product sources", () => {
      const result = productExperienceContentSchema.safeParse({
        ...baseContent,

        productIds: ["test-product"],

        products: [product],
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ["productIds"],

              message: "Provide either productIds or products, but not both.",
            }),
          ]),
        );
      }
    });
  });

  describe("section configuration", () => {
    it("accepts a section using registry references", () => {
      const section = {
        id: "test-experience",

        type: "product-experience",

        content: {
          ...baseContent,

          productIds: ["test-product-a", "test-product-b"],
        },
      };

      expect(productExperienceSectionSchema.parse(section)).toEqual(section);
    });

    it("accepts a section using inline products", () => {
      const section = {
        id: "test-experience",

        type: "product-experience",

        content: {
          ...baseContent,

          products: [product],
        },
      };

      expect(productExperienceSectionSchema.parse(section)).toEqual(section);
    });
  });
});
