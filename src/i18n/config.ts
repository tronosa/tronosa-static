export const locales = ["sr-Latn", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sr-Latn";

export const localeConfig = {
  "sr-Latn": {
    name: "Srpski",
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
