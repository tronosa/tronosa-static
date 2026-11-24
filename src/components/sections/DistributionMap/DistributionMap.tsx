import { getLocale } from "next-intl/server";

import { getDistributionLocations } from "@/lib/content/locations";

import { DistributionMapClient } from "./DistributionMapClient";
import { getMapMessages } from "./distribution-map.i18n";

import type { DistributionMapProps } from "./types";

export async function DistributionMap(content: DistributionMapProps) {
  const locale = await getLocale();

  const locations = getDistributionLocations(locale, content.categories);

  const messages = await getMapMessages(locale);

  return (
    <DistributionMapClient
      {...content}
      key={locale}
      locale={locale}
      locations={locations}
      messages={messages}
    />
  );
}
