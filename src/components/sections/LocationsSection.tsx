"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, MapPin, ArrowRight } from "lucide-react";
import LocationCard from "@/components/common/LocationCard";
import { useLocations } from "@/hooks/useData";
import SectionHeader from "@/components/common/SectionHeader";

export default function LocationsSection() {
  const { data: locations = [] } = useLocations();
  const [comingSoonLocation, setComingSoonLocation] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleLocationClick = (locationName: string) => {
    if (locationName.toUpperCase() !== "DUBAI") {
      setComingSoonLocation(locationName);
    }
  };

  return (
    <section id="locations" className="w-full bg-[#F7F7F8] pt-5 pb-3 sm:py-8 min-w-0">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Row */}
        <SectionHeader
          title="LOCATIONS"
          accentColor="yellow"
          showAccentBar={false}
          viewAllHref="/#locations"
          showBorder={false}
          size="sm"
        />

        {/* Scrollable track (drag/swipe only, no arrows) */}
        <div
          ref={scrollRef}
          className="w-full flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar snap-rail py-2 px-4 -mx-4 lg:mx-0 lg:px-0 cursor-grab active:cursor-grabbing min-w-0"
        >
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              className="snap-item"
              onClick={() => handleLocationClick(location.name)}
            />
          ))}
        </div>
      </div>

      {/* Coming Soon Modal Popup styled to match the subscription modal theme */}
      <AnimatePresence>
        {comingSoonLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setComingSoonLocation(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl p-2 select-none"
            >
              <div className="w-full rounded-2xl bg-sortd-yellow border border-sortd-black/10 p-6 sm:p-8 text-sortd-black relative overflow-hidden flex flex-col items-center text-center">
                {/* Close Button */}
                <button
                  onClick={() => setComingSoonLocation(null)}
                  className="absolute top-4 right-4 z-20 w-9 h-9 bg-white text-sortd-black hover:bg-gray-100 shadow-md flex items-center justify-center transition-colors rounded-lg focus:outline-none cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* MapPin Icon Badge */}
                <div className="w-12 h-12 rounded-full bg-sortd-black text-sortd-yellow flex items-center justify-center mb-4 shadow-md">
                  <MapPin className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl uppercase tracking-wider mb-2">
                  COMING SOON
                </h3>
                
                <h4 className="font-body font-extrabold text-xs uppercase tracking-[2px] text-sortd-black/70 mb-4">
                  TO {comingSoonLocation}
                </h4>

                {/* Description */}
                <p className="text-xs sm:text-sm font-medium text-sortd-black/85 mb-6 max-w-md leading-relaxed">
                  We are currently curating the absolute best local guides, stories, and cultural highlights for {comingSoonLocation}. Stay tuned!
                </p>

                {/* Action Button styled like the subscribe submit button */}
                <button
                  onClick={() => setComingSoonLocation(null)}
                  className="px-8 py-3.5 rounded-none bg-sortd-black text-white font-body font-bold text-xs tracking-wider uppercase hover:bg-sortd-pink transition-colors shadow-md flex items-center justify-center gap-1.5 flex-shrink-0 focus:outline-none cursor-pointer"
                >
                  <span>GOT IT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
