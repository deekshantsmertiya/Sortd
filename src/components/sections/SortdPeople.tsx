"use client";

import React, { useRef } from "react";
import SectionHeader from "@/components/common/SectionHeader";
import PersonCard from "@/components/common/PersonCard";
import CarouselControls from "@/components/common/CarouselControls";
import { usePeople } from "@/hooks/useData";

export default function SortdPeople() {
  const { data: people = [] } = usePeople();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="people" className="py-12 bg-sortd-off-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <SectionHeader
          title="SORTD PEOPLE"
          accentColor="yellow"
          subtitle="Spotlighting the creative minds, founders, and community builders shaping Dubai's future."
          viewAllHref="/#people"
        >
          <CarouselControls
            onPrev={() => handleScroll("left")}
            onNext={() => handleScroll("right")}
            className="hidden sm:flex"
          />
        </SectionHeader>

        {/* Carousel / Grid Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar snap-rail -mx-4 px-4 py-2"
        >
          {people.map((person) => (
            <div key={person.id} className="w-[82%] sm:w-[48%] lg:w-[31%] flex-shrink-0 snap-item">
              <PersonCard person={person} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
