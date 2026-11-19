"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { resolveImageUrl } from "@/lib/media/resolve-image-url";

import { BackgroundVideoControls } from "./BackgroundVideoControls";

import {
  backgroundVideoVariants,
  backgroundVideoMediaVariants,
} from "./background-video.variants";

import type { BackgroundVideoProps } from "./types";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function BackgroundVideo({
  video,
  accessibility,
  className,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [playing, setPlaying] = useState(false);

  const posterUrl = video.poster
    ? resolveImageUrl(video.poster, {
        width: 1920,
        quality: 80,
      })
    : undefined;

  useEffect(() => {
    const element = videoRef.current;

    if (!element) {
      return;
    }

    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    element.muted = true;

    if (!mediaQuery.matches) {
      void element.play().catch(() => {
        // Autoplay may be blocked by the browser.
      });
    }

    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        element.pause();
      }
    };

    mediaQuery.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMotionPreferenceChange);

      element.pause();
    };
  }, [video.src]);

  function togglePlayback() {
    const element = videoRef.current;

    if (!element) {
      return;
    }

    if (element.paused) {
      void element.play().catch(() => {
        // Playback is unavailable.
      });
    } else {
      element.pause();
    }
  }

  return (
    <div className={cn(backgroundVideoVariants(), className)}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        poster={posterUrl}
        aria-hidden="true"
        tabIndex={-1}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setPlaying(false)}
        className={backgroundVideoMediaVariants()}
      >
        <source src={video.src} type={video.type} />
      </video>

      <BackgroundVideoControls
        playing={playing}
        accessibility={accessibility}
        onToggle={togglePlayback}
      />
    </div>
  );
}
