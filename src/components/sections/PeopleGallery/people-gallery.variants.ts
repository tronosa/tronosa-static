import { cva } from "class-variance-authority";

export const peopleGalleryVariants = cva(["isolate"]);

export const peopleGalleryHeaderVariants = cva([
  "grid grid-cols-1 items-end",
  "mb-10 gap-6",
  "md:mb-14 md:gap-10",
  "lg:grid-cols-12",
]);

export const peopleGalleryHeadingVariants = cva([
  "flex min-w-0 flex-col items-start gap-4",
  "lg:col-span-6",
]);

export const peopleGalleryEyebrowVariants = cva([
  "flex items-center gap-3 uppercase",
  "before:h-px before:w-8 before:bg-current",
]);

export const peopleGalleryTitleVariants = cva(["max-w-2xl text-balance"]);

export const peopleGalleryDescriptionVariants = cva([
  "flex min-w-0 flex-col gap-4",
  "lg:col-span-5 lg:col-start-8",
]);

export const peopleGalleryGridVariants = cva(
  ["grid grid-cols-1 items-start", "gap-5 md:gap-6 lg:gap-8"],
  {
    variants: {
      count: {
        1: "mx-auto max-w-5xl",

        2: "md:grid-cols-2",

        3: ["md:grid-cols-3", "lg:py-10"],
      },
    },

    defaultVariants: {
      count: 3,
    },
  },
);

export const peopleGalleryItemVariants = cva(["min-w-0"], {
  variants: {
    position: {
      0: "",
      1: "md:mt-12 lg:mt-20",
      2: "md:mt-6 lg:mt-10",
    },
  },

  defaultVariants: {
    position: 0,
  },
});

export const peopleGalleryImageVariants = cva(
  ["relative", "overflow-hidden rounded-2xl md:rounded-3xl"],
  {
    variants: {
      count: {
        1: "aspect-4/3 md:aspect-video",
        2: "aspect-4/5",
        3: "aspect-3/4",
      },
    },

    defaultVariants: {
      count: 3,
    },
  },
);
