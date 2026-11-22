import { Fragment } from "react";

import { Typography } from "@/components/ui/Typography";
import type { RichTextBlock } from "@/content/schemas/rich-text.schema";

import { RichTextInline } from "./RichTextInline";
import type { RichTextProps } from "./types";

function renderBlock(block: RichTextBlock) {
  switch (block.type) {
    case "paragraph":
      return (
        <Typography as="p" variant="body">
          <RichTextInline content={block.children} />
        </Typography>
      );

    case "heading": {
      const heading = `h${block.level}` as const;

      return (
        <Typography as={heading} variant={heading}>
          <RichTextInline content={block.children} />
        </Typography>
      );
    }

    case "list": {
      const List = block.ordered ? "ol" : "ul";

      return (
        <List
          className={
            block.ordered
              ? "list-decimal space-y-2 ps-6"
              : "list-disc space-y-2 ps-6"
          }
        >
          {block.items.map((item, index) => (
            <Typography key={index} as="li" variant="body">
              <RichTextInline content={item} />
            </Typography>
          ))}
        </List>
      );
    }
  }
}

export function RichText({ content, className }: RichTextProps) {
  return (
    <div className={className}>
      {content.map((block, index) => (
        <Fragment key={index}>{renderBlock(block)}</Fragment>
      ))}
    </div>
  );
}
