import type { Article } from "@/content/schemas/article.schema";

import type {
  RichTextBlock,
  RichTextInline,
} from "@/content/schemas/rich-text.schema";

import { calculateReadingTime, type ReadingTimeResult } from "./reading-time";

function extractInlineText(content: RichTextInline): string {
  return content.map((element) => element.text).join("");
}

function extractBlockText(block: RichTextBlock): string {
  switch (block.type) {
    case "paragraph":
    case "heading":
      return extractInlineText(block.children);

    case "list":
      return block.items.map(extractInlineText).join("\n");
  }
}

export function extractArticleText(article: Article): string[] {
  const content: string[] = [];

  for (const section of article.content.sections) {
    switch (section.type) {
      case "article-hero": {
        content.push(
          section.content.title
            ? extractInlineText(section.content.title)
            : article.preview.title,

          article.preview.description,
        );

        break;
      }

      case "content-section": {
        content.push(...section.content.blocks.map(extractBlockText));

        break;
      }

      default:
        break;
    }
  }

  return content;
}

export function calculateArticleReadingTime(
  article: Article,
  locale: string,
): ReadingTimeResult {
  return calculateReadingTime(extractArticleText(article), locale);
}
