"use client";

import React, { useRef } from "react";
import LocationCard from "@/components/common/LocationCard";
import { useLocations } from "@/hooks/useData";
import SectionHeader from "@/components/common/SectionHeader";

export default function LocationsSection() {
  const { data: locations = [] } = useLocations();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="locations" className="w-full bg-[#F7F7F8] pt-5 pb-3 sm:py-8 min-w-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Row */}
        <SectionHeader
          title="LOCATIONS"
          accentColor="yellow"
          showAccentBar={false}
          viewAllHref="/#locations"
          showBorder={false}
        />

        {/* Scrollable track (drag/swipe only, no arrows) */}
        <div
          ref={scrollRef}
          className="w-full flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar snap-rail py-2 px-4 -mx-4 cursor-grab active:cursor-grabbing min-w-0"
        >
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} className="snap-item" />
          ))}
        </div>
      </div>
    </section>
  );
}
