import { createTranslator } from "next-intl";

import { getDictionary } from "@/i18n/get-dictionary";

import type { ContentEntry } from "@/lib/content/registry";

import { getBlogUrl, getContentUrl, getLocaleHomeUrl } from "../urls";

export async function createBreadcrumbSchema(entry: ContentEntry) {
  if (entry.kind === "page" && entry.data.id === "home") {
    return null;
  }

  const messages = await getDictionary(entry.locale);

  const t = createTranslator({
    locale: entry.locale,
    messages,
    namespace: "Navigation",
  });

  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: t("home"),
      item: getLocaleHomeUrl(entry.locale),
    },
  ];

  if (entry.kind === "article") {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: t("blog"),
      item: getBlogUrl(entry.locale),
    });
  }

  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: entry.data.seo.title,
    item: getContentUrl(entry),
  });

  return {
    "@type": "BreadcrumbList",
    "@id": `${getContentUrl(entry)}#breadcrumb`,
    itemListElement: items,
  };
}
