import { getContentHref } from "@/lib/content/content-paths";
import { getLocale } from "next-intl/server";

import { locales } from "@/i18n/config";
import { getContentById } from "@/lib/content/registry";

import { ProductShowcaseClient } from "./ProductShowcaseClient";

import type { ProductShowcaseProps, ResolvedProductShowcaseCTA } from "./types";

export async function ProductShowcase({ cta, ...props }: ProductShowcaseProps) {
  const currentLocale = await getLocale();

  const locale = locales.find(
    (supportedLocale) => supportedLocale === currentLocale,
  );

  if (!locale) {
    throw new Error(`Unsupported locale: ${currentLocale}`);
  }

  let resolvedCTA: ResolvedProductShowcaseCTA | undefined;

  if (cta) {
    const entry = getContentById("page", locale, cta.pageId);

    if (!entry) {
      throw new Error(
        `ProductShowcase CTA target "${cta.pageId}" does not exist for locale "${locale}".`,
      );
    }

    resolvedCTA = {
      label: cta.label,
      href: getContentHref(entry),
    };
  }

  return <ProductShowcaseClient {...props} cta={resolvedCTA} />;
}
