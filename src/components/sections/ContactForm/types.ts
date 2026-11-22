import type { z } from "zod";

import type { ContactField } from "@/lib/contact/types";

import type {
  contactFormContentSchema,
  contactFormSectionSchema,
} from "./contact-form.schema";

export type ContactFormContent = z.infer<typeof contactFormContentSchema>;

export type ContactFormSection = z.infer<typeof contactFormSectionSchema>;

export type ContactFormProps = ContactFormContent;

export type ContactCaptchaLanguage = "en" | "sr";

export interface ContactFormLabels {
  fields: Record<
    ContactField,
    {
      label: string;
      placeholder: string;
    }
  >;

  validation: Record<string, string>;

  captcha: {
    label: string;
    required: string;
    expired: string;
    error: string;
  };

  submit: string;
  submitting: string;
  success: string;
  error: string;
  rateLimited: string;
  unavailable: string;
  required: string;
  privacy: string;
}

export interface ContactFormClientProps {
  labels: ContactFormLabels;
  configured: boolean;
  captchaLanguage: ContactCaptchaLanguage;
}
