import { getSeoConfig } from "../config";

export function createOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": getSeoConfig().organizationId,
    name: getSeoConfig().name,
    url: getSeoConfig().url,
    ...(getSeoConfig().socialProfiles.length > 0 && {
      sameAs: getSeoConfig().socialProfiles,
    }),
  };
}
