"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LocationCard from "@/components/common/LocationCard";
import { useLocations } from "@/hooks/useData";

export default function LocationsSection() {
  const { data: locations = [] } = useLocations();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [isMounted, setIsMounted] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    setIsMounted(true);
    
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", updateScrollButtons);
      // Run initial check
      updateScrollButtons();
      // Also run on window resize
      window.addEventListener("resize", updateScrollButtons);
    }
    return () => {
      if (el) el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [locations]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    
    // Card width (200px) + gap-5 (20px) = 220px
    const cardWidth = 220;
    const containerWidth = scrollRef.current.clientWidth;
    
    // Scroll by integer number of cards fitting in viewport, or at least 1 card
    const scrollAmount = direction === "left"
      ? -Math.max(cardWidth, containerWidth - (containerWidth % cardWidth) || cardWidth)
      : Math.max(cardWidth, containerWidth - (containerWidth % cardWidth) || cardWidth);

    scrollRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="locations" className="bg-[#F7F7F8] py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-8 px-1">
          <h2 className="font-heading font-black text-2xl tracking-widest text-sortd-black uppercase">
            LOCATIONS
          </h2>
          
          <Link
            href="/#locations"
            className="text-[11px] font-body font-extrabold uppercase tracking-widest text-[#9E9E9E] hover:text-sortd-pink transition-colors whitespace-nowrap flex items-center gap-0.5 select-none"
          >
            <span>VIEW ALL</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#9E9E9E] stroke-[2.5] relative" />
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative px-1">
          {/* Left Floating Arrow */}
          <AnimatePresence>
            {isMounted && canScrollLeft && (
              <motion.button
                key="left-arrow"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => handleScroll("left")}
                className="absolute left-[-22px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white hover:bg-sortd-yellow text-sortd-black rounded-[4px] items-center justify-center shadow-md border border-gray-100 hidden md:flex transition-all hover:scale-105 active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Right Floating Arrow */}
          <AnimatePresence>
            {isMounted && canScrollRight && (
              <motion.button
                key="right-arrow"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => handleScroll("right")}
                className="absolute right-[-22px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white hover:bg-sortd-yellow text-sortd-black rounded-[4px] items-center justify-center shadow-md border border-gray-100 hidden md:flex transition-all hover:scale-105 active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto no-scrollbar snap-rail py-2 px-1 -mx-2"
          >
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} className="snap-item" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
