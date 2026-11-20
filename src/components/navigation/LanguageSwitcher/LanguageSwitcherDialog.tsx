"use client";

import { useState, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

import type { Locale } from "@/i18n/config";
import type { LanguageSwitcherDialogProps } from "./types";

export function LanguageSwitcherDialog({
  routes,
  locale,
  languages,
  currentShortLabel,
  accessibleLabel,
  title,
  closeLabel,
}: LanguageSwitcherDialogProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function changeLanguage(nextLocale: Locale) {
    if (nextLocale === locale) {
      setOpen(false);
      return;
    }

    const normalizedPathname = pathname.replace(/\/+$/, "") || "/";

    const key = `${locale}:${normalizedPathname}`;
    const targetPathname = routes[key]?.[nextLocale];

    if (!targetPathname) {
      return;
    }

    setOpen(false);

    startTransition(() => {
      router.replace(targetPathname, {
        locale: nextLocale,
      });
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          disabled={isPending}
          aria-label={accessibleLabel}
          className={cn(
            "group inline-flex h-9 w-20 shrink-0",
            "items-center justify-center gap-1.5",
            "rounded-full border border-border/70",
            "bg-surface px-2",
            "text-xs font-medium text-foreground",
            "transition-[background-color,border-color,box-shadow]",
            "duration-200",
            "hover:border-accent",
            "focus-visible:outline-2",
            "focus-visible:outline-offset-2",
            "focus-visible:outline-focus-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "motion-reduce:transition-none",
            "cursor-pointer",
          )}
        >
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <path d="M12 3c3 3 4.5 6 4.5 9s-1.5 6-4.5 9" />
            <path d="M12 3c-3 3-4.5 6-4.5 9s1.5 6 4.5 9" />
          </svg>

          <span className="whitespace-nowrap">{currentShortLabel}</span>

          <svg
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "shrink-0 transition-transform duration-200",
              "motion-reduce:transition-none",
              open && "rotate-180",
            )}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-100",
            "bg-brand-forest/35 backdrop-blur-sm",
          )}
        />

        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "fixed left-1/2 top-1/2 z-101",
            "w-[calc(100%-2rem)] max-w-md",
            "-translate-x-1/2 -translate-y-1/2",
            "rounded-2xl",
            "border border-border/70",
            "bg-background p-6 shadow-2xl",
            "outline-none",
            "sm:p-8",
            "max-h-[calc(100dvh-2rem)] overflow-y-auto",
            "data-[state=open]:animate-[fade-in_200ms_ease-out]",
            "motion-reduce:animate-none",
          )}
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <Dialog.Title className="text-xl font-semibold text-foreground">
              {title}
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={closeLabel}
                className={cn(
                  "inline-flex size-10 shrink-0",
                  "items-center justify-center",
                  "rounded-full border border-border/70",
                  "bg-surface/60 text-foreground",
                  "transition-[background-color,border-color,box-shadow]",
                  "duration-200",
                  "hover:border-accent hover:bg-surface",
                  "focus-visible:outline-2",
                  "focus-visible:outline-offset-2",
                  "focus-visible:outline-focus-ring",
                  "motion-reduce:transition-none",
                  "cursor-pointer",
                )}
              >
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
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

          <div className="grid gap-2">
            {languages.map((language) => {
              const active = language.locale === locale;

              return (
                <button
                  key={language.locale}
                  type="button"
                  lang={language.locale}
                  aria-pressed={active}
                  aria-label={language.accessibleLabel}
                  onClick={() => changeLanguage(language.locale)}
                  className={cn(
                    "group flex min-h-14 w-full",
                    "items-center justify-between gap-4",
                    "rounded-xl border px-4 py-3",
                    "text-left transition-colors duration-200",
                    "focus-visible:outline-2",
                    "focus-visible:outline-offset-2",
                    "focus-visible:outline-focus-ring",
                    "motion-reduce:transition-none",
                    "cursor-pointer",
                    active
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border/70 bg-surface/60 text-foreground hover:border-accent/60 hover:bg-surface-muted",
                  )}
                >
                  <span className="font-medium">{language.label}</span>

                  {active && (
                    <svg
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--brand-forest)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
