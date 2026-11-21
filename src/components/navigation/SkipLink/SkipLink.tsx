import { getTranslations } from "next-intl/server";

import { MAIN_CONTENT_ID } from "@/components/ui/Main";

import { skipLinkVariants } from "./skip-link.variants";

export async function SkipLink() {
  const t = await getTranslations("Accessibility");

  return (
    <a href={`#${MAIN_CONTENT_ID}`} className={skipLinkVariants()}>
      {t("skipToContent")}
    </a>
  );
}
