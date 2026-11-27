import { describe, expect, it } from "vitest";

import {
  textHeroContentSchema,
  textHeroSectionSchema,
} from "@/components/sections/TextHero/text-hero.schema";

const content = {
  eyebrow: "Test eyebrow",
  title: "Test hero",
  description: "Test description",
  alignment: "left",
} as const;

describe("textHeroContentSchema", () => {
  it("accepts complete content", () => {
    expect(textHeroContentSchema.parse(content)).toEqual(content);
  });

  it("accepts minimal content", () => {
    expect(
      textHeroContentSchema.parse({
        title: "Test hero",
      }),
    ).toEqual({
      title: "Test hero",
      alignment: "left",
    });
  });

  it("defaults to left alignment", () => {
    const result = textHeroContentSchema.parse({
      title: "Test hero",
    });

    expect(result.alignment).toBe("left");
  });

  it.each(["left", "center"] as const)("accepts %s alignment", (alignment) => {
    const result = textHeroContentSchema.parse({
      ...content,
      alignment,
    });

    expect(result.alignment).toBe(alignment);
  });

  it("rejects unsupported alignment", () => {
    expect(
      textHeroContentSchema.safeParse({
        ...content,
        alignment: "right",
      }).success,
    ).toBe(false);
  });

  it("trims text content", () => {
    expect(
      textHeroContentSchema.parse({
        eyebrow: "  Test eyebrow  ",
        title: "  Test hero  ",
        description: "  Test description  ",
      }),
    ).toEqual(content);
  });

  it("rejects a missing title", () => {
    expect(textHeroContentSchema.safeParse({}).success).toBe(false);
  });

  it.each(["", " ", "   "])("rejects an empty title %j", (title) => {
    expect(
      textHeroContentSchema.safeParse({
        ...content,
        title,
      }).success,
    ).toBe(false);
  });

  it.each(["eyebrow", "description"] as const)(
    "rejects empty optional field %s when provided",
    (field) => {
      expect(
        textHeroContentSchema.safeParse({
          ...content,
          [field]: "",
        }).success,
      ).toBe(false);
    },
  );

  it("rejects unknown configuration fields", () => {
    expect(
      textHeroContentSchema.safeParse({
        ...content,
        image: "/test/hero.webp",
      }).success,
    ).toBe(false);
  });
});

describe("textHeroSectionSchema", () => {
  it("accepts a text hero section", () => {
    const section = {
      id: "test-hero",
      type: "text-hero",
      content,
    };

    expect(textHeroSectionSchema.parse(section)).toEqual(section);
  });

  it("rejects an invalid section type", () => {
    expect(
      textHeroSectionSchema.safeParse({
        id: "test-hero",
        type: "invalid-section",
        content,
      }).success,
    ).toBe(false);
  });

  it("rejects an empty section identifier", () => {
    expect(
      textHeroSectionSchema.safeParse({
        id: "",
        type: "text-hero",
        content,
      }).success,
    ).toBe(false);
  });

  it("rejects invalid section content", () => {
    expect(
      textHeroSectionSchema.safeParse({
        id: "test-hero",
        type: "text-hero",
        content: {},
      }).success,
    ).toBe(false);
  });
});
