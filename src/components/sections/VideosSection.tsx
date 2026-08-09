"use client";

import React, { useRef, useState, useEffect } from "react";
import SectionHeader from "@/components/common/SectionHeader";
import VideoCard from "@/components/common/VideoCard";
import CarouselControls from "@/components/common/CarouselControls";
import { useVideos } from "@/hooks/useData";
import { VideoStory } from "@/types";
import { X, Play, Share2, Clock, ArrowLeft, ArrowRight, Gift, Zap, Globe, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/footer/Footer";
import { getCategoryBadgeStyle } from "@/hooks/categoryStyles";
import { addSubscriber } from "@/hooks/useSubscribers";

export default function VideosSection() {
  const { data: videos = [] } = useVideos();
  const [activeVideo, setActiveVideo] = useState<VideoStory | null>(null);
  const [email, setEmail] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <section id="videos" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
      {/* Header Row */}
      <SectionHeader
        title="VIDEOS"
        accentColor="pink"
        viewAllHref=""
        showAccentBar={false}
        showBorder={false}
      />

      <div
        ref={scrollRef}
        className="w-full flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar snap-rail -mx-4 px-4 py-2 min-w-0"
      >
        {videos.map((video) => (
          <div key={video.id} className="w-[200px] sm:w-[230px] flex-shrink-0 snap-item">
            <VideoCard video={video} onPlay={(v) => setActiveVideo(v)} />
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
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

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#F7F9FC] z-30 pt-16 sm:pt-20 overflow-y-auto flex flex-col justify-between"
            >
              <div className="relative max-w-6xl mx-auto px-4 py-8 sm:py-16 w-full flex-grow animate-fade-in">
                {/* Close Button */}
                <button
                  onClick={() => setActiveVideo(null)}
                  className="absolute top-4 right-4 p-2 rounded-none bg-gray-200/60 hover:bg-gray-200 text-sortd-black transition-colors z-50 focus:outline-none"
                  aria-label="Close video player"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                  {/* Left Column - Portrait Video Card */}
                  <div className="lg:col-span-5 w-full flex justify-center">
                    <div className="relative w-full max-w-[420px] aspect-[9/16] rounded-[24px] overflow-hidden shadow-2xl border border-gray-200 bg-gray-900 group">
                      {activeVideo.videoUrl ? (
                        <video
                          src={activeVideo.videoUrl}
                          poster={activeVideo.thumbnailUrl}
                          controls
                          playsInline
                          className="w-full h-full object-cover"
                        />
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
                  <div className="lg:col-span-7 flex flex-col gap-6 w-full">
                    {/* Category & Share Row */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`h-[22px] px-2.5 rounded-none font-body font-bold text-[9px] uppercase tracking-wider inline-flex items-center justify-center gap-1 select-none ${badgeStyle.textColorClass}`}
                        style={{ backgroundColor: badgeStyle.bgColor }}
                      >
                        {icon}
                        <span>{activeVideo.category}</span>
                      </span>
                      <button className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-55 px-4 py-2 rounded-none text-xs font-body font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-wider">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>

                    {/* Title */}
                    <h2 className="font-heading text-3xl sm:text-4xl lg:text-[40px] leading-[1.0] text-sortd-black uppercase">
                      {activeVideo.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium whitespace-pre-line">
                      {activeVideo.longDescription || `${activeVideo.description}. Watch this 60-second video story to understand the full context, key figures, and what it means for residents and visitors in Dubai.`}
                    </p>

                    {/* Read Time Tag */}
                    <div className="inline-flex items-center gap-[6.09px] bg-sortd-yellow text-sortd-black h-[28.74px] py-[4.87px] px-[9.74px] rounded-none font-body font-bold text-[9px] uppercase tracking-wider self-start shadow-sm select-none">
                      <Clock className="w-3.5 h-3.5 text-sortd-black" />
                      <span>READ IN 60 SECONDS</span>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex items-center gap-4 mt-2">
                      <button
                        onClick={() => prevVideo && setActiveVideo(prevVideo)}
                        className="w-[34px] h-[34px] rounded-full border-2 border-sortd-black hover:bg-sortd-black hover:text-white text-sortd-black flex items-center justify-center transition-all duration-200 focus:outline-none"
                        aria-label="Previous story"
                      >
                        <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                      </button>
                      <button
                        onClick={() => nextVideo && setActiveVideo(nextVideo)}
                        className="w-[34px] h-[34px] rounded-full border-2 border-sortd-black hover:bg-sortd-black hover:text-white text-sortd-black flex items-center justify-center transition-all duration-200 focus:outline-none"
                        aria-label="Next story"
                      >
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>

                    {/* Up Next Section */}
                    {nextVideo && (
                      <div className="flex flex-col gap-2 mt-2">
                        <span className="inline-flex items-center justify-center bg-sortd-yellow text-sortd-black h-[28.74px] py-[4.87px] px-[9.74px] rounded-none font-body font-bold text-[9px] uppercase tracking-wider self-start shadow-sm select-none">
                          UP NEXT
                        </span>
                        <div
                          onClick={() => setActiveVideo(nextVideo)}
                          className="flex items-center gap-2 py-2 cursor-pointer w-full lg:max-w-[629px] group"
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
                    <div className="flex flex-col gap-3 mt-4 w-full sm:max-w-xl pt-6 border-t border-gray-200">
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
                            className="w-full border border-gray-200 bg-white rounded-none px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-sortd-black pr-12 font-medium text-sortd-black"
                          />
                          <Gift className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-sortd-yellow hover:bg-sortd-yellow-hover text-sortd-black font-body font-extrabold text-xs uppercase tracking-wider py-4 rounded-none transition-colors shadow-sm"
                        >
                          Subscribe
                        </button>
                      </form>
                      <p className="text-[9px] sm:text-[10px] text-sortd-grey/80 text-left font-medium mt-1">
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
      </AnimatePresence>
    </section>
  );
}
