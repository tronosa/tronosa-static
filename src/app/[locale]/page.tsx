import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { SectionRenderer } from "@/components/sections/section-renderer";
import { JsonLd } from "@/components/seo/json-ld";

import { getContentById, type Locale } from "@/lib/content/registry";

import { routing } from "@/i18n/routing";
import { createSeoMetadata } from "@/lib/seo/metadata";
import { createStructuredData } from "@/lib/seo/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

function getHomePage(locale: Locale) {
  const entry = getContentById("page", locale, "home");

  if (!entry || entry.kind !== "page") {
    notFound();
  }

  return entry;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return createSeoMetadata(getHomePage(locale));
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const entry = getHomePage(locale);

  return (
    <>
      <JsonLd data={await createStructuredData(entry)} />

      <main>
        <SectionRenderer sections={entry.data.content.sections} />
      </main>
    </>
  );
}
