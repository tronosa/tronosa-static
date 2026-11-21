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

  const value = path.trim();

  if (/^[a-z][a-z\d+.-]*:/i.test(value)) {
    return new URL(value).toString();
  }

  if (value.startsWith("//")) {
    return new URL(value, `${siteUrl}/`).toString();
  }

  const normalizedPath =
    value === "" || value === "/" ? "/" : `/${value.replace(/^\/+|\/+$/g, "")}`;

  return new URL(normalizedPath, `${siteUrl}/`).toString();
}
