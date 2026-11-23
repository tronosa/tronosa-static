import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CONTACT_API_URL,
  CONTACT_REQUEST_TIMEOUT_MS,
  getContactConfig,
} from "@/lib/contact/contact.config";

const validAccessKey = "00000000-0000-4000-8000-000000000001";

describe("Contact configuration", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses the official Web3Forms API endpoint", () => {
    expect(CONTACT_API_URL).toBe("https://api.web3forms.com/submit");
  });

  it("defines a bounded request timeout", () => {
    expect(CONTACT_REQUEST_TIMEOUT_MS).toBe(15_000);
  });

  it("returns configuration for a valid access key", () => {
    vi.stubEnv("NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY", validAccessKey);

    expect(getContactConfig()).toEqual({
      accessKey: validAccessKey,
    });
  });

  it.each(["", " ", "invalid-key", "12345", "your_access_key"])(
    "rejects invalid access keys: %j",
    (accessKey) => {
      vi.stubEnv("NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY", accessKey);

      expect(getContactConfig()).toBeNull();
    },
  );

  it("handles a missing access key", () => {
    vi.stubEnv("NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY", undefined);

    expect(getContactConfig()).toBeNull();
  });
});
