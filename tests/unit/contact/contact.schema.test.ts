import { describe, expect, it } from "vitest";

import { CONTACT_LIMITS } from "@/lib/contact/contact.constants";
import { contactSubmissionSchema } from "@/lib/contact/contact.schema";

const validSubmission = {
  name: "Marko Petrović",
  email: "marko@example.com",
  subject: "Distribution inquiry",
  message: "I am interested in distributing your products.",
};

describe("Contact submission schema", () => {
  describe("Valid submissions", () => {
    it("accepts a valid submission", () => {
      const result = contactSubmissionSchema.safeParse(validSubmission);

      expect(result.success).toBe(true);
    });

    it.each([
      "Marko Petrović",
      "Марко Петровић",
      "John Smith",
      "Anne-Marie O'Connor",
    ])("accepts international names: %s", (name) => {
      const result = contactSubmissionSchema.safeParse({
        ...validSubmission,
        name,
      });

      expect(result.success).toBe(true);
    });

    it("trims surrounding whitespace from all fields", () => {
      const result = contactSubmissionSchema.parse({
        name: "  Marko Petrović  ",
        email: "  marko@example.com  ",
        subject: "  Distribution inquiry  ",
        message: "  I am interested in your products.  ",
      });

      expect(result).toEqual({
        name: "Marko Petrović",
        email: "marko@example.com",
        subject: "Distribution inquiry",
        message: "I am interested in your products.",
      });
    });

    it("preserves internal message line breaks", () => {
      const message = "Hello,\n\nI am interested in your products.\nThank you.";

      const result = contactSubmissionSchema.parse({
        ...validSubmission,
        message,
      });

      expect(result.message).toBe(message);
    });

    it("accepts Cyrillic message content", () => {
      const result = contactSubmissionSchema.safeParse({
        ...validSubmission,
        subject: "Пословна сарадња",
        message: "Заинтересован сам за дистрибуцију ваших производа.",
      });

      expect(result.success).toBe(true);
    });

    it("accepts fields at their minimum length", () => {
      const result = contactSubmissionSchema.safeParse({
        ...validSubmission,
        name: "a".repeat(CONTACT_LIMITS.name.min),
        subject: "a".repeat(CONTACT_LIMITS.subject.min),
        message: "a".repeat(CONTACT_LIMITS.message.min),
      });

      expect(result.success).toBe(true);
    });

    it("accepts fields at their maximum length", () => {
      const result = contactSubmissionSchema.safeParse({
        ...validSubmission,
        name: "a".repeat(CONTACT_LIMITS.name.max),
        subject: "a".repeat(CONTACT_LIMITS.subject.max),
        message: "a".repeat(CONTACT_LIMITS.message.max),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("Name validation", () => {
    it.each(["", " ", "A"])("rejects an invalid name: %j", (name) => {
      const result = contactSubmissionSchema.safeParse({
        ...validSubmission,
        name,
      });

      expect(result.success).toBe(false);
    });

    it("rejects names exceeding the maximum length", () => {
      const result = contactSubmissionSchema.safeParse({
        ...validSubmission,
        name: "a".repeat(CONTACT_LIMITS.name.max + 1),
      });

      expect(result.success).toBe(false);
    });

    it("returns the expected translation key", () => {
      const result = contactSubmissionSchema.safeParse({
        ...validSubmission,
        name: "",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ["name"],
              message: "name.tooShort",
            }),
          ]),
        );
      }
    });
  });

  describe("Email validation", () => {
    it.each([
      "",
      " ",
      "invalid",
      "marko@",
      "@example.com",
      "marko@example",
      "marko example@example.com",
      "marko@example.com\nother@example.com",
    ])("rejects an invalid email: %j", (email) => {
      const result = contactSubmissionSchema.safeParse({
        ...validSubmission,
        email,
      });

      expect(result.success).toBe(false);
    });

    it.each([
      "marko@example.com",
      "marko.petrovic@example.com",
      "marko+website@example.com",
      "marko@example.co.uk",
    ])("accepts a valid email: %s", (email) => {
      const result = contactSubmissionSchema.safeParse({
        ...validSubmission,
        email,
      });

      expect(result.success).toBe(true);
    });

    it("rejects emails exceeding the maximum length", () => {
      const result = contactSubmissionSchema.safeParse({
        ...validSubmission,
        email: "a".repeat(CONTACT_LIMITS.email.max) + "@example.com",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Subject validation", () => {
    it.each(["", " ", "ab"])("rejects an invalid subject: %j", (subject) => {
      const result = contactSubmissionSchema.safeParse({
        ...validSubmission,
        subject,
      });

      expect(result.success).toBe(false);
    });

    it("rejects subjects exceeding the maximum length", () => {
      const result = contactSubmissionSchema.safeParse({
        ...validSubmission,
        subject: "a".repeat(CONTACT_LIMITS.subject.max + 1),
      });

      expect(result.success).toBe(false);
    });

    it.each([
      "Inquiry\r\nBcc: attacker@example.com",
      "Inquiry\nCc: attacker@example.com",
      "Inquiry\rInjected header",
    ])("rejects subject header injection: %j", (subject) => {
      const result = contactSubmissionSchema.safeParse({
        ...validSubmission,
        subject,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Message validation", () => {
    it.each(["", " ", "Too short"])(
      "rejects an invalid message: %j",
      (message) => {
        const result = contactSubmissionSchema.safeParse({
          ...validSubmission,
          message,
        });

        expect(result.success).toBe(false);
      },
    );

    it("rejects messages exceeding the maximum length", () => {
      const result = contactSubmissionSchema.safeParse({
        ...validSubmission,
        message: "a".repeat(CONTACT_LIMITS.message.max + 1),
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Payload integrity", () => {
    it.each(["name", "email", "subject", "message"] as const)(
      "rejects a missing %s field",
      (field) => {
        const submission: Partial<typeof validSubmission> = {
          ...validSubmission,
        };

        delete submission[field];

        const result = contactSubmissionSchema.safeParse(submission);

        expect(result.success).toBe(false);
      },
    );

    it.each([null, undefined, 123, true, [], "invalid"])(
      "rejects an invalid payload: %j",
      (submission) => {
        const result = contactSubmissionSchema.safeParse(submission);

        expect(result.success).toBe(false);
      },
    );

    it("rejects unexpected payload properties", () => {
      const result = contactSubmissionSchema.safeParse({
        ...validSubmission,
        recipient: "attacker@example.com",
      });

      expect(result.success).toBe(false);
    });

    it("reports multiple invalid fields", () => {
      const result = contactSubmissionSchema.safeParse({
        name: "",
        email: "invalid",
        subject: "",
        message: "",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        const fields = result.error.issues.map((issue) => issue.path[0]);

        expect(fields).toEqual(
          expect.arrayContaining(["name", "email", "subject", "message"]),
        );
      }
    });
  });
});
