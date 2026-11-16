import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  getContentById,
  getContentRegistry,
  getPublishedContent,
} from "@/lib/content/registry";

import { getLanguageAlternates } from "./alternates";
import { createSeoMetadata } from "./metadata";
import { createStructuredData } from "./structured-data";
import { getContentUrl } from "./urls";

beforeAll(() => {
  vi.stubEnv("APP_ENV", "production");
  vi.stubEnv("SITE_URL", "https://example.com");
  vi.stubEnv("SEO_INDEXING_ENABLED", "true");
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe("SEO content registry", () => {
  it("validates every JSON document", () => {
    const entries = getContentRegistry();

    expect(entries.length).toBeGreaterThan(0);
  });

  it("contains both localized home pages", () => {
    expect(getContentById("page", "sr-Latn", "home")).toBeDefined();

    expect(getContentById("page", "en", "home")).toBeDefined();
  });

  it("generates the correct canonical URLs", () => {
    const sr = getContentById("page", "sr-Latn", "home");
    const en = getContentById("page", "en", "home");

    expect(sr).toBeDefined();
    expect(en).toBeDefined();

    if (!sr || !en) return;

    expect(getContentUrl(sr)).toBe("https://example.com/");

    expect(getContentUrl(en)).toBe("https://example.com/en");
  });

  it("generates reciprocal hreflang links", () => {
    const sr = getContentById("page", "sr-Latn", "home");
    const en = getContentById("page", "en", "home");

    if (!sr || !en) {
      throw new Error("Missing localized home pages");
    }

    const srAlternates = getLanguageAlternates(sr);
    const enAlternates = getLanguageAlternates(en);

    expect(srAlternates).toEqual(enAlternates);

    expect(srAlternates).toEqual({
      "sr-Latn": "https://example.com/",
      en: "https://example.com/en",
      "x-default": "https://example.com/",
    });
  });

  it("provides metadata for every published page", () => {
    for (const entry of getPublishedContent()) {
      const metadata = createSeoMetadata(entry);

      expect(metadata.title).toBeTruthy();
      expect(metadata.description).toBeTruthy();
      expect(metadata.alternates?.canonical).toBeTruthy();
    }
  });

  it("generates structured data for every published page", async () => {
    for (const entry of getPublishedContent()) {
      const data = await createStructuredData(entry);

      expect(data["@context"]).toBe("https://schema.org");
      expect(data["@graph"].length).toBeGreaterThan(0);
    }
  });

  it("does not include draft articles as published content", () => {
    const entries = getPublishedContent();

    expect(
      entries.some(
        (entry) => entry.kind === "article" && entry.data.status === "draft",
      ),
    ).toBe(false);
  });
});
