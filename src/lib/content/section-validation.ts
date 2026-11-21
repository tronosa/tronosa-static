import type { SectionType } from "@/content/schemas/section.schema";
import type { ContentEntry } from "./registry";

const SINGLETON_SECTION_TYPES = new Set<SectionType>([
  "journal-opening",
  "featured-chapter",
  "story-explorer",
  "journal-index",
  "source-closing",
  "article-hero",
  "article-metadata",
  "share-article",
  "related-posts",
]);

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
  const pages = new Set(
    entries
      .filter((entry) => entry.kind === "page")
      .map((entry) => `${entry.locale}:${entry.data.id}`),
  );

  for (const entry of entries) {
    for (const section of entry.data.content.sections) {
      if (section.type !== "source-closing") {
        continue;
      }

      const { pageId } = section.content;

      const reference = `${entry.locale}:${pageId}`;

      if (!pages.has(reference)) {
        throw new Error(
          `[Content] Invalid page reference "${pageId}" ` +
            `in ${entry.locale}/${entry.data.id}/${section.id}.`,
        );
      }
    }
  }
}
