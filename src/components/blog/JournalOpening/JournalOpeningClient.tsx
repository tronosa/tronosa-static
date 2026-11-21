"use client";

import { useEffect, useRef, type ReactNode } from "react";

type JournalOpeningClientProps = {
  children: ReactNode;
  className?: string;
};

const ANIMATION_MEDIA_QUERY =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export function JournalOpeningClient({
  children,
  className,
}: JournalOpeningClientProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const media = window.matchMedia(ANIMATION_MEDIA_QUERY);

    let disposed = false;
    let generation = 0;

    let cleanup: (() => void) | undefined;
    let observer: IntersectionObserver | undefined;

    function stopAnimation() {
      generation += 1;

      observer?.disconnect();
      observer = undefined;

      cleanup?.();
      cleanup = undefined;
    }

    async function initializeAnimation() {
      const currentGeneration = generation;

      try {
        const { createJournalOpeningAnimation } =
          await import("./journal-opening.animations");

        if (
          disposed ||
          generation !== currentGeneration ||
          !media.matches ||
          !root?.isConnected
        ) {
          return;
        }

        cleanup = createJournalOpeningAnimation(root);
      } catch {
        // Preserve the static presentation.
      }
    }

    function syncMediaQuery() {
      stopAnimation();

      if (!media.matches || !root) {
        return;
      }

      if (!("IntersectionObserver" in window)) {
        void initializeAnimation();
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) {
            return;
          }

          observer?.disconnect();
          observer = undefined;

          void initializeAnimation();
        },
        {
          rootMargin: "600px 0px",
        },
      );

      observer.observe(root);
    }

    media.addEventListener("change", syncMediaQuery);

    syncMediaQuery();

    return () => {
      disposed = true;

      media.removeEventListener("change", syncMediaQuery);

      stopAnimation();
    };
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
