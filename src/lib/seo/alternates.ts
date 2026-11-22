import { defaultLocale } from "@/i18n/config";

import { getPublishedContent, type ContentEntry } from "@/lib/content/registry";

import { isCanonicalIndexable } from "./indexability";
import { getContentUrl } from "./urls";

export function getLanguageAlternates(
  entry: ContentEntry,
): Record<string, string> {
  if (!isCanonicalIndexable(entry)) {
    return {};
  }

  const translations = getPublishedContent().filter(
    (candidate) =>
      candidate.kind === entry.kind &&
      candidate.data.id === entry.data.id &&
      isCanonicalIndexable(candidate),
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
