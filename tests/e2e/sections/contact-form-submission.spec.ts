import { expect, test, type Locator, type Page } from "@playwright/test";

import { HCAPTCHA_TEST_TOKEN, mockHCaptcha } from "../../shared/mocks/hcaptcha";

import { getSectionTestRoutes } from "../../shared/routes";

const routes = getSectionTestRoutes("contact-form");

const WEB3FORMS_URL = "https://api.web3forms.com/submit";

const VALID_VALUES = {
  name: "Marko Petrovic",
  email: "marko@example.com",
  subject: "Product information",
  message: "I would like to receive more information about your products.",
} as const;

const FIELD_NAMES = ["name", "email", "subject", "message"] as const;

type FieldName = (typeof FIELD_NAMES)[number];

type ContactRoute = (typeof routes)[number];

type MockResponse = {
  status?: number;
  body?: Record<string, unknown>;
  networkError?: boolean;
  waitFor?: Promise<void>;
};

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

async function mockWeb3Forms(
  page: Page,
  responses: MockResponse[] = [
    {
      status: 200,
      body: {
        success: true,
      },
    },
  ],
) {
  const submissions: unknown[] = [];

  await page.route(WEB3FORMS_URL, async (route) => {
    const request = route.request();

    if (request.method() === "OPTIONS") {
      await route.fulfill({
        status: 204,
        headers: CORS_HEADERS,
      });

      return;
    }

    if (request.method() !== "POST") {
      await route.abort();

      return;
    }

    submissions.push(request.postDataJSON());

    const response =
      responses[Math.min(submissions.length - 1, responses.length - 1)];

    if (!response) {
      throw new Error("Missing Web3Forms mock response.");
    }

    if (response.waitFor) {
      await response.waitFor;
    }

    if (response.networkError) {
      await route.abort("failed");

      return;
    }

    await route.fulfill({
      status: response.status ?? 200,

      headers: CORS_HEADERS,

      contentType: "application/json",

      body: JSON.stringify(
        response.body ?? {
          success: false,
        },
      ),
    });
  });

  return submissions;
}

async function navigateToContactForm(
  page: Page,
  route: ContactRoute,
): Promise<Locator> {
  const response = await page.goto(route.pathname);

  expect(response?.status()).toBe(route.expectedStatus);

  const section = page.locator("[data-contact-form]");

  await expect(section).toHaveCount(1);

  const form = section.getByRole("form");

  await expect(form).toHaveCount(1);

  await expect(form).toBeVisible();

  await expect(getSubmitButton(form)).toBeEnabled();

  return form;
}

function getField(form: Locator, field: FieldName): Locator {
  return form.locator(`[name="${field}"]:is(input, textarea)`);
}

function getSubmitButton(form: Locator): Locator {
  return form.locator('button[type="submit"]');
}

function getSubmissionStatus(form: Locator): Locator {
  return form.locator(':scope > p[role="status"]');
}

async function fillValidFields(form: Locator) {
  for (const field of FIELD_NAMES) {
    await getField(form, field).fill(VALID_VALUES[field]);
  }
}

async function expectPreservedValues(form: Locator) {
  for (const field of FIELD_NAMES) {
    await expect(getField(form, field)).toHaveValue(VALID_VALUES[field]);
  }
}

async function expectEmptyValues(form: Locator) {
  for (const field of FIELD_NAMES) {
    await expect(getField(form, field)).toHaveValue("");
  }
}

async function expectEnabledControls(form: Locator) {
  for (const field of FIELD_NAMES) {
    await expect(getField(form, field)).toBeEnabled();
  }

  await expect(getSubmitButton(form)).toBeEnabled();
}

async function expectDisabledControls(form: Locator) {
  for (const field of FIELD_NAMES) {
    await expect(getField(form, field)).toBeDisabled();
  }

  await expect(getSubmitButton(form)).toBeDisabled();
}

test.describe("Contact form submission @contact", () => {
  for (const route of routes) {
    test.describe(route.pathname, () => {
      test("does not load CAPTCHA before interaction", async ({ page }) => {
        const captcha = await mockHCaptcha(page);

        const submissions = await mockWeb3Forms(page);

        await navigateToContactForm(page, route);

        await page.waitForLoadState("load");

        expect(captcha.scriptRequests).toHaveLength(0);

        await expect(captcha.widget).toHaveCount(0);

        expect(submissions).toHaveLength(0);
      });

      test("loads CAPTCHA after form interaction", async ({ page }) => {
        const captcha = await mockHCaptcha(page);

        await mockWeb3Forms(page);

        const form = await navigateToContactForm(page, route);

        expect(captcha.scriptRequests).toHaveLength(0);

        await getField(form, "name").focus();

        await expect(captcha.widget).toBeVisible();

        await expect(captcha.verify).toBeVisible();

        expect(captcha.scriptRequests).toHaveLength(1);
      });

      test("submits verified contact data with the expected payload", async ({
        page,
      }) => {
        const captcha = await mockHCaptcha(page);

        const submissions = await mockWeb3Forms(page);

        const form = await navigateToContactForm(page, route);

        await fillValidFields(form);

        await captcha.verify.click();

        await getSubmitButton(form).click();

        await expect.poll(() => submissions.length).toBe(1);

        expect(submissions[0]).toStrictEqual({
          access_key: expect.stringMatching(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
          ),

          ...VALID_VALUES,

          "h-captcha-response": HCAPTCHA_TEST_TOKEN,
        });

        await expectEmptyValues(form);

        await expect(getSubmissionStatus(form)).toBeVisible();

        await expect(getSubmissionStatus(form)).not.toBeEmpty();

        await expect(captcha.widget).toHaveAttribute("data-reset-count", "1");

        await expectEnabledControls(form);
      });

      test("disables controls during submission and prevents duplicate requests", async ({
        page,
      }) => {
        const captcha = await mockHCaptcha(page);

        let releaseRequest!: () => void;

        const pendingResponse = new Promise<void>((resolve) => {
          releaseRequest = resolve;
        });

        const submissions = await mockWeb3Forms(page, [
          {
            status: 200,

            body: {
              success: true,
            },

            waitFor: pendingResponse,
          },
        ]);

        try {
          const form = await navigateToContactForm(page, route);

          await fillValidFields(form);

          await captcha.verify.click();

          const submit = getSubmitButton(form);

          await submit.click();

          await expect.poll(() => submissions.length).toBe(1);

          await expectDisabledControls(form);

          await expect(submit).toHaveAttribute("aria-busy", "true");

          await form.evaluate((element) => {
            const form = element as HTMLFormElement;

            form.requestSubmit();
            form.requestSubmit();
          });

          expect(submissions).toHaveLength(1);

          releaseRequest();

          await expectEnabledControls(form);

          await expectEmptyValues(form);

          await expect(submit).toHaveAttribute("aria-busy", "false");

          expect(submissions).toHaveLength(1);
        } finally {
          releaseRequest();
        }
      });

      const failureScenarios = [
        {
          name: "handles HTTP 429 rate limiting",

          response: {
            status: 429,

            body: {
              success: false,
            },
          },
        },
        {
          name: "handles HTTP 500 service failures",

          response: {
            status: 500,

            body: {
              success: false,
            },
          },
        },
        {
          name: "handles network failures",

          response: {
            networkError: true,
          },
        },
        {
          name: "handles rejected provider responses",

          response: {
            status: 200,

            body: {
              success: false,
            },
          },
        },
        {
          name: "handles malformed provider responses",

          response: {
            status: 200,

            body: {
              success: "true",
            },
          },
        },
      ] satisfies {
        name: string;
        response: MockResponse;
      }[];

      for (const scenario of failureScenarios) {
        test(scenario.name, async ({ page }) => {
          const captcha = await mockHCaptcha(page);

          const submissions = await mockWeb3Forms(page, [scenario.response]);

          const form = await navigateToContactForm(page, route);

          await fillValidFields(form);

          await captcha.verify.click();

          await getSubmitButton(form).click();

          await expect.poll(() => submissions.length).toBe(1);

          await expect(captcha.widget).toHaveAttribute("data-reset-count", "1");

          await expectEnabledControls(form);

          await expectPreservedValues(form);

          await expect(getSubmissionStatus(form)).toBeVisible();

          await expect(getSubmissionStatus(form)).not.toBeEmpty();

          await expect(getSubmitButton(form)).toHaveAttribute(
            "aria-busy",
            "false",
          );

          expect(submissions).toHaveLength(1);
        });
      }

      test("prevents submission after CAPTCHA token expiration", async ({
        page,
      }) => {
        const captcha = await mockHCaptcha(page);

        const submissions = await mockWeb3Forms(page);

        const form = await navigateToContactForm(page, route);

        await fillValidFields(form);

        await captcha.verify.click();

        await captcha.expire.click();

        const captchaGroup = form.getByRole("group");

        const captchaStatus = captchaGroup.getByRole("status");

        await expect(captchaStatus).toBeVisible();

        await expect(captchaStatus).not.toBeEmpty();

        await getSubmitButton(form).click();

        await expect(captchaGroup).toBeFocused();

        expect(submissions).toHaveLength(0);

        await expectPreservedValues(form);
      });

      test("requires fresh CAPTCHA verification after successful submission", async ({
        page,
      }) => {
        const captcha = await mockHCaptcha(page);

        const submissions = await mockWeb3Forms(page);

        const form = await navigateToContactForm(page, route);

        await fillValidFields(form);

        await captcha.verify.click();

        await getSubmitButton(form).click();

        await expect(captcha.widget).toHaveAttribute("data-reset-count", "1");

        await expectEnabledControls(form);

        await expectEmptyValues(form);

        await fillValidFields(form);

        await getSubmitButton(form).click();

        await expect(form.getByRole("group")).toBeFocused();

        expect(submissions).toHaveLength(1);

        await captcha.verify.click();

        await getSubmitButton(form).click();

        await expect.poll(() => submissions.length).toBe(2);

        await expect(captcha.widget).toHaveAttribute("data-reset-count", "2");

        await expectEmptyValues(form);
      });

      test("allows retry after failure and fresh CAPTCHA verification", async ({
        page,
      }) => {
        const captcha = await mockHCaptcha(page);

        const submissions = await mockWeb3Forms(page, [
          {
            status: 500,

            body: {
              success: false,
            },
          },
          {
            status: 200,

            body: {
              success: true,
            },
          },
        ]);

        const form = await navigateToContactForm(page, route);

        await fillValidFields(form);

        await captcha.verify.click();

        await getSubmitButton(form).click();

        await expect(captcha.widget).toHaveAttribute("data-reset-count", "1");

        await expectEnabledControls(form);

        await expectPreservedValues(form);

        expect(submissions).toHaveLength(1);

        await getSubmitButton(form).click();

        await expect(form.getByRole("group")).toBeFocused();

        expect(submissions).toHaveLength(1);

        await captcha.verify.click();

        await getSubmitButton(form).click();

        await expect.poll(() => submissions.length).toBe(2);

        await expect(captcha.widget).toHaveAttribute("data-reset-count", "2");

        await expectEmptyValues(form);

        await expectEnabledControls(form);
      });
    });
  }
});
