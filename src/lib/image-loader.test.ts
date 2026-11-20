import { beforeEach, describe, expect, it, vi } from "vitest";

import { resolveImageUrl } from "./media/resolve-image-url";

import imageLoader from "./image-loader";

vi.mock("./media/resolve-image-url", () => ({
  resolveImageUrl: vi.fn(),
}));

const mockedResolveImageUrl = vi.mocked(resolveImageUrl);

describe("Next.js image loader", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("delegates image resolution to the media resolver", () => {
    const expectedUrl =
      "https://ik.imagekit.io/tronosa/images/placeholder.jpg?tr=w-640,q-75";

    mockedResolveImageUrl.mockReturnValue(expectedUrl);

    const result = imageLoader({
      src: "/images/placeholder.jpg",
      width: 640,
      quality: 75,
    });

    expect(mockedResolveImageUrl).toHaveBeenCalledExactlyOnceWith(
      "/images/placeholder.jpg",
      {
        width: 640,
        quality: 75,
      },
    );

    expect(result).toBe(expectedUrl);
  });

  it("delegates without an explicit quality", () => {
    mockedResolveImageUrl.mockReturnValue("/assets/images/placeholder.jpg");

    imageLoader({
      src: "/images/placeholder.jpg",
      width: 1080,
    });

    expect(mockedResolveImageUrl).toHaveBeenCalledExactlyOnceWith(
      "/images/placeholder.jpg",
      {
        width: 1080,
        quality: undefined,
      },
    );
  });

  it("returns the resolved local asset URL", () => {
    const expectedUrl = "/assets/images/placeholder.jpg";

    mockedResolveImageUrl.mockReturnValue(expectedUrl);

    const result = imageLoader({
      src: "/images/placeholder.jpg",
      width: 640,
    });

    expect(result).toBe(expectedUrl);
  });

  it("propagates resolver errors", () => {
    const error = new Error("Unsupported image source");

    mockedResolveImageUrl.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      imageLoader({
        src: "https://untrusted.example.com/image.jpg",
        width: 640,
      }),
    ).toThrow(error);
  });
});
