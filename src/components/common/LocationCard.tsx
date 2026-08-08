"use client";
import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { LocationItem } from "@/types";
import {
  AtlantisIllustration,
  MosqueIllustration,
  SoukIllustration,
  FortIllustration,
} from "./LocationIllustrations";
import {
  MuseumOfTheFutureArt,
  DubaiFrameArt,
  BurjKhalifaSkylineArt,
} from "@/components/hero/DubaiSkylineIllustrations";

interface LocationCardProps {
  location: LocationItem;
  className?: string;
}

export default function LocationCard({ location, className = "" }: LocationCardProps) {
  // Select matching line illustration by landmark type or custom imageUrl
  const renderIllustration = () => {
    if (location.imageUrl) {
      return (
        <div className="w-full h-full relative">
          <Image
            src={location.imageUrl}
            alt={location.name}
            fill
            className="object-contain object-bottom"
            sizes="(max-width: 640px) 150px, 200px"
          />
        </div>
      );
    }

    switch (location.landmarkType) {
      case "atlantis":
        return <AtlantisIllustration className="w-full h-full object-contain" />;
      case "mosque":
        return <MosqueIllustration className="w-full h-full object-contain" />;
      case "souk":
        return <SoukIllustration className="w-full h-full object-contain" />;
      case "fort":
        return <FortIllustration className="w-full h-full object-contain" />;
      case "museum":
        return <MuseumOfTheFutureArt className="w-full h-full object-contain" />;
      case "frame":
        return <DubaiFrameArt className="w-full h-full object-contain" />;
      case "burj":
      default:
        return <BurjKhalifaSkylineArt className="w-full h-full object-contain" />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className={`relative flex flex-col justify-between w-[170px] h-[170px] sm:w-[200px] sm:h-[200px] rounded-[24px] bg-sortd-yellow border border-sortd-black/5 p-4 sm:p-5 overflow-hidden hover:shadow-sortd-hover transition-all cursor-pointer group flex-shrink-0 snap-item ${className}`}
    >
      {/* Top Left Section: Inline Pin + Name */}
      <div className="z-10 flex items-center gap-1.5 mt-1 sm:mt-1.5 ml-0.5">
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-sortd-black stroke-[2.5]" />
        <span className="font-body font-bold text-sm sm:text-base tracking-wider text-sortd-black uppercase">
          {location.name}
        </span>
      </div>

      {/* Bottom Landmark Hand-drawn Sketch Line Art or Image */}
      <div className="absolute w-[175px] h-[108px] left-[-2px] top-[77px] sm:w-[206px] sm:h-[127px] sm:left-[-3px] sm:top-[90px] group-hover:scale-105 transition-transform duration-300">
        {renderIllustration()}
      </div>
    </motion.div>
  );
}
