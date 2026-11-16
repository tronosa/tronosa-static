import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

import { DesktopNavigation } from "../DesktopNavigation";
import { MobileNavigation } from "../MobileNavigation";
import { headerInnerVariants, headerVariants } from "./header.variants";

import type { HeaderProps } from "./types";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function Header({
  size = "default",
  className,
  ...props
}: HeaderProps) {
  const t = await getTranslations("Header");

  return (
    <header {...props} className={cn(headerVariants(), className)}>
      <Container size="wide">
        <div className={headerInnerVariants({ size })}>
          <Link
            href="/"
            aria-label={t("brand.homeLabel")}
            className={cn(
              "relative z-10 inline-flex shrink-0 items-center",
              "rounded-sm text-xl font-semibold tracking-[0.12em]",
              "text-brand-forest",
              "focus-visible:outline-2",
              "focus-visible:outline-offset-4",
              "focus-visible:outline-focus-ring",
            )}
          >
            TRONOŠA
          </Link>

          <DesktopNavigation />
          <MobileNavigation />
        </div>
      </Container>
    </header>
  );
}
