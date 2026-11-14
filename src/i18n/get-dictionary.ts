import type { Locale } from "./config";

export async function getDictionary(locale: Locale) {
  const messages = (await import(`../dictionaries/${locale}.json`)).default;

  return messages;
}
