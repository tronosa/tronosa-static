import { LanguageSwitcherDialog } from "./LanguageSwitcherDialog";
import { getLanguageRoutes } from "./language-switcher.server";

export function LanguageSwitcher() {
  const routes = getLanguageRoutes();

  return <LanguageSwitcherDialog routes={routes} />;
}
