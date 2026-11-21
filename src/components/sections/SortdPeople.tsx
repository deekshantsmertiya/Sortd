"use client";

import React, { useRef } from "react";
import PersonCard from "@/components/common/PersonCard";
import { usePeople } from "@/hooks/useData";
import EmptyState from "@/components/common/EmptyState";

export default function SortdPeople() {
  const { data: people = [] } = usePeople();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="people" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
      {/* Section Header: exact 28px Bebas Neue, 2px letter spacing, uppercase, 20px gap to cards */}
      <div className="w-full mb-[20px] select-none">
        <h2 className="font-heading font-normal text-[28px] leading-[28px] tracking-[2px] uppercase text-[#0A0A0A]">
          SORTD PEOPLE
        </h2>
      </div>

      {people.length === 0 && <EmptyState />}

      {/* Carousel Container: 16px gap, 200px width cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 lg:gap-6 overflow-x-auto no-scrollbar snap-rail w-[calc(100%+2rem)] -mx-4 px-4 sm:w-[calc(100%+3rem)] sm:-mx-6 sm:px-6 lg:w-full lg:mx-0 lg:px-0 min-w-0"
      >
        {people.map((person) => (
          <div
            key={person.id}
            className="w-[200px] flex-shrink-0 snap-item flex flex-col"
          >
            <PersonCard person={person} />
          </div>
        ))}
      </div>
    </section>
  );
}
