import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["sr-Latn", "en"],
  defaultLocale: "sr-Latn",
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
});
