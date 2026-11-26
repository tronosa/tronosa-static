import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ENV_KEY = "NEXT_PUBLIC_HCAPTCHA_SITE_KEY";

async function loadConfig(value: string | undefined) {
  vi.stubEnv(ENV_KEY, value);

  return import("@/lib/contact/contact.public-config");
}

describe("Contact public configuration", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  describe("CONTACT_HCAPTCHA_SITE_KEY", () => {
    it("defaults to an empty string when the environment variable is missing", async () => {
      const config = await loadConfig(undefined);

      expect(config.CONTACT_HCAPTCHA_SITE_KEY).toBe("");
    });

    it("preserves an explicitly empty environment variable", async () => {
      const config = await loadConfig("");

      expect(config.CONTACT_HCAPTCHA_SITE_KEY).toBe("");
    });

    it("reads the configured public site key", async () => {
      const config = await loadConfig("test-site-key");

      expect(config.CONTACT_HCAPTCHA_SITE_KEY).toBe("test-site-key");
    });

    it("preserves the original environment variable value", async () => {
      const config = await loadConfig("  test-site-key  ");

      expect(config.CONTACT_HCAPTCHA_SITE_KEY).toBe("  test-site-key  ");
    });
  });

  describe("isContactCaptchaConfigured", () => {
    it.each([undefined, "", " ", "   ", "\t", "\n", "\t\n "])(
      "returns false for a missing or blank site key: %j",
      async (value) => {
        const config = await loadConfig(value);

        expect(config.isContactCaptchaConfigured()).toBe(false);
      },
    );

    it.each([
      "test-site-key",
      " test-site-key",
      "test-site-key ",
      "  test-site-key  ",
    ])("returns true for a non-empty site key: %j", async (value) => {
      const config = await loadConfig(value);

      expect(config.isContactCaptchaConfigured()).toBe(true);
    });
  });
});
