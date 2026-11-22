import { z } from "zod";

import {
  CONTACT_API_URL,
  CONTACT_REQUEST_TIMEOUT_MS,
  getContactConfig,
} from "./contact.config";

import { contactSubmissionSchema } from "./contact.schema";

import type { ContactSubmissionResult } from "./types";

interface ContactSubmissionOptions {
  captchaToken?: string;
}

const providerResponseSchema = z.object({
  success: z.boolean(),
});

export async function submitContactForm(
  input: unknown,
  options: ContactSubmissionOptions = {},
): Promise<ContactSubmissionResult> {
  const submission = contactSubmissionSchema.safeParse(input);

  if (!submission.success) {
    return {
      success: false,
      code: "invalid-input",
    };
  }

  const config = getContactConfig();

  if (!config) {
    return {
      success: false,
      code: "configuration-error",
    };
  }

  const captchaToken = options.captchaToken?.trim();

  if (options.captchaToken !== undefined && !captchaToken) {
    return {
      success: false,
      code: "verification-failed",
    };
  }

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, CONTACT_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(CONTACT_API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      credentials: "omit",
      redirect: "error",

      signal: controller.signal,

      body: JSON.stringify({
        access_key: config.accessKey,

        name: submission.data.name,
        email: submission.data.email,
        subject: submission.data.subject,
        message: submission.data.message,

        ...(captchaToken ? { "h-captcha-response": captchaToken } : {}),
      }),
    });

    if (response.status === 429) {
      return {
        success: false,
        code: "rate-limited",
      };
    }

    if (response.status >= 500) {
      return {
        success: false,
        code: "service-unavailable",
      };
    }

    if (!response.ok) {
      return {
        success: false,
        code: "submission-failed",
      };
    }

    const payload: unknown = await response.json();

    const result = providerResponseSchema.safeParse(payload);

    if (!result.success || !result.data.success) {
      return {
        success: false,
        code: "submission-failed",
      };
    }

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      code: "network-error",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
