import { getContentById } from "@/lib/content/registry";

import {
  standardPageSchema,
  type StandardPage,
} from "@/content/schemas/page.schema";

import type { Locale } from "@/i18n/config";
import type { ContentEntry } from "@/lib/content/registry";

export const SITE_URL = "https://example.com";

export type PageEntry = Extract<ContentEntry, { kind: "page" }>;

interface CreatePageEntryOptions {
  locale?: Locale;
  data?: Partial<StandardPage>;
  seo?: Partial<StandardPage["seo"]>;
}

export function createPageEntry({
  locale = "en",
  data = {},
  seo = {},
}: CreatePageEntryOptions = {}): PageEntry {
  const fixture = getContentById("page", locale, "home");

  if (!fixture || fixture.kind !== "page") {
    throw new Error(`Missing home page fixture for locale: ${locale}`);
  }

  const standardPage = standardPageSchema.parse(fixture.data);

  return {
    kind: "page",
    locale,
    data: {
      ...structuredClone(standardPage),
      id: "test-page",
      slug: "test-page",
      ...data,
      seo: {
        ...structuredClone(standardPage.seo),
        title: "Test page",
        description: "Test page description",
        index: true,
        follow: true,
        canonical: undefined,
        openGraph: undefined,
        twitter: undefined,
        ...seo,
      },
    },
  };
}
