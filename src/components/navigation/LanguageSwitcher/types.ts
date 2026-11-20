import { Locale } from "@/i18n/config";

export type LanguageAlternates = Record<string, string>;

export type LanguageRoutes = Record<string, LanguageAlternates>;

export type LanguageSwitcherDialogProps = {
  routes: LanguageRoutes;
  locale: Locale;
  languages: LanguageSwitcherOption[];
  currentShortLabel: string;
  accessibleLabel: string;
  title: string;
  closeLabel: string;
};

export interface LanguageSwitcherOption {
  locale: Locale;
  label: string;
  accessibleLabel: string;
}
