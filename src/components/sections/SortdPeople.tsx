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
    const scrollAmount = 427; // Card width (403px) + gap (24px)
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="people" className="py-12 bg-sortd-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="SORTD PEOPLE"
          accentColor="yellow"
          subtitle="Lorem ipsum dolor sit amet consectetur. Suscipit etiam lacus purus ut sapien non purus metus. Lacus quahgm."
          viewAllHref="/news"
        />

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          className="w-full flex gap-6 overflow-x-auto no-scrollbar snap-rail -mx-4 px-4 py-2 min-w-0"
        >
          {people.map((person) => (
            <div key={person.id} className="w-[280px] sm:w-[320px] lg:w-[calc((100%-48px)/3)] h-[228px] flex-shrink-0 snap-item">
              <PersonCard person={person} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
