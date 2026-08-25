"use client";

import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Header from "@/components/header/Header";
import SectionHeader from "@/components/common/SectionHeader";
import VideoCard from "@/components/common/VideoCard";
import CarouselControls from "@/components/common/CarouselControls";
import { useVideos } from "@/hooks/useData";
import { VideoStory } from "@/types";
import { X, Play, Pause, Share2, Clock, ArrowLeft, ArrowRight, Gift, Zap, Globe, Users, Check, ChevronDown, Heart, MessageSquare, BookOpen, Square, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/footer/Footer";
import { getCategoryBadgeStyle } from "@/hooks/categoryStyles";
import { addSubscriber } from "@/hooks/useSubscribers";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

const isInstagramUrl = (url?: string) => {
  if (!url) return false;
  return /instagram\.com\/(p|reel|tv)\//i.test(url);
};

const getInstagramEmbedUrl = (url?: string) => {
  if (!url) return "";
  if (url.includes("/embed")) return url;
  const cleanUrl = url.split("?")[0].replace(/\/+$/, "");
  return `${cleanUrl}/embed/`;
};

export default function VideosSection() {
  const { data: videos = [] } = useVideos();
  const [activeVideo, setActiveVideo] = useState<VideoStory | null>(null);
  const [email, setEmail] = useState("");
  const [copiedVideo, setCopiedVideo] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mobile immersive story states
  const [isMobile, setIsMobile] = useState(false);
  const [activePanel, setActivePanel] = useState<"video" | "article">("video");
  const [likedVideos, setLikedVideos] = useState<Record<string, boolean>>({});

  const videoContent = activeVideo ? [
    activeVideo.longDescription || `${activeVideo.description}. This represents a key story update for residents, professionals, and visitors in Dubai.`,
    "Beyond the immediate updates, this story highlights a broader strategic shift. Industry leaders and development experts note that these policies are directly aimed at establishing long-term value, encouraging community growth, and solidifying Dubai's global standing.",
    "Furthermore, local creative hubs and businesses have welcomed this narrative. By creating a unified digital space and simplifying communication, the region is positioning itself to compete directly with major European and North American capitals."
  ] : [];

  const fullTextToSpeak = activeVideo ? [
    activeVideo.title,
    ...videoContent
  ].join(". ") : "";

  const {
    isPlaying,
    isPaused,
    progress,
    currentTime,
    durationTime,
    play,
    pause,
    stop,
    seek,
  } = useSpeechSynthesis(fullTextToSpeak);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setActivePanel("video");
    stop();
  }, [activeVideo]);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isScrollBlocked = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent, activeIndex: number) => {
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;

    // Check if horizontal or vertical swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < -50) {
        // Swipe Left -> open article
        if (activePanel === "video") {
          setActivePanel("article");
        }
      } else if (diffX > 50) {
        // Swipe Right -> close article
        if (activePanel === "article") {
          setActivePanel("video");
        }
      }
    } else {
      if (activePanel === "video") {
        if (isScrollBlocked.current) return;

        if (diffY < -55) {
          // Swipe Up -> next video
          isScrollBlocked.current = true;
          const nextIdx = (activeIndex + 1) % videos.length;
          setActiveVideo(videos[nextIdx]);
          
          if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
          scrollTimeout.current = setTimeout(() => {
            isScrollBlocked.current = false;
          }, 1000);
        } else if (diffY > 55) {
          // Swipe Down -> prev video
          isScrollBlocked.current = true;
          const prevIdx = (activeIndex - 1 + videos.length) % videos.length;
          setActiveVideo(videos[prevIdx]);

          if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
          scrollTimeout.current = setTimeout(() => {
            isScrollBlocked.current = false;
          }, 1000);
        }
      }
    }
  };

  const handleWheel = (e: React.WheelEvent, activeIndex: number) => {
    if (activePanel !== "video") return;
    if (isScrollBlocked.current) return;

    if (Math.abs(e.deltaY) > 30) {
      isScrollBlocked.current = true;
      if (e.deltaY > 0) {
        // Scroll Down -> next video
        const nextIdx = (activeIndex + 1) % videos.length;
        setActiveVideo(videos[nextIdx]);
      } else {
        // Scroll Up -> prev video
        const prevIdx = (activeIndex - 1 + videos.length) % videos.length;
        setActiveVideo(videos[prevIdx]);
      }

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isScrollBlocked.current = false;
      }, 1000);
    }
  };

  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      addSubscriber(email);
      alert(`Subscribed ${email} to Sortd!`);
      setEmail("");
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toUpperCase()) {
      case "NEWS":
        return "bg-sortd-yellow text-sortd-black";
      case "CULTURE":
        return "bg-sortd-navy text-white";
      case "COMMUNITY":
        return "bg-sortd-pink text-white";
      default:
        return "bg-sortd-black text-white";
    }
  };

  return (
    <section id="videos" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
      {/* Header Row */}
      <SectionHeader
        title="VIDEOS"
        accentColor="pink"
        viewAllHref=""
        showAccentBar={false}
        showBorder={false}
        size="sm"
      />

      <div
        ref={scrollRef}
        className="w-full flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar snap-rail -mx-4 px-4 lg:mx-0 lg:px-0 py-2 min-w-0"
      >
        {videos.map((video) => (
          <div key={video.id} className="w-[200px] sm:w-[230px] flex-shrink-0 snap-item">
            <VideoCard video={video} onPlay={(v) => setActiveVideo(v)} />
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {activeVideo && (() => {
            const activeIndex = videos.findIndex((v) => v.id === activeVideo.id);
            const prevVideo = activeIndex !== -1 ? videos[(activeIndex - 1 + videos.length) % videos.length] : null;
            const nextVideo = activeIndex !== -1 ? videos[(activeIndex + 1) % videos.length] : null;

          // Resolve category styles dynamically
          const badgeStyle = getCategoryBadgeStyle(activeVideo.category);
          
          const getIcon = (catName: string) => {
            switch (catName.toUpperCase()) {
              case "NEWS":
                return <Zap className="w-3 h-3 text-current fill-current" />;
              case "CULTURE":
                return <Globe className="w-3 h-3 text-current" />;
              case "COMMUNITY":
                return <Users className="w-3 h-3 text-current" />;
              default:
                return <Zap className="w-3 h-3 text-current" />;
            }
          };

          const icon = getIcon(activeVideo.category);

          if (isMobile) {
            const isLiked = likedVideos[activeVideo.id] || false;
            const toggleLike = () => {
              setLikedVideos(prev => ({ ...prev, [activeVideo.id]: !isLiked }));
            };

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onTouchStart={handleTouchStart}
                onTouchEnd={(e) => handleTouchEnd(e, activeIndex)}
                onWheel={(e) => handleWheel(e, activeIndex)}
                className="fixed inset-0 bg-black z-50 overflow-hidden flex flex-col justify-between select-none"
              >
                {/* 1. Immersive Video Background with overlay */}
                <div className="absolute inset-0 w-full h-full bg-black z-0 flex items-center justify-center">
                  {activeVideo.videoUrl ? (
                    isInstagramUrl(activeVideo.videoUrl) ? (
                      <div className="relative w-full max-w-[420px] aspect-[9/16] overflow-hidden rounded-[16px] shadow-2xl bg-black">
                        <iframe
                          src={getInstagramEmbedUrl(activeVideo.videoUrl)}
                          className="w-full h-full border-none"
                          allowTransparency
                          allow="encrypted-media"
                          scrolling="no"
                          frameBorder="0"
                        />
                      </div>
                    ) : (
                      <video
                        src={activeVideo.videoUrl}
                        poster={activeVideo.thumbnailUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <img
                      src={activeVideo.thumbnailUrl}
                      alt={activeVideo.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Vignette Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 z-10 pointer-events-none" />
                </div>

                {/* 2. Top Navigation Header (sortd logo + DUBAI location dropdown + back button) */}
                <div className="relative z-20 flex items-center justify-between px-4 pt-6 pb-2 w-full">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveVideo(null)}
                      className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center border border-white/20 active:scale-95 transition-transform"
                      aria-label="Back to home"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    {/* Brand Logo Image */}
                    <img
                      src="/header.png"
                      alt="sortd"
                      className="h-8 w-auto object-contain select-none"
                    />
                  </div>

                  <div className="border border-white/40 bg-black/30 rounded-full px-3 py-1 text-[10px] sm:text-xs text-white uppercase tracking-wider font-body font-bold flex items-center gap-1">
                    <span>DUBAI</span>
                    <ChevronDown className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* 3. Bottom & Right Side Controls Container */}
                <div className="relative z-20 w-full flex-grow flex items-end justify-between px-4 pb-8">
                  
                  {/* Left Side Overlay Info */}
                  <div className="flex flex-col max-w-[75%] pb-4">
                    {/* Category Tags Row */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="border border-white/40 bg-black/30 text-white text-[9px] font-body font-bold tracking-wider px-2 py-0.5 uppercase">
                        {activeVideo.category}
                      </span>
                      <span className="border border-white/40 bg-black/30 text-white text-[9px] font-body font-bold tracking-wider px-2 py-0.5 uppercase">
                        {activeVideo.category}
                      </span>
                    </div>
                    {/* Story Big Headline Title (Bebas Neue/Condensed Style) */}
                    <h2 className="font-heading text-[26px] leading-[28px] font-normal uppercase text-white tracking-[0.5px] mt-2.5 mb-3.5 select-none">
                      {activeVideo.title}
                    </h2>
                    {/* Swipe Instruction link */}
                    <div
                      onClick={() => setActivePanel("article")}
                      className="flex items-center gap-1.5 text-white/90 font-body font-bold text-[10px] uppercase tracking-wider select-none cursor-pointer hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-white animate-pulse" />
                      <span>Swipe Left To Read Article</span>
                    </div>
                  </div>

                  {/* Right Side Control Bar Icons Stack (Naked Outlines with 24px gap) */}
                  <div className="flex flex-col items-center gap-6 mb-4 select-none pr-1 w-[33px]">
                    {/* Heart (Like) */}
                    <div className="flex flex-col items-center cursor-pointer group" onClick={toggleLike}>
                      <Heart className={`w-8 h-8 ${isLiked ? "text-red-500 fill-red-500" : "text-white"}`} />
                      <span className="text-[11px] font-bold text-white mt-1 shadow-sm">1.1K</span>
                    </div>

                    {/* MessageCircle (Comments) */}
                    <div className="flex flex-col items-center cursor-pointer group">
                      <MessageSquare className="w-8 h-8 text-white" />
                      <span className="text-[11px] font-bold text-white mt-1 shadow-sm">1.1K</span>
                    </div>

                    {/* Share icon */}
                    <div
                      className="flex flex-col items-center cursor-pointer group"
                      onClick={async () => {
                        if (typeof window === "undefined") return;
                        const videoUrl = `${window.location.origin}/article/${activeVideo.id}`;
                        const shareData = {
                          title: activeVideo.title,
                          text: activeVideo.description,
                          url: videoUrl,
                        };
                        if (navigator.share) {
                          try {
                            await navigator.share(shareData);
                          } catch (err) {
                            console.log("Error sharing video story:", err);
                          }
                        } else {
                          try {
                            await navigator.clipboard.writeText(videoUrl);
                            alert("Link copied!");
                          } catch (err) {
                            console.log("Clipboard failed:", err);
                          }
                        }
                      }}
                    >
                      <Share2 className="w-8 h-8 text-white" />
                      <span className="text-[11px] font-bold text-white mt-1 shadow-sm">1.1K</span>
                    </div>

                    {/* BookOpen (Read) */}
                    <div className="flex flex-col items-center cursor-pointer group" onClick={() => setActivePanel("article")}>
                      <BookOpen className="w-8 h-8 text-sortd-yellow" />
                      <span className="text-[11px] font-bold text-sortd-yellow mt-1 shadow-sm">1.1K</span>
                    </div>
                  </div>

                </div>

                {/* 4. Slide-in Article Details Panel (Figma 3rd Image Style) */}
                <AnimatePresence>
                  {activePanel === "article" && (
                    <motion.div
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      transition={{ type: "spring", damping: 28, stiffness: 220 }}
                      className="absolute inset-0 bg-[#F7F9FC] z-30 overflow-y-auto flex flex-col justify-between"
                    >
                      <div className="w-full">
                        {/* Upper Half: Banner Image */}
                        <div className="relative w-full h-[220px] bg-gray-150 flex-shrink-0">
                          <img
                            src={activeVideo.thumbnailUrl}
                            alt={activeVideo.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Title, Category & Info Header */}
                        <div className="px-4 pt-4 flex items-center gap-3">
                          <span
                            className={`h-[22px] px-2.5 rounded-none font-body font-bold text-[9px] uppercase tracking-wider inline-flex items-center justify-center gap-1 select-none ${badgeStyle.textColorClass}`}
                            style={{ backgroundColor: badgeStyle.bgColor }}
                          >
                            {icon}
                            <span>{activeVideo.category}</span>
                          </span>
                          <span className="text-[11px] font-semibold text-sortd-grey uppercase tracking-wider">
                            2 hours ago
                          </span>
                        </div>

                        {/* Bold Uppercase Header */}
                        <h1 className="px-4 font-heading uppercase text-2xl sm:text-3xl tracking-normal font-normal text-sortd-black mt-3 mb-4 leading-[1.1]">
                          {activeVideo.title}
                        </h1>

                        {/* Listen Play Button & Audio controls */}
                        <div className="px-4 mb-5 flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => {
                              if (isPlaying) {
                                if (isPaused) {
                                  play();
                                } else {
                                  pause();
                                }
                              } else {
                                play();
                              }
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-sortd-pink hover:bg-sortd-pink-hover text-white font-body font-extrabold text-xs tracking-wider uppercase transition-all shadow-sm"
                          >
                            {isPlaying && !isPaused ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
                                <Play className="w-2.5 h-2.5 text-white fill-white ml-[0.5px]" />
                              </div>
                            )}
                            <span>{isPlaying ? (isPaused ? "RESUME AUDIO" : "PAUSE AUDIO") : "LISTEN TO THE ARTICLE"}</span>
                          </button>

                          {isPlaying && (
                            <button
                              onClick={stop}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-none border border-sortd-pink hover:bg-sortd-pink/10 text-sortd-pink font-body font-extrabold text-xs tracking-wider uppercase transition-all shadow-sm"
                            >
                              <Square className="w-3.5 h-3.5 fill-sortd-pink text-sortd-pink" />
                              <span>STOP</span>
                            </button>
                          )}
                        </div>

                        {/* Audio Player Bar (If Active) */}
                        <AnimatePresence>
                          {isPlaying && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mx-4 mb-5 p-4 rounded-xl bg-sortd-off-white border border-sortd-black/10 flex flex-col gap-2"
                            >
                              <div className="flex items-center justify-between text-xs font-bold text-sortd-black">
                                <div className="flex items-center gap-2">
                                  <Volume2 className="w-4 h-4 text-sortd-pink animate-pulse" />
                                  <span>AUDIO NARRATION — READ IN {durationTime} SECONDS</span>
                                </div>
                                <span>{formatTime(currentTime)} / {formatTime(durationTime)}</span>
                              </div>
                              {/* Progress bar */}
                              <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden cursor-pointer" onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const clickX = e.clientX - rect.left;
                                seek((clickX / rect.width) * 100);
                              }}>
                                <div className="h-full bg-sortd-pink rounded-full" style={{ width: `${progress}%` }} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Text copy */}
                        <div className="px-4 text-sortd-black/90 font-normal leading-relaxed text-base space-y-4 mb-24">
                          <p>
                            {activeVideo.longDescription || `${activeVideo.description}. This represents a key story update for residents, professionals, and visitors in Dubai.`}
                          </p>
                          <p>
                            Beyond the immediate updates, this story highlights a broader strategic shift. Industry leaders and development experts note that these policies are directly aimed at establishing long-term value, encouraging community growth, and solidifying Dubai's global standing.
                          </p>
                          <p>
                            Furthermore, local creative hubs and businesses have welcomed this narrative. By creating a unified digital space and simplifying communication, the region is positioning itself to compete directly with major European and North American capitals.
                          </p>
                        </div>
                      </div>

                      {/* Floating back button at bottom center */}
                      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 pointer-events-none">
                        <button
                          onClick={() => setActivePanel("video")}
                          className="pointer-events-auto w-[161px] h-[40px] rounded-[10px] bg-sortd-yellow text-sortd-black font-body font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all duration-200 cursor-pointer border-none"
                        >
                          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                          <span>Back To Video</span>
                        </button>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          }


          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#F7F9FC] z-30 overflow-y-auto"
            >
              <Header onClickLogo={() => setActiveVideo(null)} />

              <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-6 sm:pt-16 sm:pb-6 w-full animate-fade-in">
                {/* Close Button */}
                <button
                  onClick={() => setActiveVideo(null)}
                  className="absolute top-4 right-4 p-2 rounded-none bg-gray-200/60 hover:bg-gray-200 text-sortd-black transition-colors z-50 focus:outline-none lg:hidden"
                  aria-label="Close video player"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                  {/* Left Column - Portrait Video Card */}
                  <div className="lg:col-span-5 w-full flex justify-center">
                    <div className="relative w-full max-w-[420px] aspect-[9/16] rounded-[24px] overflow-hidden shadow-2xl border border-gray-200 bg-gray-900 group">
                      {activeVideo.videoUrl ? (
                        isInstagramUrl(activeVideo.videoUrl) ? (
                          <div className="w-full h-full flex items-center justify-center bg-black">
                            <iframe
                              src={getInstagramEmbedUrl(activeVideo.videoUrl)}
                              className="w-full h-full border-none"
                              allowTransparency
                              allow="encrypted-media"
                              scrolling="no"
                              frameBorder="0"
                            />
                          </div>
                        ) : (
                          <video
                            src={activeVideo.videoUrl}
                            poster={activeVideo.thumbnailUrl}
                            controls
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <>
                          <img
                            src={activeVideo.thumbnailUrl}
                            alt={activeVideo.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          {/* Subtle gradient overlays */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                          
                          {/* Simulated Play button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button className="w-16 h-16 rounded-full border-4 border-white bg-transparent flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200 focus:outline-none">
                              <Play className="w-6 h-6 text-white fill-white ml-1" />
                            </button>
                          </div>

                          {/* Player controls overlay at bottom */}
                          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white text-xs font-semibold">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                              <span>00:00 / {activeVideo.duration}</span>
                            </div>
                            <span>HD</span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/30">
                            <div className="h-full bg-sortd-yellow w-1/3" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Story Info */}
                  <div className="lg:col-span-7 flex flex-col gap-5 w-full">
                    {/* Category & Share Row */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`h-[22px] px-2.5 rounded-none font-body font-bold text-[9px] uppercase tracking-wider inline-flex items-center justify-center gap-1 select-none ${badgeStyle.textColorClass}`}
                        style={{ backgroundColor: badgeStyle.bgColor }}
                      >
                        {icon}
                        <span>{activeVideo.category}</span>
                      </span>
                      <button
                        onClick={async () => {
                          if (typeof window === "undefined" || !activeVideo) return;
                          const videoUrl = `${window.location.origin}/article/${activeVideo.id}`;
                          const shareData = {
                            title: activeVideo.title,
                            text: activeVideo.description,
                            url: videoUrl,
                          };
                          if (navigator.share) {
                            try {
                              await navigator.share(shareData);
                            } catch (err) {
                              console.log("Error sharing video:", err);
                            }
                          } else {
                            try {
                              await navigator.clipboard.writeText(videoUrl);
                              setCopiedVideo(true);
                              setTimeout(() => setCopiedVideo(false), 2500);
                            } catch (err) {
                              console.log("Clipboard write failed:", err);
                            }
                          }
                        }}
                        className="w-[86px] h-[33px] rounded-[4px] border border-[#999999] bg-transparent text-[#999999] hover:border-sortd-black hover:text-sortd-black flex items-center justify-center gap-[8px] font-body font-medium text-xs transition-colors focus:outline-none cursor-pointer"
                      >
                        {copiedVideo ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
                        <span>{copiedVideo ? "Copied!" : "Share"}</span>
                      </button>
                    </div>

                    {/* Title */}
                    <h2 className="font-heading text-3xl sm:text-4xl lg:text-[40px] leading-[1.0] text-sortd-black uppercase">
                      {activeVideo.title}
                    </h2>

                    {/* Description */}
                    <p className="font-body font-normal text-[18px] leading-[24px] text-justify text-[#0A0A0A] whitespace-pre-line">
                      {activeVideo.longDescription || `${activeVideo.description}. Watch this 60-second video story to understand the full context, key figures, and what it means for residents and visitors in Dubai.`}
                    </p>

                    {/* Read Time Tag */}
                    <div className="inline-flex items-center gap-[6.09px] bg-[#FFD100] text-sortd-black h-[28.74px] py-[4.87px] px-[9.74px] rounded-none font-body font-bold text-[9px] uppercase tracking-wider self-start shadow-sm select-none">
                      <Clock className="w-3.5 h-3.5 text-sortd-black" />
                      <span>READ IN 60 SECONDS</span>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => prevVideo && setActiveVideo(prevVideo)}
                        className="w-[34px] h-[34px] rounded-full border-[2.83px] border-sortd-black hover:bg-sortd-black hover:text-white text-sortd-black flex items-center justify-center transition-all duration-200 focus:outline-none"
                        aria-label="Previous story"
                      >
                        <ArrowLeft className="w-4 h-4 stroke-[2.83]" />
                      </button>
                      <button
                        onClick={() => nextVideo && setActiveVideo(nextVideo)}
                        className="w-[34px] h-[34px] rounded-full border-[2.83px] border-sortd-black hover:bg-sortd-black hover:text-white text-sortd-black flex items-center justify-center transition-all duration-200 focus:outline-none"
                        aria-label="Next story"
                      >
                        <ArrowRight className="w-4 h-4 stroke-[2.83]" />
                      </button>
                    </div>

                    {/* Up Next Section */}
                    {nextVideo && (
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center justify-center bg-[#FFD100] text-sortd-black h-[28.74px] py-[4.87px] px-[9.74px] rounded-none font-body font-bold text-[9px] uppercase tracking-wider self-start shadow-sm select-none">
                          UP NEXT
                        </span>
                        <div
                          onClick={() => setActiveVideo(nextVideo)}
                          className="flex items-center gap-2 cursor-pointer w-full lg:max-w-[629px] group"
                        >
                          <div className="w-[80px] h-[72.38px] rounded-[4px] overflow-hidden flex-shrink-0 relative bg-gray-900 shadow-sm">
                            <img
                              src={nextVideo.thumbnailUrl}
                              alt={nextVideo.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <Play className="w-4 h-4 fill-white text-white opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all" />
                            </div>
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-heading font-bold text-xs sm:text-sm text-sortd-black uppercase line-clamp-2 leading-snug group-hover:text-sortd-pink transition-colors">
                              {nextVideo.title}
                            </h4>
                            <p className="text-[10px] text-sortd-grey font-medium mt-1">
                              5 hours ago
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Newsletter Subscription */}
                    <div className="flex flex-col gap-3 w-full sm:max-w-xl">
                      <h3 className="font-heading text-lg sm:text-[19px] text-sortd-black uppercase tracking-wider">
                        STAY SORTD. SUBSCRIBE NOW
                      </h3>
                      <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                        <div className="relative">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email Address"
                            required
                            className="w-full px-4 py-3 rounded-[6px] border border-gray-200 bg-white text-xs font-medium text-sortd-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-sortd-black pr-12"
                          />
                          <Gift className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-3 rounded-[6px] bg-sortd-yellow hover:bg-sortd-yellow-hover text-sortd-black font-body font-extrabold text-xs uppercase tracking-wider transition-colors shadow-sm text-center"
                        >
                          Subscribe
                        </button>
                      </form>
                      <p className="text-[9px] sm:text-[10px] text-sortd-grey/80 text-left font-medium">
                        By subscribing you agree to the{" "}
                        <span className="underline cursor-pointer hover:text-sortd-black">terms & conditions</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <Footer />
            </motion.div>
          );
        })()}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
