"use client";

import React from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { VideoStory } from "@/types";
import { getCategoryBadgeStyle } from "@/hooks/categoryStyles";

interface VideoCardProps {
  video: VideoStory;
  onPlay?: (video: VideoStory) => void;
  className?: string;
}

export default function VideoCard({ video, onPlay, className = "" }: VideoCardProps) {
  const badgeStyle = getCategoryBadgeStyle(video.category);

  return (
    <div
      onClick={() => onPlay && onPlay(video)}
      className={`group cursor-pointer flex flex-col ${className}`}
    >
      {/* Thumbnail Card with Overlay */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="relative w-full h-[356px] sm:h-[390px] rounded-[10px] overflow-hidden bg-sortd-black shadow-sortd-sm group-hover:shadow-sortd-hover transition-all"
      >
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 80vw, 300px"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Left: Category Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`h-[22px] px-2.5 rounded-none font-body font-bold text-[10px] uppercase tracking-[1px] inline-flex items-center justify-center select-none ${badgeStyle.textColorClass}`}
            style={{ backgroundColor: badgeStyle.bgColor }}
          >
            {video.category}
          </span>
        </div>

        {/* Top Right: White Play Circle Icon */}
        <div className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 group-hover:bg-white/30 shadow-md">
          <Play className="w-4 h-4 fill-white text-white ml-0.5" />
        </div>

        {/* Bottom Overlay Bold White Caption */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <h4 className="font-heading font-normal text-[17px] sm:text-[18px] leading-[18.7px] sm:leading-[20px] text-white line-clamp-2 tracking-[0.02em] drop-shadow-sm uppercase">
            {video.title}
          </h4>
        </div>
      </motion.div>

      {/* One-line Dark Semi-bold Caption Below Card */}
      <p className="mt-[10px] text-[13px] font-semibold leading-[18.2px] text-[#0A0A0A] line-clamp-2">
        {video.description}
      </p>
    </div>
  );
}
