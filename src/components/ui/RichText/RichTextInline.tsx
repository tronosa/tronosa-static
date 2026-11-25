import { Fragment, type ReactNode } from "react";

import { hasLocale } from "next-intl";
import { getLocale } from "next-intl/server";

import type { RichTextLeaf } from "@/content/schemas/rich-text.schema";

import { locales } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { getContentById } from "@/lib/content/registry";

import {
  richTextInlineVariants,
  richTextLinkVariants,
} from "./rich-text.variants";

import type { RichTextInlineProps } from "./types";

function renderLeaf(leaf: RichTextLeaf): ReactNode {
  let content: ReactNode = leaf.text;

  if (leaf.bold) {
    content = <strong>{content}</strong>;
  }

  if (leaf.italic) {
    content = <em>{content}</em>;
  }

  if (leaf.underline || (leaf.color && leaf.color !== "default")) {
    content = (
      <span
        className={richTextInlineVariants({
          color: leaf.color,
          underline: leaf.underline,
        })}
      >
        {content}
      </span>
    );
  }

  return content;
}

export async function RichTextInline({ content }: RichTextInlineProps) {
  const hasInternalLinks = content.some(
    (item) => "type" in item && item.type === "link",
  );

  const locale = hasInternalLinks ? await getLocale() : undefined;

  if (locale !== undefined && !hasLocale(locales, locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  return (
    <>
      {content.map((item, index) => {
        if ("type" in item && item.type === "link") {
          if (!locale) {
            throw new Error("Locale is required for internal links.");
          }

          const entry = getContentById("page", locale, item.pageId);

          if (!entry || entry.kind !== "page") {
            throw new Error(
              `Page "${item.pageId}" not found for locale "${locale}".`,
            );
          }

          const href = entry.data.slug ? `/${entry.data.slug}` : "/";

          return (
            <Link
              key={index}
              href={href}
              prefetch={false}
              className={richTextLinkVariants()}
            >
              {item.text}
            </Link>
          );
        }

        if ("type" in item && item.type === "external-link") {
          return (
            <a
              key={index}
              href={item.href}
              target={item.newTab ? "_blank" : undefined}
              rel={item.newTab ? "noopener noreferrer" : undefined}
              className={richTextLinkVariants()}
            >
              {item.text}
            </a>
          );
        }

        return <Fragment key={index}>{renderLeaf(item)}</Fragment>;
      })}
    </>
  );
}
