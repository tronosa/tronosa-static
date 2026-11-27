import { describe, expect, it } from "vitest";

import type { LocalizedProduct } from "@/content/schemas/product.schema";

import {
  resolveExperienceProducts,
  resolveInlineExperienceProducts,
} from "./resolve-experience-products";

const baseProduct = {
  category: "still",

  waterType: "still",

  status: "published",

  volumeMl: 750,

  featured: false,

  sortOrder: 0,

  image: {
    src: "/test/product.webp",
    alt: "Test product",
    width: 600,
    height: 1200,
  },

  appearance: {
    backgroundColor: "#DCEBF0",
    accentColor: "#214C60",
  },

  title: "Test product",

  description: "Test product description",

  seo: {
    title: "Test product",
    description: "Test description",
  },
} satisfies Omit<LocalizedProduct, "id" | "slug">;

const products: LocalizedProduct[] = [
  {
    ...baseProduct,

    id: "product-a",
    slug: "product-a",
  },

  {
    ...baseProduct,

    id: "product-b",
    slug: "product-b",
    category: "sparkling",
    waterType: "sparkling",
  },

  {
    ...baseProduct,

    id: "product-c",
    slug: "product-c",
    status: "draft",
  },
];

describe("resolveExperienceProducts", () => {
  it("resolves only selected products", () => {
    const result = resolveExperienceProducts(
      ["product-a"],
      products,
      "en",
      false,
    );

    expect(result).toEqual([products[0]]);
  });

  it("preserves the configured product order", () => {
    const result = resolveExperienceProducts(
      ["product-b", "product-a"],
      products,
      "en",
      false,
    );

    expect(result.map(({ id }) => id)).toEqual(["product-b", "product-a"]);
  });

  it("rejects duplicate product identifiers", () => {
    expect(() =>
      resolveExperienceProducts(
        ["product-a", "product-a"],
        products,
        "en",
        false,
      ),
    ).toThrow("Product IDs must be unique");
  });

  it("rejects unknown products", () => {
    expect(() =>
      resolveExperienceProducts(["unknown-product"], products, "en", false),
    ).toThrow('Unknown product "unknown-product"');
  });

  it("allows drafts in preview environments", () => {
    const result = resolveExperienceProducts(
      ["product-c"],
      products,
      "en",
      true,
    );

    expect(result).toEqual([products[2]]);
  });

  it("rejects drafts in production", () => {
    expect(() =>
      resolveExperienceProducts(["product-c"], products, "en", false),
    ).toThrow('Product "product-c" is not published');
  });
});

describe("resolveInlineExperienceProducts", () => {
  it("rejects missing products", () => {
    expect(() => resolveInlineExperienceProducts(undefined)).toThrow(
      "No products configured",
    );
  });

  it("rejects an empty product collection", () => {
    expect(() => resolveInlineExperienceProducts([])).toThrow(
      "No products configured",
    );
  });

  it("preserves existing inline product configurations", () => {
    const inlineProducts = [
      {
        id: "inline-product",

        title: "Inline product",

        volume: "750 ml",

        image: {
          src: "/test/product.webp",
          alt: "Test product",
          width: 600,
          height: 1200,
        },

        highlights: [
          {
            id: "test-highlight",
            title: "Highlight",
            description: "Description",
          },
        ],
      },
    ];

    expect(resolveInlineExperienceProducts(inlineProducts)).toBe(
      inlineProducts,
    );
  });
});
