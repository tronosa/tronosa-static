import { Children } from "react";

import {
  sliderFallbackViewportVariants,
  sliderFallbackSlideVariants,
  sliderFallbackControlsVariants,
} from "./slider-viewport.variants";

import type { SliderViewportProps } from "./types";

function getControlCount(count: number) {
  if (count <= 1) {
    return "one";
  }

  if (count === 2) {
    return "two";
  }

  if (count === 3) {
    return "three";
  }

  return "multiple";
}

export function SliderViewportFallback({
  children,
  accessibility,
  count,
}: SliderViewportProps) {
  return (
    <div>
      <div
        role="region"
        aria-label={accessibility.viewportLabel}
        tabIndex={0}
        className={sliderFallbackViewportVariants()}
      >
        {Children.map(children, (child) => (
          <div className={sliderFallbackSlideVariants()}>{child}</div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className={sliderFallbackControlsVariants({
          count: getControlCount(count),
        })}
      />
    </div>
  );
}
