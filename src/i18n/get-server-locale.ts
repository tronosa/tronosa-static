import "server-only";

import { hasLocale } from "next-intl";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "./routing";

import type { Locale } from "./config";

export async function getServerLocale(): Promise<Locale> {
  const locale = await getLocale();

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return locale;
}
