import { describe, expect, it } from "vitest";

import {
  productShowcaseCategorySchema,
  productShowcaseContentSchema,
  productShowcaseSectionSchema,
} from "@/components/sections/ProductShowcase/product-showcase.schema";

function createProduct(id: string) {
  return {
    id,
    title: `Product ${id}`,
    description: "Natural spring water.",
    volume: "500 ml",
    image: {
      src: "/images/product.webp",
      alt: "Water bottle",
      width: 600,
      height: 1200,
    },
    appearance: {
      backgroundColor: "#173f35",
      accentColor: "#ac815a",
    },
  };
}

function createCategory(id: string, productIds: string[]) {
  return {
    id,
    label: `Category ${id}`,
    products: productIds.map(createProduct),
  };
}

function createContent(categories: ReturnType<typeof createCategory>[]) {
  return {
    eyebrow: "Our products",
    title: "Natural spring water",
    description: "Discover our products.",
    backgroundText: "Water",
    accessibility: {
      categorySelectorLabel: "Select category",
      selectorLabel: "Select product",
    },
    categories,
  };
}

describe("ProductShowcase schema", () => {
  describe("productShowcaseCategorySchema", () => {
    it("accepts products with unique identifiers", () => {
      const input = createCategory("still", ["still-500", "still-1500"]);

      const result = productShowcaseCategorySchema.safeParse(input);

      expect(result.success).toBe(true);
    });

    it("rejects duplicate product identifiers within a category", () => {
      const input = createCategory("still", ["still-500", "still-500"]);

      const result = productShowcaseCategorySchema.safeParse(input);

      expect(result.success).toBe(false);

      if (result.success) {
        throw new Error("Expected duplicate product ID to be rejected");
      }

      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          code: "custom",
          path: ["products", 1, "id"],
          message: "Duplicate product ID: still-500",
        }),
      );
    });
  });

  describe("productShowcaseContentSchema", () => {
    it("accepts globally unique category and product identifiers", () => {
      const input = createContent([
        createCategory("still", ["still-500", "still-1500"]),
        createCategory("sparkling", ["sparkling-500", "sparkling-1500"]),
      ]);

      const result = productShowcaseContentSchema.safeParse(input);

      expect(result.success).toBe(true);
    });

    it("rejects duplicate category identifiers", () => {
      const input = createContent([
        createCategory("still", ["still-500"]),
        createCategory("still", ["still-1500"]),
      ]);

      const result = productShowcaseContentSchema.safeParse(input);

      expect(result.success).toBe(false);

      if (result.success) {
        throw new Error("Expected duplicate category ID to be rejected");
      }

      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          code: "custom",
          path: ["categories", 1, "id"],
          message: "Duplicate category ID: still",
        }),
      );
    });

    it("rejects duplicate product identifiers across categories", () => {
      const input = createContent([
        createCategory("still", ["shared-product"]),
        createCategory("sparkling", ["shared-product"]),
      ]);

      const result = productShowcaseContentSchema.safeParse(input);

      expect(result.success).toBe(false);

      if (result.success) {
        throw new Error("Expected global product ID to be rejected");
      }

      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          code: "custom",
          path: ["categories", 1, "products", 0, "id"],
          message: "Duplicate global product ID: shared-product",
        }),
      );
    });

    it("reports duplicate category and global product identifiers together", () => {
      const input = createContent([
        createCategory("still", ["shared-product"]),
        createCategory("still", ["shared-product"]),
      ]);

      const result = productShowcaseContentSchema.safeParse(input);

      expect(result.success).toBe(false);

      if (result.success) {
        throw new Error("Expected duplicate identifiers to be rejected");
      }

      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: "custom",
            path: ["categories", 1, "id"],
            message: "Duplicate category ID: still",
          }),
          expect.objectContaining({
            code: "custom",
            path: ["categories", 1, "products", 0, "id"],
            message: "Duplicate global product ID: shared-product",
          }),
        ]),
      );
    });

    it("accepts identical product titles when identifiers are unique", () => {
      const input = createContent([
        {
          id: "still",
          label: "Still water",
          products: [
            {
              ...createProduct("still-500"),
              title: "Natural water",
            },
            {
              ...createProduct("still-1500"),
              title: "Natural water",
            },
          ],
        },
      ]);

      const result = productShowcaseContentSchema.safeParse(input);

      expect(result.success).toBe(true);
    });
  });

  describe("productShowcaseSectionSchema", () => {
    it("propagates duplicate identifier errors through the section schema", () => {
      const input = {
        id: "products-showcase",
        type: "product-showcase",
        content: createContent([
          createCategory("still", ["shared-product"]),
          createCategory("sparkling", ["shared-product"]),
        ]),
      };

      const result = productShowcaseSectionSchema.safeParse(input);

      expect(result.success).toBe(false);

      if (result.success) {
        throw new Error("Expected invalid section to be rejected");
      }

      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          code: "custom",
          path: ["content", "categories", 1, "products", 0, "id"],
          message: "Duplicate global product ID: shared-product",
        }),
      );
    });
  });
});
