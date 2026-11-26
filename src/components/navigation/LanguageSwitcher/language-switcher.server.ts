import "server-only";

import { getPublishedContent } from "@/lib/content/registry";

import { getContentHref } from "@/lib/content/content-paths";

import type { LanguageAlternates, LanguageRoutes } from "./types";

export function getLanguageRoutes(): LanguageRoutes {
  const entries = getPublishedContent();

  const groups = new Map<string, LanguageAlternates>();

  const routes: LanguageRoutes = {};

  for (const entry of entries) {
    const identity = `${entry.kind}:${entry.data.id}`;

    const pathname = getContentHref(entry);

    const key = `${entry.locale}:${pathname}`;

    let alternatives = groups.get(identity);

    if (!alternatives) {
      alternatives = {};

      groups.set(identity, alternatives);
    }

    alternatives[entry.locale] = pathname;

    routes[key] = alternatives;
  }

  return routes;
}
