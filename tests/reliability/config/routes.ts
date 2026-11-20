import { SharedArray } from "k6/data";

interface PrerenderManifest {
  routes: Record<string, unknown>;
}

export interface ReliabilityRoute {
  path: string;
  kind: "page" | "resource";
}

const defaultLocalePrefix = "/sr-Cyrl";

function normalizePath(path: string): string {
  if (path === defaultLocalePrefix) {
    return "/";
  }

  if (path.startsWith(`${defaultLocalePrefix}/`)) {
    return path.slice(defaultLocalePrefix.length);
  }

  return path;
}

function isInternalRoute(path: string): boolean {
  return path.startsWith("/_");
}

function isResource(path: string): boolean {
  return /\.[a-z0-9]+$/i.test(path);
}

export const routes = new SharedArray<ReliabilityRoute>(
  "reliability-routes",
  () => {
    const manifest = JSON.parse(
      open(import.meta.resolve("../../../.next/prerender-manifest.json")),
    ) as PrerenderManifest;

    if (!manifest.routes) {
      throw new Error("Invalid Next.js prerender manifest.");
    }

    const paths = [
      ...new Set(
        Object.keys(manifest.routes)
          .filter((path) => !isInternalRoute(path))
          .map(normalizePath),
      ),
    ].sort();

    const discoveredRoutes = paths.map((path): ReliabilityRoute => ({
      path,
      kind: isResource(path) ? "resource" : "page",
    }));

    if (!discoveredRoutes.some((route) => route.kind === "page")) {
      throw new Error("No public pages discovered.");
    }

    return discoveredRoutes;
  },
);
