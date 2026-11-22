import { useId } from "react";
import { getLocale, getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import {
  getContactConfig,
  isContactCaptchaConfigured,
} from "@/lib/contact/contact.config";

import { ContactFormClient } from "./ContactFormClient";

import {
  contactFormVariants,
  contactFormLayoutVariants,
  contactFormHeaderVariants,
  contactFormEyebrowVariants,
  contactFormTitleVariants,
  contactFormDescriptionVariants,
} from "./contact-form.variants";

import type {
  ContactCaptchaLanguage,
  ContactFormLabels,
  ContactFormProps,
} from "./types";

export function ContactForm(props: ContactFormProps) {
  const headingId = useId();

  return <ContactFormSection {...props} headingId={headingId} />;
}

async function ContactFormSection({
  eyebrow,
  title,
  description,
  headingId,
}: ContactFormProps & { headingId: string }) {
  const [t, locale] = await Promise.all([
    getTranslations("ContactForm"),
    getLocale(),
  ]);

  const captchaLanguage: ContactCaptchaLanguage = locale === "en" ? "en" : "sr";

  const labels: ContactFormLabels = {
    fields: {
      name: {
        label: t("fields.name.label"),
        placeholder: t("fields.name.placeholder"),
      },
      email: {
        label: t("fields.email.label"),
        placeholder: t("fields.email.placeholder"),
      },
      subject: {
        label: t("fields.subject.label"),
        placeholder: t("fields.subject.placeholder"),
      },
      message: {
        label: t("fields.message.label"),
        placeholder: t("fields.message.placeholder"),
      },
    },

    validation: {
      "name.tooShort": t("validation.name.tooShort"),
      "name.tooLong": t("validation.name.tooLong"),

      "email.invalid": t("validation.email.invalid"),
      "email.tooLong": t("validation.email.tooLong"),

      "subject.tooShort": t("validation.subject.tooShort"),
      "subject.tooLong": t("validation.subject.tooLong"),
      "subject.invalid": t("validation.subject.invalid"),

      "message.tooShort": t("validation.message.tooShort"),
      "message.tooLong": t("validation.message.tooLong"),
    },

    captcha: {
      label: t("captcha.label"),
      required: t("captcha.required"),
      expired: t("captcha.expired"),
      error: t("captcha.error"),
    },

    submit: t("submit"),
    submitting: t("submitting"),
    success: t("success"),
    error: t("error"),
    rateLimited: t("rateLimited"),
    unavailable: t("unavailable"),
    required: t("required"),
    privacy: t("privacy"),
  };

  return (
    <Section
      spacingType="padding"
      aria-labelledby={headingId}
      data-contact-form
      className={contactFormVariants()}
    >
      <Container size="wide">
        <div className={contactFormLayoutVariants()}>
          <header className={contactFormHeaderVariants()}>
            {eyebrow && (
              <p className={contactFormEyebrowVariants()}>{eyebrow}</p>
            )}

            <h2 id={headingId} className={contactFormTitleVariants()}>
              {title}
            </h2>

            <p className={contactFormDescriptionVariants()}>{description}</p>
          </header>

          <ContactFormClient
            labels={labels}
            configured={
              getContactConfig() !== null && isContactCaptchaConfigured()
            }
            captchaLanguage={captchaLanguage}
          />
        </div>
      </Container>
    </Section>
  );
}
