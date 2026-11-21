"use client";

import React, { useEffect, useRef, useState } from "react";
import EmptyState from "@/components/common/EmptyState";
import { isInstagramUrl, getInstagramEmbedUrl } from "@/lib/instagram";

interface VideoMediaProps {
  videoUrl?: string;
  posterUrl?: string;
  /** Story mode (mobile): loops with no controls. Otherwise plays once with controls. Both start muted. */
  story?: boolean;
  className?: string;
}

/**
 * Plays a video story from an MP4 link or an Instagram post/reel link.
 * - Any aspect ratio is shown whole (never cropped); spare space is filled
 *   with a blurred, dimmed copy of the same video instead of black bars.
 * - No link, or a link that fails to load, shows "Nothing to show here".
 */
export default function VideoMedia({ videoUrl, posterUrl, story = false, className = "" }: VideoMediaProps) {
  const [failed, setFailed] = useState(false);
  const mainRef = useRef<HTMLVideoElement>(null);
  const bgRef = useRef<HTMLVideoElement>(null);

  // New video → clear any earlier error.
  useEffect(() => setFailed(false), [videoUrl]);

  // Keep the blurred background in step with the main video.
  useEffect(() => {
    const main = mainRef.current;
    const bg = bgRef.current;
    if (!main || !bg) return;
    const sync = () => {
      if (Math.abs(bg.currentTime - main.currentTime) > 0.3) bg.currentTime = main.currentTime;
      if (main.paused) bg.pause(); else bg.play().catch(() => {});
    };
    main.addEventListener("play", sync);
    main.addEventListener("pause", sync);
    main.addEventListener("seeked", sync);
    main.addEventListener("timeupdate", sync);
    return () => {
      main.removeEventListener("play", sync);
      main.removeEventListener("pause", sync);
      main.removeEventListener("seeked", sync);
      main.removeEventListener("timeupdate", sync);
    };
  }, [videoUrl, failed]);

  const url = videoUrl?.trim();

  if (!url || failed) {
    return (
      <div className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden ${className}`}>
        {posterUrl && <img src={posterUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />}
        <div className="relative z-10 w-[80%] max-w-[320px]">
          <EmptyState dark />
        </div>
      </div>
    );
  }

  if (isInstagramUrl(url)) {
    return (
      <div className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden ${className}`}>
        <iframe
          src={getInstagramEmbedUrl(url)}
          title="Instagram video"
          className="w-full h-full max-w-[540px] border-none bg-white"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          scrolling="no"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full bg-black overflow-hidden ${className}`}>
      {/* Blurred fill behind the video, so no shape ever leaves empty bars */}
      <video
        ref={bgRef}
        src={url}
        muted
        loop
        playsInline
        autoPlay
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60 pointer-events-none"
      />
      {/* The real video, always shown whole */}
      <video
        ref={mainRef}
        src={url}
        poster={posterUrl}
        playsInline
        autoPlay
        muted
        loop={story}
        controls={!story}
        onError={(e) => {
          const err = e.currentTarget.error;
          console.warn(`[Sortd video] Couldn't load "${url}" (error ${err?.code ?? "?"}: ${err?.message || "no details"})`);
          setFailed(true);
        }}
        className="relative z-[1] w-full h-full object-contain"
      />
    </div>
  );
}
