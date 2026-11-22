import { z } from "zod";

import { CONTACT_LIMITS } from "./contact.constants";

export const contactSubmissionSchema = z.strictObject({
  name: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.name.min, "name.tooShort")
    .max(CONTACT_LIMITS.name.max, "name.tooLong"),

  email: z
    .string()
    .trim()
    .max(CONTACT_LIMITS.email.max, "email.tooLong")
    .pipe(z.email("email.invalid")),

  subject: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.subject.min, "subject.tooShort")
    .max(CONTACT_LIMITS.subject.max, "subject.tooLong")
    .refine((value) => !/[\r\n]/.test(value), "subject.invalid"),

  message: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.message.min, "message.tooShort")
    .max(CONTACT_LIMITS.message.max, "message.tooLong"),
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;
