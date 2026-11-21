"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import {
  shareArticleActionVariants,
  shareArticleIconVariants,
  shareArticlePopoverVariants,
  shareArticleTriggerVariants,
} from "./share-article.variants";

import type { ShareArticleProps } from "./types";

export function ShareArticle({ url, title, labels }: ShareArticleProps) {
  const popoverId = useId();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const encodedUrl = encodeURIComponent(url);

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const popover = popoverRef.current;

    if (!trigger || !popover || !popover.matches(":popover-open")) {
      return;
    }

    const buttonRect = trigger.getBoundingClientRect();
    const panelRect = popover.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const margin = 12;
    const gap = 8;

    if (buttonRect.bottom <= 0 || buttonRect.top >= viewportHeight) {
      popover.hidePopover();
      return;
    }

    const left = Math.max(
      margin,
      Math.min(
        buttonRect.right - panelRect.width,
        viewportWidth - panelRect.width - margin,
      ),
    );

    const below = buttonRect.bottom + gap;
    const above = buttonRect.top - panelRect.height - gap;

    const top =
      below + panelRect.height + margin <= viewportHeight
        ? below
        : above >= margin
          ? above
          : Math.max(
              margin,
              Math.min(below, viewportHeight - panelRect.height - margin),
            );

    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handlePositionChange = () => {
      updatePosition();
    };

    window.addEventListener("scroll", handlePositionChange, {
      capture: true,
      passive: true,
    });

    window.addEventListener("resize", handlePositionChange);

    const observer = new ResizeObserver(handlePositionChange);

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    if (popoverRef.current) {
      observer.observe(popoverRef.current);
    }

    updatePosition();

    return () => {
      window.removeEventListener("scroll", handlePositionChange, true);

      window.removeEventListener("resize", handlePositionChange);

      observer.disconnect();
    };
  }, [isOpen, updatePosition]);

  function closePopover() {
    const popover = popoverRef.current;

    if (popover?.matches(":popover-open")) {
      popover.hidePopover();
    }
  }

  function togglePopover() {
    const popover = popoverRef.current;

    if (!popover) return;

    if (popover.matches(":popover-open")) {
      popover.hidePopover();
      return;
    }

    setCopyStatus("idle");
    popover.showPopover();
    updatePosition();

    popover.querySelector<HTMLElement>("a, button")?.focus();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }
  }

  async function nativeShare() {
    if (typeof navigator.share !== "function") {
      await copyLink();
      return;
    }

    try {
      await navigator.share({ title, url });
      closePopover();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setCopyStatus("error");
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-controls={popoverId}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={togglePopover}
        className={shareArticleTriggerVariants()}
      >
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4" />
        </svg>

        <span>{labels.share}</span>
      </button>

      <div
        ref={popoverRef}
        id={popoverId}
        popover="auto"
        role="dialog"
        aria-label={labels.heading}
        onToggle={(event) => {
          setIsOpen(event.currentTarget.matches(":popover-open"));
        }}
        className={shareArticlePopoverVariants()}
      >
        <div className="border-b border-border/70 px-2 pb-3 pt-1">
          <p className="text-sm font-semibold text-brand-forest">
            {labels.heading}
          </p>
        </div>

        <div className="flex flex-col gap-1 pt-2">
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels.linkedin}
            className={shareArticleActionVariants()}
          >
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#0A66C2] text-sm font-bold text-white"
            >
              in
            </span>
            <span>LinkedIn</span>
          </a>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels.facebook}
            className={shareArticleActionVariants()}
          >
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#1877F2] text-lg font-bold text-white"
            >
              f
            </span>
            <span>Facebook</span>
          </a>

          <button
            type="button"
            onClick={copyLink}
            className={shareArticleActionVariants()}
          >
            <span aria-hidden="true" className={shareArticleIconVariants()}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.07 0l3-3A5 5 0 0 0 13 2.93l-1.7 1.7" />
                <path d="M14 11a5 5 0 0 0-7.07 0l-3 3A5 5 0 0 0 11 21.07l1.7-1.7" />
              </svg>
            </span>

            <span>
              {copyStatus === "success" ? labels.copied : labels.copyLink}
            </span>
          </button>

          <button
            type="button"
            onClick={nativeShare}
            className={shareArticleActionVariants()}
          >
            <span aria-hidden="true" className={shareArticleIconVariants()}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4" />
              </svg>
            </span>

            <span>{labels.more}</span>
          </button>
        </div>

        {copyStatus !== "idle" && (
          <p
            role="status"
            aria-live="polite"
            className="border-t border-border/70 px-3 pt-3 text-xs text-foreground"
          >
            {copyStatus === "success" ? labels.copied : labels.copyFailed}
          </p>
        )}
      </div>
    </>
  );
}
