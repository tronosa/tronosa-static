import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";

import { getPage } from "@/lib/content/get-page";
import { SectionRenderer } from "@/components/sections/section-renderer";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const { seo } = await getPage(locale, "home");

  return {
    title: seo.title,
    description: seo.description,
    robots: {
      index: seo.index,
      follow: seo.follow,
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const page = await getPage(locale, "home");

  return (
    <main>
      <SectionRenderer sections={page.content.sections} />
    </main>
  );
}
