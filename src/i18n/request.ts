import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as getRootLocale } from "next/root-params";

import { routing } from "./routing";

const dictionaries = {
  "sr-Latn": () => import("@/dictionaries/sr-Latn.json"),
  en: () => import("@/dictionaries/en.json"),
};

export default getRequestConfig(async () => {
  const locale = await getRootLocale();

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await dictionaries[locale]()).default,
  };
});
