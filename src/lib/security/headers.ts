import { getContentSecurityPolicyHeader } from "./csp";

export interface SecurityHeader {
  key: string;
  value: string;
}

export function getSecurityHeaders(): SecurityHeader[] {
  const isProduction = process.env.NODE_ENV === "production";

  return [
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    {
      key: "X-Frame-Options",
      value: "DENY",
    },
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    },
    {
      key: "Permissions-Policy",
      value: ["camera=()", "microphone=()", "payment=()", "usb=()"].join(", "),
    },
    {
      key: "X-Permitted-Cross-Domain-Policies",
      value: "none",
    },

    getContentSecurityPolicyHeader(isProduction ? "enforce" : "report-only"),
  ];
}
