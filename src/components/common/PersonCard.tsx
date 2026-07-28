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
      className={`relative w-full h-80 sm:h-96 rounded-2xl bg-sortd-yellow border border-sortd-black/10 overflow-hidden shadow-sortd-sm hover:shadow-sortd-hover transition-all flex flex-col justify-between p-5 sm:p-6 group ${className}`}
    >
      {/* Top Eyebrow Tag */}
      <div className="z-10">
        <span className="inline-block px-3 py-1 rounded-full bg-sortd-black text-sortd-yellow font-heading font-extrabold text-[10px] uppercase tracking-widest">
          SORTD PEOPLE
        </span>
      </div>

      {/* Black and White Bleed Portrait Image (Right/Bottom Alignment) */}
      <div className="absolute right-0 bottom-0 w-3/5 h-4/5 z-0">
        <Image
          src={person.imageUrl}
          alt={person.name}
          fill
          className="object-cover object-top grayscale contrast-125 group-hover:scale-105 transition-transform duration-500 opacity-95"
          sizes="(max-width: 768px) 60vw, 300px"
        />
        {/* Subtle Gradient Blend */}
        <div className="absolute inset-0 bg-gradient-to-t from-sortd-yellow via-transparent to-transparent opacity-80" />
      </div>

      {/* Bottom Left Content */}
      <div className="z-10 max-w-[65%] mt-auto pr-2">
        <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-sortd-black leading-none mb-1">
          {person.name}
        </h3>
        <p className="font-heading font-bold text-xs text-sortd-black/80 uppercase tracking-wider mb-2">
          {person.title}
        </p>
        <p className="text-xs text-sortd-black/90 font-medium italic line-clamp-3 leading-snug">
          &ldquo;{person.quote}&rdquo;
        </p>
      </div>
    </motion.div>
  );
}
