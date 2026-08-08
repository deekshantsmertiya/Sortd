"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PersonSpotlight } from "@/types";

interface PersonCardProps {
  person: PersonSpotlight;
  className?: string;
}

export default function PersonCard({ person, className = "" }: PersonCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`relative w-full h-full rounded-[10px] bg-[#FFCC00] border border-sortd-black/10 overflow-hidden shadow-sortd-sm hover:shadow-sortd-hover transition-all flex flex-col justify-between p-5 group ${className}`}
    >
      {/* Top Left: Stylized white translucent Logo Mark */}
      <div className="z-10 select-none">
        <svg className="w-8 h-8 text-white/30 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.5 3h3a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 10.5 17h-3A1.5 1.5 0 0 1 6 15.5v-11A1.5 1.5 0 0 1 7.5 3z" transform="rotate(25 9 10)" />
          <path d="M13.5 7h3a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-11A1.5 1.5 0 0 1 13.5 7z" transform="rotate(25 15 14)" className="opacity-60" />
        </svg>
      </div>

      {/* Black and White Bleed Portrait Image (Right/Bottom Alignment) */}
      <div className="absolute right-0 bottom-0 w-[55%] h-[90%] z-0">
        <Image
          src={person.imageUrl}
          alt={person.name}
          fill
          className="object-cover object-top grayscale group-hover:scale-105 transition-transform duration-500 opacity-95"
          sizes="200px"
        />
        {/* Subtle Gradient Blend */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFCC00] via-transparent to-transparent opacity-80" />
      </div>

      {/* Bottom Left Content */}
      <div className="z-10 max-w-[65%] mt-auto select-none">
        <span className="block font-body font-bold text-[9px] text-sortd-black/60 uppercase tracking-[0.1em] mb-1">
          SORTD PEOPLE
        </span>
        <h3 className="font-heading font-normal text-3xl sm:text-[34px] leading-[0.95] text-sortd-black uppercase tracking-[0.01em]">
          {person.name}
        </h3>
      </div>
    </motion.div>
  );
}
