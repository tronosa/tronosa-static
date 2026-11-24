import type { ReactNode } from "react";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";

import "../globals.css";
import { fontSans } from "@/lib/fonts";
import { Header } from "@/components/navigation/Header";
import { SkipLink } from "@/components/navigation/SkipLink";
import { Main } from "@/components/ui/Main";
import { Footer } from "@/components/navigation/Footer";

type Props = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

function getImageKitOrigin(): string | null {
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.trim();

  if (!endpoint) {
    return null;
  }

  const url = new URL(endpoint);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Invalid ImageKit endpoint protocol.");
  }

  return url.origin;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const imageKitOrigin = getImageKitOrigin();

  return (
    <html
      lang={locale}
      className={fontSans.variable}
      data-scroll-behavior="smooth"
    >
      <head>
        {imageKitOrigin && <link rel="preconnect" href={imageKitOrigin} />}
      </head>

      <body>
        <NextIntlClientProvider messages={null}>
          <SkipLink />
          <Header />
          <Main>{children}</Main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
