import { getLocale } from "next-intl/server";

import { getDistributionLocations } from "@/lib/content/locations";

import { DistributionMapClient } from "./DistributionMapClient";

import type { DistributionMapProps } from "./types";

export async function DistributionMap(content: DistributionMapProps) {
  const locale = await getLocale();

  const locations = getDistributionLocations(locale, content.categories);

  return (
    <DistributionMapClient
      {...content}
      key={locale}
      locale={locale}
      locations={locations}
    />
  );
}
