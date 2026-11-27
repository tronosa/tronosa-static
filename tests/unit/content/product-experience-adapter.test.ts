import { describe, expect, it } from "vitest";

import { productFixture, productLabelsFixture } from "../../fixtures/products";

import { toExperienceProduct } from "@/lib/content/products/product-experience-adapter";

describe("toExperienceProduct", () => {
  it("maps the product presentation", () => {
    const result = toExperienceProduct(
      productFixture,
      "en",
      productLabelsFixture,
    );

    expect(result).toMatchObject({
      id: productFixture.id,

      title: productFixture.title,

      volume: "750 ml",

      description: productFixture.description,

      image: productFixture.image,
    });
  });

  it("generates three fallback highlights", () => {
    const result = toExperienceProduct(
      productFixture,
      "en",
      productLabelsFixture,
    );

    expect(result.highlights).toEqual([
      {
        id: "category",

        title: productLabelsFixture.facts.category,

        description: productLabelsFixture.categories.still,
      },
      {
        id: "water-type",

        title: productLabelsFixture.facts.waterType,

        description: productLabelsFixture.waterTypes.still,
      },
      {
        id: "volume",

        title: productLabelsFixture.facts.volume,

        description: "750 ml",
      },
    ]);
  });

  it("preserves configured editorial highlights", () => {
    const highlights = [
      {
        id: "first",
        title: "First highlight",
        description: "First description",
      },
      {
        id: "second",
        title: "Second highlight",
        description: "Second description",
      },
      {
        id: "third",
        title: "Third highlight",
        description: "Third description",
      },
    ];

    const result = toExperienceProduct(
      {
        ...productFixture,
        highlights,
      },
      "en",
      productLabelsFixture,
    );

    expect(result.highlights).toEqual(highlights);
  });

  it("uses provided translations", () => {
    const result = toExperienceProduct(
      {
        ...productFixture,
        category: "sparkling",
        waterType: "sparkling",
      },
      "en",
      productLabelsFixture,
    );

    expect(result.highlights).toEqual(
      expect.arrayContaining([
        {
          id: "category",

          title: productLabelsFixture.facts.category,

          description: productLabelsFixture.categories.sparkling,
        },
        {
          id: "water-type",

          title: productLabelsFixture.facts.waterType,

          description: productLabelsFixture.waterTypes.sparkling,
        },
      ]),
    );
  });

  it.each([
    ["sr-Latn", "1,5 L"],
    ["sr-Cyrl", "1,5 L"],
    ["en", "1.5 L"],
  ] as const)("formats the volume for %s", (locale, expected) => {
    const result = toExperienceProduct(
      {
        ...productFixture,
        volumeMl: 1500,
      },
      locale,
      productLabelsFixture,
    );

    expect(result.volume).toBe(expected);
  });

  it("does not expose dialog or SEO data", () => {
    const result = toExperienceProduct(
      productFixture,
      "en",
      productLabelsFixture,
    );

    expect(result).not.toHaveProperty("details");

    expect(result).not.toHaveProperty("seo");

    expect(result).not.toHaveProperty("declaration");
  });
});
