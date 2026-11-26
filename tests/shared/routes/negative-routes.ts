import { getLocalePrefix, locales } from "@/i18n/config";

import { getArticlePath, getLocalizedPath } from "@/lib/content/content-paths";

import type { ContentTestRoute, NegativeTestRoute } from "./types";

function createMissingPath(
  basePath: string,
  occupiedPaths: ReadonlySet<string>,
): string {
  let pathname = basePath;
  let suffix = 1;

  while (occupiedPaths.has(pathname)) {
    pathname = `${basePath}-${suffix}`;
    suffix++;
  }

  return pathname;
}

export function getNegativeTestRoutes(
  contentRoutes: readonly ContentTestRoute[],
): NegativeTestRoute[] {
  const occupiedPaths = new Set(contentRoutes.map((route) => route.pathname));

  return locales.flatMap((locale) => {
    const prefix = getLocalePrefix(locale);

    const missingPage = createMissingPath(
      `${prefix}/e2e-nonexistent-page`,
      occupiedPaths,
    );

    const missingArticle = createMissingPath(
      getLocalizedPath(
        locale,
        getArticlePath(locale, "e2e-nonexistent-article"),
      ),
      occupiedPaths,
    );

    return [
      {
        kind: "not-found",
        id: "missing-page",
        locale,
        pathname: missingPage,
        expectedStatus: 404,
      },
      {
        kind: "not-found",
        id: "missing-article",
        locale,
        pathname: missingArticle,
        expectedStatus: 404,
      },
    ];
  });
}
