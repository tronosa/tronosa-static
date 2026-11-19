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

const directives: CspDirectives = {
  "default-src": ["'self'"],

  "script-src": ["'self'", "'unsafe-inline'"],

  "style-src": ["'self'", "'unsafe-inline'"],

  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https://ik.imagekit.io",
    "https://tiles.openfreemap.org",
  ],

  "font-src": ["'self'"],

  "connect-src": ["'self'", "https://tiles.openfreemap.org"],

  "media-src": ["'self'"],

  "worker-src": ["'self'", "blob:"],

  "object-src": ["'none'"],

  "frame-src": ["'none'"],

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
