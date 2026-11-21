export type NavigationCurrent = "page" | "location" | undefined;

interface NavigationCurrentOptions {
  pathname: string;
  href: string;
  relatedPaths?: readonly string[];
}

function normalizePathname(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

export function getNavigationCurrent({
  pathname,
  href,
  relatedPaths = [],
}: NavigationCurrentOptions): NavigationCurrent {
  const currentPath = normalizePathname(pathname);
  const targetPath = normalizePathname(href);

  if (currentPath === targetPath) {
    return "page";
  }

  const isRelatedPath = relatedPaths.some(
    (path) => normalizePathname(path) === currentPath,
  );

  if (isRelatedPath) {
    return "location";
  }

  return undefined;
}
