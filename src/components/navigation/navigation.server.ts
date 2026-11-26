import "server-only";

import type { Locale } from "@/i18n/config";

import { getPublishedContent } from "@/lib/content/registry";

import { getContentHref } from "@/lib/content/content-paths";

import { navigationItems } from "./navigation.config";

export function getNavigationItems(locale: Locale) {
  const entries = getPublishedContent().filter(
    (entry) => entry.locale === locale,
  );

  const entriesWithPaths = entries.map((entry) => ({
    entry,
    href: getContentHref(entry),
  }));

  return navigationItems.flatMap((item) => {
    const target = entriesWithPaths.find(
      ({ entry }) => entry.kind === "page" && entry.data.id === item.id,
    );

    if (!target) {
      return [];
    }

    const relatedPaths =
      target.href === "/"
        ? []
        : entriesWithPaths
            .filter(({ href }) => href.startsWith(`${target.href}/`))
            .map(({ href }) => href);

    return [
      {
        ...item,
        href: target.href,
        relatedPaths,
      },
    ];
  });
}
