import type { Locale } from "@/i18n/config";
import type { ContentKind } from "@/lib/content/content-loader";

export interface ContentTestRoute {
  kind: ContentKind;
  id: string;
  locale: Locale;
  pathname: string;
  expectedStatus: 200;
}

export interface NegativeTestRoute {
  kind: "not-found";
  id: string;
  locale: Locale;
  pathname: string;
  expectedStatus: 404;
}

export type TestRoute = ContentTestRoute | NegativeTestRoute;
