import {
  backgroundVideoControlsVariants,
  backgroundVideoControlButtonVariants,
} from "./background-video.variants";

import type { BackgroundVideoControlsProps } from "./types";

export function BackgroundVideoControls({
  playing,
  accessibility,
  onToggle,
}: BackgroundVideoControlsProps) {
  return (
    <div className={backgroundVideoControlsVariants()}>
      <button
        type="button"
        aria-label={
          playing ? accessibility.pauseLabel : accessibility.playLabel
        }
        onClick={onToggle}
        className={backgroundVideoControlButtonVariants()}
      >
        {playing ? (
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
            <path d="M9 5v14M15 5v14" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m8 5 12 7-12 7V5Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
