"use client";

import { useState, useEffect } from "react";

interface HeroBannerProps {
  src?: string;
}

export function HeroBanner({ src: customSrc }: HeroBannerProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      if (typeof window !== "undefined") {
        if (customSrc) {
          setSrc(customSrc);
          return;
        }
        if (window.innerWidth <= 639) {
          setSrc("/hero/homepage-hero-mobile.png");
        } else if (window.innerWidth <= 1023) {
          setSrc("/hero/homepage-hero-tablet.png");
        } else {
          setSrc("/hero/homepage-hero.png");
        }
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [customSrc]);

  if (!src) return null;

  return (
    <img
      src={src}
      alt="Nessco Tech Services banner"
      className="object-contain object-top w-full h-auto block"
      decoding="async"
      loading="eager"
    />
  );
}
