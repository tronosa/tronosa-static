import type { Locale } from "@/i18n/config";

export const BLOG_SLUGS = {
  "sr-Cyrl": "price-sa-izvora",
  "sr-Latn": "price-sa-izvora",
  en: "stories-from-the-spring",
} as const satisfies Record<Locale, string>;

export function getBlogSlug(locale: Locale): string {
  return BLOG_SLUGS[locale];
}

export function getBlogPath(locale: Locale): string {
  return `/${getBlogSlug(locale)}`;
}
