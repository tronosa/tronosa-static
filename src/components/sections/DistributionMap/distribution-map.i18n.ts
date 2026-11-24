import "server-only";

import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/config";

import type { DistributionMapMessages } from "./types";

export async function getMapMessages(
  locale: Locale,
): Promise<DistributionMapMessages> {
  const t = await getTranslations({
    locale,
    namespace: "DistributionMap",
  });

  return {
    eyebrow: t("eyebrow"),
    title: t("title"),
    description: t("description"),

    retailer: t("retailer"),
    distributor: t("distributor"),
    production: t("production"),
    partner: t("partner"),

    map: t("map"),
    list: t("list"),
    view: t("view"),
    count: t("count"),
    legend: t("legend"),

    details: t("details"),
    showOnMap: t("showOnMap"),
    directions: t("directions"),
    close: t("close"),

    phone: t("phone"),
    email: t("email"),
    website: t("website"),

    zoomIn: t("zoomIn"),
    zoomOut: t("zoomOut"),
    resetMap: t("resetMap"),

    loading: t("loading"),
    unavailable: t("unavailable"),
    empty: t("empty"),

    attribution: t("attribution"),
    gestureWindows: t("gestureWindows"),
    gestureMac: t("gestureMac"),
    gestureMobile: t("gestureMobile"),

    activation: {
      title: t("activation.title"),
      description: t("activation.description"),
      button: t("activation.button"),
    },
  };
}
