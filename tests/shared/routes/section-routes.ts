import {
  filterPublishedContent,
  loadContentRegistry,
} from "@/lib/content/content-loader";

import { getContentPath } from "@/lib/seo/urls";

import type { ContentTestRoute } from "./types";

type ContentEntry = ReturnType<typeof filterPublishedContent>[number];

type SectionType = ContentEntry["data"]["content"]["sections"][number]["type"];

export function getSectionTestRoutes(
  sectionType: SectionType,
): ContentTestRoute[] {
  const entries = filterPublishedContent(loadContentRegistry());

  const routes = entries
    .filter((entry) =>
      entry.data.content.sections.some(
        (section) => section.type === sectionType,
      ),
    )
    .map((entry): ContentTestRoute => ({
      kind: entry.kind,
      id: entry.data.id,
      locale: entry.locale,
      pathname: getContentPath(entry),
      expectedStatus: 200,
    }));

  if (routes.length === 0) {
    throw new Error(
      `Test route discovery failed: no published content contains section "${sectionType}".`,
    );
  }

  return routes;
}
