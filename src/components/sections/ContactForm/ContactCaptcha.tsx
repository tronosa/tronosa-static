"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";

import type { ComponentProps, RefObject } from "react";

type ContactCaptchaProps = ComponentProps<typeof HCaptcha> & {
  captchaRef: RefObject<HCaptcha | null>;
};

export function ContactCaptcha({ captchaRef, ...props }: ContactCaptchaProps) {
  return <HCaptcha {...props} ref={captchaRef} />;
}
