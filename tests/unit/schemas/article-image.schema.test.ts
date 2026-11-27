import { describe, expect, it } from "vitest";

import {
  articleImageContentSchema,
  articleImageSchema,
} from "@/components/sections/ArticleImage/article-image.schema";

const validImage = {
  src: "/assets/images/placeholder.webp",
  alt: "Natural spring water",
  width: 1200,
  height: 800,
};

describe("Article image content schema", () => {
  it("accepts a valid local image source", () => {
    const result = articleImageContentSchema.parse(validImage);

    expect(result.src).toBe(validImage.src);
  });

  it("accepts a valid HTTPS image source", () => {
    const src = "https://example.com/images/natural-origin.webp";

    const result = articleImageContentSchema.parse({
      ...validImage,
      src,
    });

    expect(result.src).toBe(src);
  });

  it.each([
    "http://example.com/image.webp",
    "ftp://example.com/image.webp",
    "javascript:alert(1)",
    "data:image/png;base64,example",
    "blob:https://example.com/image",
    "assets/blog/image.webp",
    "image.webp",
    "../assets/image.webp",
  ])("rejects an unsupported image source: %s", (src) => {
    const result = articleImageContentSchema.safeParse({
      ...validImage,
      src,
    });

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("Expected image validation to fail");
    }

    expect(result.error.issues).toContainEqual(
      expect.objectContaining({
        path: ["src"],
        message: "Image source must be a local path or HTTPS URL",
      }),
    );
  });

  it.each(["", "   "])("rejects an empty image source", (src) => {
    expect(
      articleImageContentSchema.safeParse({
        ...validImage,
        src,
      }).success,
    ).toBe(false);
  });

  it("trims the image source", () => {
    const result = articleImageContentSchema.parse({
      ...validImage,
      src: "  /assets/blog/image.webp  ",
    });

    expect(result.src).toBe("/assets/blog/image.webp");
  });

  it("trims the alternative text", () => {
    const result = articleImageContentSchema.parse({
      ...validImage,
      alt: "  Natural spring water  ",
    });

    expect(result.alt).toBe("Natural spring water");
  });

  it.each(["", "   "])("rejects empty alternative text", (alt) => {
    expect(
      articleImageContentSchema.safeParse({
        ...validImage,
        alt,
      }).success,
    ).toBe(false);
  });

  it("rejects missing alternative text", () => {
    expect(
      articleImageContentSchema.safeParse({
        ...validImage,
        alt: undefined,
      }).success,
    ).toBe(false);
  });

  it.each([
    { width: 0, height: 800 },
    { width: -1200, height: 800 },
    { width: 1200, height: 0 },
    { width: 1200, height: -800 },
    { width: 1200.5, height: 800 },
    { width: 1200, height: 800.5 },
  ])(
    "rejects invalid image dimensions: $width x $height",
    ({ width, height }) => {
      expect(
        articleImageContentSchema.safeParse({
          ...validImage,
          width,
          height,
        }).success,
      ).toBe(false);
    },
  );

  it("accepts an image without a caption", () => {
    const result = articleImageContentSchema.parse(validImage);

    expect(result.caption).toBeUndefined();
  });

  it("accepts and trims an image caption", () => {
    const result = articleImageContentSchema.parse({
      ...validImage,
      caption: "  Natural water source  ",
    });

    expect(result.caption).toBe("Natural water source");
  });

  it.each(["", "   "])("rejects an explicitly empty caption", (caption) => {
    expect(
      articleImageContentSchema.safeParse({
        ...validImage,
        caption,
      }).success,
    ).toBe(false);
  });

  it("defaults the image layout to wide", () => {
    const result = articleImageContentSchema.parse(validImage);

    expect(result.layout).toBe("wide");
  });

  it.each(["reading", "medium", "wide"] as const)(
    "accepts the %s image layout",
    (layout) => {
      const result = articleImageContentSchema.parse({
        ...validImage,
        layout,
      });

      expect(result.layout).toBe(layout);
    },
  );

  it("rejects an unsupported image layout", () => {
    expect(
      articleImageContentSchema.safeParse({
        ...validImage,
        layout: "fullscreen",
      }).success,
    ).toBe(false);
  });

  it("defaults image priority to false", () => {
    const result = articleImageContentSchema.parse(validImage);

    expect(result.priority).toBe(false);
  });

  it.each([true, false])(
    "preserves explicit image priority: %s",
    (priority) => {
      const result = articleImageContentSchema.parse({
        ...validImage,
        priority,
      });

      expect(result.priority).toBe(priority);
    },
  );
});

describe("Article image section schema", () => {
  const validSection = {
    id: "article-image",
    type: "article-image",
    content: validImage,
  };

  it("accepts a valid article image section", () => {
    const result = articleImageSchema.parse(validSection);

    expect(result).toEqual({
      id: "article-image",
      type: "article-image",
      content: {
        ...validImage,
        layout: "wide",
        priority: false,
      },
    });
  });

  it("trims the section ID", () => {
    const result = articleImageSchema.parse({
      ...validSection,
      id: "  article-image  ",
    });

    expect(result.id).toBe("article-image");
  });

  it.each(["", "   "])("rejects an empty section ID", (id) => {
    expect(
      articleImageSchema.safeParse({
        ...validSection,
        id,
      }).success,
    ).toBe(false);
  });

  it("rejects an incorrect section type", () => {
    expect(
      articleImageSchema.safeParse({
        ...validSection,
        type: "image-hero",
      }).success,
    ).toBe(false);
  });

  it("rejects missing section content", () => {
    expect(
      articleImageSchema.safeParse({
        ...validSection,
        content: undefined,
      }).success,
    ).toBe(false);
  });

  it("rejects invalid section content", () => {
    expect(
      articleImageSchema.safeParse({
        ...validSection,
        content: {
          ...validImage,
          width: 0,
        },
      }).success,
    ).toBe(false);
  });
});
