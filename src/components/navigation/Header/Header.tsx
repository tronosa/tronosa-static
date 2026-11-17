import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

import { DesktopNavigation } from "../DesktopNavigation";
import { MobileNavigation } from "../MobileNavigation";

import { headerInnerVariants, headerVariants } from "./header.variants";

import type { HeaderProps } from "./types";

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
              "rounded-sm",
              "focus-visible:outline-2",
              "focus-visible:outline-offset-4",
              "focus-visible:outline-focus-ring",
            )}
          >
            <Image
              src={t("brand.logo.src")}
              alt={t("brand.logo.alt")}
              width={60}
              height={60}
              loading="eager"
              unoptimized
              className="size-10 object-contain md:size-15"
            />
          </Link>

          <DesktopNavigation />
          <MobileNavigation />
        </div>
      </Container>
    </header>
  );
}
