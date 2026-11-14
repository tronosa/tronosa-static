import { defaultLocale } from "@/i18n/config";

import { getPublishedContent, type ContentEntry } from "@/lib/content/registry";

import { getContentUrl } from "./urls";

function isIndexable(entry: ContentEntry): boolean {
  return entry.data.seo.index && !entry.data.seo.canonical;
}

export function getLanguageAlternates(
  entry: ContentEntry,
): Record<string, string> {
  const translations = getPublishedContent().filter(
    (candidate) =>
      candidate.kind === entry.kind &&
      candidate.data.id === entry.data.id &&
      isIndexable(candidate),
  );

  const languages = Object.fromEntries(
    translations.map((translation) => [
      translation.locale,
      getContentUrl(translation),
    ]),
  );

  const defaultTranslation = translations.find(
    (translation) => translation.locale === defaultLocale,
  );

  if (defaultTranslation) {
    languages["x-default"] = getContentUrl(defaultTranslation);
  }

  return languages;
}
