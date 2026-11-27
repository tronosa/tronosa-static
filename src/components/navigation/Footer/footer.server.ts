import "server-only";

import type { Locale } from "@/i18n/config";

import { getContentHref } from "@/lib/content/content-paths";
import { getPublishedContent } from "@/lib/content/registry";

import { footerGroups, footerLegalPages } from "./footer.config";

type FooterPage =
  | (typeof footerGroups)[number]["pages"][number]
  | (typeof footerLegalPages)[number];

type ResolvedFooterLink<T extends FooterPage> = T & {
  href: string;
};

export function getFooterNavigation(locale: Locale) {
  const paths = new Map<string, string>();

  for (const entry of getPublishedContent()) {
    if (entry.kind !== "page" || entry.locale !== locale) {
      continue;
    }

    paths.set(entry.data.id, getContentHref(entry));
  }

  function resolveLinks<T extends FooterPage>(
    items: readonly T[],
  ): ResolvedFooterLink<T>[] {
    return items.flatMap((item) => {
      const href = paths.get(item.id);

      if (href === undefined) {
        return [];
      }

      return [
        {
          ...item,
          href,
        },
      ];
    });
  }

  const groups = footerGroups.flatMap((group) => {
    const links = resolveLinks<(typeof footerGroups)[number]["pages"][number]>(
      group.pages,
    );

    if (links.length === 0) {
      return [];
    }

    return [
      {
        id: group.id,
        translationKey: group.translationKey,
        links,
      },
    ];
  });

  return {
    groups,
    legalLinks: resolveLinks(footerLegalPages),
  };
}
