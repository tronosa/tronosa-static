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

  return new URL(path, `${siteUrl}/`).toString();
}
