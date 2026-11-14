import { describe, expect, it } from "vitest";

import {
  defaultLocale,
  getLocalePrefix,
  localeConfig,
  locales,
} from "./config";

describe("Locale configuration", () => {
  it("has unique supported locales", () => {
    expect(new Set(locales).size).toBe(locales.length);
  });

  it("includes the default locale", () => {
    expect(locales).toContain(defaultLocale);
  });

  it("has metadata for every locale", () => {
    for (const locale of locales) {
      expect(localeConfig[locale].name).toBeTruthy();
      expect(localeConfig[locale].openGraphLocale).toBeTruthy();
    }
  });

  it("uses no prefix for the default locale", () => {
    expect(getLocalePrefix(defaultLocale)).toBe("");
  });

  it("prefixes every non-default locale", () => {
    for (const locale of locales) {
      expect(getLocalePrefix(locale)).toBe(
        locale === defaultLocale ? "" : `/${locale}`,
      );
    }
  });
});
