import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { locales, localeConfig } from "@/i18n/config";

import { createSeoMetadata } from "@/lib/seo/metadata";
import { getContentUrl } from "@/lib/seo/urls";

import { createPageEntry, SITE_URL } from "./seo.fixtures";

beforeEach(() => {
  vi.stubEnv("APP_ENV", "production");
  vi.stubEnv("SITE_URL", SITE_URL);
  vi.stubEnv("SEO_INDEXING_ENABLED", "true");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("SEO metadata", () => {
  it("generates basic page metadata", () => {
    const entry = createPageEntry();
    const metadata = createSeoMetadata(entry);

    expect(metadata.title).toBe("Test page");

    expect(metadata.description).toBe("Test page description");

    expect(metadata.metadataBase).toEqual(new URL(SITE_URL));

    expect(metadata.alternates?.canonical).toBe(getContentUrl(entry));
  });

  it("generates a custom canonical URL", () => {
    const entry = createPageEntry({
      seo: {
        canonical: "/canonical-page",
      },
    });

    const metadata = createSeoMetadata(entry);

    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/canonical-page`);

    expect(metadata.alternates?.languages).toBeUndefined();
  });

  it.each(["/test-page?source=test", "/test-page#section"])(
    "rejects invalid canonical URL %s",
    (canonical) => {
      const entry = createPageEntry({
        seo: { canonical },
      });

      expect(() => createSeoMetadata(entry)).toThrow(
        "Invalid canonical URL for test-page",
      );
    },
  );
});

describe("Robots metadata", () => {
  it("allows indexing in production", () => {
    const metadata = createSeoMetadata(createPageEntry());

    expect(metadata.robots).toMatchObject({
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    });
  });

  it.each(["development", "staging"])(
    "disables indexing in %s",
    (environment) => {
      vi.stubEnv("APP_ENV", environment);

      const metadata = createSeoMetadata(createPageEntry());

      expect(metadata.robots).toMatchObject({
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      });
    },
  );

  it("disables indexing without production opt-in", () => {
    vi.stubEnv("SEO_INDEXING_ENABLED", "false");

    const metadata = createSeoMetadata(createPageEntry());

    expect(metadata.robots).toMatchObject({
      index: false,
      follow: false,
    });
  });

  it("respects page-level noindex", () => {
    const entry = createPageEntry({
      seo: {
        index: false,
      },
    });

    const metadata = createSeoMetadata(entry);

    expect(metadata.robots).toMatchObject({
      index: false,
      follow: true,
    });

    expect(metadata.alternates?.languages).toBeUndefined();
  });

  it("respects page-level nofollow", () => {
    const entry = createPageEntry({
      seo: {
        follow: false,
      },
    });

    expect(createSeoMetadata(entry).robots).toMatchObject({
      index: true,
      follow: false,
    });
  });

  it("provides Google preview directives", () => {
    const metadata = createSeoMetadata(createPageEntry());

    expect(metadata.robots).toMatchObject({
      googleBot: {
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    });
  });
});

describe("Open Graph metadata", () => {
  it("uses the default SEO title and description", () => {
    const metadata = createSeoMetadata(createPageEntry());

    expect(metadata.openGraph).toMatchObject({
      type: "website",
      title: "Test page",
      description: "Test page description",
      images: [],
    });
  });

  it("uses explicitly configured Open Graph content", () => {
    const entry = createPageEntry({
      seo: {
        openGraph: {
          title: "Open Graph title",
          description: "Open Graph description",
        },
      },
    });

    expect(createSeoMetadata(entry).openGraph).toMatchObject({
      title: "Open Graph title",
      description: "Open Graph description",
    });
  });

  it("generates absolute Open Graph image URLs", () => {
    const entry = createPageEntry({
      seo: {
        openGraph: {
          image: {
            src: "/assets/images/social.jpg",
            width: 1200,
            height: 630,
            alt: "Social preview",
          },
        },
      },
    });

    expect(createSeoMetadata(entry).openGraph).toMatchObject({
      images: [
        {
          url: `${SITE_URL}/assets/images/social.jpg`,
          width: 1200,
          height: 630,
          alt: "Social preview",
        },
      ],
    });
  });

  it.each(locales)("uses the correct Open Graph locale for %s", (locale) => {
    const entry = createPageEntry({ locale });

    expect(createSeoMetadata(entry).openGraph).toMatchObject({
      locale: localeConfig[locale].openGraphLocale,
    });
  });
});

describe("Twitter metadata", () => {
  it("uses the summary card without an image", () => {
    const metadata = createSeoMetadata(createPageEntry());

    expect(metadata.twitter).toMatchObject({
      card: "summary",
      title: "Test page",
      description: "Test page description",
    });

    expect(metadata.twitter).not.toHaveProperty("images");
  });

  it("uses a large image card when an image exists", () => {
    const entry = createPageEntry({
      seo: {
        openGraph: {
          image: {
            src: "/assets/images/social.jpg",
            width: 1200,
            height: 630,
            alt: "Social preview",
          },
        },
      },
    });

    expect(createSeoMetadata(entry).twitter).toMatchObject({
      card: "summary_large_image",
      images: [`${SITE_URL}/assets/images/social.jpg`],
    });
  });

  it("respects an explicitly configured Twitter card", () => {
    const entry = createPageEntry({
      seo: {
        twitter: {
          card: "summary_large_image",
        },
      },
    });

    expect(createSeoMetadata(entry).twitter).toMatchObject({
      card: "summary_large_image",
    });
  });
});
