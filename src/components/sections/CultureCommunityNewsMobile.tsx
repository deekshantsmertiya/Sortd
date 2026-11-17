"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/common/SectionHeader";
import ListItemCard from "@/components/common/ListItemCard";
import EmptyState from "@/components/common/EmptyState";
import { useArticles } from "@/hooks/useArticles";
import { useCategories } from "@/hooks/categoryStyles";

/** Time each slide stays before auto-advancing (was 4.5s). */
const SLIDE_MS = 8000;

export default function CultureCommunityNewsMobile() {
  // Columns are tied to category IDs, so renaming a category in admin keeps its column.
  const { data: allCategories = [] } = useCategories();
  const catName = (id: string, fallback: string) => allCategories.find((c) => c.id === id)?.name || fallback;
  const NEWS_NAME = catName("news", "NEWS");
  const CULTURE_NAME = catName("culture", "CULTURE");
  const COMMUNITY_NAME = catName("community", "COMMUNITY");
  const { data: cultureArticles = [] } = useArticles(CULTURE_NAME);
  const { data: communityArticles = [] } = useArticles(COMMUNITY_NAME);
  const { data: newsArticles = [] } = useArticles(NEWS_NAME);

  const visibleCulture = cultureArticles.slice(0, 3);
  const visibleCommunity = communityArticles.slice(0, 3);
  const visibleNews = newsArticles.slice(0, 3);

  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const autoplayTimerRef = useRef<any>(null);

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, SLIDE_MS); // slower autoplay so readers can scan each list
  };

  const stopAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  };

  const resetAutoplay = () => {
    startAutoplay();
  };

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
      }
    };
    window.addEventListener("resize", handleResize);
    startAutoplay();

    return () => {
      window.removeEventListener("resize", handleResize);
      stopAutoplay();
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    stopAutoplay();
    touchStartX.current = e.targetTouches[0].clientX;
    touchCurrentX.current = e.targetTouches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    touchCurrentX.current = e.targetTouches[0].clientX;
    const diffX = touchCurrentX.current - touchStartX.current;
    
    // Apply boundary resistance at ends
    if (activeIndex === 0 && diffX > 0) {
      setDragOffset(diffX * 0.4); // Resistance when dragging right on first slide
    } else if (activeIndex === 2 && diffX < 0) {
      setDragOffset(diffX * 0.4); // Resistance when dragging left on last slide
    } else {
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    setIsSwiping(false);

    const diffX = touchCurrentX.current - touchStartX.current;
    const swipeThreshold = 50; // Threshold to trigger slide change in pixels

    let nextIndex = activeIndex;
    if (diffX < -swipeThreshold && activeIndex < 2) {
      nextIndex = activeIndex + 1;
    } else if (diffX > swipeThreshold && activeIndex > 0) {
      nextIndex = activeIndex - 1;
    }

    setActiveIndex(nextIndex);
    setDragOffset(0);
    resetAutoplay();
  };

  // Convert pixel drag offset to percentage translation of the 300% wide container
  const dragPercent = containerWidth ? (dragOffset / (containerWidth * 3)) * 100 : 0;
  const translatePercent = -activeIndex * (100 / 3) + dragPercent;

  return (
    <section className="bg-transparent max-w-[1440px] mx-auto w-full px-4 overflow-hidden select-none lg:hidden">
      {/* Progress Bars / Slide Indicators */}
      <div className="flex justify-center gap-3 mb-6">
        {[NEWS_NAME, CULTURE_NAME, COMMUNITY_NAME].map((label, idx) => {
          const colors = ["#FFD100", "#1B2F6E", "#E8185A"];
          const isActive = activeIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => {
                setActiveIndex(idx);
                resetAutoplay();
              }}
              className="flex flex-col gap-1.5 flex-1 max-w-[100px] text-left group focus:outline-none cursor-pointer py-2.5 -my-2.5"
            >
              {/* Label */}
              <span className={`text-[10px] font-body font-bold tracking-wider transition-colors ${isActive ? "text-[#0A0A0A]" : "text-gray-400 group-hover:text-gray-600"}`}>
                {label}
              </span>
              {/* Indicator Bar Container */}
              <div className="h-[3px] w-full bg-gray-200 rounded-none overflow-hidden relative">
                {isActive ? (
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                    className="h-full absolute left-0 top-0"
                    style={{ backgroundColor: colors[idx] }}
                  />
                ) : (
                  <div className="h-full w-0 bg-transparent" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Slider Viewport */}
      <div ref={containerRef} className="relative overflow-hidden w-full">
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex w-[300%] select-none touch-pan-y"
          style={{
            transform: `translate3d(${translatePercent}%, 0, 0)`,
            transition: isSwiping ? "none" : "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* Slide 1: NEWS */}
          <div className="w-1/3 flex-shrink-0 pr-4">
            <SectionHeader
              title={NEWS_NAME}
              accentColor="yellow"
              viewAllHref={`/news?category=${encodeURIComponent(NEWS_NAME)}`}
              showAccentBar={true}
            />
            <div className="flex flex-col gap-5">
              {visibleNews.length === 0 ? (
                <EmptyState />
              ) : (
                visibleNews.map((article) => <ListItemCard key={article.id} article={article} />)
              )}
            </div>
          </div>

          {/* Slide 2: CULTURE */}
          <div className="w-1/3 flex-shrink-0 pr-4">
            <SectionHeader
              title={CULTURE_NAME}
              accentColor="navy"
              viewAllHref={`/news?category=${encodeURIComponent(CULTURE_NAME)}`}
              showAccentBar={true}
            />
            <div className="flex flex-col gap-5">
              {visibleCulture.length === 0 ? (
                <EmptyState />
              ) : (
                visibleCulture.map((article) => <ListItemCard key={article.id} article={article} />)
              )}
            </div>
          </div>

          {/* Slide 3: COMMUNITY */}
          <div className="w-1/3 flex-shrink-0 pr-4">
            <SectionHeader
              title={COMMUNITY_NAME}
              accentColor="pink"
              viewAllHref={`/news?category=${encodeURIComponent(COMMUNITY_NAME)}`}
              showAccentBar={true}
            />
            <div className="flex flex-col gap-5">
              {visibleCommunity.length === 0 ? (
                <EmptyState />
              ) : (
                visibleCommunity.map((article) => <ListItemCard key={article.id} article={article} />)
              )}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
