import { describe, expect, it } from "vitest";

import { getNavigationCurrent } from "@/components/navigation/navigation-current";

describe("Navigation current state", () => {
  describe("Exact page matching", () => {
    it("identifies the home page", () => {
      expect(
        getNavigationCurrent({
          pathname: "/",
          href: "/",
        }),
      ).toBe("page");
    });

    it.each([
      "/o-nama",
      "/about-us",
      "/proizvodi",
      "/products",
      "/blog",
      "/contact",
    ])("identifies an exact page match: %s", (pathname) => {
      expect(
        getNavigationCurrent({
          pathname,
          href: pathname,
        }),
      ).toBe("page");
    });

    it("prioritizes an exact page match over related paths", () => {
      expect(
        getNavigationCurrent({
          pathname: "/blog",
          href: "/blog",
          relatedPaths: ["/blog"],
        }),
      ).toBe("page");
    });
  });

  describe("Related location matching", () => {
    it("identifies a published article as a related location", () => {
      expect(
        getNavigationCurrent({
          pathname: "/blog/natural-origin",
          href: "/blog",
          relatedPaths: ["/blog/natural-origin"],
        }),
      ).toBe("location");
    });

    it("identifies a related location among multiple article paths", () => {
      expect(
        getNavigationCurrent({
          pathname: "/blog/hydration",
          href: "/blog",
          relatedPaths: [
            "/blog/natural-origin",
            "/blog/hydration",
            "/blog/sustainability",
          ],
        }),
      ).toBe("location");
    });

    it("supports localized article slugs", () => {
      expect(
        getNavigationCurrent({
          pathname: "/blog/prirodno-poreklo",
          href: "/blog",
          relatedPaths: ["/blog/prirodno-poreklo"],
        }),
      ).toBe("location");
    });

    it("does not activate an unpublished or unknown article", () => {
      expect(
        getNavigationCurrent({
          pathname: "/blog/unknown-article",
          href: "/blog",
          relatedPaths: ["/blog/natural-origin"],
        }),
      ).toBeUndefined();
    });

    it("does not match nested paths below a related location", () => {
      expect(
        getNavigationCurrent({
          pathname: "/blog/natural-origin/extra",
          href: "/blog",
          relatedPaths: ["/blog/natural-origin"],
        }),
      ).toBeUndefined();
    });
  });

  describe("Path normalization", () => {
    it("normalizes a trailing slash on the current pathname", () => {
      expect(
        getNavigationCurrent({
          pathname: "/products/",
          href: "/products",
        }),
      ).toBe("page");
    });

    it("normalizes a trailing slash on the target href", () => {
      expect(
        getNavigationCurrent({
          pathname: "/products",
          href: "/products/",
        }),
      ).toBe("page");
    });

    it("normalizes trailing slashes on both paths", () => {
      expect(
        getNavigationCurrent({
          pathname: "/products/",
          href: "/products/",
        }),
      ).toBe("page");
    });

    it("normalizes repeated trailing slashes", () => {
      expect(
        getNavigationCurrent({
          pathname: "/products///",
          href: "/products/",
        }),
      ).toBe("page");
    });

    it("normalizes an empty pathname to the root", () => {
      expect(
        getNavigationCurrent({
          pathname: "",
          href: "/",
        }),
      ).toBe("page");
    });

    it("normalizes an empty href to the root", () => {
      expect(
        getNavigationCurrent({
          pathname: "/",
          href: "",
        }),
      ).toBe("page");
    });

    it("normalizes a related article path", () => {
      expect(
        getNavigationCurrent({
          pathname: "/blog/natural-origin/",
          href: "/blog",
          relatedPaths: ["/blog/natural-origin"],
        }),
      ).toBe("location");
    });

    it("normalizes a trailing slash in related paths", () => {
      expect(
        getNavigationCurrent({
          pathname: "/blog/natural-origin",
          href: "/blog",
          relatedPaths: ["/blog/natural-origin/"],
        }),
      ).toBe("location");
    });
  });

  describe("Inactive navigation", () => {
    it("does not match the home link on another page", () => {
      expect(
        getNavigationCurrent({
          pathname: "/products",
          href: "/",
        }),
      ).toBeUndefined();
    });

    it("does not match unrelated pages", () => {
      expect(
        getNavigationCurrent({
          pathname: "/about-us",
          href: "/products",
        }),
      ).toBeUndefined();
    });

    it("does not match similar pathname prefixes", () => {
      expect(
        getNavigationCurrent({
          pathname: "/blogging",
          href: "/blog",
        }),
      ).toBeUndefined();
    });

    it("does not match similar related article prefixes", () => {
      expect(
        getNavigationCurrent({
          pathname: "/blog/natural-origin-extra",
          href: "/blog",
          relatedPaths: ["/blog/natural-origin"],
        }),
      ).toBeUndefined();
    });

    it("does not match unknown pages", () => {
      expect(
        getNavigationCurrent({
          pathname: "/unknown-page",
          href: "/about-us",
        }),
      ).toBeUndefined();
    });

    it("does not activate a location with an empty related path list", () => {
      expect(
        getNavigationCurrent({
          pathname: "/blog/article",
          href: "/blog",
          relatedPaths: [],
        }),
      ).toBeUndefined();
    });

    it("does not require related paths", () => {
      expect(
        getNavigationCurrent({
          pathname: "/blog/article",
          href: "/blog",
        }),
      ).toBeUndefined();
    });

    it("does not match paths with different letter casing", () => {
      expect(
        getNavigationCurrent({
          pathname: "/Blog",
          href: "/blog",
        }),
      ).toBeUndefined();
    });
  });
});
