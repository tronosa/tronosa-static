"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type FocusEvent,
} from "react";

import { SliderViewportFallback } from "./SliderViewportFallback";

import { sliderViewportVariants } from "./slider-viewport.variants";

import type { SliderViewportProps } from "./types";

const ACTIVATION_ROOT_MARGIN = "400px 0px";

type SliderRuntime = ComponentType<SliderViewportProps>;

export function SliderViewport(props: SliderViewportProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const pendingRuntimeRef = useRef<SliderRuntime | null>(null);

  const [Runtime, setRuntime] = useState<SliderRuntime | null>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    let disposed = false;
    let loading = false;
    let observer: IntersectionObserver | undefined;

    async function loadRuntime() {
      if (disposed || loading) {
        return;
      }

      loading = true;

      observer?.disconnect();

      try {
        const { SliderViewportRuntime } =
          await import("./SliderViewportRuntime");

        if (disposed) {
          return;
        }

        if (root?.contains(document.activeElement)) {
          pendingRuntimeRef.current = SliderViewportRuntime;

          return;
        }

        setRuntime(() => SliderViewportRuntime);
      } catch {
        // Preserve the native scrollable fallback
        // if the interactive runtime cannot be loaded.
      }
    }

    if (!("IntersectionObserver" in window)) {
      void loadRuntime();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            void loadRuntime();
          }
        },
        {
          rootMargin: ACTIVATION_ROOT_MARGIN,
        },
      );

      observer.observe(root);
    }

    return () => {
      disposed = true;

      observer?.disconnect();

      pendingRuntimeRef.current = null;
    };
  }, []);

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const nextTarget = event.relatedTarget;

    if (
      nextTarget instanceof Node &&
      event.currentTarget.contains(nextTarget)
    ) {
      return;
    }

    const pendingRuntime = pendingRuntimeRef.current;

    if (!pendingRuntime) {
      return;
    }

    pendingRuntimeRef.current = null;

    setRuntime(() => pendingRuntime);
  }

  return (
    <div
      ref={rootRef}
      className={sliderViewportVariants()}
      onBlurCapture={handleBlur}
    >
      {Runtime ? <Runtime {...props} /> : <SliderViewportFallback {...props} />}
    </div>
  );
}
