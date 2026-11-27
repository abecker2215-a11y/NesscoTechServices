"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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
          setSrc("/hero/homepage-hero-mobile.webp");
        } else if (window.innerWidth <= 1024) {
          setSrc("/hero/homepage-hero-tablet.webp");
        } else {
          setSrc("/hero/homepage-hero.webp");
        }
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [customSrc]);

  if (!src) return null;

  return (
    <Image
      src={src}
      alt="Nessco Tech Services banner"
      width={1200}
      height={630}
      priority
      sizes="100vw"
      className="object-contain object-top w-full h-auto block"
      decoding="async"
    />
  );
}
