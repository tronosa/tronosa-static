import { describe, expect, it } from "vitest";

import {
  richTextHeadingSchema,
  richTextSchema,
} from "@/content/schemas/rich-text.schema";

function heading(level: number, text = "Section title") {
  return {
    type: "heading" as const,
    level,
    children: [{ text }],
  };
}

function paragraph(text = "Paragraph content") {
  return {
    type: "paragraph" as const,
    children: [{ text }],
  };
}

function list() {
  return {
    type: "list" as const,
    ordered: false,
    items: [[{ text: "List item" }]],
  };
}

describe("Rich text accessibility", () => {
  describe("Accessible heading content", () => {
    it.each([2, 3, 4])("accepts a valid H%i heading", (level) => {
      expect(richTextHeadingSchema.safeParse(heading(level)).success).toBe(
        true,
      );
    });

    it.each([0, 1, 5, 6, 7, 2.5])(
      "rejects unsupported heading level %s",
      (level) => {
        expect(richTextHeadingSchema.safeParse(heading(level)).success).toBe(
          false,
        );
      },
    );

    it.each([" ", "   ", "\t", "\n", "\r\n", "\u00a0"])(
      "rejects a whitespace-only heading: %j",
      (text) => {
        const result = richTextHeadingSchema.safeParse(heading(2, text));

        expect(result.success).toBe(false);

        if (!result.success) {
          expect(result.error.issues).toContainEqual(
            expect.objectContaining({
              path: ["children"],
              message: "Heading must contain non-whitespace text.",
            }),
          );
        }
      },
    );

    it("rejects an empty heading", () => {
      expect(richTextHeadingSchema.safeParse(heading(2, "")).success).toBe(
        false,
      );
    });

    it("rejects multiple whitespace-only inline elements", () => {
      const result = richTextHeadingSchema.safeParse({
        type: "heading",
        level: 2,
        children: [
          { text: " " },
          { text: "\t", bold: true },
          { text: "\n", italic: true },
        ],
      });

      expect(result.success).toBe(false);
    });

    it("accepts whitespace around valid inline text", () => {
      const value = {
        type: "heading",
        level: 2,
        children: [
          { text: " " },
          { text: "Natural water", bold: true },
          { text: " " },
        ],
      };

      expect(richTextHeadingSchema.parse(value)).toEqual(value);
    });

    it("preserves whitespace between formatted inline elements", () => {
      const value = {
        type: "heading",
        level: 2,
        children: [
          { text: "Natural " },
          { text: "mineral", bold: true },
          { text: " water" },
        ],
      };

      expect(richTextHeadingSchema.parse(value)).toEqual(value);
    });

    it.each([
      "Природна минерална вода",
      "Prirodna mineralna voda",
      "Natural mineral water",
    ])("accepts localized heading text: %s", (text) => {
      expect(richTextHeadingSchema.safeParse(heading(2, text)).success).toBe(
        true,
      );
    });

    it("accepts a heading containing an internal link", () => {
      const result = richTextHeadingSchema.safeParse({
        type: "heading",
        level: 2,
        children: [
          {
            type: "link",
            pageId: "about",
            text: "About our source",
          },
        ],
      });

      expect(result.success).toBe(true);
    });

    it("rejects a whitespace-only internal link heading", () => {
      const result = richTextHeadingSchema.safeParse({
        type: "heading",
        level: 2,
        children: [
          {
            type: "link",
            pageId: "about",
            text: " ",
          },
        ],
      });

      expect(result.success).toBe(false);
    });

    it("accepts a heading containing an external link", () => {
      const result = richTextHeadingSchema.safeParse({
        type: "heading",
        level: 2,
        children: [
          {
            type: "external-link",
            href: "https://example.com",
            text: "Additional information",
          },
        ],
      });

      expect(result.success).toBe(true);
    });

    it("rejects a whitespace-only external link heading", () => {
      const result = richTextHeadingSchema.safeParse({
        type: "heading",
        level: 2,
        children: [
          {
            type: "external-link",
            href: "https://example.com",
            text: " ",
          },
        ],
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Heading hierarchy", () => {
    it.each([
      [2],
      [3],
      [4],
      [2, 3],
      [3, 4],
      [2, 3, 4],
      [2, 2, 2],
      [3, 3],
      [4, 4],
      [2, 3, 2],
      [2, 3, 4, 2],
      [4, 3, 2],
      [4, 2],
      [2, 3, 4, 3, 4, 2],
    ])("accepts valid heading sequence %j", (...levels) => {
      const blocks = levels.map((level) => heading(level));

      expect(richTextSchema.safeParse(blocks).success).toBe(true);
    });

    it("rejects a skipped heading level", () => {
      const result = richTextSchema.safeParse([heading(2), heading(4)]);

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: [1, "level"],
            message:
              "Invalid heading hierarchy: H2 " +
              "cannot be followed directly by H4.",
          }),
        );
      }
    });

    it("rejects a skipped level after returning to H2", () => {
      const result = richTextSchema.safeParse([
        heading(2),
        heading(3),
        heading(4),
        heading(2),
        heading(4),
      ]);

      expect(result.success).toBe(false);
    });

    it("reports multiple hierarchy violations", () => {
      const result = richTextSchema.safeParse([
        heading(2),
        heading(4),
        heading(2),
        heading(4),
      ]);

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues).toHaveLength(2);

        expect(result.error.issues.map(({ path }) => path)).toEqual([
          [1, "level"],
          [3, "level"],
        ]);
      }
    });

    it("does not reset hierarchy after a paragraph", () => {
      expect(
        richTextSchema.safeParse([heading(2), paragraph(), heading(4)]).success,
      ).toBe(false);
    });

    it("does not reset hierarchy after a list", () => {
      expect(
        richTextSchema.safeParse([heading(2), list(), heading(4)]).success,
      ).toBe(false);
    });

    it("accepts valid headings separated by paragraphs and lists", () => {
      expect(
        richTextSchema.safeParse([
          heading(2),
          paragraph(),
          heading(3),
          list(),
          heading(4),
          paragraph(),
          heading(2),
        ]).success,
      ).toBe(true);
    });

    it("accepts content without headings", () => {
      expect(
        richTextSchema.safeParse([paragraph(), list(), paragraph()]).success,
      ).toBe(true);
    });

    it("accepts paragraphs before the first local heading", () => {
      expect(
        richTextSchema.safeParse([paragraph(), heading(3), paragraph()])
          .success,
      ).toBe(true);
    });
  });
});
