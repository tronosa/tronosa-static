export type CspMode = "report-only" | "enforce";

type CspDirective =
  | "default-src"
  | "script-src"
  | "style-src"
  | "img-src"
  | "font-src"
  | "connect-src"
  | "media-src"
  | "worker-src"
  | "object-src"
  | "frame-src"
  | "frame-ancestors"
  | "base-uri"
  | "form-action"
  | "manifest-src";

type CspDirectives = Record<CspDirective, readonly string[]>;

const HCAPTCHA_ORIGINS = [
  "https://hcaptcha.com",
  "https://*.hcaptcha.com",
] as const;

const WEB3FORMS_ORIGIN = "https://api.web3forms.com";

const IMAGEKIT_ORIGIN = "https://ik.imagekit.io";

const directives: CspDirectives = {
  "default-src": ["'self'"],

  "script-src": ["'self'", "'unsafe-inline'", ...HCAPTCHA_ORIGINS],

  "style-src": ["'self'", "'unsafe-inline'", ...HCAPTCHA_ORIGINS],

  "img-src": [
    "'self'",
    "data:",
    "blob:",
    IMAGEKIT_ORIGIN,
    "https://tiles.openfreemap.org",
  ],

  "font-src": ["'self'"],

  "connect-src": [
    "'self'",
    "https://tiles.openfreemap.org",
    WEB3FORMS_ORIGIN,
    ...HCAPTCHA_ORIGINS,
  ],

  "media-src": ["'self'", IMAGEKIT_ORIGIN],

  "worker-src": ["'self'", "blob:"],

  "object-src": ["'none'"],

  "frame-src": [...HCAPTCHA_ORIGINS],

  "frame-ancestors": ["'none'"],

  "base-uri": ["'self'"],

  "form-action": ["'self'"],

  "manifest-src": ["'self'"],
};

export function getContentSecurityPolicy(): string {
  return Object.entries(directives)
    .map(([directive, sources]) => {
      return `${directive} ${sources.join(" ")}`;
    })
    .join("; ");
}

export function getContentSecurityPolicyHeader(mode: CspMode = "report-only") {
  return {
    key:
      mode === "enforce"
        ? "Content-Security-Policy"
        : "Content-Security-Policy-Report-Only",
    value: getContentSecurityPolicy(),
  };
}
