import type { SectionType } from "@/content/schemas/section.schema";
import type { ContentEntry, PageEntry } from "./registry";

const SINGLETON_SECTION_TYPES = new Set<SectionType>([
  "journal-opening",
  "featured-chapter",
  "story-explorer",
  "journal-index",
  "source-closing",
  "article-hero",
  "article-metadata",
  "related-posts",
]);

type PageReference = {
  pageId: string;
  path: string;
};

function collectPageReferences(
  value: unknown,
  path: string,
  references: PageReference[],
): void {
  if (value === null || typeof value !== "object") {
    return;
  }

  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) {
      collectPageReferences(item, `${path}[${index}]`, references);
    }

    return;
  }

  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}.${key}`;

    if (key === "pageId" && typeof child === "string") {
      references.push({
        pageId: child,
        path: childPath,
      });

      continue;
    }

    collectPageReferences(child, childPath, references);
  }
}

export function validateSections(entry: ContentEntry): void {
  const ids = new Set<string>();
  const types = new Set<SectionType>();

  const contentIdentity = `${entry.locale}/${entry.data.id}`;

  for (const section of entry.data.content.sections) {
    if (ids.has(section.id)) {
      throw new Error(
        `[Content] Duplicate section ID "${section.id}" ` +
          `in ${contentIdentity}.`,
      );
    }

    if (SINGLETON_SECTION_TYPES.has(section.type) && types.has(section.type)) {
      throw new Error(
        `[Content] Section "${section.type}" can only appear once ` +
          `in ${contentIdentity}.`,
      );
    }

    ids.add(section.id);
    types.add(section.type);
  }
}

export function validateSectionReferences(
  entries: readonly ContentEntry[],
): void {
  const pages = new Map<string, PageEntry>();

  for (const entry of entries) {
    if (entry.kind === "page") {
      pages.set(`${entry.locale}:${entry.data.id}`, entry);
    }
  }

  for (const entry of entries) {
    for (const section of entry.data.content.sections) {
      const references: PageReference[] = [];

      collectPageReferences(section, "section", references);

      for (const reference of references) {
        const target = pages.get(`${entry.locale}:${reference.pageId}`);

        const source = `${entry.locale}/${entry.data.id}/${section.id}`;

        if (!target) {
          throw new Error(
            `[Content] Invalid page reference "${reference.pageId}" ` +
              `in ${source}. Path: ${reference.path}.`,
          );
        }

        if (
          entry.data.status === "published" &&
          target.data.status === "draft"
        ) {
          throw new Error(
            `[Content] Reference to draft page "${reference.pageId}" ` +
              `in ${source}. Path: ${reference.path}.`,
          );
        }
      }
    }
  }
}
