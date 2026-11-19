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
    expect(resolveImageUrl("/images/placeholder.jpg")).toBe(
      `${ENDPOINT}/images/placeholder.jpg`,
    );
  });

  it("resolves optimized video posters", () => {
    const result = resolveImageUrl("/images/placeholder.jpg", {
      width: 1920,
      quality: 80,
    });

    const url = new URL(result);

    expect(url.pathname).toBe("/tronosa/images/placeholder.jpg");

    expect(url.searchParams.get("tr")).toBe("w-1920,q-80");
  });

  it("uses default transformation quality", () => {
    const result = resolveImageUrl("/images/placeholder.jpg", {
      width: 1080,
    });

    expect(new URL(result).searchParams.get("tr")).toBe("w-1080,q-75");
  });

  it("preserves existing transformations when none are provided", () => {
    const src = `${ENDPOINT}/images/placeholder.jpg?tr=w-640`;

    expect(resolveImageUrl(src)).toBe(src);
  });

  it("preserves existing query parameters", () => {
    const result = resolveImageUrl("/images/placeholder.jpg?v=2");

    expect(new URL(result).searchParams.get("v")).toBe("2");
  });

  it.each([
    "/images/placeholder.jpg",
    "images/placeholder.jpg",
    "/assets/images/placeholder.jpg",
    "assets/images/placeholder.jpg",
  ])("resolves local assets: %s", (src) => {
    vi.stubEnv(ENV_KEY, undefined);

    expect(resolveImageUrl(src)).toBe("/assets/images/placeholder.jpg");
  });

  it("resolves local video posters without CDN transformations", () => {
    vi.stubEnv(ENV_KEY, undefined);

    expect(
      resolveImageUrl("/images/placeholder.jpg", {
        width: 1920,
        quality: 80,
      }),
    ).toBe("/assets/images/placeholder.jpg");
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
});
