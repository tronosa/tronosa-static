import { z } from "zod";

export const richTextColorSchema = z.enum([
  "default",
  "primary",
  "secondary",
  "accent",
]);

export const richTextLeafSchema = z.object({
  text: z.string().min(1),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  color: richTextColorSchema.optional(),
});

export const richTextInternalLinkSchema = z.object({
  type: z.literal("link"),
  text: z.string().min(1),
  pageId: z.string().trim().min(1),
});

export const richTextExternalLinkSchema = z.object({
  type: z.literal("external-link"),
  text: z.string().min(1),
  href: z
    .url()
    .refine(
      (value) => value.startsWith("https://"),
      "External links must use HTTPS",
    ),
  newTab: z.boolean().default(false),
});

export const richTextInlineElementSchema = z.union([
  richTextInternalLinkSchema,
  richTextExternalLinkSchema,
  richTextLeafSchema,
]);

export const richTextInlineSchema = z.array(richTextInlineElementSchema).min(1);

export const richTextParagraphSchema = z.object({
  type: z.literal("paragraph"),
  children: richTextInlineSchema,
});

export const richTextHeadingSchema = z
  .object({
    type: z.literal("heading"),
    level: z.union([z.literal(2), z.literal(3), z.literal(4)]),
    children: richTextInlineSchema,
  })
  .refine(
    ({ children }) => children.some(({ text }) => text.trim().length > 0),
    {
      message: "Heading must contain non-whitespace text.",
      path: ["children"],
    },
  );

export const richTextListSchema = z.object({
  type: z.literal("list"),
  ordered: z.boolean().default(false),
  items: z.array(richTextInlineSchema).min(1),
});

export const richTextBlockSchema = z.discriminatedUnion("type", [
  richTextParagraphSchema,
  richTextHeadingSchema,
  richTextListSchema,
]);

export const richTextSchema = z
  .array(richTextBlockSchema)
  .min(1)
  .superRefine((blocks, context) => {
    let previousLevel: number | undefined;

    for (const [index, block] of blocks.entries()) {
      if (block.type !== "heading") {
        continue;
      }

      if (previousLevel !== undefined && block.level > previousLevel + 1) {
        context.addIssue({
          code: "custom",
          path: [index, "level"],
          message:
            `Invalid heading hierarchy: H${previousLevel} ` +
            `cannot be followed directly by H${block.level}.`,
        });
      }

      previousLevel = block.level;
    }
  });

export type RichTextColor = z.infer<typeof richTextColorSchema>;
export type RichTextLeaf = z.infer<typeof richTextLeafSchema>;

export type RichTextInternalLink = z.infer<typeof richTextInternalLinkSchema>;

export type RichTextExternalLink = z.infer<typeof richTextExternalLinkSchema>;

export type RichTextInline = z.infer<typeof richTextInlineSchema>;
export type RichTextBlock = z.infer<typeof richTextBlockSchema>;
export type RichTextContent = z.infer<typeof richTextSchema>;
