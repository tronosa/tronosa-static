import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function createJournalOpeningAnimation(root: HTMLElement): () => void {
  gsap.registerPlugin(ScrollTrigger);

  const aperture = root.querySelector<HTMLElement>("[data-journal-aperture]");

  const image = root.querySelector<HTMLElement>("[data-journal-opening-image]");

  if (!aperture || !image) {
    return () => {};
  }

  const media = gsap.matchMedia();

  media.add(
    "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    () => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "none",
        },
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "center center",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .fromTo(
          aperture,
          {
            scaleX: 0.64,
            borderRadius: "45% 45% 38% 38% / 48% 48% 40% 40%",
          },
          {
            scaleX: 1,
            borderRadius: "24px",
          },
          0,
        )
        .fromTo(
          image,
          {
            scaleX: 1 / 0.64,
            scaleY: 1.18,
          },
          {
            scaleX: 1,
            scaleY: 1,
          },
          0,
        );
    },
  );

  return () => {
    media.revert();
  };
}
