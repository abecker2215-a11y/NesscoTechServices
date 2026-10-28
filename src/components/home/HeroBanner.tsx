"use client";

import { useState, useEffect } from "react";

export function HeroBanner() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth <= 639) {
          setSrc("/Hero-banner-mobile.png");
        } else if (window.innerWidth <= 1023) {
          setSrc("/hero-banner-tablet.png");
        } else {
          setSrc("/hero-banner.png");
        }
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!src) return null;

  return (
    <img
      src={src}
      alt="Nessco Tech Services banner"
      className="object-contain object-top w-full h-full block"
      decoding="async"
      loading="eager"
    />
  );
}
