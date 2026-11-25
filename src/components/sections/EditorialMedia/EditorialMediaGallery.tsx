"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import { Picture } from "@/components/media/Picture";

import {
  editorialMediaGalleryButtonVariants,
  editorialMediaGalleryControlsVariants,
  editorialMediaGallerySlideVariants,
} from "./editorial-media.variants";

import type { EditorialMediaContent } from "./types";
import { IMAGE_SIZES } from "@/lib/media/image-sizes";
import { IMAGE_QUALITY } from "@/lib/media/image-quality";

type GalleryMedia = Extract<
  EditorialMediaContent["media"],
  { kind: "gallery" }
>;

type EditorialMediaGalleryProps = {
  media: GalleryMedia;
};

const INTERVAL_MS = 5000;

export function EditorialMediaGallery({ media }: EditorialMediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotionInitialized = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setReducedMotion(query.matches);

      if (query.matches && !reducedMotionInitialized.current) {
        setPlaying(false);
      }

      reducedMotionInitialized.current = true;
    };

    update();

    query.addEventListener("change", update);

    return () => {
      query.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const element = rootRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.25 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => {
      setPageVisible(!document.hidden);
    };

    updateVisibility();

    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  const canAdvance =
    playing && !reducedMotion && visible && pageVisible && !hovered && !focused;

  useEffect(() => {
    if (!canAdvance) return;

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % media.images.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [canAdvance, media.images.length]);

  const changeSlide = (direction: -1 | 1) => {
    setPlaying(false);

    setActiveIndex((index) => {
      return (index + direction + media.images.length) % media.images.length;
    });
  };

  const togglePlayback = () => {
    setPlaying((current) => !current);
  };

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={media.accessibility.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        const next = event.relatedTarget;

        if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
          setFocused(false);
        }
      }}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-brand-mineral-deep md:rounded-3xl">
        {media.images.map((image, index) => (
          <div
            key={index}
            aria-hidden={index !== activeIndex}
            className={editorialMediaGallerySlideVariants()}
            style={{
              opacity: index === activeIndex ? 1 : 0,
              zIndex: index === activeIndex ? 1 : 0,
            }}
          >
            <Picture
              {...image}
              ratio="fill"
              fit="cover"
              sizes={IMAGE_SIZES.editorial}
              quality={IMAGE_QUALITY.editorial}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className={editorialMediaGalleryControlsVariants()}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => changeSlide(-1)}
            aria-label={media.accessibility.previousLabel}
            className={editorialMediaGalleryButtonVariants()}
          >
            <ChevronLeft aria-hidden="true" size={20} />
          </button>

          <button
            type="button"
            onClick={() => changeSlide(1)}
            aria-label={media.accessibility.nextLabel}
            className={editorialMediaGalleryButtonVariants()}
          >
            <ChevronRight aria-hidden="true" size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="text-sm tabular-nums text-brand-mineral-deep"
            aria-hidden="true"
          >
            {activeIndex + 1} / {media.images.length}
          </span>

          <button
            type="button"
            onClick={togglePlayback}
            aria-label={
              playing
                ? media.accessibility.pauseLabel
                : media.accessibility.playLabel
            }
            className={editorialMediaGalleryButtonVariants()}
          >
            {playing ? (
              <Pause aria-hidden="true" size={18} />
            ) : (
              <Play aria-hidden="true" size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
