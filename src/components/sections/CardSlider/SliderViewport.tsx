"use client";

import {
  Children,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";

import { sliderControlVariants } from "./card-slider.variants";

import type { SliderAccessibility } from "./types";

import "swiper/css";
import "swiper/css/a11y";

type SliderViewportProps = {
  children: ReactNode;
  accessibility: SliderAccessibility;
  count: number;
};

export function SliderViewport({
  children,
  accessibility,
  count,
}: SliderViewportProps) {
  const id = useId();

  const swiperRef = useRef<SwiperInstance | null>(null);

  const [navigation, setNavigation] = useState({
    isBeginning: true,
    isEnd: true,
    isLocked: false,
  });

  const [speed, setSpeed] = useState(550);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateSpeed() {
      setSpeed(mediaQuery.matches ? 0 : 550);
    }

    updateSpeed();

    mediaQuery.addEventListener("change", updateSpeed);

    return () => {
      mediaQuery.removeEventListener("change", updateSpeed);
    };
  }, []);

  function syncNavigation(swiper: SwiperInstance) {
    setNavigation({
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
      isLocked: swiper.isLocked,
    });
  }

  return (
    <div className="min-w-0">
      <Swiper
        id={id}
        modules={[A11y, Keyboard]}
        slidesPerView={1}
        slidesPerGroup={1}
        spaceBetween={16}
        speed={speed}
        cssMode={false}
        followFinger={true}
        allowTouchMove={true}
        virtualTranslate={false}
        effect="slide"
        loop={false}
        watchOverflow
        grabCursor
        keyboard={{
          enabled: true,
          onlyInViewport: true,
          pageUpDown: false,
        }}
        a11y={{
          enabled: true,
          containerMessage: accessibility.viewportLabel,
          prevSlideMessage: accessibility.previousLabel,
          nextSlideMessage: accessibility.nextLabel,
          slideLabelMessage: "{{index}} / {{slidesLength}}",
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          syncNavigation(swiper);
        }}
        onSlideChange={syncNavigation}
        onResize={syncNavigation}
        onLock={syncNavigation}
        onUnlock={syncNavigation}
        onUpdate={syncNavigation}
      >
        {Children.map(children, (child) => (
          <SwiperSlide>{child}</SwiperSlide>
        ))}
      </Swiper>

      {count > 1 && (
        <div hidden={navigation.isLocked} className="mt-6">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              aria-label={accessibility.previousLabel}
              aria-controls={id}
              aria-disabled={navigation.isBeginning}
              className={sliderControlVariants()}
              onClick={() => {
                if (!navigation.isBeginning) {
                  swiperRef.current?.slidePrev();
                }
              }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <path d="M19 12H5m7 7-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              aria-label={accessibility.nextLabel}
              aria-controls={id}
              aria-disabled={navigation.isEnd}
              className={sliderControlVariants()}
              onClick={() => {
                if (!navigation.isEnd) {
                  swiperRef.current?.slideNext();
                }
              }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
