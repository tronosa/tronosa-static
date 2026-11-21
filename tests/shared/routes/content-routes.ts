import {
  filterPublishedContent,
  loadContentRegistry,
} from "@/lib/content/content-loader";

import { locales } from "@/i18n/config";

import { getContentPath } from "@/lib/seo/urls";

import type { ContentTestRoute } from "./types";

export function getContentTestRoutes(): ContentTestRoute[] {
  const entries = filterPublishedContent(loadContentRegistry());

  const routes = entries.map((entry): ContentTestRoute => ({
    kind: entry.kind,
    id: entry.data.id,
    locale: entry.locale,
    pathname: getContentPath(entry),
    expectedStatus: 200,
  }));

  if (routes.length === 0) {
    throw new Error(
      "Test route discovery failed: no published content was found.",
    );
  }

  for (const locale of locales) {
    const homeRoutes = routes.filter(
      (route) =>
        route.kind === "page" && route.id === "home" && route.locale === locale,
    );

    if (homeRoutes.length !== 1) {
      throw new Error(
        `Expected exactly one home route for locale "${locale}".`,
      );
    }
  }

  return routes;
}
