import { z } from "@/lib/validation/zod";

export {
  CONTACT_HCAPTCHA_SITE_KEY,
  isContactCaptchaConfigured,
} from "./contact.public-config";

const accessKeySchema = z.uuid();

export const CONTACT_API_URL = "https://api.web3forms.com/submit";

export const CONTACT_REQUEST_TIMEOUT_MS = 15_000;

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
