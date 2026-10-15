"use client";

import dynamic from "next/dynamic";

const HeroQuiz = dynamic(() => import("@/components/home/HeroQuiz").then((mod) => mod.HeroQuiz), { ssr: false });

export function HeroQuizClient() {
  return <HeroQuiz />;
}