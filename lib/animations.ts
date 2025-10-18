import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { gsap } from "gsap";

export const MOTION_CONFIG = {
  Y_OFFSET: {
    LG: 50,
    MD: 32,
  },
  STAGGER: {
    LG: 0.2,
    MD: 0.1,
  },
  DURATION: {
    TRANSITION: 0.7,
    CTA: 0.3,
    DEFAULT: 0.5,
    SCRAMBLE: 1,
  },
};

export const animatePageFadeIn = () => {
  return gsap.from(["canvas"], {
    opacity: 0,
    duration: MOTION_CONFIG.DURATION.TRANSITION,
    ease: "power2.inOut",
  });
};

export const animateNavToPageFadeOut = (
  router: AppRouterInstance,
  href: string
) => {
  const tl = gsap.timeline();

  tl.to(["main", "canvas"], {
    opacity: 0,
    duration: MOTION_CONFIG.DURATION.TRANSITION,
    ease: "power2.inOut",
  }).call(() => router.push(href));
};
