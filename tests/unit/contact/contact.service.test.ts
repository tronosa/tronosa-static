import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  CONTACT_API_URL,
  CONTACT_REQUEST_TIMEOUT_MS,
} from "@/lib/contact/contact.config";

import { submitContactForm } from "@/lib/contact/contact.service";

const accessKey = "00000000-0000-4000-8000-000000000001";

const validSubmission = {
  name: "Marko Petrović",
  email: "marko@example.com",
  subject: "Distribution inquiry",
  message: "I am interested in distributing your products.",
};

const fetchMock = vi.fn<typeof fetch>();

function createResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

describe("Contact submission service", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.stubGlobal("fetch", fetchMock);

    vi.stubEnv("NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY", accessKey);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  describe("Successful submissions", () => {
    it("returns success when the provider accepts the submission", async () => {
      fetchMock.mockResolvedValueOnce(
        createResponse({
          success: true,
        }),
      );

      const result = await submitContactForm(validSubmission);

      expect(result).toEqual({
        success: true,
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("uses the expected API endpoint and HTTP options", async () => {
      fetchMock.mockResolvedValueOnce(
        createResponse({
          success: true,
        }),
      );

      await submitContactForm(validSubmission);

      expect(fetchMock).toHaveBeenCalledWith(
        CONTACT_API_URL,
        expect.objectContaining({
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          credentials: "omit",
          redirect: "error",

          signal: expect.any(AbortSignal),
        }),
      );
    });

    it("sends only the expected provider payload", async () => {
      fetchMock.mockResolvedValueOnce(
        createResponse({
          success: true,
        }),
      );

      await submitContactForm(validSubmission);

      expect(fetchMock).toHaveBeenCalledWith(
        CONTACT_API_URL,
        expect.objectContaining({
          body: JSON.stringify({
            access_key: accessKey,
            name: validSubmission.name,
            email: validSubmission.email,
            subject: validSubmission.subject,
            message: validSubmission.message,
          }),
        }),
      );
    });

    it("normalizes fields before sending the request", async () => {
      fetchMock.mockResolvedValueOnce(
        createResponse({
          success: true,
        }),
      );

      await submitContactForm({
        name: `  ${validSubmission.name}  `,
        email: `  ${validSubmission.email}  `,
        subject: `  ${validSubmission.subject}  `,
        message: `  ${validSubmission.message}  `,
      });

      expect(fetchMock).toHaveBeenCalledWith(
        CONTACT_API_URL,
        expect.objectContaining({
          body: JSON.stringify({
            access_key: accessKey,
            ...validSubmission,
          }),
        }),
      );
    });

    it("accepts additional provider response metadata", async () => {
      fetchMock.mockResolvedValueOnce(
        createResponse({
          success: true,
          body: {
            data: validSubmission,
            message: "Email sent successfully!",
          },
        }),
      );

      await expect(submitContactForm(validSubmission)).resolves.toEqual({
        success: true,
      });
    });
  });

  describe("Input validation", () => {
    it("rejects invalid submissions without calling the provider", async () => {
      const result = await submitContactForm({
        ...validSubmission,
        email: "invalid-email",
      });

      expect(result).toEqual({
        success: false,
        code: "invalid-input",
      });

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("rejects unexpected submission fields", async () => {
      const result = await submitContactForm({
        ...validSubmission,
        recipient: "attacker@example.com",
      });

      expect(result).toEqual({
        success: false,
        code: "invalid-input",
      });

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("rejects malformed payloads", async () => {
      const result = await submitContactForm(null);

      expect(result).toEqual({
        success: false,
        code: "invalid-input",
      });

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("Configuration validation", () => {
    it("rejects submissions when the access key is missing", async () => {
      vi.stubEnv("NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY", undefined);

      expect(await submitContactForm(validSubmission)).toEqual({
        success: false,
        code: "configuration-error",
      });

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("rejects submissions when the access key is invalid", async () => {
      vi.stubEnv("NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY", "invalid-key");

      expect(await submitContactForm(validSubmission)).toEqual({
        success: false,
        code: "configuration-error",
      });

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("CAPTCHA integration", () => {
    it("includes the hCaptcha response when provided", async () => {
      fetchMock.mockResolvedValueOnce(
        createResponse({
          success: true,
        }),
      );

      await submitContactForm(validSubmission, {
        captchaToken: "test-captcha-token",
      });

      expect(fetchMock).toHaveBeenCalledWith(
        CONTACT_API_URL,
        expect.objectContaining({
          body: JSON.stringify({
            access_key: accessKey,
            ...validSubmission,
            "h-captcha-response": "test-captcha-token",
          }),
        }),
      );
    });

    it("trims surrounding whitespace from the CAPTCHA token", async () => {
      fetchMock.mockResolvedValueOnce(
        createResponse({
          success: true,
        }),
      );

      await submitContactForm(validSubmission, {
        captchaToken: "  test-token  ",
      });

      expect(fetchMock).toHaveBeenCalledWith(
        CONTACT_API_URL,
        expect.objectContaining({
          body: JSON.stringify({
            access_key: accessKey,
            ...validSubmission,
            "h-captcha-response": "test-token",
          }),
        }),
      );
    });

    it.each(["", " ", "\n"])(
      "rejects an empty CAPTCHA token: %j",
      async (captchaToken) => {
        expect(
          await submitContactForm(validSubmission, {
            captchaToken,
          }),
        ).toEqual({
          success: false,
          code: "verification-failed",
        });

        expect(fetchMock).not.toHaveBeenCalled();
      },
    );

    it("omits the CAPTCHA field when no token is provided", async () => {
      fetchMock.mockResolvedValueOnce(
        createResponse({
          success: true,
        }),
      );

      await submitContactForm(validSubmission);

      const request = fetchMock.mock.calls[0]?.[1];

      const payload = JSON.parse(String(request?.body));

      expect(payload).not.toHaveProperty("h-captcha-response");
    });
  });

  describe("HTTP error handling", () => {
    it("handles rate limiting", async () => {
      fetchMock.mockResolvedValueOnce(
        createResponse(
          {
            success: false,
          },
          429,
        ),
      );

      expect(await submitContactForm(validSubmission)).toEqual({
        success: false,
        code: "rate-limited",
      });
    });

    it.each([500, 502, 503, 504])(
      "handles provider errors: HTTP %i",
      async (status) => {
        fetchMock.mockResolvedValueOnce(
          createResponse(
            {
              success: false,
            },
            status,
          ),
        );

        expect(await submitContactForm(validSubmission)).toEqual({
          success: false,
          code: "service-unavailable",
        });
      },
    );

    it.each([400, 401, 403, 404, 422])(
      "handles rejected submissions: HTTP %i",
      async (status) => {
        fetchMock.mockResolvedValueOnce(
          createResponse(
            {
              success: false,
            },
            status,
          ),
        );

        expect(await submitContactForm(validSubmission)).toEqual({
          success: false,
          code: "submission-failed",
        });
      },
    );
  });

  describe("Provider response validation", () => {
    it("rejects an unsuccessful provider response with HTTP 200", async () => {
      fetchMock.mockResolvedValueOnce(
        createResponse({
          success: false,
          message: "Submission rejected",
        }),
      );

      expect(await submitContactForm(validSubmission)).toEqual({
        success: false,
        code: "submission-failed",
      });
    });

    it.each([
      null,
      {},
      { status: "success" },
      { success: "true" },
      { success: 1 },
      [],
    ])("rejects malformed provider responses: %j", async (body) => {
      fetchMock.mockResolvedValueOnce(createResponse(body));

      expect(await submitContactForm(validSubmission)).toEqual({
        success: false,
        code: "submission-failed",
      });
    });

    it("handles non-JSON provider responses", async () => {
      fetchMock.mockResolvedValueOnce(
        new Response("<html>Unexpected response</html>", {
          status: 200,
          headers: {
            "Content-Type": "text/html",
          },
        }),
      );

      expect(await submitContactForm(validSubmission)).toEqual({
        success: false,
        code: "network-error",
      });
    });
  });

  describe("Network resilience", () => {
    it("handles network failures", async () => {
      fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));

      expect(await submitContactForm(validSubmission)).toEqual({
        success: false,
        code: "network-error",
      });
    });

    it("does not automatically retry a failed submission", async () => {
      fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));

      await submitContactForm(validSubmission);

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("aborts requests that exceed the timeout", async () => {
      vi.useFakeTimers();

      fetchMock.mockImplementationOnce(
        (_input, init) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener(
              "abort",
              () => {
                reject(new DOMException("Request aborted", "AbortError"));
              },
              { once: true },
            );
          }),
      );

      const submission = submitContactForm(validSubmission);

      await vi.advanceTimersByTimeAsync(CONTACT_REQUEST_TIMEOUT_MS);

      expect(await submission).toEqual({
        success: false,
        code: "network-error",
      });

      expect(fetchMock.mock.calls[0]?.[1]?.signal?.aborted).toBe(true);

      expect(vi.getTimerCount()).toBe(0);
    });

    it("clears the timeout after a successful request", async () => {
      vi.useFakeTimers();

      fetchMock.mockResolvedValueOnce(
        createResponse({
          success: true,
        }),
      );

      await submitContactForm(validSubmission);

      expect(vi.getTimerCount()).toBe(0);
    });

    it("clears the timeout after a failed request", async () => {
      vi.useFakeTimers();

      fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));

      await submitContactForm(validSubmission);

      expect(vi.getTimerCount()).toBe(0);
    });
  });
});
