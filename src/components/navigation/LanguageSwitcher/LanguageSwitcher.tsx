import { hasLocale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";

import { LanguageSwitcherDialog } from "./LanguageSwitcherDialog";
import { getLanguageRoutes } from "./language-switcher.server";

export async function LanguageSwitcher() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Header"),
  ]);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const routes = getLanguageRoutes();

  const currentShortLabel = t(`languageShortLabels.${locale}`);
  const currentLanguage = t(`languages.${locale}`);

  const languages = routing.locales.map((availableLocale) => {
    const label = t(`languages.${availableLocale}`);

    return {
      locale: availableLocale,
      label,
      accessibleLabel: t("languageSwitcher.switchTo", {
        language: label,
      }),
    };
  });

  return (
    <LanguageSwitcherDialog
      routes={routes}
      locale={locale}
      languages={languages}
      currentShortLabel={currentShortLabel}
      accessibleLabel={`${currentShortLabel} — ${t(
        "languageSwitcher.currentLanguage",
        {
          language: currentLanguage,
        },
      )}`}
      title={t("languageSwitcher.label")}
      closeLabel={t("mobileMenu.closeLabel")}
    />
  );
}
