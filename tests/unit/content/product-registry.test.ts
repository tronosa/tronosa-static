import { beforeEach, describe, expect, it, vi } from "vitest";

const fixtures = vi.hoisted(() => {
  const createProduct = (id: string, overrides = {}) => ({
    id,

    category: "still",

    waterType: "still",

    status: "published",

    volumeMl: 500,

    featured: false,

    sortOrder: 10,

    image: {
      src: "/test/product.webp",

      width: 600,

      height: 1200,
    },

    appearance: {
      backgroundColor: "#DCEBF0",

      accentColor: "#214C60",
    },

    ...overrides,
  });

  const createTranslation = (id: string, prefix: string) => ({
    id,

    slug: `${prefix}-${id}`,

    title: `${prefix} ${id}`,

    description: "Test description",

    imageAlt: "Test packaging",

    declaration: "Test declaration",

    storageInstructions: "Test storage instructions",

    availability: "Test availability",

    seo: {
      title: "Test SEO title",

      description: "Test SEO description",
    },
  });

  const catalog = [
    createProduct("product-a", {
      featured: true,
    }),

    createProduct("product-b", {
      category: "sparkling",

      waterType: "sparkling",

      volumeMl: 750,

      sortOrder: 20,
    }),

    createProduct("product-c", {
      status: "draft",

      volumeMl: 1500,

      sortOrder: 30,
    }),

    createProduct("product-d", {
      volumeMl: 330,
    }),

    createProduct("product-e"),
  ];

  return {
    catalog,

    translations: {
      "sr-Cyrl": catalog.map(({ id }) => createTranslation(id, "cyrl")),

      "sr-Latn": catalog.map(({ id }) => createTranslation(id, "latn")),

      en: catalog.map(({ id }) => createTranslation(id, "en")),
    },
  };
});

vi.mock("server-only", () => ({}));

vi.mock("@/content/products/catalog.json", () => ({
  default: fixtures.catalog,
}));

vi.mock("@/content/products/translations/sr-Cyrl.json", () => ({
  default: fixtures.translations["sr-Cyrl"],
}));

vi.mock("@/content/products/translations/sr-Latn.json", () => ({
  default: fixtures.translations["sr-Latn"],
}));

vi.mock("@/content/products/translations/en.json", () => ({
  default: fixtures.translations.en,
}));

const originalCatalog = structuredClone(fixtures.catalog);

const originalTranslations = structuredClone(fixtures.translations);

async function loadRegistry() {
  return import("@/lib/content/products/product-registry");
}

beforeEach(() => {
  vi.resetModules();

  fixtures.catalog.splice(
    0,

    fixtures.catalog.length,

    ...structuredClone(originalCatalog),
  );

  for (const locale of ["sr-Cyrl", "sr-Latn", "en"] as const) {
    fixtures.translations[locale].splice(
      0,

      fixtures.translations[locale].length,

      ...structuredClone(originalTranslations[locale]),
    );
  }
});

describe("Product Registry", () => {
  describe("localized products", () => {
    it("returns published and draft products", async () => {
      const { getAllProducts } = await loadRegistry();

      expect(getAllProducts("en")).toHaveLength(5);
    });

    it.each([
      ["sr-Cyrl", "cyrl"],

      ["sr-Latn", "latn"],

      ["en", "en"],
    ] as const)("resolves translations for %s", async (locale, prefix) => {
      const { getAllProducts } = await loadRegistry();

      const product = getAllProducts(locale).find(
        ({ id }) => id === "product-a",
      );

      expect(product).toMatchObject({
        id: "product-a",

        slug: `${prefix}-product-a`,

        title: `${prefix} product-a`,

        image: {
          alt: "Test packaging",
        },
      });
    });

    it("reuses a locale product index", async () => {
      const { getAllProducts } = await loadRegistry();

      expect(getAllProducts("en")).toBe(getAllProducts("en"));
    });

    it("creates separate indexes for different locales", async () => {
      const { getAllProducts } = await loadRegistry();

      expect(getAllProducts("en")).not.toBe(getAllProducts("sr-Latn"));
    });

    it("sorts by order, volume and identifier", async () => {
      const { getAllProducts } = await loadRegistry();

      expect(getAllProducts("en").map(({ id }) => id)).toEqual([
        "product-d",

        "product-a",

        "product-e",

        "product-b",

        "product-c",
      ]);
    });
  });

  describe("published product selection", () => {
    it("excludes draft products", async () => {
      const { getPublishedProducts } = await loadRegistry();

      const products = getPublishedProducts("en");

      expect(products).toHaveLength(4);

      expect(products.every(({ status }) => status === "published")).toBe(true);
    });

    it("filters products by category", async () => {
      const { getPublishedProducts } = await loadRegistry();

      expect(
        getPublishedProducts("en", {
          category: "sparkling",
        }).map(({ id }) => id),
      ).toEqual(["product-b"]);
    });

    it("filters products by water type", async () => {
      const { getPublishedProducts } = await loadRegistry();

      expect(
        getPublishedProducts("en", {
          waterType: "sparkling",
        }).map(({ id }) => id),
      ).toEqual(["product-b"]);
    });

    it("filters products by volume", async () => {
      const { getPublishedProducts } = await loadRegistry();

      expect(
        getPublishedProducts("en", {
          volumeMl: 500,
        }).map(({ id }) => id),
      ).toEqual(["product-a", "product-e"]);
    });

    it("filters featured products", async () => {
      const { getPublishedProducts } = await loadRegistry();

      expect(
        getPublishedProducts("en", {
          featured: true,
        }).map(({ id }) => id),
      ).toEqual(["product-a"]);
    });

    it("filters non-featured products", async () => {
      const { getPublishedProducts } = await loadRegistry();

      expect(
        getPublishedProducts("en", {
          featured: false,
        }),
      ).toHaveLength(3);
    });

    it("combines multiple filters", async () => {
      const { getPublishedProducts } = await loadRegistry();

      expect(
        getPublishedProducts("en", {
          category: "still",

          waterType: "still",

          volumeMl: 500,

          featured: true,
        }).map(({ id }) => id),
      ).toEqual(["product-a"]);
    });

    it("returns no products for unmatched filters", async () => {
      const { getPublishedProducts } = await loadRegistry();

      expect(
        getPublishedProducts("en", {
          waterType: "sparkling",

          volumeMl: 500,
        }),
      ).toEqual([]);
    });
  });

  describe("product lookup", () => {
    it("finds published products by identifier", async () => {
      const { getProductById } = await loadRegistry();

      expect(getProductById("en", "product-a")?.id).toBe("product-a");
    });

    it("does not expose draft products by identifier", async () => {
      const { getProductById } = await loadRegistry();

      expect(getProductById("en", "product-c")).toBeUndefined();
    });

    it("returns undefined for unknown identifiers", async () => {
      const { getProductById } = await loadRegistry();

      expect(getProductById("en", "unknown")).toBeUndefined();
    });

    it("finds published products by localized slug", async () => {
      const { getProductBySlug } = await loadRegistry();

      expect(
        getProductBySlug(
          "sr-Latn",

          "latn-product-a",
        )?.id,
      ).toBe("product-a");
    });

    it("does not expose draft products by slug", async () => {
      const { getProductBySlug } = await loadRegistry();

      expect(getProductBySlug("en", "en-product-c")).toBeUndefined();
    });

    it("returns undefined for unknown slugs", async () => {
      const { getProductBySlug } = await loadRegistry();

      expect(getProductBySlug("en", "unknown")).toBeUndefined();
    });
  });

  describe("available filter values", () => {
    it("returns unique published product categories", async () => {
      const { getAvailableProductCategories } = await loadRegistry();

      expect(getAvailableProductCategories("en")).toEqual([
        "still",

        "sparkling",
      ]);
    });

    it("returns unique published water types", async () => {
      const { getAvailableProductWaterTypes } = await loadRegistry();

      expect(getAvailableProductWaterTypes("en")).toEqual([
        "still",

        "sparkling",
      ]);
    });

    it("returns unique numerically sorted published volumes", async () => {
      const { getAvailableProductVolumes } = await loadRegistry();

      expect(getAvailableProductVolumes("en")).toEqual([
        330,

        500,

        750,
      ]);
    });
  });

  describe("content integrity", () => {
    it("rejects translations referencing unknown products", async () => {
      fixtures.translations.en.push({
        ...fixtures.translations.en[0],

        id: "unknown-product",

        slug: "unknown-product",
      });

      const { getAllProducts } = await loadRegistry();

      expect(() => getAllProducts("en")).toThrow(
        'Unknown product "unknown-product"',
      );
    });

    it("rejects products without translations", async () => {
      fixtures.translations.en.splice(0, 1);

      const { getAllProducts } = await loadRegistry();

      expect(() => getAllProducts("en")).toThrow(
        'Missing translation for "product-a"',
      );
    });

    it.each(["declaration", "storageInstructions", "availability"] as const)(
      "rejects published products without %s",
      async (field) => {
        Reflect.deleteProperty(
          fixtures.translations.en[0],

          field,
        );

        const { getAllProducts } = await loadRegistry();

        expect(() => getAllProducts("en")).toThrow(
          'Published product "product-a" is missing required product information',
        );
      },
    );

    it("accepts draft products without publication information", async () => {
      const translation = fixtures.translations.en.find(
        ({ id }) => id === "product-c",
      );

      if (!translation) {
        throw new Error("Draft product fixture not found.");
      }

      Reflect.deleteProperty(
        translation,

        "declaration",
      );

      Reflect.deleteProperty(
        translation,

        "storageInstructions",
      );

      Reflect.deleteProperty(
        translation,

        "availability",
      );

      const { getAllProducts } = await loadRegistry();

      expect(
        getAllProducts("en").find(({ id }) => id === "product-c"),
      ).toMatchObject({
        id: "product-c",

        status: "draft",
      });
    });
  });
});
