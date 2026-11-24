"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { isInstagramUrl } from "@/lib/instagram";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { VideoStory } from "@/types";
import { getCategoryBadgeStyle, useCategories } from "@/hooks/categoryStyles";

interface VideoCardProps {
  video: VideoStory;
  onPlay?: (video: VideoStory) => void;
  /** Pause the silent preview (e.g. while the full-screen player is open). */
  paused?: boolean;
  className?: string;
}

export default function VideoCard({ video, onPlay, paused = false, className = "" }: VideoCardProps) {
  useCategories(); // re-render with saved category colours once the page has loaded
  const badgeStyle = getCategoryBadgeStyle(video.category);

  const previewUrl = video.videoUrl?.trim();
  const [previewFailed, setPreviewFailed] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [previewFit, setPreviewFit] = useState<"cover" | "contain">("cover");
  const [thumbFailed, setThumbFailed] = useState(false);
  const previewRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setPreviewFailed(false);
    setPreviewReady(false);
    setPreviewFit("cover");
  }, [previewUrl]);

  useEffect(() => setThumbFailed(false), [video.thumbnailUrl]);

  // Instagram links can't be previewed inline; those cards keep the photo.
  const canPreview = !!previewUrl && !isInstagramUrl(previewUrl) && !previewFailed;

  // Only play while the card is on screen.
  useEffect(() => {
    const v = previewRef.current;
    if (!canPreview || !v) return;
    // A broken link can fail before React is listening; catch that here.
    if (v.error) { setPreviewFailed(true); return; }
    if (paused) { v.pause(); return; }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [canPreview, previewUrl, paused]);

  return (
    <div
      onClick={() => onPlay && onPlay(video)}
      className={`group cursor-pointer flex flex-col ${className}`}
    >
      {/* Thumbnail Card with Overlay (exact Figma 340px height, 12px radius) */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="relative w-full h-[340px] rounded-[12px] overflow-hidden bg-sortd-black transition-all"
      >
        {video.thumbnailUrl && !thumbFailed && (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            onError={() => setThumbFailed(true)}
            className={`object-cover opacity-90 transition-[filter] duration-300 ${previewFit === "contain" ? "blur-xl scale-110" : ""}`}
            sizes="(max-width: 768px) 80vw, 300px"
          />
        )}

        {/* Silent looping preview of the video itself (MP4 links only) */}
        {canPreview && (
          <video
            ref={previewRef}
            src={previewUrl}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              const box = v.parentElement?.getBoundingClientRect();
              if (!v.videoWidth || !box?.height) return;
              // Close to the card's shape → fill it; very different (e.g. landscape) → show it whole.
              const diff = Math.abs(v.videoWidth / v.videoHeight - box.width / box.height) / (box.width / box.height);
              setPreviewFit(diff <= 0.12 ? "cover" : "contain");
            }}
            // Show the video as soon as it has a picture, even if the browser blocks autoplay.
            onLoadedData={() => setPreviewReady(true)}
            onPlaying={() => setPreviewReady(true)}
            onError={() => setPreviewFailed(true)}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${previewFit === "contain" ? "object-contain" : "object-cover"} ${previewReady ? "opacity-90" : "opacity-0"}`}
          />
        )}

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Left: Category Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`h-[22px] px-2.5 rounded-[4px] font-body font-bold text-[10px] uppercase tracking-[1px] inline-flex items-center justify-center select-none ${badgeStyle.textColorClass}`}
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
