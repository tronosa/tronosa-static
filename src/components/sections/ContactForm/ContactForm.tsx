import { useId } from "react";
import { getLocale, getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Typography } from "@/components/ui/Typography";

import {
  getContactConfig,
  isContactCaptchaConfigured,
} from "@/lib/contact/contact.config";

import { ContactFormClient } from "./ContactFormClient";
import { ContactFormDecoration } from "./ContactFormDecoration";

import {
  contactFormVariants,
  contactFormLayoutVariants,
  contactFormHeaderVariants,
  contactFormHeaderContentVariants,
  contactFormEyebrowVariants,
  contactFormTitleVariants,
  contactFormDescriptionVariants,
  contactFormTopicsVariants,
  contactFormTopicVariants,
  contactFormTopicMarkerVariants,
  contactFormDecorationSpaceVariants,
  contactFormBodyVariants,
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
  layout = "default",
  topics,
  decoration = false,
  headingId,
}: ContactFormProps & {
  headingId: string;
}) {
  const [t, locale] = await Promise.all([
    getTranslations("ContactForm"),
    getLocale(),
  ]);

  const captchaLanguage: ContactCaptchaLanguage = locale === "en" ? "en" : "sr";

  const isEditorial = layout === "editorial";

  const headingTone = isEditorial ? "inverse" : "accent";

  const descriptionTone = isEditorial ? "inverse" : "muted";

  const showDecoration = isEditorial && decoration;

  const hasTopics = Boolean(topics?.length);

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

  const configured =
    getContactConfig() !== null && isContactCaptchaConfigured();

  return (
    <Section
      aria-labelledby={headingId}
      data-contact-form
      data-contact-layout={layout}
      className={contactFormVariants()}
    >
      <Container size="wide">
        <div
          className={contactFormLayoutVariants({
            layout,
          })}
        >
          <header
            data-contact-header
            className={contactFormHeaderVariants({
              layout,
            })}
          >
            <div className={contactFormHeaderContentVariants()}>
              {eyebrow && (
                <Typography
                  as="p"
                  variant="caption"
                  weight="semibold"
                  tone={headingTone}
                  className={contactFormEyebrowVariants()}
                >
                  {eyebrow}
                </Typography>
              )}

              <Typography
                as="h2"
                id={headingId}
                variant="h2"
                weight="medium"
                tone={headingTone}
                className={contactFormTitleVariants()}
              >
                {title}
              </Typography>

              <Typography
                as="p"
                variant="body"
                tone={descriptionTone}
                className={contactFormDescriptionVariants()}
              >
                {description}
              </Typography>
            </div>

            {isEditorial && hasTopics && (
              <ul
                role="list"
                data-contact-topics
                className={contactFormTopicsVariants()}
              >
                {topics?.map((topic) => (
                  <li key={topic.id} className={contactFormTopicVariants()}>
                    <span
                      aria-hidden="true"
                      className={contactFormTopicMarkerVariants()}
                    />

                    <Typography
                      as="span"
                      variant="small"
                      weight="medium"
                      tone="inverse"
                    >
                      {topic.label}
                    </Typography>
                  </li>
                ))}
              </ul>
            )}

            {showDecoration && (
              <>
                <div
                  aria-hidden="true"
                  className={contactFormDecorationSpaceVariants()}
                />

                <ContactFormDecoration />
              </>
            )}
          </header>

          <div
            data-contact-body
            className={contactFormBodyVariants({
              layout,
            })}
          >
            <ContactFormClient
              labels={labels}
              configured={configured}
              captchaLanguage={captchaLanguage}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
