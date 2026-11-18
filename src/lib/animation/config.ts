export const animationConfig = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.8,
    cinematic: 1.2,
  },

  ease: {
    standard: "power2.out",
    enter: "power3.out",
    exit: "power2.in",
    cinematic: "power4.out",
  },

  media: {
    desktop: "(min-width: 1024px)",
    mobile: "(max-width: 1023px)",
    reducedMotion: "(prefers-reduced-motion: reduce)",
  },
} as const;
