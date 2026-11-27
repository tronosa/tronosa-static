import "server-only";

import type { Locale } from "@/i18n/config";

import { getContentHref } from "@/lib/content/content-paths";
import { getPublishedContent } from "@/lib/content/registry";

import { navigationItems } from "./navigation.config";

export function getNavigationItems(locale: Locale) {
  const entries = getPublishedContent()
    .filter((entry) => entry.locale === locale)
    .map((entry) => ({
      kind: entry.kind,
      id: entry.data.id,
      href: getContentHref(entry),
    }));

  const pages = new Map(
    entries
      .filter((entry) => entry.kind === "page")
      .map((entry) => [entry.id, entry]),
  );

  return navigationItems.flatMap((item) => {
    const target = pages.get(item.id);

    if (!target) {
      return [];
    }

    const relatedPaths =
      target.href === "/"
        ? []
        : entries
            .filter((entry) => entry.href.startsWith(`${target.href}/`))
            .map((entry) => entry.href);

    return [
      {
        ...item,
        href: target.href,
        relatedPaths,
      },
    ];
  });
}
