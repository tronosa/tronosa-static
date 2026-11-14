import site from "@/content/config/site.json";
import { getEnvironment } from "@/lib/environment";

export function getSeoConfig() {
  const { siteUrl } = getEnvironment();

  return {
    ...site,
    url: siteUrl,
    organizationId: `${siteUrl}/#organization`,
    websiteId: `${siteUrl}/#website`,
  };
}

export function absoluteUrl(path: string): string {
  const { siteUrl } = getEnvironment();

  const normalizedPath =
    path === "" || path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;

  return new URL(normalizedPath, `${siteUrl}/`).toString();
}
