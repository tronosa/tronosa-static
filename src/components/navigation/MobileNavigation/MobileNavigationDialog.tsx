"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";

import * as Dialog from "@radix-ui/react-dialog";

import { cn } from "@/lib/cn";

import {
  mobileNavigationPanelVariants,
  mobileNavigationTriggerVariants,
} from "./mobile-navigation.variants";

import type { MobileNavigationDialogProps } from "./types";

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

export function MobileNavigationDialog({
  children,
  title,
  openLabel,
  closeLabel,
}: MobileNavigationDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const handleBreakpointChange = () => {
      if (mediaQuery.matches) {
        setOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleBreakpointChange);

    handleBreakpointChange();

    return () => {
      mediaQuery.removeEventListener("change", handleBreakpointChange);
    };
  }, []);

  function handleContentClick(event: MouseEvent<HTMLDivElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const link = target.closest("a[href]");

    if (
      link &&
      !link.hasAttribute("download") &&
      link.getAttribute("target") !== "_blank"
    ) {
      setOpen(false);
    }
  }

  function handleCloseAutoFocus(event: Event) {
    if (window.matchMedia(DESKTOP_MEDIA_QUERY).matches) {
      event.preventDefault();
    }
  }

  return (
    <Dialog.Root modal open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={open ? closeLabel : openLabel}
          className={mobileNavigationTriggerVariants()}
        >
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Content
          aria-modal="true"
          aria-describedby={undefined}
          onCloseAutoFocus={handleCloseAutoFocus}
          onClickCapture={handleContentClick}
          className={cn(mobileNavigationPanelVariants())}
        >
          <div
            className={cn(
              "flex h-20 shrink-0 items-center",
              "justify-between gap-4",
              "border-b border-border/60",
              "px-5 sm:px-8",
            )}
          >
            <Dialog.Title
              className={cn(
                "text-xl font-semibold",
                "tracking-[0.12em]",
                "text-brand-forest",
              )}
            >
              {title}
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={closeLabel}
                className={cn(
                  "inline-flex size-11 shrink-0",
                  "items-center justify-center",
                  "rounded-full border border-border/70",
                  "bg-surface/70 text-foreground",
                  "transition-colors duration-200",
                  "hover:bg-surface-muted",
                  "focus-visible:outline-2",
                  "focus-visible:outline-offset-2",
                  "focus-visible:outline-focus-ring",
                  "motion-reduce:transition-none",
                )}
              >
                <svg
                  aria-hidden="true"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </Dialog.Close>
          </div>

          <div
            className={cn(
              "min-h-0 flex-1",
              "overflow-y-auto overscroll-contain",
              "px-5 pb-8 pt-6 sm:px-8",
              "[-webkit-overflow-scrolling:touch]",
            )}
          >
            {children}
          </div>

          {/* <div
            aria-hidden="true"
            className="h-4 shrink-0 border-t border-border/40"
          /> */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
