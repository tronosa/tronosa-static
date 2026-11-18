import "server-only";

import type { Locale } from "@/i18n/config";

import { distributionLocationsSchema } from "@/components/sections/DistributionMap/distribution-map.schema";

import type {
  DistributionLocation,
  DistributionLocationType,
} from "@/components/sections/DistributionMap/types";

import srCyrl from "@/content/locations/sr-Cyrl.json";
import srLatn from "@/content/locations/sr-Latn.json";
import en from "@/content/locations/en.json";

const locationSources = {
  "sr-Cyrl": srCyrl,
  "sr-Latn": srLatn,
  en,
} satisfies Record<Locale, unknown>;

export function getDistributionLocations(
  locale: Locale,
  categories?: readonly DistributionLocationType[],
): DistributionLocation[] {
  const locations = distributionLocationsSchema.parse(locationSources[locale]);

  return locations
    .filter((location) => location.enabled)
    .filter((location) => !categories || categories.includes(location.type))
    .sort((first, second) => Number(second.featured) - Number(first.featured));
}
