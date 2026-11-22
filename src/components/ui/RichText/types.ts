import type {
  RichTextContent,
  RichTextInline as RichTextInlineContent,
} from "@/content/schemas/rich-text.schema";

export interface RichTextProps {
  content: RichTextContent;
  className?: string;
}

export interface RichTextInlineProps {
  content: RichTextInlineContent;
}
