import { z } from "@/lib/validation/zod";

const accessKeySchema = z.uuid();

export const CONTACT_API_URL = "https://api.web3forms.com/submit";

export const CONTACT_REQUEST_TIMEOUT_MS = 15_000;

export const CONTACT_HCAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? "";

export interface ContactConfig {
  accessKey: string;
}

export function getContactConfig(): ContactConfig | null {
  const result = accessKeySchema.safeParse(
    process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
  );

  if (!result.success) {
    return null;
  }

  return {
    accessKey: result.data,
  };
}

export function isContactCaptchaConfigured(): boolean {
  return CONTACT_HCAPTCHA_SITE_KEY.trim().length > 0;
}
