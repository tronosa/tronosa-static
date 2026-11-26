import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { ContentPageRenderer } from "@/components/pages/content-page-renderer";
import { JsonLd } from "@/components/seo/json-ld";

import { routing } from "@/i18n/routing";

import type { Locale } from "@/i18n/config";

import {
  getContentStaticParams,
  resolveContentRoute,
} from "@/lib/content/content-route-resolver";

import { createSeoMetadata } from "@/lib/seo/metadata";
import { createStructuredData } from "@/lib/seo/structured-data";

type Props = {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
};

export function generateStaticParams() {
  return getContentStaticParams();
}

function getRouteEntry(locale: Locale, slug: readonly string[]) {
  const entry = resolveContentRoute(locale, slug);

  if (!entry) {
    notFound();
  }

  return entry;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const entry = getRouteEntry(locale, slug);

  return createSeoMetadata(entry);
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const entry = getRouteEntry(locale, slug);

  return (
    <>
      <JsonLd data={await createStructuredData(entry)} />

      <ContentPageRenderer entry={entry} />
    </>
  );
}
