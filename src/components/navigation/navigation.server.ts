import "server-only";

import type { Locale } from "@/i18n/config";

import { getContentById, getPublishedPosts } from "@/lib/content/registry";

import { navigationItems } from "./navigation.config";

export function getNavigationItems(locale: Locale) {
  const articlePaths = getPublishedPosts(locale).map(
    ({ data }) => `/blog/${data.slug}`,
  );

  return navigationItems.flatMap((item) => {
    const entry = getContentById("page", locale, item.id);

    if (!entry) {
      return [];
    }

    return [
      {
        ...item,
        href: entry.data.slug ? `/${entry.data.slug}` : "/",
        relatedPaths: item.id === "blog" ? articlePaths : [],
      },
    ];
  });
}
