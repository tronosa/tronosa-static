import { getLocale, getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/config";

import { LanguageSwitcher } from "../LanguageSwitcher";
import { NavigationLink } from "../NavigationLink";

import { getNavigationItems } from "../navigation.server";

export async function DesktopNavigation() {
  const [locale, t, tHeader] = await Promise.all([
    getLocale(),
    getTranslations("Navigation"),
    getTranslations("Header"),
  ]);

  const navigationItems = getNavigationItems(locale as Locale);

  return (
    <nav
      aria-label={tHeader("navigation.ariaLabel")}
      className="hidden items-center gap-8 lg:flex"
    >
      <ul className="flex items-center gap-7">
        {navigationItems.map((item) => (
          <li key={item.id}>
            <NavigationLink
              href={item.href}
              relatedPaths={item.relatedPaths}
              variant="desktop"
            >
              {t(item.translationKey)}
            </NavigationLink>
          </li>
        ))}
      </ul>

      <LanguageSwitcher />
    </nav>
  );
}
