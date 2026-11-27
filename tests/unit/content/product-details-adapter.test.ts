import { describe, expect, it } from "vitest";

import { productFixture, productLabelsFixture } from "../../fixtures/products";

import { toProductDetails } from "@/lib/content/products/product-details-adapter";

describe("toProductDetails", () => {
  it("includes the product name and volume", () => {
    const result = toProductDetails(productFixture, "en", productLabelsFixture);

    expect(result.title).toBe("Test product — 750 ml");

    expect(result.description).toBe(productFixture.description);
  });

  it("maps three localized product facts", () => {
    const result = toProductDetails(productFixture, "en", productLabelsFixture);

    expect(result.facts).toEqual([
      {
        id: "volume",

        label: productLabelsFixture.facts.volume,

        value: "750 ml",
      },
      {
        id: "water-type",

        label: productLabelsFixture.facts.waterType,

        value: productLabelsFixture.waterTypes.still,
      },
      {
        id: "category",

        label: productLabelsFixture.facts.category,

        value: productLabelsFixture.categories.still,
      },
    ]);
  });

  it("omits missing optional information", () => {
    const result = toProductDetails(productFixture, "en", productLabelsFixture);

    expect(result.sections).toEqual([]);
  });

  it("maps the declaration when provided", () => {
    const result = toProductDetails(
      {
        ...productFixture,

        declaration: "Test declaration content",
      },
      "en",
      productLabelsFixture,
    );

    expect(result.sections).toEqual([
      {
        id: "declaration",

        title: productLabelsFixture.information.declaration,

        description: "Test declaration content",
      },
    ]);
  });

  it("maps storage instructions when provided", () => {
    const result = toProductDetails(
      {
        ...productFixture,

        storageInstructions: "Test storage content",
      },
      "en",
      productLabelsFixture,
    );

    expect(result.sections).toEqual([
      {
        id: "storage",

        title: productLabelsFixture.information.storage,

        description: "Test storage content",
      },
    ]);
  });

  it("maps availability when provided", () => {
    const result = toProductDetails(
      {
        ...productFixture,

        availability: "Test availability content",
      },
      "en",
      productLabelsFixture,
    );

    expect(result.sections).toEqual([
      {
        id: "availability",

        title: productLabelsFixture.information.availability,

        description: "Test availability content",
      },
    ]);
  });

  it("preserves the information section order", () => {
    const result = toProductDetails(
      {
        ...productFixture,

        declaration: "Test declaration",

        storageInstructions: "Test storage",

        availability: "Test availability",
      },
      "en",
      productLabelsFixture,
    );

    expect(result.sections.map(({ id }) => id)).toEqual([
      "declaration",
      "storage",
      "availability",
    ]);
  });

  it("does not expose images or presentation data", () => {
    const result = toProductDetails(productFixture, "en", productLabelsFixture);

    expect(result).not.toHaveProperty("image");

    expect(result).not.toHaveProperty("appearance");

    expect(result).not.toHaveProperty("seo");

    expect(result).not.toHaveProperty("highlights");
  });
});
