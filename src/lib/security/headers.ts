export interface SecurityHeader {
  key: string;
  value: string;
}

export function getSecurityHeaders(): SecurityHeader[] {
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
  ];
}
