import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { beforeAll, describe, expect, it } from "vitest";

import {
  articleSchema,
  articleAuthorSchema,
  articleCategorySchema,
  type Article,
} from "./article.schema";

const CREATED_AT = "2026-01-10T10:00:00+01:00";
const PUBLISHED_AT = "2026-01-15T10:00:00+01:00";
const MODIFIED_AT = "2026-01-20T10:00:00+01:00";

let articleFixture: Article;

beforeAll(() => {
  const directory = path.join(process.cwd(), "src", "content", "blog", "en");

  const filenames = readdirSync(directory)
    .filter((filename) => filename.endsWith(".json"))
    .sort();

  for (const filename of filenames) {
    const raw: unknown = JSON.parse(
      readFileSync(path.join(directory, filename), "utf8"),
    );

    const parsed = articleSchema.safeParse(raw);

    if (parsed.success) {
      articleFixture = parsed.data;

      return;
    }
  }

  throw new Error("Missing valid article fixture");
});

function createArticle(overrides: Partial<Article> = {}): Article {
  return {
    ...structuredClone(articleFixture),

    id: "test-article",
    slug: "test-article",
    status: "published",

    createdAt: CREATED_AT,
    publishedAt: PUBLISHED_AT,
    modifiedAt: MODIFIED_AT,

    category: "nature",
    featured: false,

    author: {
      type: "Organization",
      name: "Tronoša",
    },

    preview: {
      title: "Natural spring water",
      description: "Discover the natural origin of spring water.",
    },

    content: {
      sections: [
        {
          id: "article-metadata",
          type: "article-metadata",
        },
      ],
    },

    ...overrides,
  };
}

describe("Article schema", () => {
  it("accepts a valid published article", () => {
    const result = articleSchema.safeParse(createArticle());

    expect(result.success).toBe(true);
  });

  it("accepts a valid draft article", () => {
    const result = articleSchema.safeParse(
      createArticle({
        status: "draft",
      }),
    );

    expect(result.success).toBe(true);
  });

  it("rejects an unsupported article status", () => {
    const result = articleSchema.safeParse({
      ...createArticle(),
      status: "archived",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid article ID", () => {
    const result = articleSchema.safeParse(
      createArticle({
        id: "Invalid Article ID",
      }),
    );

    expect(result.success).toBe(false);
  });

  it("rejects an empty article slug", () => {
    const result = articleSchema.safeParse(
      createArticle({
        slug: "",
      }),
    );

    expect(result.success).toBe(false);
  });

  it("defaults featured to false", () => {
    const result = articleSchema.parse({
      ...createArticle(),
      featured: undefined,
    });

    expect(result.featured).toBe(false);
  });

  it("preserves an explicitly featured article", () => {
    const result = articleSchema.parse(
      createArticle({
        featured: true,
      }),
    );

    expect(result.featured).toBe(true);
  });
});

describe("Article date validation", () => {
  it("accepts chronological article dates", () => {
    const result = articleSchema.safeParse(
      createArticle({
        createdAt: CREATED_AT,
        publishedAt: PUBLISHED_AT,
        modifiedAt: MODIFIED_AT,
      }),
    );

    expect(result.success).toBe(true);
  });

  it("accepts identical creation, publication and modification dates", () => {
    const result = articleSchema.safeParse(
      createArticle({
        createdAt: CREATED_AT,
        publishedAt: CREATED_AT,
        modifiedAt: CREATED_AT,
      }),
    );

    expect(result.success).toBe(true);
  });

  it.each<Article["status"]>(["draft", "published"])(
    "rejects modification before creation for a %s article",
    (status) => {
      const result = articleSchema.safeParse(
        createArticle({
          status,
          createdAt: CREATED_AT,
          modifiedAt: "2026-01-09T10:00:00+01:00",
        }),
      );

      expect(result.success).toBe(false);

      if (result.success) {
        throw new Error("Expected article validation to fail");
      }

      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          code: "custom",
          path: ["modifiedAt"],
          message: "Modification date cannot precede creation date.",
        }),
      );
    },
  );

  it("rejects publication before creation for a published article", () => {
    const result = articleSchema.safeParse(
      createArticle({
        createdAt: CREATED_AT,
        publishedAt: "2026-01-09T10:00:00+01:00",
        modifiedAt: MODIFIED_AT,
      }),
    );

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("Expected article validation to fail");
    }

    expect(result.error.issues).toContainEqual(
      expect.objectContaining({
        code: "custom",
        path: ["publishedAt"],
        message: "Publication date cannot precede creation date.",
      }),
    );
  });

  it("rejects modification before publication for a published article", () => {
    const result = articleSchema.safeParse(
      createArticle({
        createdAt: CREATED_AT,
        publishedAt: PUBLISHED_AT,
        modifiedAt: "2026-01-12T10:00:00+01:00",
      }),
    );

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("Expected article validation to fail");
    }

    expect(result.error.issues).toContainEqual(
      expect.objectContaining({
        code: "custom",
        path: ["modifiedAt"],
        message: "Modification date cannot precede publication date.",
      }),
    );
  });

  it("reports multiple chronological violations", () => {
    const result = articleSchema.safeParse(
      createArticle({
        createdAt: CREATED_AT,
        publishedAt: "2026-01-09T10:00:00+01:00",
        modifiedAt: "2026-01-08T10:00:00+01:00",
      }),
    );

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("Expected article validation to fail");
    }

    expect(result.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["modifiedAt"],
          message: "Modification date cannot precede creation date.",
        }),
        expect.objectContaining({
          path: ["publishedAt"],
          message: "Publication date cannot precede creation date.",
        }),
        expect.objectContaining({
          path: ["modifiedAt"],
          message: "Modification date cannot precede publication date.",
        }),
      ]),
    );

    expect(result.error.issues).toHaveLength(3);
  });

  it("allows publication before creation for a draft article", () => {
    const result = articleSchema.safeParse(
      createArticle({
        status: "draft",
        createdAt: CREATED_AT,
        publishedAt: "2026-01-09T10:00:00+01:00",
        modifiedAt: MODIFIED_AT,
      }),
    );

    expect(result.success).toBe(true);
  });

  it("allows modification before publication for a draft article", () => {
    const result = articleSchema.safeParse(
      createArticle({
        status: "draft",
        createdAt: CREATED_AT,
        publishedAt: PUBLISHED_AT,
        modifiedAt: "2026-01-12T10:00:00+01:00",
      }),
    );

    expect(result.success).toBe(true);
  });

  it("compares equivalent timestamps across timezone offsets", () => {
    const result = articleSchema.safeParse(
      createArticle({
        createdAt: "2026-01-10T10:00:00+01:00",
        publishedAt: "2026-01-10T09:00:00Z",
        modifiedAt: "2026-01-10T11:00:00+02:00",
      }),
    );

    expect(result.success).toBe(true);
  });

  it("rejects chronological violations across timezone offsets", () => {
    const result = articleSchema.safeParse(
      createArticle({
        createdAt: "2026-01-10T10:00:00+01:00",
        publishedAt: "2026-01-10T10:00:00+02:00",
        modifiedAt: MODIFIED_AT,
      }),
    );

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("Expected article validation to fail");
    }

    expect(result.error.issues).toContainEqual(
      expect.objectContaining({
        path: ["publishedAt"],
        message: "Publication date cannot precede creation date.",
      }),
    );
  });

  it.each(["createdAt", "publishedAt", "modifiedAt"] as const)(
    "rejects an invalid %s timestamp",
    (field) => {
      const result = articleSchema.safeParse({
        ...createArticle(),
        [field]: "invalid-date",
      });

      expect(result.success).toBe(false);
    },
  );

  it.each(["createdAt", "publishedAt", "modifiedAt"] as const)(
    "rejects a timestamp without an offset in %s",
    (field) => {
      const result = articleSchema.safeParse({
        ...createArticle(),
        [field]: "2026-01-10T10:00:00",
      });

      expect(result.success).toBe(false);
    },
  );
});

describe("Article category schema", () => {
  it.each([
    "nature",
    "hydration",
    "health",
    "sustainability",
    "company",
    "news",
  ])("accepts the %s category", (category) => {
    expect(articleCategorySchema.parse(category)).toBe(category);
  });

  it.each(["", "unknown", "Nature", "HEALTH"])(
    "rejects an unsupported category: %s",
    (category) => {
      expect(articleCategorySchema.safeParse(category).success).toBe(false);
    },
  );
});

describe("Article author schema", () => {
  it("defaults the author type to Person", () => {
    const result = articleAuthorSchema.parse({
      name: "Article Author",
    });

    expect(result.type).toBe("Person");
  });

  it.each(["Person", "Organization"] as const)(
    "accepts an author of type %s",
    (type) => {
      const result = articleAuthorSchema.parse({
        type,
        name: "Article Author",
      });

      expect(result.type).toBe(type);
    },
  );

  it("trims the author name", () => {
    const result = articleAuthorSchema.parse({
      name: "  Tronoša  ",
    });

    expect(result.name).toBe("Tronoša");
  });

  it("accepts an author with a URL and image", () => {
    const result = articleAuthorSchema.parse({
      type: "Organization",
      name: "Tronoša",
      url: "https://tronosa.com",
      image: "/assets/logo/logo.webp",
    });

    expect(result).toEqual({
      type: "Organization",
      name: "Tronoša",
      url: "https://tronosa.com",
      image: "/assets/logo/logo.webp",
    });
  });

  it.each(["", "   "])("rejects an empty author name", (name) => {
    expect(articleAuthorSchema.safeParse({ name }).success).toBe(false);
  });

  it("rejects an invalid author type", () => {
    expect(
      articleAuthorSchema.safeParse({
        type: "Unknown",
        name: "Tronoša",
      }).success,
    ).toBe(false);
  });

  it("rejects an invalid author URL", () => {
    expect(
      articleAuthorSchema.safeParse({
        name: "Tronoša",
        url: "invalid-url",
      }).success,
    ).toBe(false);
  });

  it("rejects an empty author image", () => {
    expect(
      articleAuthorSchema.safeParse({
        name: "Tronoša",
        image: "   ",
      }).success,
    ).toBe(false);
  });
});

describe("Article preview schema", () => {
  it("accepts a preview without an image", () => {
    const result = articleSchema.safeParse(createArticle());

    expect(result.success).toBe(true);
  });

  it("accepts a preview with a valid image", () => {
    const result = articleSchema.safeParse(
      createArticle({
        preview: {
          title: "Natural spring water",
          description: "Discover the natural origin.",
          image: {
            src: "/assets/blog/natural-origin.webp",
            alt: "Natural spring water",
            width: 1200,
            height: 630,
          },
        },
      }),
    );

    expect(result.success).toBe(true);
  });

  it.each(["title", "description"] as const)(
    "rejects an empty preview %s",
    (field) => {
      const article = createArticle();

      const result = articleSchema.safeParse({
        ...article,
        preview: {
          ...article.preview,
          [field]: "",
        },
      });

      expect(result.success).toBe(false);
    },
  );

  it.each([
    { width: 0, height: 630 },
    { width: -1200, height: 630 },
    { width: 1200, height: 0 },
    { width: 1200, height: -630 },
    { width: 1200.5, height: 630 },
    { width: 1200, height: 630.5 },
  ])(
    "rejects invalid preview image dimensions: $width x $height",
    ({ width, height }) => {
      const result = articleSchema.safeParse(
        createArticle({
          preview: {
            title: "Natural spring water",
            description: "Discover the natural origin.",
            image: {
              src: "/assets/blog/natural-origin.webp",
              alt: "Natural spring water",
              width,
              height,
            },
          },
        }),
      );

      expect(result.success).toBe(false);
    },
  );
});
