import { expect, test, type Locator, type Page } from "@playwright/test";

import { locales } from "@/i18n/config";

import { getSectionTestRoutes } from "../../shared/routes";

const routes = getSectionTestRoutes("contact-form");

const WEB3FORMS_URL = "https://api.web3forms.com/submit";

const MAX_MESSAGE_LENGTH = 3000;

const VALID_VALUES = {
  name: "Marko Petrovic",
  email: "marko@example.com",
  subject: "Product information",
  message: "I would like to receive more information about your products.",
} as const;

const FIELD_NAMES = ["name", "email", "subject", "message"] as const;

type FieldName = (typeof FIELD_NAMES)[number];

type ContactRoute = (typeof routes)[number];

for (const locale of locales) {
  if (!routes.some((route) => route.locale === locale)) {
    throw new Error(`Contact form is missing for locale "${locale}".`);
  }
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

  return form;
}

function getField(form: Locator, field: FieldName): Locator {
  return form.locator(`[name="${field}"]:is(input, textarea)`);
}

function getSubmitButton(form: Locator): Locator {
  return form.locator('button[type="submit"]');
}

async function fillValidFields(form: Locator) {
  for (const field of FIELD_NAMES) {
    await getField(form, field).fill(VALID_VALUES[field]);
  }
}

async function expectFieldError(field: Locator, form: Locator) {
  await expect(field).toHaveAttribute("aria-invalid", "true");

  const id = await field.getAttribute("id");

  expect(id).toBeTruthy();

  const errorId = `${id}-error`;

  const describedBy = await field.getAttribute("aria-describedby");

  expect(describedBy?.split(/\s+/)).toContain(errorId);

  const error = form.locator(`[id="${errorId}"]`);

  await expect(error).toBeVisible();
  await expect(error).not.toBeEmpty();
}

test.describe("Contact form @contact", () => {
  test.describe("Rendering and validation", () => {
    test.beforeEach(async ({ page }) => {
      // Never allow real email submissions during this suite.
      await page.route(WEB3FORMS_URL, (route) => route.abort());

      // External CAPTCHA behavior is tested separately.
      await page.route(
        /^https:\/\/(?:[^/]+\.)?hcaptcha\.com(?:\/|$)/,
        (route) => route.abort(),
      );
    });

    for (const route of routes) {
      test.describe(route.pathname, () => {
        test("renders an accessible contact form", async ({ page }) => {
          const form = await navigateToContactForm(page, route);

          await expect(form).toHaveAccessibleName(/\S+/);

          for (const fieldName of FIELD_NAMES) {
            const field = getField(form, fieldName);

            await expect(field).toHaveCount(1);
            await expect(field).toBeVisible();
            await expect(field).toHaveAccessibleName(/\S+/);
            await expect(field).toHaveAttribute("required", "");
          }

          await expect(getSubmitButton(form)).toBeVisible();
        });

        test("enables form controls after hydration", async ({ page }) => {
          const form = await navigateToContactForm(page, route);

          for (const field of FIELD_NAMES) {
            await expect(getField(form, field)).toBeEnabled();
          }

          await expect(getSubmitButton(form)).toBeEnabled();
        });

        test("uses POST as the native submission method", async ({ page }) => {
          const form = await navigateToContactForm(page, route);

          await expect(form).toHaveAttribute("method", "post");
        });

        test("rejects empty required fields", async ({ page }) => {
          const form = await navigateToContactForm(page, route);

          await getSubmitButton(form).click();

          for (const field of FIELD_NAMES) {
            await expectFieldError(getField(form, field), form);
          }
        });

        test("focuses the first invalid field", async ({ page }) => {
          const form = await navigateToContactForm(page, route);

          await getSubmitButton(form).click();

          await expect(getField(form, "name")).toBeFocused();
        });

        test("rejects an invalid email address", async ({ page }) => {
          const form = await navigateToContactForm(page, route);

          await fillValidFields(form);

          const email = getField(form, "email");

          await email.fill("invalid-email");

          await getSubmitButton(form).click();

          await expectFieldError(email, form);

          await expect(email).toBeFocused();

          for (const fieldName of FIELD_NAMES) {
            if (fieldName !== "email") {
              await expect(getField(form, fieldName)).toHaveAttribute(
                "aria-invalid",
                "false",
              );
            }
          }
        });

        test("clears field errors when the user edits the field", async ({
          page,
        }) => {
          const form = await navigateToContactForm(page, route);

          await getSubmitButton(form).click();

          const name = getField(form, "name");

          await expectFieldError(name, form);

          await name.fill(VALID_VALUES.name);

          await expect(name).toHaveAttribute("aria-invalid", "false");

          await expect(name).not.toHaveAttribute("aria-describedby", /-error/);
        });

        test("enforces the maximum message length", async ({ page }) => {
          const form = await navigateToContactForm(page, route);

          const message = getField(form, "message");

          await expect(message).toHaveAttribute(
            "maxlength",
            String(MAX_MESSAGE_LENGTH),
          );

          await message.fill("a".repeat(MAX_MESSAGE_LENGTH + 1));

          await expect(message).toHaveValue("a".repeat(MAX_MESSAGE_LENGTH));
        });

        test("updates the message character counter", async ({ page }) => {
          const form = await navigateToContactForm(page, route);

          const message = getField(form, "message");

          const id = await message.getAttribute("id");

          expect(id).toBeTruthy();

          const counter = form.locator(`[id="${id}-count"]`);

          await expect(counter).toHaveText(`0 / ${MAX_MESSAGE_LENGTH}`);

          await message.fill(VALID_VALUES.message);

          await expect(counter).toHaveText(
            `${VALID_VALUES.message.length} / ${MAX_MESSAGE_LENGTH}`,
          );

          await message.clear();

          await expect(counter).toHaveText(`0 / ${MAX_MESSAGE_LENGTH}`);
        });

        test("does not submit invalid content to Web3Forms", async ({
          page,
        }) => {
          const requests: string[] = [];

          page.on("request", (request) => {
            if (request.url() === WEB3FORMS_URL) {
              requests.push(request.method());
            }
          });

          const form = await navigateToContactForm(page, route);

          await getSubmitButton(form).click();

          await expectFieldError(getField(form, "name"), form);

          expect(requests).toEqual([]);
        });

        test("does not submit valid content without CAPTCHA verification", async ({
          page,
        }) => {
          const requests: string[] = [];

          page.on("request", (request) => {
            if (request.url() === WEB3FORMS_URL) {
              requests.push(request.method());
            }
          });

          const form = await navigateToContactForm(page, route);

          await fillValidFields(form);

          await getSubmitButton(form).click();

          const captchaGroup = form.getByRole("group");

          await expect(captchaGroup).toHaveCount(1);
          await expect(captchaGroup).toBeFocused();

          const captchaError = captchaGroup.getByRole("status");

          await expect(captchaError).toBeVisible();
          await expect(captchaError).not.toBeEmpty();

          expect(requests).toEqual([]);

          for (const field of FIELD_NAMES) {
            await expect(getField(form, field)).toHaveValue(
              VALID_VALUES[field],
            );
          }
        });
      });
    }
  });

  test.describe("Without JavaScript", () => {
    test.use({
      javaScriptEnabled: false,
    });

    for (const route of routes) {
      test.describe(route.pathname, () => {
        test("preserves server-rendered form markup", async ({ page }) => {
          const form = await navigateToContactForm(page, route);

          for (const field of FIELD_NAMES) {
            await expect(getField(form, field)).toBeVisible();
          }

          await expect(getSubmitButton(form)).toBeVisible();
        });

        test("disables all submission controls", async ({ page }) => {
          const form = await navigateToContactForm(page, route);

          for (const field of FIELD_NAMES) {
            await expect(getField(form, field)).toBeDisabled();
          }

          await expect(getSubmitButton(form)).toBeDisabled();

          await expect(form).toHaveAttribute("method", "post");
        });

        test("displays a localized unavailable message", async ({ page }) => {
          const form = await navigateToContactForm(page, route);

          const fallback = form.locator("noscript p");

          await expect(fallback).toHaveCount(1);
          await expect(fallback).toBeVisible();
          await expect(fallback).not.toBeEmpty();
        });
      });
    }
  });
});
