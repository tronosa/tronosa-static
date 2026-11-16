"use client";

import { useState, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Header");

  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const languageNames = t.raw("languages") as Record<string, string>;

  const currentLanguage = languageNames[locale] ?? locale;

  function changeLanguage(nextLocale: (typeof routing.locales)[number]) {
    if (nextLocale === locale) {
      setOpen(false);
      return;
    }

    setOpen(false);

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          disabled={isPending}
          aria-label={t("languageSwitcher.currentLanguage", {
            language: currentLanguage,
          })}
          className={cn(
            "group inline-flex min-h-11 items-center gap-2",
            "rounded-full border border-border/70",
            "bg-surface/60 px-3.5 py-2",
            "text-sm font-medium text-foreground",
            "transition-[background-color,border-color,box-shadow]",
            "duration-200 hover:border-accent",
            "hover:bg-surface",
            "focus-visible:outline-2",
            "focus-visible:outline-offset-2",
            "focus-visible:outline-focus-ring",
            "disabled:opacity-50",
            "motion-reduce:transition-none",
          )}
        >
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <path d="M12 3c3 3 4.5 6 4.5 9s-1.5 6-4.5 9" />
            <path d="M12 3c-3 3-4.5 6-4.5 9s1.5 6 4.5 9" />
          </svg>

          <span className="uppercase">{locale}</span>

          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "transition-transform duration-200",
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
            "overflow-hidden rounded-2xl",
            "border border-border/70",
            "bg-background p-6 shadow-2xl",
            "outline-none",
            "sm:p-8",
            "max-h-[calc(100dvh-2rem)] overflow-y-auto",
            "data-[state=open]:animate-[fade-in_200ms_ease-out]",
            "motion-reduce:animate-none",
          )}
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Dialog.Title className="text-xl font-semibold text-foreground">
                {t("languageSwitcher.label")}
              </Dialog.Title>

              <p className="text-sm text-foreground-muted">
                {t("languageSwitcher.currentLanguage", {
                  language: currentLanguage,
                })}
              </p>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t("mobileMenu.closeLabel")}
                className={cn(
                  "inline-flex size-10 shrink-0",
                  "items-center justify-center",
                  "rounded-full border border-border",
                  "text-foreground",
                  "transition-colors hover:bg-surface-muted",
                  "focus-visible:outline-2",
                  "focus-visible:outline-focus-ring",
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
            {routing.locales.map((availableLocale) => {
              const active = availableLocale === locale;
              const language =
                languageNames[availableLocale] ?? availableLocale;

              return (
                <button
                  key={availableLocale}
                  type="button"
                  lang={availableLocale}
                  aria-pressed={active}
                  aria-label={t("languageSwitcher.switchTo", {
                    language,
                  })}
                  onClick={() => changeLanguage(availableLocale)}
                  className={cn(
                    "group flex min-h-14 w-full",
                    "items-center justify-between gap-4",
                    "rounded-xl border px-4 py-3",
                    "text-left transition-colors duration-200",
                    "focus-visible:outline-2",
                    "focus-visible:outline-offset-2",
                    "focus-visible:outline-focus-ring",
                    "motion-reduce:transition-none",
                    active
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border/70 bg-surface/60 text-foreground hover:border-accent/60 hover:bg-surface-muted",
                  )}
                >
                  <span className="font-medium">{language}</span>

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
