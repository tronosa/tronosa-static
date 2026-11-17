import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

import { LanguageSwitcher } from "../LanguageSwitcher";
import { getNavigationItems } from "../navigation.server";
import type { Locale } from "@/i18n/config";
import { DesktopNavigationProps } from "./types";
import { desktopNavigationLinkVariants } from "./desktop-navigation.variants";

export async function DesktopNavigation({
  activePage,
}: DesktopNavigationProps) {
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
        {navigationItems.map((item) => {
          const active = activePage === item.id;

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={desktopNavigationLinkVariants({ active })}
              >
                {t(item.translationKey)}

                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute inset-x-0 bottom-2 h-0.5",
                    "origin-center rounded-full bg-accent",
                    "transition-transform origin-left duration-300 ease-out",
                    "motion-reduce:transition-none",
                    active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>

      <LanguageSwitcher />
    </nav>
  );
}
