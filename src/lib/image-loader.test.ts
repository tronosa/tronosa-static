import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import imageLoader from "./image-loader";

const ENDPOINT = "https://ik.imagekit.io/tronosa";
const ENV_KEY = "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT";

beforeEach(() => {
  vi.stubEnv(ENV_KEY, ENDPOINT);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Image loader", () => {
  describe("ImageKit sources", () => {
    it.each([
      "/images/placeholder.jpg",
      "images/placeholder.jpg",
      "/assets/images/placeholder.jpg",
      "assets/images/placeholder.jpg",
      `${ENDPOINT}/images/placeholder.jpg`,
    ])("supports image source: %s", (src) => {
      const result = imageLoader({
        src,
        width: 640,
        quality: 75,
      });

      const url = new URL(result);

      expect(url.origin).toBe("https://ik.imagekit.io");
      expect(url.pathname).toBe("/tronosa/images/placeholder.jpg");
      expect(url.searchParams.get("tr")).toBe("w-640,q-75");
    });

    it("supports nested image directories", () => {
      const result = imageLoader({
        src: "/products/water-330ml.webp",
        width: 640,
      });

      expect(new URL(result).pathname).toBe(
        "/tronosa/products/water-330ml.webp",
      );
    });

    it("generates identical URLs for relative and absolute sources", () => {
      const relative = imageLoader({
        src: "/images/placeholder.jpg",
        width: 640,
      });

      const absolute = imageLoader({
        src: `${ENDPOINT}/images/placeholder.jpg`,
        width: 640,
      });

      expect(relative).toBe(absolute);
    });
  });

  describe("Responsive image transformations", () => {
    it.each([96, 160, 256, 384, 640, 750, 828, 1080, 1200, 1600, 1920])(
      "supports responsive width %i",
      (width) => {
        const result = imageLoader({
          src: "/images/placeholder.jpg",
          width,
          quality: 75,
        });

        expect(new URL(result).searchParams.get("tr")).toBe(`w-${width},q-75`);
      },
    );

    it("uses the default image quality", () => {
      const result = imageLoader({
        src: "/images/placeholder.jpg",
        width: 640,
      });

      expect(new URL(result).searchParams.get("tr")).toBe("w-640,q-75");
    });

    it("supports custom image quality", () => {
      const result = imageLoader({
        src: "/images/placeholder.jpg",
        width: 1080,
        quality: 80,
      });

      expect(new URL(result).searchParams.get("tr")).toBe("w-1080,q-80");
    });

    it("generates different URLs for different widths", () => {
      const small = imageLoader({
        src: "/images/placeholder.jpg",
        width: 384,
      });

      const large = imageLoader({
        src: "/images/placeholder.jpg",
        width: 1920,
      });

      expect(small).not.toBe(large);
    });

    it("generates different URLs for different qualities", () => {
      const standard = imageLoader({
        src: "/images/placeholder.jpg",
        width: 640,
        quality: 75,
      });

      const high = imageLoader({
        src: "/images/placeholder.jpg",
        width: 640,
        quality: 80,
      });

      expect(standard).not.toBe(high);
    });
  });

  describe("URL normalization", () => {
    it.each(["/", "//", "///"])(
      "normalizes endpoint trailing slashes: %s",
      (suffix) => {
        vi.stubEnv(ENV_KEY, `${ENDPOINT}${suffix}`);

        const result = imageLoader({
          src: "/images/placeholder.jpg",
          width: 640,
        });

        expect(new URL(result).pathname).toBe(
          "/tronosa/images/placeholder.jpg",
        );
      },
    );

    it("trims environment variable whitespace", () => {
      vi.stubEnv(ENV_KEY, `  ${ENDPOINT}  `);

      const result = imageLoader({
        src: "/images/placeholder.jpg",
        width: 640,
      });

      expect(new URL(result).pathname).toBe("/tronosa/images/placeholder.jpg");
    });

    it("preserves existing query parameters", () => {
      const result = imageLoader({
        src: "/images/placeholder.jpg?v=2",
        width: 640,
      });

      const url = new URL(result);

      expect(url.searchParams.get("v")).toBe("2");
      expect(url.searchParams.get("tr")).toBe("w-640,q-75");
    });

    it("replaces existing image transformations", () => {
      const result = imageLoader({
        src: "/images/placeholder.jpg?tr=w-200,q-50",
        width: 640,
        quality: 80,
      });

      const url = new URL(result);

      expect(url.searchParams.get("tr")).toBe("w-640,q-80");
      expect(url.searchParams.getAll("tr")).toHaveLength(1);
    });

    it("encodes spaces in image paths", () => {
      const result = imageLoader({
        src: "/images/product image.jpg",
        width: 640,
      });

      expect(new URL(result).pathname).toBe(
        "/tronosa/images/product%20image.jpg",
      );
    });
  });

  describe("ImageKit source validation", () => {
    it.each([
      "https://example.com/image.jpg",
      "https://cdn.example.com/image.jpg",
      "http://ik.imagekit.io/tronosa/images/image.jpg",
      "https://ik.imagekit.io/another-account/image.jpg",
      "https://ik.imagekit.io/tronosa-other/image.jpg",
      "https://ik.imagekit.io.example.com/tronosa/image.jpg",
      "../image.jpg",
      "/../image.jpg",
      "/images/../../image.jpg",
      "/%2e%2e/image.jpg",
    ])("rejects unsupported image source: %s", (src) => {
      expect(() =>
        imageLoader({
          src,
          width: 640,
        }),
      ).toThrow("Unsupported image source");
    });

    it("rejects an invalid ImageKit endpoint", () => {
      vi.stubEnv(ENV_KEY, "invalid-endpoint");

      expect(() =>
        imageLoader({
          src: "/images/placeholder.jpg",
          width: 640,
        }),
      ).toThrow();
    });
  });

  describe("Local asset fallback", () => {
    beforeEach(() => {
      vi.stubEnv(ENV_KEY, undefined);
    });

    it.each(["", undefined, "   "])(
      "uses local assets when the endpoint is missing: %s",
      (endpoint) => {
        vi.stubEnv(ENV_KEY, endpoint);

        expect(
          imageLoader({
            src: "/images/placeholder.jpg",
            width: 640,
          }),
        ).toBe("/assets/images/placeholder.jpg");
      },
    );

    it.each([
      "/images/placeholder.jpg",
      "images/placeholder.jpg",
      "/assets/images/placeholder.jpg",
      "assets/images/placeholder.jpg",
    ])("normalizes local image source: %s", (src) => {
      expect(
        imageLoader({
          src,
          width: 640,
        }),
      ).toBe("/assets/images/placeholder.jpg");
    });

    it("supports nested local asset directories", () => {
      expect(
        imageLoader({
          src: "/products/water-330ml.webp",
          width: 640,
        }),
      ).toBe("/assets/products/water-330ml.webp");
    });

    it("does not duplicate the assets directory", () => {
      expect(
        imageLoader({
          src: "/assets/products/water-330ml.webp",
          width: 640,
        }),
      ).toBe("/assets/products/water-330ml.webp");
    });

    it("preserves local image query parameters", () => {
      expect(
        imageLoader({
          src: "/images/placeholder.jpg?v=2",
          width: 640,
        }),
      ).toBe("/assets/images/placeholder.jpg?v=2");
    });

    it("preserves absolute image URLs", () => {
      const src = `${ENDPOINT}/images/placeholder.jpg`;

      expect(
        imageLoader({
          src,
          width: 640,
        }),
      ).toBe(src);
    });

    it("does not apply CDN transformations to local assets", () => {
      expect(
        imageLoader({
          src: "/images/placeholder.jpg",
          width: 1920,
          quality: 80,
        }),
      ).toBe("/assets/images/placeholder.jpg");
    });
  });
});
