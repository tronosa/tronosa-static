import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { SectionRenderer } from "@/components/sections/section-renderer";

import { routing } from "@/i18n/routing";

import { getContentById, type Locale } from "@/lib/content/registry";

import { createSeoMetadata } from "@/lib/seo/metadata";
import { createStructuredData } from "@/lib/seo/structured-data";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

function getBlog(locale: Locale) {
  const entry = getContentById("page", locale, "blog");

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

  return createSeoMetadata(getBlog(locale));
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const entry = getBlog(locale);

  return (
    <>
      <JsonLd data={await createStructuredData(entry)} />

      <SectionRenderer sections={entry.data.content.sections} context={entry} />
    </>
  );
}
