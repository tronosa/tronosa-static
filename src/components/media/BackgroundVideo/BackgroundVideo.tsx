"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { IMAGE_SIZES } from "@/lib/media/image-sizes";

import { BackgroundVideoControls } from "./BackgroundVideoControls";

import {
  backgroundVideoVariants,
  backgroundVideoMediaVariants,
} from "./background-video.variants";

import type { BackgroundVideoProps } from "./types";

const MOBILE_QUERY = "(width < 640px)";
const TABLET_QUERY = "(width < 1024px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type PlaybackIntent = "auto" | "play" | "pause";

export function BackgroundVideo({
  video,
  accessibility,
  className,
}: BackgroundVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);

  const playbackIntentRef = useRef<PlaybackIntent>("auto");
  const synchronizeRef = useRef<(() => void) | null>(null);
  const posterReadyRef = useRef(false);

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

    let disposed = false;
    let isVisible = false;
    let documentReady = document.readyState === "complete";
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
      if (disposed || !element) {
        return;
      }

      const intent = playbackIntentRef.current;

      const canStart =
        intent === "play" || (documentReady && posterReadyRef.current);

      const shouldPlay =
        canStart &&
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

        setHasVideoFrame(false);

        element.src = source.src;
      }

      if (element.paused) {
        void element.play().catch(() => {
          // Keep the poster visible if playback is unavailable.
        });
      }
    }

    synchronizeRef.current = synchronizePlayback;

    function handleDocumentLoad() {
      documentReady = true;

      synchronizePlayback();
    }

    function handleMotionPreferenceChange() {
      if (reducedMotionMedia.matches) {
        playbackIntentRef.current = "auto";
      }

      synchronizePlayback();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries.some(
          (entry) => entry.isIntersecting && entry.intersectionRatio > 0,
        );

        synchronizePlayback();
      },
      {
        threshold: 0,
      },
    );

    observer.observe(container);

    if (!documentReady) {
      window.addEventListener("load", handleDocumentLoad, {
        once: true,
      });
    }

    /*
     * Handle posters that finished loading before
     * the component's effect was initialized.
     */
    const poster = posterRef.current;

    if (poster?.complete) {
      if (poster.naturalWidth > 0) {
        void poster
          .decode()
          .catch(() => {
            // A decode failure must not block video playback.
          })
          .then(() => {
            if (disposed) {
              return;
            }

            posterReadyRef.current = true;

            synchronizePlayback();
          });
      } else {
        posterReadyRef.current = true;
      }
    }

    document.addEventListener("visibilitychange", synchronizePlayback);

    mobileMedia.addEventListener("change", synchronizePlayback);

    tabletMedia.addEventListener("change", synchronizePlayback);

    reducedMotionMedia.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      disposed = true;

      observer.disconnect();

      window.removeEventListener("load", handleDocumentLoad);

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

  function handlePosterReady() {
    posterReadyRef.current = true;

    synchronizeRef.current?.();
  }

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
        ref={posterRef}
        src={video.poster}
        alt=""
        fill
        sizes={IMAGE_SIZES.hero}
        quality={65}
        loading="eager"
        fetchPriority="high"
        onLoad={handlePosterReady}
        onError={handlePosterReady}
        className={backgroundVideoMediaVariants()}
      />

      <video
        ref={videoRef}
        muted
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
