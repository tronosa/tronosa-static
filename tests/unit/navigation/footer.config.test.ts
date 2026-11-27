import { describe, expect, it } from "vitest";

import {
  footerGroups,
  footerLegalPages,
} from "@/components/navigation/Footer/footer.config";

describe("footer navigation configuration", () => {
  it("preserves the expected group order", () => {
    expect(footerGroups.map((group) => group.id)).toEqual([
      "company",
      "products",
      "partners",
      "information",
    ]);
  });

  it("uses unique navigation group identifiers", () => {
    const ids = footerGroups.map((group) => group.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses unique page identifiers", () => {
    const ids = footerGroups.flatMap((group) =>
      group.pages.map((page) => page.id),
    );

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes home as the first company link", () => {
    expect(footerGroups[0].pages[0].id).toBe("home");
  });

  it("includes the journal in the company group", () => {
    const ids = footerGroups[0].pages.map((page) => page.id);

    expect(ids).toContain("blog");
  });

  it("includes only the main products page", () => {
    expect(footerGroups[1].pages).toEqual([
      {
        id: "products",
        translationKey: "allProducts",
      },
    ]);
  });

  it("includes the main partnership page first", () => {
    expect(footerGroups[2].pages[0].id).toBe("partners");
  });

  it("includes all configured partnership pages", () => {
    expect(footerGroups[2].pages.map((page) => page.id)).toEqual([
      "partners",
      "horeca",
      "private-label",
      "corporate-water",
      "distribution",
    ]);
  });

  it("includes store locator and contact information", () => {
    expect(footerGroups[3].pages.map((page) => page.id)).toEqual([
      "store-locator",
      "contact",
    ]);
  });

  it("keeps legal pages separate from primary navigation", () => {
    const navigationIds = new Set<string>(
      footerGroups.flatMap((group) => group.pages.map((page) => page.id)),
    );

    for (const page of footerLegalPages) {
      expect(navigationIds.has(page.id)).toBe(false);
    }
  });

  it("includes the configured legal pages", () => {
    expect(footerLegalPages.map((page) => page.id)).toEqual([
      "privacy-policy",
      "cookie-policy",
    ]);
  });
});
