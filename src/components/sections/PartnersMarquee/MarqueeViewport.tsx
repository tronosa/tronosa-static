import { useId, type ReactNode } from "react";
import { partnersControlVariants } from "./partners-marquee.variants";
import type { PartnersAccessibility } from "./types";

export function MarqueeViewport({
  children,
  accessibility,
  animated,
}: {
  children: ReactNode;
  accessibility: PartnersAccessibility;
  animated: boolean;
}) {
  const id = useId();
  return (
    <div data-partners-marquee={animated ? "animated" : "static"}>
      {animated && (
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          data-partners-pause
        />
      )}
      <div className="overflow-hidden" data-partners-window>
        <div data-partners-track>{children}</div>
      </div>
      {animated && (
        <div className="mt-6 flex justify-center" data-partners-control>
          <label
            htmlFor={id}
            className={partnersControlVariants() + " cursor-pointer"}
          >
            <span
              aria-hidden="true"
              data-partners-check
              className="grid size-4 place-items-center rounded border border-current"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="size-3"
              >
                <path d="m3 8 3 3 7-7" />
              </svg>
            </span>
            <span>{accessibility.pauseLabel}</span>
          </label>
        </div>
      )}
    </div>
  );
}
