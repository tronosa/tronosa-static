export type LanguageAlternates = Record<string, string>;

export type LanguageRoutes = Record<string, LanguageAlternates>;

export type LanguageSwitcherDialogProps = {
  routes: LanguageRoutes;
};
