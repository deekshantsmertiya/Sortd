"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselControlsProps {
  onPrev?: () => void;
  onNext?: () => void;
  variant?: "light" | "dark";
  className?: string;
}

export default function CarouselControls({
  onPrev,
  onNext,
  variant = "light",
  className = "",
}: CarouselControlsProps) {
  const btnBase =
    "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none";

  const variants = {
    light: "bg-sortd-off-white hover:bg-sortd-yellow text-sortd-black border border-gray-200 shadow-sm",
    dark: "bg-white/10 hover:bg-sortd-yellow text-white hover:text-sortd-black border border-white/20",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={onPrev}
        className={`${btnBase} ${variants[variant]}`}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={onNext}
        className={`${btnBase} ${variants[variant]}`}
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
