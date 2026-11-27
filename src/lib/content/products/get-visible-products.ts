import "server-only";

import type { Locale } from "@/i18n/config";

import { getEnvironment } from "@/lib/environment";

import { getAllProducts, getPublishedProducts } from "./product-registry";

export function getVisibleProducts(locale: Locale) {
  const environment = getEnvironment();

  return environment.appEnv === "production"
    ? getPublishedProducts(locale)
    : getAllProducts(locale);
}
