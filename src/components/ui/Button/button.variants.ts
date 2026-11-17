import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "group/button relative inline-flex",
    "items-center justify-center gap-6",
    "rounded-full border",
    "font-medium leading-tight",
    "cursor-pointer select-none",
    "transition-[background-color,border-color,color]",
    "duration-300 ease-out",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-4",
    "focus-visible:outline-focus-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      variant: {
        primary: [
          "border-primary bg-primary text-primary-foreground",
          "hover:border-brand-sage hover:bg-brand-sage",
        ],
        secondary: [
          "border-background bg-background text-primary",
          "hover:border-primary hover:bg-primary",
          "hover:text-primary-foreground",
        ],
        outline: [
          "border-primary bg-transparent text-primary",
          "hover:bg-primary hover:text-primary-foreground",
        ],
        glass: [
          "border-white/30 bg-white/12 text-white",
          "backdrop-blur-md",
          "hover:border-white/50 hover:bg-white/25",
        ],
      },
      size: {
        sm: "min-h-10 px-4 py-2 text-sm",
        md: "min-h-12 px-5 py-2.5 text-sm",
        lg: "min-h-13 px-6 py-3 text-base",
      },
      arrow: {
        true: "justify-between",
        false: "",
      },
    },
    compoundVariants: [
      {
        size: "sm",
        arrow: true,
        className: "py-1 pr-1 pl-4",
      },
      {
        size: "md",
        arrow: true,
        className: "py-1.5 pr-1.5 pl-5",
      },
      {
        size: "lg",
        arrow: true,
        className: "py-1.5 pr-1.5 pl-6",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      arrow: false,
    },
  },
);

export const buttonArrowVariants = cva(
  [
    "relative inline-flex shrink-0",
    "items-center justify-center",
    "overflow-hidden rounded-full",
    "transition-[background-color,color]",
    "duration-300 ease-out",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      variant: {
        primary: "bg-background text-primary",
        secondary: [
          "bg-primary text-primary-foreground",
          "group-hover/button:bg-background",
          "group-hover/button:text-primary",
        ],
        outline: [
          "bg-primary text-primary-foreground",
          "group-hover/button:bg-background",
          "group-hover/button:text-primary",
        ],
        glass: "bg-white text-primary",
      },
      size: {
        sm: "size-7",
        md: "size-8.5",
        lg: "size-9.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export const buttonArrowIconVariants = cva(
  [
    "absolute",
    "transition-transform duration-420",
    "ease-[cubic-bezier(0.22,1,0.36,1)]",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      position: {
        outgoing: [
          "translate-x-0 translate-y-0",
          "group-hover/button:translate-x-[160%]",
          "group-hover/button:-translate-y-[160%]",
          "group-focus-visible/button:translate-x-[160%]",
          "group-focus-visible/button:-translate-y-[160%]",
        ],
        incoming: [
          "-translate-x-[160%] translate-y-[160%]",
          "group-hover/button:translate-x-0",
          "group-hover/button:translate-y-0",
          "group-focus-visible/button:translate-x-0",
          "group-focus-visible/button:translate-y-0",
        ],
      },
      size: {
        sm: "size-3.5",
        md: "size-4",
        lg: "size-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
