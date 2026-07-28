"use client";

import React from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { VideoStory } from "@/types";

interface VideoCardProps {
  video: VideoStory;
  onPlay?: (video: VideoStory) => void;
  className?: string;
}

export default function VideoCard({ video, onPlay, className = "" }: VideoCardProps) {
  const categoryStyles = {
    NEWS: "bg-sortd-yellow text-sortd-black",
    CULTURE: "bg-sortd-navy text-white",
    COMMUNITY: "bg-sortd-pink text-white",
  };

  return (
    <div
      onClick={() => onPlay && onPlay(video)}
      className={`group cursor-pointer flex flex-col ${className}`}
    >
      {/* Thumbnail Card with Overlay */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="relative w-full h-[350px] sm:h-[390px] rounded-2xl overflow-hidden bg-sortd-black shadow-sortd-sm group-hover:shadow-sortd-hover transition-all"
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

        {/* Top Left: Category Tag Pill */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-heading font-extrabold uppercase tracking-wider ${
              categoryStyles[video.category]
            }`}
          >
            {video.category}
          </span>
        </div>

        {/* Top Right: White Play Circle Icon */}
        <div className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-sortd-black group-hover:bg-sortd-yellow transition-colors shadow-md">
          <Play className="w-4 h-4 fill-sortd-black text-sortd-black ml-0.5" />
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 z-10 text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded">
          {video.duration}
        </div>

        {/* Bottom Overlay Bold White Caption */}
        <div className="absolute bottom-3 left-3 right-14 z-10">
          <h4 className="font-heading font-extrabold text-sm sm:text-base text-white line-clamp-2 leading-snug drop-shadow-sm">
            {video.title}
          </h4>
        </div>
      </motion.div>

      {/* One-line Grey Description Below Card */}
      <p className="mt-2 text-xs font-normal text-sortd-grey line-clamp-1 px-1">
        {video.description}
      </p>
    </div>
  );
}
