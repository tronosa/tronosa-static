import { useId } from "react";

import type { MapActivationMessages } from "./types";

type MapPreviewProps = {
  messages: MapActivationMessages;
  onActivate: () => void;
};

export function MapPreview({ messages, onActivate }: MapPreviewProps) {
  const headingId = useId();
  const descriptionId = useId();

  return (
    <div className="distribution-map__map-area">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden bg-brand-mineral-deep"
      >
        {Array.from({ length: 6 }, (_, index) => {
          const size = 160 + index * 110;

          return (
            <div
              key={size}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
              style={{
                width: size,
                height: size,
              }}
            />
          );
        })}
      </div>

      <div className="relative z-10 flex size-full items-center justify-center p-5 sm:p-8">
        <div
          role="group"
          aria-labelledby={headingId}
          className="flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl bg-background p-6 text-center shadow-lg sm:p-8"
        >
          <div
            aria-hidden="true"
            className="flex size-16 items-center justify-center rounded-full bg-brand-mineral-deep text-white"
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" />
              <path d="M9 3v15M15 6v15" />
            </svg>
          </div>

          <h3
            id={headingId}
            className="text-xl font-semibold text-brand-mineral-deep"
          >
            {messages.title}
          </h3>

          <p
            id={descriptionId}
            className="text-sm leading-relaxed text-foreground-muted"
          >
            {messages.description}
          </p>

          <button
            type="button"
            aria-describedby={descriptionId}
            onClick={onActivate}
            className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-brand-mineral-deep px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-forest focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-mineral-deep motion-reduce:transition-none"
          >
            {messages.button}

            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="shrink-0"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
