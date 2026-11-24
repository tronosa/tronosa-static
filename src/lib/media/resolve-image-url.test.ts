import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resolveImageUrl } from "./resolve-image-url";

const ENDPOINT = "https://ik.imagekit.io/tronosa";
const ENV_KEY = "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT";

beforeEach(() => {
  vi.stubEnv(ENV_KEY, ENDPOINT);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Image URL resolver", () => {
  it("resolves CDN images without transformations", () => {
    expect(resolveImageUrl("/images/placeholder.webp")).toBe(
      `${ENDPOINT}/images/placeholder.webp`,
    );
  });

  it("resolves optimized video posters", () => {
    const result = resolveImageUrl("/images/placeholder.webp", {
      width: 1920,
      quality: 80,
    });

    const url = new URL(result);

    expect(url.pathname).toBe("/tronosa/images/placeholder.webp");

    expect(url.searchParams.get("tr")).toBe("w-1920,q-80");
  });

  it("uses default transformation quality", () => {
    const result = resolveImageUrl("/images/placeholder.webp", {
      width: 1080,
    });

    expect(new URL(result).searchParams.get("tr")).toBe("w-1080,q-75");
  });

  it("preserves existing transformations when none are provided", () => {
    const src = `${ENDPOINT}/images/placeholder.webp?tr=w-640`;

    expect(resolveImageUrl(src)).toBe(src);
  });

  it("preserves existing query parameters", () => {
    const result = resolveImageUrl("/images/placeholder.webp?v=2");

    expect(new URL(result).searchParams.get("v")).toBe("2");
  });

  it.each([
    "/images/placeholder.webp",
    "images/placeholder.webp",
    "/assets/images/placeholder.webp",
    "assets/images/placeholder.webp",
  ])("resolves local assets: %s", (src) => {
    vi.stubEnv(ENV_KEY, undefined);

    expect(resolveImageUrl(src)).toBe("/assets/images/placeholder.webp");
  });

  it("resolves local video posters without CDN transformations", () => {
    vi.stubEnv(ENV_KEY, undefined);

    expect(
      resolveImageUrl("/images/placeholder.webp", {
        width: 1920,
        quality: 80,
      }),
    ).toBe("/assets/images/placeholder.webp");
  });

  it("rejects untrusted CDN sources", () => {
    expect(() => resolveImageUrl("https://example.com/image.jpg")).toThrow(
      "Unsupported image source",
    );
  });

  it("rejects CDN path traversal", () => {
    expect(() => resolveImageUrl("../image.jpg")).toThrow(
      "Unsupported image source",
    );
  });

  it.each([
    "https://example.com/images/placeholder.webp",
    "http://example.com/images/placeholder.webp",
  ])("preserves absolute image URLs without a CDN endpoint: %s", (src) => {
    vi.stubEnv(ENV_KEY, undefined);

    expect(resolveImageUrl(src)).toBe(src);
  });

  it("preserves absolute image URLs without applying local transformations", () => {
    vi.stubEnv(ENV_KEY, undefined);

    const src = "https://example.com/images/placeholder.webp?v=2";

    expect(
      resolveImageUrl(src, {
        width: 1920,
        quality: 80,
      }),
    ).toBe(src);
  });

  it.each(["", "   "])(
    "falls back to local assets when the CDN endpoint is empty",
    (endpoint) => {
      vi.stubEnv(ENV_KEY, endpoint);

      expect(resolveImageUrl("/images/placeholder.webp")).toBe(
        "/assets/images/placeholder.webp",
      );
    },
  );

  it("normalizes whitespace around the CDN endpoint", () => {
    vi.stubEnv(ENV_KEY, `  ${ENDPOINT}  `);

    expect(resolveImageUrl("/images/placeholder.webp")).toBe(
      `${ENDPOINT}/images/placeholder.webp`,
    );
  });

  it.each(["/", "//", "///"])(
    "normalizes trailing slashes in the CDN endpoint: %s",
    (suffix) => {
      vi.stubEnv(ENV_KEY, `${ENDPOINT}${suffix}`);

      expect(resolveImageUrl("/images/placeholder.webp")).toBe(
        `${ENDPOINT}/images/placeholder.webp`,
      );
    },
  );

  it.each([
    "/images/placeholder.webp",
    "images/placeholder.webp",
    "/assets/images/placeholder.webp",
    "assets/images/placeholder.webp",
  ])("normalizes asset paths for CDN requests: %s", (src) => {
    expect(resolveImageUrl(src)).toBe(`${ENDPOINT}/images/placeholder.webp`);
  });

  it("accepts an absolute URL from the configured CDN endpoint", () => {
    const src = `${ENDPOINT}/images/placeholder.webp`;

    expect(resolveImageUrl(src)).toBe(src);
  });

  it("applies transformations to an absolute CDN URL", () => {
    const src = `${ENDPOINT}/images/placeholder.webp`;

    const result = resolveImageUrl(src, {
      width: 640,
      quality: 85,
    });

    const url = new URL(result);

    expect(url.pathname).toBe("/tronosa/images/placeholder.webp");
    expect(url.searchParams.get("tr")).toBe("w-640,q-85");
  });

  it("replaces existing transformations when new ones are provided", () => {
    const src = `${ENDPOINT}/images/placeholder.webp?tr=w-320,q-60`;

    const result = resolveImageUrl(src, {
      width: 1280,
      quality: 85,
    });

    const url = new URL(result);

    expect(url.searchParams.get("tr")).toBe("w-1280,q-85");
    expect(url.searchParams.getAll("tr")).toHaveLength(1);
  });

  it("preserves unrelated query parameters when applying transformations", () => {
    const src = `${ENDPOINT}/images/placeholder.webp?v=2&tr=w-320&format=webp`;

    const result = resolveImageUrl(src, {
      width: 1280,
      quality: 90,
    });

    const url = new URL(result);

    expect(url.searchParams.get("v")).toBe("2");
    expect(url.searchParams.get("format")).toBe("webp");
    expect(url.searchParams.get("tr")).toBe("w-1280,q-90");
  });

  it("preserves URL fragments when applying transformations", () => {
    const src = `${ENDPOINT}/images/placeholder.webp#preview`;

    const result = resolveImageUrl(src, {
      width: 640,
    });

    const url = new URL(result);

    expect(url.hash).toBe("#preview");
    expect(url.searchParams.get("tr")).toBe("w-640,q-75");
  });

  it.each([
    "https://ik.imagekit.io/another-project/image.jpg",
    "https://ik.imagekit.io/tronosa-backup/image.jpg",
    "https://ik.imagekit.io/tronosaproject/image.jpg",
  ])("rejects CDN URLs outside the configured project path: %s", (src) => {
    expect(() => resolveImageUrl(src)).toThrow("Unsupported image source");
  });

  it.each([
    "https://example.com/tronosa/image.jpg",
    "http://ik.imagekit.io/tronosa/image.jpg",
    "https://ik.imagekit.io.example.com/tronosa/image.jpg",
    "https://ik.imagekit.io:8443/tronosa/image.jpg",
  ])("rejects CDN URLs with an unexpected origin: %s", (src) => {
    expect(() => resolveImageUrl(src)).toThrow("Unsupported image source");
  });

  it.each([
    "../image.jpg",
    "images/../../image.jpg",
    "%2e%2e/image.jpg",
    "images/%2e%2e/%2e%2e/image.jpg",
    `${ENDPOINT}/../image.jpg`,
  ])("rejects traversal outside the configured CDN path: %s", (src) => {
    expect(() => resolveImageUrl(src)).toThrow("Unsupported image source");
  });
});
