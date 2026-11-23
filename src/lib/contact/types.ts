import type { ContactSubmission } from "./contact.schema";

export type ContactField = keyof ContactSubmission;

export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export type ContactSubmissionStatus =
  "idle" | "submitting" | "success" | "error";

export type ContactSubmissionErrorCode =
  | "invalid-input"
  | "configuration-error"
  | "verification-failed"
  | "rate-limited"
  | "network-error"
  | "service-unavailable"
  | "submission-failed";

export type ContactSubmissionResult =
  | {
      success: true;
    }
  | {
      success: false;
      code: ContactSubmissionErrorCode;
    };
