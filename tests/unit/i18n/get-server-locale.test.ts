import { beforeEach, describe, expect, it, vi } from "vitest";

const { getLocaleMock, notFoundMock } = vi.hoisted(() => ({
  getLocaleMock: vi.fn<() => Promise<string>>(),
  notFoundMock: vi.fn<() => never>(),
}));

vi.mock("server-only", () => ({}));

vi.mock("next-intl/server", () => ({
  getLocale: getLocaleMock,
}));

vi.mock("next/navigation", () => ({
  notFound: notFoundMock,
}));

import { getServerLocale } from "@/i18n/get-server-locale";

describe("Server locale", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    notFoundMock.mockImplementation(() => {
      throw new Error("NEXT_NOT_FOUND");
    });
  });

  it.each(["sr-Cyrl", "sr-Latn", "en"] as const)(
    "returns the supported locale %s",
    async (locale) => {
      getLocaleMock.mockResolvedValue(locale);

      await expect(getServerLocale()).resolves.toBe(locale);

      expect(getLocaleMock).toHaveBeenCalledTimes(1);

      expect(notFoundMock).not.toHaveBeenCalled();
    },
  );

  it.each([
    "sr",
    "de",
    "fr",
    "en-US",
    "sr-cyrl",
    "sr-latn",
    "EN",
    "",
    "unknown",
  ])("rejects the unsupported locale %s", async (locale) => {
    getLocaleMock.mockResolvedValue(locale);

    await expect(getServerLocale()).rejects.toThrow("NEXT_NOT_FOUND");

    expect(getLocaleMock).toHaveBeenCalledTimes(1);

    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });

  it("propagates errors from the locale provider", async () => {
    const error = new Error("Unable to resolve request locale");

    getLocaleMock.mockRejectedValue(error);

    await expect(getServerLocale()).rejects.toBe(error);

    expect(notFoundMock).not.toHaveBeenCalled();
  });

  it("resolves the locale independently for subsequent calls", async () => {
    getLocaleMock
      .mockResolvedValueOnce("sr-Cyrl")
      .mockResolvedValueOnce("en")
      .mockResolvedValueOnce("sr-Latn");

    await expect(getServerLocale()).resolves.toBe("sr-Cyrl");

    await expect(getServerLocale()).resolves.toBe("en");

    await expect(getServerLocale()).resolves.toBe("sr-Latn");

    expect(getLocaleMock).toHaveBeenCalledTimes(3);

    expect(notFoundMock).not.toHaveBeenCalled();
  });
});
