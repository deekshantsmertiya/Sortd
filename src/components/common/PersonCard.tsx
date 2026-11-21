"use client";

import React from "react";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { PersonSpotlight } from "@/types";

interface PersonCardProps {
  person: PersonSpotlight;
  className?: string;
  onClick?: (person: PersonSpotlight) => void;
}

export default function PersonCard({ person, className = "", onClick }: PersonCardProps) {
  return (
    <div
      onClick={() => onClick?.(person)}
      className={`group flex flex-col w-[200px] cursor-pointer select-none ${className}`}
    >
      {/* Top Yellow Card: exactly 200px x 340px, radius 12px, fill #FFCC00 */}
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.15 }}
        className="relative w-[200px] h-[340px] rounded-[12px] bg-[#FFCC00] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex-shrink-0"
      >
        {/* Top-Left Translucent Sortd Logo Mark (35x33.5px at x:12, y:12, opacity: 0.3) */}
        <div className="absolute top-[12px] left-[12px] z-10 w-[35px] h-[34px] opacity-30 select-none pointer-events-none">
          <img
            src="/header.png"
            alt=""
            className="w-full h-full object-contain brightness-0 invert"
          />
        </div>

        {/* Top-Right Circular Play Icon Button (36x36px at x:152, y:12, bg-white/20) */}
        <div
          className="absolute top-[12px] right-[12px] z-10 w-[36px] h-[36px] rounded-full bg-white/20 backdrop-blur-[2px] flex items-center justify-center transition-colors pointer-events-none select-none"
          aria-hidden="true"
        >
          <Play className="w-[14px] h-[14px] fill-white text-white ml-0.5" />
        </div>

        {/* Cutout Grayscale Person Portrait Image (bottom-aligned, sits above bottom edge) */}
        <div className="absolute inset-x-0 bottom-0 h-[255px] z-0 flex items-end justify-center overflow-hidden pointer-events-none">
          <img
            src={person.imageUrl}
            alt={person.name}
            className="h-full w-auto max-w-none object-contain object-bottom pointer-events-none"
          />
        </div>

        {/* Bottom Dark Gradient Shadow */}
        <div className="absolute inset-x-0 bottom-0 h-[115px] bg-gradient-to-t from-black/85 via-black/20 to-transparent z-[5] pointer-events-none" />

        {/* Bottom-Left Overlaid Text (x: 12, y: 290.61, Bebas Neue, white text) */}
        <div className="absolute left-[12px] bottom-[12px] z-10 text-left pointer-events-none max-w-[176px]">
          <span className="block font-heading text-white text-[16px] leading-[17px] tracking-[1px] uppercase opacity-95">
            SORTD PEOPLE
          </span>
          <h3 className="font-heading text-white text-[18px] leading-[19px] tracking-[0.5px] uppercase truncate">
            {person.name}
          </h3>
        </div>
      </motion.div>

      {/* Description Below Card: 10px padding-top, 200px width, DM Sans SemiBold 13px/18.2px */}
      <div className="pt-[10px] w-[200px]">
        <p className="font-body font-semibold text-[13px] leading-[18.2px] text-[#0A0A0A] line-clamp-2">
          {person.quote || "Lorem ipsum dolor sit amet consectetur. Turpis etiam."}
        </p>
      </div>
    </div>
  );
}
