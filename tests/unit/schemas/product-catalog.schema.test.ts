import { describe, expect, it } from "vitest";

import {
  productCatalogContentSchema,
  productCatalogSectionSchema,
} from "@/components/sections/ProductCatalog/product-catalog.schema";

describe("productCatalogContentSchema", () => {
  it("accepts the minimal configuration", () => {
    expect(
      productCatalogContentSchema.parse({
        title: "Test catalogue",
      }),
    ).toEqual({
      title: "Test catalogue",
    });
  });

  it("accepts optional editorial content", () => {
    const content = {
      eyebrow: "Test eyebrow",
      title: "Test catalogue",
      description: "Test description",
    };

    expect(productCatalogContentSchema.parse(content)).toEqual(content);
  });

  it("trims editorial content", () => {
    expect(
      productCatalogContentSchema.parse({
        title: "  Test catalogue  ",
      }),
    ).toEqual({
      title: "Test catalogue",
    });
  });

  it("rejects a missing title", () => {
    expect(productCatalogContentSchema.safeParse({}).success).toBe(false);
  });

  it.each(["", " ", "   "])("rejects empty title %j", (title) => {
    expect(
      productCatalogContentSchema.safeParse({
        title,
      }).success,
    ).toBe(false);
  });

  it("rejects embedded UI translations", () => {
    expect(
      productCatalogContentSchema.safeParse({
        title: "Test catalogue",
        labels: {
          reset: "Test reset",
        },
      }).success,
    ).toBe(false);
  });
});

describe("productCatalogSectionSchema", () => {
  it("accepts a valid catalog section", () => {
    const section = {
      id: "test-catalog",
      type: "product-catalog",
      content: {
        title: "Test catalogue",
      },
    };

    expect(productCatalogSectionSchema.parse(section)).toEqual(section);
  });

  it("rejects an invalid section type", () => {
    expect(
      productCatalogSectionSchema.safeParse({
        id: "test-catalog",
        type: "invalid-section",
        content: {
          title: "Test catalogue",
        },
      }).success,
    ).toBe(false);
  });
});
