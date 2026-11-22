"use client";

import dynamic from "next/dynamic";

const SliderViewport = dynamic(
  () =>
    import("./SliderViewportRuntime").then(
      (module) => module.SliderViewportRuntime,
    ),
  {
    ssr: true,
  },
);

export { SliderViewport };
