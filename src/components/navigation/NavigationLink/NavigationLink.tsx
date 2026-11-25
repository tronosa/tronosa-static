"use client";

import { Link, usePathname } from "@/i18n/navigation";

import { cn } from "@/lib/cn";

import { desktopNavigationLinkVariants } from "../DesktopNavigation/desktop-navigation.variants";
import { mobileNavigationLinkVariants } from "../MobileNavigation/mobile-navigation.variants";

import { getNavigationCurrent } from "../navigation-current";

import type { NavigationLinkProps } from "./types";

export function NavigationLink({
  href,
  relatedPaths,
  variant,
  children,
}: NavigationLinkProps) {
  const pathname = usePathname();

  const current = getNavigationCurrent({
    pathname,
    href,
    relatedPaths,
  });

  const active = current !== undefined;
  const isDesktop = variant === "desktop";

  const className = isDesktop
    ? desktopNavigationLinkVariants({ active })
    : cn(
        mobileNavigationLinkVariants({ active }),
        active && "underline decoration-2 underline-offset-8",
      );

  return (
    <Link
      href={href}
      prefetch={false}
      aria-current={current}
      className={className}
    >
      {children}

      {isDesktop && (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-2 h-px",
            "origin-left rounded-full bg-(--nav-fg)",
            "transition-transform duration-300 ease-out",
            "motion-reduce:transition-none",
            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
          )}
        />
      )}
    </Link>
  );
}
