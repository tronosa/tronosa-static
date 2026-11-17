import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { LanguageSwitcher } from "../LanguageSwitcher";
import { navigationItems } from "../navigation.config";

import { MobileNavigationDialog } from "./MobileNavigationDialog";
import { mobileNavigationLinkVariants } from "./mobile-navigation.variants";

export async function MobileNavigation() {
  const [t, tHeader] = await Promise.all([
    getTranslations("Navigation"),
    getTranslations("Header"),
  ]);

  return (
    <div className="flex items-center gap-3 lg:hidden">
      <LanguageSwitcher />

      <MobileNavigationDialog
        title={tHeader("mobileMenu.title")}
        openLabel={tHeader("mobileMenu.openLabel")}
        closeLabel={tHeader("mobileMenu.closeLabel")}
      >
        <nav aria-label={tHeader("navigation.ariaLabel")}>
          <ul className="flex flex-col">
            {navigationItems.map((item, index) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={mobileNavigationLinkVariants()}
                >
                  <span className="flex items-baseline gap-4">
                    <span
                      aria-hidden="true"
                      className="text-xs font-normal tabular-nums text-foreground-muted"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span>{t(item.translationKey)}</span>
                  </span>

                  <svg
                    aria-hidden="true"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                  >
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </MobileNavigationDialog>
    </div>
  );
}
