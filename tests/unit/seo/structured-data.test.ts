import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { locales } from "@/i18n/config";

import * as seoConfig from "@/lib/seo/config";

import { createStructuredData } from "@/lib/seo/structured-data";

import { createOrganizationSchema } from "@/lib/seo/structured-data/organization";
import { createWebsiteSchema } from "@/lib/seo/structured-data/website";
import { createWebPageSchema } from "@/lib/seo/structured-data/webpage";
import { createBreadcrumbSchema } from "@/lib/seo/structured-data/breadcrumb";

import { getContentUrl, getLocaleHomeUrl } from "@/lib/seo/urls";

import { createPageEntry, SITE_URL } from "./seo.fixtures";

beforeEach(() => {
  vi.stubEnv("APP_ENV", "production");
  vi.stubEnv("SITE_URL", SITE_URL);
  vi.stubEnv("SEO_INDEXING_ENABLED", "true");
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("Organization structured data", () => {
  it("generates organization information", () => {
    const config = seoConfig.getSeoConfig();

    expect(createOrganizationSchema()).toMatchObject({
      "@type": "Organization",
      "@id": config.organizationId,
      name: config.name,
      url: config.url,
    });
  });

  it("includes configured social profiles", () => {
    const config = seoConfig.getSeoConfig();

    const socialProfiles = [
      "https://www.facebook.com/example",
      "https://www.instagram.com/example",
    ];

    vi.spyOn(seoConfig, "getSeoConfig").mockReturnValue({
      ...config,
      socialProfiles,
    });

    expect(createOrganizationSchema()).toMatchObject({
      sameAs: socialProfiles,
    });
  });

  it("omits sameAs when no social profiles exist", () => {
    const config = seoConfig.getSeoConfig();

    vi.spyOn(seoConfig, "getSeoConfig").mockReturnValue({
      ...config,
      socialProfiles: [],
    });

    expect(createOrganizationSchema()).not.toHaveProperty("sameAs");
  });
});

describe("Website structured data", () => {
  it("generates website information", () => {
    const config = seoConfig.getSeoConfig();

    expect(createWebsiteSchema()).toMatchObject({
      "@type": "WebSite",
      "@id": config.websiteId,
      name: config.name,
      url: config.url,
    });
  });
});

describe("WebPage structured data", () => {
  it("generates page information", () => {
    const entry = createPageEntry();
    const url = getContentUrl(entry);

    expect(createWebPageSchema(entry)).toMatchObject({
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: entry.data.seo.title,
      description: entry.data.seo.description,
      inLanguage: entry.locale,
      isPartOf: {
        "@id": seoConfig.getSeoConfig().websiteId,
      },
    });
  });

  it.each(locales)("provides the correct language for %s", (locale) => {
    const entry = createPageEntry({ locale });

    expect(createWebPageSchema(entry)).toMatchObject({
      inLanguage: locale,
    });
  });

  it("includes the modification date when available", () => {
    const modifiedAt = "2026-11-18T12:00:00.000Z";

    const entry = createPageEntry({
      data: {
        modifiedAt,
      },
    });

    expect(createWebPageSchema(entry)).toMatchObject({
      dateModified: modifiedAt,
    });
  });

  it("omits the modification date when unavailable", () => {
    const entry = createPageEntry({
      data: {
        modifiedAt: undefined,
      },
    });

    expect(createWebPageSchema(entry)).not.toHaveProperty("dateModified");
  });

  it("does not include an article publication date", () => {
    expect(createWebPageSchema(createPageEntry())).not.toHaveProperty(
      "datePublished",
    );
  });
});

describe("Breadcrumb structured data", () => {
  it.each(locales)("omits breadcrumbs on the %s home page", async (locale) => {
    const entry = createPageEntry({
      locale,
      data: {
        id: "home",
        slug: "",
      },
    });

    expect(await createBreadcrumbSchema(entry)).toBeNull();
  });

  it.each(locales)("generates localized breadcrumbs for %s", async (locale) => {
    const entry = createPageEntry({ locale });

    const breadcrumb = await createBreadcrumbSchema(entry);

    expect(breadcrumb).toMatchObject({
      "@type": "BreadcrumbList",
      "@id": `${getContentUrl(entry)}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: expect.any(String),
          item: getLocaleHomeUrl(locale),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: entry.data.seo.title,
          item: getContentUrl(entry),
        },
      ],
    });
  });
});

describe("Structured data graph", () => {
  it("generates a valid home page graph", async () => {
    const entry = createPageEntry({
      data: {
        id: "home",
        slug: "",
      },
    });

    const result = await createStructuredData(entry);

    expect(result["@context"]).toBe("https://schema.org");

    expect(result["@graph"].map((node) => node["@type"])).toEqual([
      "Organization",
      "WebSite",
      "WebPage",
    ]);
  });

  it("includes breadcrumbs for an internal page", async () => {
    const entry = createPageEntry();

    const result = await createStructuredData(entry);

    expect(result["@graph"].map((node) => node["@type"])).toEqual([
      "Organization",
      "WebSite",
      "WebPage",
      "BreadcrumbList",
    ]);
  });

  it("generates unique structured data identifiers", async () => {
    const result = await createStructuredData(createPageEntry());

    const ids = result["@graph"].map((node) => node["@id"]);

    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(
      true,
    );

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("generates JSON-serializable structured data", async () => {
    const result = await createStructuredData(createPageEntry());

    const serialized = JSON.stringify(result);

    expect(JSON.parse(serialized)).toEqual(result);
  });
});
