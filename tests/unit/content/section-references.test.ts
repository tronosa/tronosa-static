import { describe, expect, it } from "vitest";

import { pageSchema } from "@/content/schemas/page.schema";
import { articleSchema } from "@/content/schemas/article.schema";

import type { Locale } from "@/i18n/config";

import type {
  ContentEntry,
  PageEntry,
  ArticleEntry,
} from "@/lib/content/registry";

import { validateSectionReferences } from "@/lib/content/section-validation";

type PublicationStatus = "draft" | "published";

type ReferenceFixture = {
  name: string;
  path: string;
  createSection: (pageId: string) => unknown;
};

const SEO = {
  title: "Test content",
  description: "Test content description.",
};

const IMAGE = {
  alt: "Test image",
  desktop: {
    src: "/test/image.webp",
    width: 1200,
    height: 800,
  },
};

const PRODUCT_IMAGE = {
  src: "/test/product.webp",
  alt: "Test product",
  width: 600,
  height: 900,
};

const VIDEO = {
  src: "/test/video.mp4",
  poster: "/test/poster.webp",
  type: "video/mp4",
};

const VIDEO_ACCESSIBILITY = {
  playLabel: "Play video",
  pauseLabel: "Pause video",
};

function createCta(pageId: string) {
  return {
    label: "Learn more",
    pageId,
  };
}

function createInternalLink(pageId: string) {
  return {
    type: "link",
    text: "Learn more",
    pageId,
  };
}

function createPage({
  id = "test-page",
  slug = id,
  locale = "en",
  status = "published",
  sections = [],
}: {
  id?: string;
  slug?: string;
  locale?: Locale;
  status?: PublicationStatus;
  sections?: unknown[];
} = {}): PageEntry {
  return {
    kind: "page",
    locale,
    data: pageSchema.parse({
      id,
      slug,
      status,
      seo: SEO,
      content: {
        sections,
      },
    }),
  };
}

function createBlogPage({
  locale = "en",
  status = "published",
  sections = [],
}: {
  locale?: Locale;
  status?: PublicationStatus;
  sections?: unknown[];
} = {}): PageEntry {
  return createPage({
    id: "blog",
    slug: locale === "en" ? "stories-from-the-spring" : "price-sa-izvora",
    locale,
    status,
    sections,
  });
}

function createArticle({
  id = "test-article",
  locale = "en",
  status = "published",
  sections = [],
}: {
  id?: string;
  locale?: Locale;
  status?: PublicationStatus;
  sections?: unknown[];
} = {}): ArticleEntry {
  return {
    kind: "article",
    locale,
    data: articleSchema.parse({
      id,
      slug: id,
      category: "nature",
      status,
      featured: false,
      createdAt: "2026-01-01T10:00:00+01:00",
      publishedAt: "2026-01-02T10:00:00+01:00",
      modifiedAt: "2026-01-03T10:00:00+01:00",
      author: {
        name: "Test author",
      },
      preview: {
        title: "Test article",
        description: "Test article description.",
      },
      seo: SEO,
      content: {
        sections,
      },
    }),
  };
}

function createSourceClosing(pageId: string) {
  return {
    id: "test-source-closing",
    type: "source-closing",
    content: {
      pageId,
    },
  };
}

function createRichTextParagraph(pageId: string) {
  return {
    id: "test-rich-text",
    type: "content-section",
    content: {
      width: "narrow",
      blocks: [
        {
          type: "paragraph",
          children: [
            {
              text: "Test paragraph.",
            },
            createInternalLink(pageId),
          ],
        },
      ],
    },
  };
}

function createArticleHero(pageId: string) {
  return {
    id: "test-article-hero",
    type: "article-hero",
    content: {
      backgroundText: "Test background",
      title: [
        {
          text: "Test article ",
        },
        createInternalLink(pageId),
      ],
    },
  };
}

const REFERENCE_FIXTURES: ReferenceFixture[] = [
  {
    name: "VideoHero CTA",
    path: "section.content.cta.pageId",
    createSection: (pageId) => ({
      id: "test-video-hero",
      type: "video-hero",
      content: {
        title: "Test title",
        video: VIDEO,
        accessibility: VIDEO_ACCESSIBILITY,
        cta: createCta(pageId),
      },
    }),
  },
  {
    name: "ImageHero CTA",
    path: "section.content.cta.pageId",
    createSection: (pageId) => ({
      id: "test-image-hero",
      type: "image-hero",
      content: {
        title: "Test title",
        image: IMAGE,
        cta: createCta(pageId),
      },
    }),
  },
  {
    name: "CardSlider text card CTA",
    path: "section.content.cards[0].cta.pageId",
    createSection: (pageId) => ({
      id: "test-card-slider",
      type: "card-slider",
      content: {
        title: "Test slider",
        cards: [
          {
            kind: "text",
            title: "Test card",
            headline: "Test headline",
            cta: createCta(pageId),
          },
        ],
        accessibility: {
          previousLabel: "Previous",
          nextLabel: "Next",
          viewportLabel: "Test slides",
        },
      },
    }),
  },
  {
    name: "CardSlider image card CTA",
    path: "section.content.cards[0].cta.pageId",
    createSection: (pageId) => ({
      id: "test-card-slider",
      type: "card-slider",
      content: {
        title: "Test slider",
        cards: [
          {
            kind: "image",
            title: "Test card",
            headline: "Test headline",
            image: IMAGE,
            cta: createCta(pageId),
          },
        ],
        accessibility: {
          previousLabel: "Previous",
          nextLabel: "Next",
          viewportLabel: "Test slides",
        },
      },
    }),
  },
  {
    name: "EditorialMedia CTA",
    path: "section.content.cta.pageId",
    createSection: (pageId) => ({
      id: "test-editorial-media",
      type: "editorial-media",
      content: {
        title: "Test title",
        paragraphs: ["Test paragraph."],
        mediaPosition: "right",
        media: {
          kind: "image",
          image: IMAGE,
        },
        cta: createCta(pageId),
      },
    }),
  },
  {
    name: "ProductShowcase CTA",
    path: "section.content.cta.pageId",
    createSection: (pageId) => ({
      id: "test-product-showcase",
      type: "product-showcase",
      content: {
        title: "Test products",
        accessibility: {
          categorySelectorLabel: "Select category",
          selectorLabel: "Select product",
        },
        cta: createCta(pageId),
        categories: [
          {
            id: "test-category",
            label: "Test category",
            products: [
              {
                id: "test-product",
                title: "Test product",
                description: "Test product description.",
                volume: "1 L",
                image: PRODUCT_IMAGE,
                appearance: {
                  backgroundColor: "#FFFFFF",
                  accentColor: "#000000",
                },
              },
            ],
          },
        ],
      },
    }),
  },
  {
    name: "RichText paragraph link",
    path: "section.content.blocks[0].children[1].pageId",
    createSection: createRichTextParagraph,
  },
  {
    name: "RichText heading link",
    path: "section.content.blocks[0].children[0].pageId",
    createSection: (pageId) => ({
      id: "test-rich-text-heading",
      type: "content-section",
      content: {
        blocks: [
          {
            type: "heading",
            level: 2,
            children: [createInternalLink(pageId)],
          },
        ],
      },
    }),
  },
  {
    name: "RichText list link",
    path: "section.content.blocks[0].items[0][1].pageId",
    createSection: (pageId) => ({
      id: "test-rich-text-list",
      type: "content-section",
      content: {
        blocks: [
          {
            type: "list",
            ordered: false,
            items: [
              [
                {
                  text: "Test list item.",
                },
                createInternalLink(pageId),
              ],
            ],
          },
        ],
      },
    }),
  },
];

describe("Content section reference validation", () => {
  it("accepts an empty content collection", () => {
    expect(() => validateSectionReferences([])).not.toThrow();
  });

  it("accepts content without sections", () => {
    const page = createPage();

    expect(() => validateSectionReferences([page])).not.toThrow();
  });

  it("accepts sections without internal references", () => {
    const source = createPage({
      id: "source-page",
      sections: [
        {
          id: "test-content",
          type: "content-section",
          content: {
            blocks: [
              {
                type: "paragraph",
                children: [
                  {
                    text: "Test content.",
                  },
                ],
              },
            ],
          },
        },
      ],
    });

    expect(() => validateSectionReferences([source])).not.toThrow();
  });

  it("ignores external HTTPS links", () => {
    const source = createPage({
      id: "source-page",
      sections: [
        {
          id: "test-content",
          type: "content-section",
          content: {
            blocks: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "external-link",
                    text: "External website",
                    href: "https://example.com",
                    newTab: true,
                  },
                ],
              },
            ],
          },
        },
      ],
    });

    expect(() => validateSectionReferences([source])).not.toThrow();
  });

  it("allows a page to reference itself", () => {
    const source = createPage({
      id: "source-page",
      sections: [createRichTextParagraph("source-page")],
    });

    expect(() => validateSectionReferences([source])).not.toThrow();
  });

  it("allows mutually referencing pages", () => {
    const first = createPage({
      id: "first-page",
      sections: [createRichTextParagraph("second-page")],
    });

    const second = createPage({
      id: "second-page",
      sections: [createRichTextParagraph("first-page")],
    });

    expect(() => validateSectionReferences([first, second])).not.toThrow();
  });

  it("resolves references independently of entry order", () => {
    const source = createPage({
      id: "source-page",
      sections: [createRichTextParagraph("target-page")],
    });

    const target = createPage({
      id: "target-page",
    });

    expect(() => validateSectionReferences([source, target])).not.toThrow();

    expect(() => validateSectionReferences([target, source])).not.toThrow();
  });

  it("does not mutate content entries", () => {
    const entries: ContentEntry[] = [
      createPage({
        id: "source-page",
        sections: [createRichTextParagraph("target-page")],
      }),
      createPage({
        id: "target-page",
      }),
    ];

    const original = structuredClone(entries);

    validateSectionReferences(entries);

    expect(entries).toEqual(original);
  });
});

describe.each(REFERENCE_FIXTURES)(
  "$name reference validation",
  ({ createSection, path }) => {
    it("accepts a published target page", () => {
      const source = createPage({
        id: "source-page",
        sections: [createSection("target-page")],
      });

      const target = createPage({
        id: "target-page",
      });

      expect(() => validateSectionReferences([source, target])).not.toThrow();
    });

    it("rejects a missing target page", () => {
      const source = createPage({
        id: "source-page",
        sections: [createSection("missing-page")],
      });

      expect(() => validateSectionReferences([source])).toThrow(
        /Invalid page reference "missing-page"/,
      );
    });

    it("rejects a draft target from published content", () => {
      const source = createPage({
        id: "source-page",
        status: "published",
        sections: [createSection("target-page")],
      });

      const target = createPage({
        id: "target-page",
        status: "draft",
      });

      expect(() => validateSectionReferences([source, target])).toThrow(
        /Reference to draft page "target-page"/,
      );
    });

    it("allows a draft target from draft content", () => {
      const source = createPage({
        id: "source-page",
        status: "draft",
        sections: [createSection("target-page")],
      });

      const target = createPage({
        id: "target-page",
        status: "draft",
      });

      expect(() => validateSectionReferences([source, target])).not.toThrow();
    });

    it("reports the exact reference path", () => {
      const source = createPage({
        id: "source-page",
        sections: [createSection("missing-page")],
      });

      expect(() => validateSectionReferences([source])).toThrow(
        `Path: ${path}.`,
      );
    });
  },
);

describe("Reference publication lifecycle", () => {
  it.each([
    ["published", "published"],
    ["draft", "published"],
    ["draft", "draft"],
  ] as const)(
    "allows %s source content to reference a %s page",
    (sourceStatus, targetStatus) => {
      const source = createPage({
        id: "source-page",
        status: sourceStatus,
        sections: [createRichTextParagraph("target-page")],
      });

      const target = createPage({
        id: "target-page",
        status: targetStatus,
      });

      expect(() => validateSectionReferences([source, target])).not.toThrow();
    },
  );

  it("rejects published content referencing a draft page", () => {
    const source = createPage({
      id: "source-page",
      status: "published",
      sections: [createRichTextParagraph("target-page")],
    });

    const target = createPage({
      id: "target-page",
      status: "draft",
    });

    expect(() => validateSectionReferences([source, target])).toThrow(
      /Reference to draft page "target-page"/,
    );
  });

  it.each<PublicationStatus>(["published", "draft"])(
    "rejects missing references from %s content",
    (status) => {
      const source = createPage({
        id: "source-page",
        status,
        sections: [createRichTextParagraph("missing-page")],
      });

      expect(() => validateSectionReferences([source])).toThrow(
        /Invalid page reference "missing-page"/,
      );
    },
  );
});

describe("Localized content references", () => {
  it.each<Locale>(["sr-Cyrl", "sr-Latn", "en"])(
    "accepts references to pages in the same locale: %s",
    (locale) => {
      const source = createPage({
        id: "source-page",
        locale,
        sections: [createRichTextParagraph("target-page")],
      });

      const target = createPage({
        id: "target-page",
        locale,
      });

      expect(() => validateSectionReferences([source, target])).not.toThrow();
    },
  );

  it.each([
    ["en", "sr-Cyrl"],
    ["en", "sr-Latn"],
    ["sr-Cyrl", "en"],
    ["sr-Cyrl", "sr-Latn"],
    ["sr-Latn", "en"],
    ["sr-Latn", "sr-Cyrl"],
  ] as const)(
    "rejects references from %s to content available only in %s",
    (sourceLocale, targetLocale) => {
      const source = createPage({
        id: "source-page",
        locale: sourceLocale,
        sections: [createRichTextParagraph("target-page")],
      });

      const target = createPage({
        id: "target-page",
        locale: targetLocale,
      });

      expect(() => validateSectionReferences([source, target])).toThrow(
        `Invalid page reference "target-page" ` +
          `in ${sourceLocale}/source-page/test-rich-text.`,
      );
    },
  );

  it("resolves the target with the matching locale and ID", () => {
    const source = createPage({
      id: "source-page",
      locale: "en",
      sections: [createRichTextParagraph("target-page")],
    });

    const englishTarget = createPage({
      id: "target-page",
      locale: "en",
      status: "published",
    });

    const serbianTarget = createPage({
      id: "target-page",
      locale: "sr-Cyrl",
      status: "draft",
    });

    expect(() =>
      validateSectionReferences([source, englishTarget, serbianTarget]),
    ).not.toThrow();
  });

  it("does not fall back to a published page in another locale", () => {
    const source = createPage({
      id: "source-page",
      locale: "en",
      sections: [createRichTextParagraph("target-page")],
    });

    const englishTarget = createPage({
      id: "target-page",
      locale: "en",
      status: "draft",
    });

    const serbianTarget = createPage({
      id: "target-page",
      locale: "sr-Latn",
      status: "published",
    });

    expect(() =>
      validateSectionReferences([source, englishTarget, serbianTarget]),
    ).toThrow(/Reference to draft page "target-page"/);
  });
});

describe("Journal content references", () => {
  it("validates SourceClosing page references", () => {
    const source = createBlogPage({
      sections: [createSourceClosing("target-page")],
    });

    const target = createPage({
      id: "target-page",
    });

    expect(() => validateSectionReferences([source, target])).not.toThrow();
  });

  it("rejects missing SourceClosing references", () => {
    const source = createBlogPage({
      sections: [createSourceClosing("missing-page")],
    });

    expect(() => validateSectionReferences([source])).toThrow(
      /Invalid page reference "missing-page"/,
    );
  });

  it("reports the SourceClosing reference path", () => {
    const source = createBlogPage({
      sections: [createSourceClosing("missing-page")],
    });

    expect(() => validateSectionReferences([source])).toThrow(
      "Path: section.content.pageId.",
    );
  });

  it("allows standard pages to reference the journal listing", () => {
    const source = createPage({
      id: "source-page",
      sections: [createRichTextParagraph("blog")],
    });

    const journal = createBlogPage();

    expect(() => validateSectionReferences([source, journal])).not.toThrow();
  });

  it("rejects references to a draft journal listing", () => {
    const source = createPage({
      id: "source-page",
      sections: [createRichTextParagraph("blog")],
    });

    const journal = createBlogPage({
      status: "draft",
    });

    expect(() => validateSectionReferences([source, journal])).toThrow(
      /Reference to draft page "blog"/,
    );
  });
});

describe("Article content references", () => {
  it("accepts references from articles to published pages", () => {
    const article = createArticle({
      sections: [createRichTextParagraph("target-page")],
    });

    const target = createPage({
      id: "target-page",
    });

    expect(() => validateSectionReferences([article, target])).not.toThrow();
  });

  it("rejects missing page references in articles", () => {
    const article = createArticle({
      sections: [createRichTextParagraph("missing-page")],
    });

    expect(() => validateSectionReferences([article])).toThrow(
      /Invalid page reference "missing-page"/,
    );
  });

  it("rejects published articles referencing draft pages", () => {
    const article = createArticle({
      status: "published",
      sections: [createRichTextParagraph("target-page")],
    });

    const target = createPage({
      id: "target-page",
      status: "draft",
    });

    expect(() => validateSectionReferences([article, target])).toThrow(
      /Reference to draft page "target-page"/,
    );
  });

  it("allows draft articles referencing draft pages", () => {
    const article = createArticle({
      status: "draft",
      sections: [createRichTextParagraph("target-page")],
    });

    const target = createPage({
      id: "target-page",
      status: "draft",
    });

    expect(() => validateSectionReferences([article, target])).not.toThrow();
  });

  it("validates internal links in ArticleHero titles", () => {
    const article = createArticle({
      sections: [createArticleHero("target-page")],
    });

    const target = createPage({
      id: "target-page",
    });

    expect(() => validateSectionReferences([article, target])).not.toThrow();
  });

  it("rejects missing ArticleHero title references", () => {
    const article = createArticle({
      sections: [createArticleHero("missing-page")],
    });

    expect(() => validateSectionReferences([article])).toThrow(
      /Invalid page reference "missing-page"/,
    );
  });

  it("reports the ArticleHero reference path", () => {
    const article = createArticle({
      sections: [createArticleHero("missing-page")],
    });

    expect(() => validateSectionReferences([article])).toThrow(
      "Path: section.content.title[1].pageId.",
    );
  });

  it("does not resolve page references to articles with the same ID", () => {
    const source = createPage({
      id: "source-page",
      sections: [createRichTextParagraph("target-content")],
    });

    const article = createArticle({
      id: "target-content",
    });

    expect(() => validateSectionReferences([source, article])).toThrow(
      /Invalid page reference "target-content"/,
    );
  });
});

describe("Multiple content references", () => {
  it("validates multiple references within the same section", () => {
    const source = createPage({
      id: "source-page",
      sections: [
        {
          id: "test-content",
          type: "content-section",
          content: {
            blocks: [
              {
                type: "paragraph",
                children: [
                  createInternalLink("first-page"),
                  createInternalLink("second-page"),
                ],
              },
            ],
          },
        },
      ],
    });

    const first = createPage({
      id: "first-page",
    });

    const second = createPage({
      id: "second-page",
    });

    expect(() =>
      validateSectionReferences([source, first, second]),
    ).not.toThrow();
  });

  it("rejects invalid references after valid references", () => {
    const source = createPage({
      id: "source-page",
      sections: [
        {
          id: "test-content",
          type: "content-section",
          content: {
            blocks: [
              {
                type: "paragraph",
                children: [
                  createInternalLink("target-page"),
                  createInternalLink("missing-page"),
                ],
              },
            ],
          },
        },
      ],
    });

    const target = createPage({
      id: "target-page",
    });

    expect(() => validateSectionReferences([source, target])).toThrow(
      /Invalid page reference "missing-page"/,
    );
  });

  it("validates references across multiple sections", () => {
    const source = createPage({
      id: "source-page",
      sections: [
        {
          ...createRichTextParagraph("target-page"),
          id: "first-section",
        },
        {
          ...createRichTextParagraph("missing-page"),
          id: "second-section",
        },
      ],
    });

    const target = createPage({
      id: "target-page",
    });

    expect(() => validateSectionReferences([source, target])).toThrow(
      'Invalid page reference "missing-page" ' +
        "in en/source-page/second-section.",
    );
  });

  it("validates every card in a CardSlider", () => {
    const source = createPage({
      id: "source-page",
      sections: [
        {
          id: "test-slider",
          type: "card-slider",
          content: {
            title: "Test slider",
            cards: [
              {
                kind: "text",
                title: "First card",
                headline: "First headline",
                cta: createCta("target-page"),
              },
              {
                kind: "text",
                title: "Second card",
                headline: "Second headline",
              },
              {
                kind: "text",
                title: "Third card",
                headline: "Third headline",
                cta: createCta("missing-page"),
              },
            ],
            accessibility: {
              previousLabel: "Previous",
              nextLabel: "Next",
              viewportLabel: "Test slides",
            },
          },
        },
      ],
    });

    const target = createPage({
      id: "target-page",
    });

    expect(() => validateSectionReferences([source, target])).toThrow(
      "Path: section.content.cards[2].cta.pageId.",
    );
  });

  it("allows repeated references to the same page", () => {
    const source = createPage({
      id: "source-page",
      sections: [
        {
          ...createRichTextParagraph("target-page"),
          id: "first-section",
        },
        {
          ...createRichTextParagraph("target-page"),
          id: "second-section",
        },
      ],
    });

    const target = createPage({
      id: "target-page",
    });

    expect(() => validateSectionReferences([source, target])).not.toThrow();
  });
});

describe("Reference traversal edge cases", () => {
  it("handles nullable and optional section values", () => {
    const source = createPage({
      id: "source-page",
      sections: [
        {
          id: "test-image-hero",
          type: "image-hero",
          content: {
            title: "Test title",
            image: IMAGE,
          },
        },
      ],
    });

    expect(() => validateSectionReferences([source])).not.toThrow();
  });
});
