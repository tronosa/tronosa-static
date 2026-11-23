"use client";

import dynamic from "next/dynamic";

import {
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";

import type HCaptchaInstance from "@hcaptcha/react-hcaptcha";

import { Button } from "@/components/ui/Button";

import { CONTACT_HCAPTCHA_SITE_KEY } from "@/lib/contact/contact.config";

import { CONTACT_LIMITS } from "@/lib/contact/contact.constants";

import {
  contactSubmissionSchema,
  type ContactSubmission,
} from "@/lib/contact/contact.schema";

import { submitContactForm } from "@/lib/contact/contact.service";

import type {
  ContactField,
  ContactFieldErrors,
  ContactSubmissionStatus,
} from "@/lib/contact/types";

import {
  contactFormPanelVariants,
  contactFormFieldGridVariants,
  contactFormFieldVariants,
  contactFormLabelVariants,
  contactFormControlVariants,
  contactFormTextareaVariants,
  contactFormErrorVariants,
  contactFormHintVariants,
  contactFormStatusVariants,
} from "./contact-form.variants";

import type { ContactFormClientProps } from "./types";

const ContactCaptcha = dynamic(
  () => import("./ContactCaptcha").then((module) => module.ContactCaptcha),
  {
    ssr: false,
  },
);

function subscribeToHydration() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

const INITIAL_VALUES: ContactSubmission = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const FIELDS = [
  "name",
  "email",
  "subject",
  "message",
] as const satisfies readonly ContactField[];

export function ContactFormClient({
  labels,
  configured,
  captchaLanguage,
}: ContactFormClientProps) {
  const formId = useId();

  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot,
  );

  const formRef = useRef<HTMLFormElement>(null);

  const captchaRef = useRef<HCaptchaInstance>(null);

  const captchaContainerRef = useRef<HTMLDivElement>(null);

  const submittingRef = useRef(false);

  const [values, setValues] = useState<ContactSubmission>(INITIAL_VALUES);

  const [errors, setErrors] = useState<ContactFieldErrors>({});

  const [status, setStatus] = useState<ContactSubmissionStatus>("idle");

  const [statusMessage, setStatusMessage] = useState("");

  const [captchaRequested, setCaptchaRequested] = useState(false);

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const [captchaError, setCaptchaError] = useState("");

  const isSubmitting = status === "submitting";

  const disabled = !isHydrated || !configured || isSubmitting;

  const captchaId = `${formId}-captcha`;

  function getFieldId(field: ContactField) {
    return `${formId}-${field}`;
  }

  function requestCaptcha() {
    if (isHydrated && configured) {
      setCaptchaRequested(true);
    }
  }

  function updateField(field: ContactField, value: string) {
    requestCaptcha();

    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));

    if (status === "success" || status === "error") {
      setStatus("idle");
      setStatusMessage("");
    }
  }

  function focusField(field: ContactField) {
    const control = formRef.current?.elements.namedItem(field);

    if (control instanceof HTMLElement) {
      control.focus();
    }
  }

  function handleCaptchaVerify(token: string) {
    setCaptchaToken(token);
    setCaptchaError("");
  }

  function handleCaptchaExpire() {
    setCaptchaToken(null);

    if (!submittingRef.current) {
      setCaptchaError(labels.captcha.expired);
    }
  }

  function handleCaptchaError() {
    setCaptchaToken(null);

    if (!submittingRef.current) {
      setCaptchaError(labels.captcha.error);
    }
  }

  function resetCaptcha() {
    setCaptchaToken(null);

    captchaRef.current?.resetCaptcha();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isHydrated || !configured || submittingRef.current) {
      return;
    }

    requestCaptcha();

    setStatus("idle");
    setStatusMessage("");

    const validation = contactSubmissionSchema.safeParse(values);

    if (!validation.success) {
      const fieldErrors: ContactFieldErrors = {};

      for (const issue of validation.error.issues) {
        const field = issue.path[0];

        if (
          typeof field === "string" &&
          FIELDS.includes(field as ContactField)
        ) {
          const contactField = field as ContactField;

          fieldErrors[contactField] ??=
            labels.validation[issue.message] ?? labels.required;
        }
      }

      setErrors(fieldErrors);

      setStatus("error");
      setStatusMessage(labels.required);

      const firstInvalidField = FIELDS.find((field) => fieldErrors[field]);

      if (firstInvalidField) {
        focusField(firstInvalidField);
      }

      return;
    }

    setErrors({});

    if (!captchaToken) {
      setCaptchaError(labels.captcha.required);

      captchaContainerRef.current?.focus();

      return;
    }

    setCaptchaError("");

    submittingRef.current = true;

    setStatus("submitting");
    setStatusMessage(labels.submitting);

    try {
      const result = await submitContactForm(validation.data, {
        captchaToken,
      });

      if (result.success) {
        setValues({ ...INITIAL_VALUES });

        setStatus("success");
        setStatusMessage(labels.success);

        return;
      }

      setStatus("error");

      switch (result.code) {
        case "verification-failed":
          setCaptchaError(labels.captcha.required);
          setStatusMessage(labels.captcha.required);
          break;

        case "rate-limited":
          setStatusMessage(labels.rateLimited);
          break;

        case "configuration-error":
        case "service-unavailable":
          setStatusMessage(labels.unavailable);
          break;

        default:
          setStatusMessage(labels.error);
      }
    } catch {
      setStatus("error");
      setStatusMessage(labels.error);
    } finally {
      try {
        resetCaptcha();
      } catch {
        setCaptchaError(labels.captcha.error);
      } finally {
        submittingRef.current = false;
      }
    }
  }

  function renderField(field: Exclude<ContactField, "message">) {
    const id = getFieldId(field);
    const error = errors[field];

    return (
      <div className={contactFormFieldVariants()}>
        <label htmlFor={id} className={contactFormLabelVariants()}>
          {labels.fields[field].label}
          <span aria-hidden="true"> *</span>
        </label>

        <input
          id={id}
          name={field}
          type={field === "email" ? "email" : "text"}
          autoComplete={
            field === "name" ? "name" : field === "email" ? "email" : undefined
          }
          required
          disabled={disabled}
          maxLength={CONTACT_LIMITS[field].max}
          value={values[field]}
          placeholder={labels.fields[field].placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => updateField(field, event.target.value)}
          className={contactFormControlVariants({
            invalid: Boolean(error),
          })}
        />

        {error && (
          <p id={`${id}-error`} className={contactFormErrorVariants()}>
            {error}
          </p>
        )}
      </div>
    );
  }

  const messageId = getFieldId("message");

  return (
    <form
      ref={formRef}
      method="post"
      noValidate
      onSubmit={handleSubmit}
      onFocusCapture={requestCaptcha}
      aria-label={labels.submit}
      className={contactFormPanelVariants()}
    >
      <div className={contactFormFieldGridVariants()}>
        {renderField("name")}
        {renderField("email")}
      </div>

      {renderField("subject")}

      <div className={contactFormFieldVariants()}>
        <label htmlFor={messageId} className={contactFormLabelVariants()}>
          {labels.fields.message.label}
          <span aria-hidden="true"> *</span>
        </label>

        <textarea
          id={messageId}
          name="message"
          required
          disabled={disabled}
          maxLength={CONTACT_LIMITS.message.max}
          value={values.message}
          placeholder={labels.fields.message.placeholder}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message
              ? `${messageId}-error ${messageId}-count`
              : `${messageId}-count`
          }
          onChange={(event) => updateField("message", event.target.value)}
          className={[
            contactFormControlVariants({
              invalid: Boolean(errors.message),
            }),
            contactFormTextareaVariants(),
          ].join(" ")}
        />

        <div
          id={`${messageId}-count`}
          className="text-right text-xs tabular-nums"
        >
          {values.message.length} / {CONTACT_LIMITS.message.max}
        </div>

        {errors.message && (
          <p id={`${messageId}-error`} className={contactFormErrorVariants()}>
            {errors.message}
          </p>
        )}
      </div>

      <p className={contactFormHintVariants()}>{labels.privacy}</p>

      {configured && (
        <noscript>
          <p className={contactFormErrorVariants()}>{labels.unavailable}</p>
        </noscript>
      )}

      {configured && (
        <div
          ref={captchaContainerRef}
          role="group"
          tabIndex={-1}
          aria-labelledby={`${captchaId}-label`}
          aria-describedby={captchaError ? `${captchaId}-error` : undefined}
          className={contactFormFieldVariants()}
        >
          <p id={`${captchaId}-label`} className={contactFormLabelVariants()}>
            {labels.captcha.label}
          </p>

          <div className="min-h-36 min-w-0" inert={isSubmitting}>
            {captchaRequested && (
              <ContactCaptcha
                captchaRef={captchaRef}
                sitekey={CONTACT_HCAPTCHA_SITE_KEY}
                languageOverride={captchaLanguage}
                reCaptchaCompat={false}
                theme="light"
                size="compact"
                onVerify={handleCaptchaVerify}
                onExpire={handleCaptchaExpire}
                onError={handleCaptchaError}
                onChalExpired={handleCaptchaExpire}
              />
            )}
          </div>

          <p
            id={`${captchaId}-error`}
            role="status"
            aria-live="polite"
            className={captchaError ? contactFormErrorVariants() : "sr-only"}
          >
            {captchaError}
          </p>
        </div>
      )}

      <div>
        <Button
          type="submit"
          variant="outline"
          size="lg"
          arrow={!isSubmitting}
          disabled={disabled}
          aria-busy={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? labels.submitting : labels.submit}
        </Button>
      </div>

      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={contactFormStatusVariants({
          status: configured ? status : "error",
        })}
      >
        {configured ? statusMessage : labels.unavailable}
      </p>
    </form>
  );
}
