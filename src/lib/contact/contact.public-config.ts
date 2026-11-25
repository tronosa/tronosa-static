export const CONTACT_HCAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? "";

export function isContactCaptchaConfigured(): boolean {
  return CONTACT_HCAPTCHA_SITE_KEY.trim().length > 0;
}
