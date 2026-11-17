export const locales = ["sr-Cyrl", "sr-Latn", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sr-Cyrl";

export const localeConfig = {
  "sr-Cyrl": {
    name: "Српски (ћирилица)",
    openGraphLocale: "sr_RS",
  },
  "sr-Latn": {
    name: "Srpski (latinica)",
    openGraphLocale: "sr_RS",
  },
  en: {
    name: "English",
    openGraphLocale: "en_US",
  },
} as const satisfies Record<
  Locale,
  {
    name: string;
    openGraphLocale: string;
  }
>;

export function isDefaultLocale(locale: Locale): boolean {
  return locale === defaultLocale;
}

export function getLocalePrefix(locale: Locale): string {
  return isDefaultLocale(locale) ? "" : `/${locale}`;
}
