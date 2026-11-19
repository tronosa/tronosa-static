"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

import { BackgroundVideoControls } from "./BackgroundVideoControls";

import {
  backgroundVideoVariants,
  backgroundVideoMediaVariants,
} from "./background-video.variants";

import type { BackgroundVideoProps } from "./types";

const MOBILE_QUERY = "(max-width: 639px)";
const TABLET_QUERY = "(max-width: 1023px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type PlaybackIntent = "auto" | "play" | "pause";

export function BackgroundVideo({
  video,
  accessibility,
  className,
}: BackgroundVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const playbackIntentRef = useRef<PlaybackIntent>("auto");
  const synchronizeRef = useRef<(() => void) | null>(null);

  const [playing, setPlaying] = useState(false);
  const [hasVideoFrame, setHasVideoFrame] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const element = videoRef.current;

    if (!container || !element) {
      return;
    }

    const mobileMedia = window.matchMedia(MOBILE_QUERY);
    const tabletMedia = window.matchMedia(TABLET_QUERY);
    const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);

    let isVisible = false;
    let activeSource: string | undefined;

    element.muted = true;

    function getSource() {
      if (mobileMedia.matches && video.mobile) {
        return video.mobile;
      }

      if (tabletMedia.matches && video.tablet) {
        return video.tablet;
      }

      return video;
    }

    function synchronizePlayback() {
      if (!element) {
        return;
      }

      const intent = playbackIntentRef.current;

      const shouldPlay =
        isVisible &&
        !document.hidden &&
        intent !== "pause" &&
        (!reducedMotionMedia.matches || intent === "play");

      if (!shouldPlay) {
        element.pause();
        return;
      }

      const source = getSource();

      if (activeSource !== source.src) {
        element.pause();

        activeSource = source.src;
        element.src = source.src;
      }

      if (element.paused) {
        void element.play().catch(() => {
          // Autoplay or media playback may be unavailable.
        });
      }
    }

    synchronizeRef.current = synchronizePlayback;

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries.some((entry) => entry.isIntersecting);

        synchronizePlayback();
      },
      {
        threshold: 0,
      },
    );

    function handleMotionPreferenceChange() {
      if (reducedMotionMedia.matches) {
        playbackIntentRef.current = "auto";
      }

      synchronizePlayback();
    }

    observer.observe(container);

    document.addEventListener("visibilitychange", synchronizePlayback);

    mobileMedia.addEventListener("change", synchronizePlayback);
    tabletMedia.addEventListener("change", synchronizePlayback);

    reducedMotionMedia.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      observer.disconnect();

      document.removeEventListener("visibilitychange", synchronizePlayback);

      mobileMedia.removeEventListener("change", synchronizePlayback);

      tabletMedia.removeEventListener("change", synchronizePlayback);

      reducedMotionMedia.removeEventListener(
        "change",
        handleMotionPreferenceChange,
      );

      synchronizeRef.current = null;

      element.pause();
      element.removeAttribute("src");
      element.load();
    };
  }, [video]);

  function togglePlayback() {
    const element = videoRef.current;

    if (!element) {
      return;
    }

    if (element.paused) {
      playbackIntentRef.current = "play";
    } else {
      playbackIntentRef.current = "pause";
    }

    synchronizeRef.current?.();
  }

  return (
    <div
      ref={containerRef}
      className={cn(backgroundVideoVariants(), className)}
    >
      <Image
        src={video.poster}
        alt=""
        fill
        sizes="100vw"
        quality={65}
        loading="eager"
        fetchPriority="high"
        className={backgroundVideoMediaVariants()}
      />

      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => {
          setPlaying(true);
          setHasVideoFrame(true);
        }}
        onPause={() => setPlaying(false)}
        onEmptied={() => {
          setPlaying(false);
          setHasVideoFrame(false);
        }}
        onError={() => {
          setPlaying(false);
          setHasVideoFrame(false);
        }}
        className={cn(
          backgroundVideoMediaVariants(),
          !hasVideoFrame && "opacity-0",
        )}
      />

      <BackgroundVideoControls
        playing={playing}
        accessibility={accessibility}
        onToggle={togglePlayback}
      />
    </div>
  );
}
