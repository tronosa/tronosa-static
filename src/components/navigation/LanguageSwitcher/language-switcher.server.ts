import "server-only";

import { getPublishedContent } from "@/lib/content/registry";

import type { LanguageRoutes } from "./types";

export function getLanguageRoutes(): LanguageRoutes {
  const entries = getPublishedContent();
  const routes: LanguageRoutes = {};

  for (const entry of entries) {
    const pathname = getPathname(entry);
    const key = `${entry.locale}:${pathname}`;

    routes[key] = {};

    for (const alternate of entries) {
      if (
        alternate.kind === entry.kind &&
        alternate.data.id === entry.data.id
      ) {
        routes[key][alternate.locale] = getPathname(alternate);
      }
    }
  }

  return routes;
}

function getPathname(
  entry: ReturnType<typeof getPublishedContent>[number],
): string {
  const slug = entry.data.slug;

  if (entry.kind === "article") {
    return `/blog/${slug}`;
  }

  return slug ? `/${slug}` : "/";
}
