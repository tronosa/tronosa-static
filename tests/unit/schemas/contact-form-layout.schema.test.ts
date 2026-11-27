import { describe, expect, it } from "vitest";

import {
  contactFormLayoutSchema,
  contactFormTopicSchema,
  contactFormTopicsSchema,
  contactFormContentSchema,
  contactFormSectionSchema,
} from "@/components/sections/ContactForm/contact-form.schema";

const baseContent = {
  title: "Test contact title",
  description: "Test contact description",
};

const topics = [
  {
    id: "first-topic",
    label: "First topic",
  },
  {
    id: "second-topic",
    label: "Second topic",
  },
];

describe("contactFormLayoutSchema", () => {
  it.each(["default", "editorial"] as const)(
    "accepts the %s layout",
    (layout) => {
      expect(contactFormLayoutSchema.parse(layout)).toBe(layout);
    },
  );

  it("rejects unsupported layouts", () => {
    expect(contactFormLayoutSchema.safeParse("unknown").success).toBe(false);
  });
});

describe("contactFormTopicSchema", () => {
  it("accepts valid topic content", () => {
    expect(contactFormTopicSchema.parse(topics[0])).toEqual(topics[0]);
  });

  it("trims topic labels", () => {
    expect(
      contactFormTopicSchema.parse({
        id: "test-topic",
        label: "  Test topic  ",
      }),
    ).toEqual({
      id: "test-topic",
      label: "Test topic",
    });
  });

  it.each([
    "",
    "Invalid Topic",
    "invalid_topic",
    "-invalid",
    "invalid-",
    "invalid--topic",
  ])("rejects invalid topic ID %j", (id) => {
    expect(
      contactFormTopicSchema.safeParse({
        id,
        label: "Test topic",
      }).success,
    ).toBe(false);
  });

  it.each(["", " ", "   "])("rejects empty topic label %j", (label) => {
    expect(
      contactFormTopicSchema.safeParse({
        id: "test-topic",
        label,
      }).success,
    ).toBe(false);
  });

  it("rejects unknown topic configuration fields", () => {
    expect(
      contactFormTopicSchema.safeParse({
        ...topics[0],
        unknown: true,
      }).success,
    ).toBe(false);
  });
});

describe("contactFormTopicsSchema", () => {
  it("preserves configured topic order", () => {
    expect(contactFormTopicsSchema.parse(topics)).toEqual(topics);
  });

  it("accepts one topic", () => {
    expect(contactFormTopicsSchema.safeParse([topics[0]]).success).toBe(true);
  });

  it("accepts six topics", () => {
    const values = Array.from({ length: 6 }, (_, index) => ({
      id: `topic-${index}`,
      label: `Topic ${index}`,
    }));

    expect(contactFormTopicsSchema.safeParse(values).success).toBe(true);
  });

  it("rejects empty topic collections", () => {
    expect(contactFormTopicsSchema.safeParse([]).success).toBe(false);
  });

  it("rejects more than six topics", () => {
    const values = Array.from({ length: 7 }, (_, index) => ({
      id: `topic-${index}`,
      label: `Topic ${index}`,
    }));

    expect(contactFormTopicsSchema.safeParse(values).success).toBe(false);
  });

  it("rejects duplicate topic identifiers", () => {
    expect(
      contactFormTopicsSchema.safeParse([
        {
          id: "duplicate-topic",
          label: "First topic",
        },
        {
          id: "duplicate-topic",
          label: "Second topic",
        },
      ]).success,
    ).toBe(false);
  });
});

describe("contactFormContentSchema", () => {
  it("preserves existing contact form content", () => {
    expect(contactFormContentSchema.parse(baseContent)).toEqual(baseContent);
  });

  it("accepts an optional eyebrow", () => {
    const content = {
      ...baseContent,
      eyebrow: "Test eyebrow",
    };

    expect(contactFormContentSchema.parse(content)).toEqual(content);
  });

  it("accepts an explicit default layout", () => {
    const content = {
      ...baseContent,
      layout: "default",
    };

    expect(contactFormContentSchema.parse(content)).toEqual(content);
  });

  it("accepts a complete editorial layout", () => {
    const content = {
      ...baseContent,
      layout: "editorial",
      decoration: true,
      topics,
    };

    expect(contactFormContentSchema.parse(content)).toEqual(content);
  });

  it("accepts an editorial layout without topics", () => {
    expect(
      contactFormContentSchema.safeParse({
        ...baseContent,
        layout: "editorial",
      }).success,
    ).toBe(true);
  });

  it.each([true, false])("accepts decoration value %s", (decoration) => {
    expect(
      contactFormContentSchema.safeParse({
        ...baseContent,
        layout: "editorial",
        decoration,
      }).success,
    ).toBe(true);
  });

  it("rejects invalid decoration values", () => {
    expect(
      contactFormContentSchema.safeParse({
        ...baseContent,
        decoration: "true",
      }).success,
    ).toBe(false);
  });

  it("rejects obsolete hero configuration", () => {
    expect(
      contactFormContentSchema.safeParse({
        ...baseContent,
        intro: {
          title: "Invalid hero",
        },
      }).success,
    ).toBe(false);
  });

  it("rejects a missing title", () => {
    expect(
      contactFormContentSchema.safeParse({
        description: baseContent.description,
      }).success,
    ).toBe(false);
  });

  it("rejects a missing description", () => {
    expect(
      contactFormContentSchema.safeParse({
        title: baseContent.title,
      }).success,
    ).toBe(false);
  });
});

describe("contactFormSectionSchema", () => {
  it("accepts an editorial contact form section", () => {
    const section = {
      id: "test-contact",
      type: "contact-form",
      content: {
        ...baseContent,
        layout: "editorial",
        decoration: true,
        topics,
      },
    };

    expect(contactFormSectionSchema.parse(section)).toEqual(section);
  });

  it("rejects an unsupported section type", () => {
    expect(
      contactFormSectionSchema.safeParse({
        id: "test-contact",
        type: "unknown",
        content: baseContent,
      }).success,
    ).toBe(false);
  });

  it("rejects an empty section identifier", () => {
    expect(
      contactFormSectionSchema.safeParse({
        id: "",
        type: "contact-form",
        content: baseContent,
      }).success,
    ).toBe(false);
  });
});
