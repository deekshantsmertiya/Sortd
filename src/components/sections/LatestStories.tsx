"use client";

import React, { useRef } from "react";
import SectionHeader from "@/components/common/SectionHeader";
import ArticleCard from "@/components/common/ArticleCard";
import CarouselControls from "@/components/common/CarouselControls";
import { useArticles } from "@/hooks/useArticles";

export default function LatestStories() {
  const { data: articles = [], isLoading } = useArticles();
  const latestItems = articles.filter((a) => a.isLatest).slice(0, 6);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="latest" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Row */}
      <SectionHeader title="LATEST STORIES" accentColor="yellow" viewAllHref="/#news">
        <CarouselControls
          onPrev={() => handleScroll("left")}
          onNext={() => handleScroll("right")}
          className="hidden sm:flex"
        />
      </SectionHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar snap-rail -mx-4 px-4 py-2"
        >
          {latestItems.map((article) => (
            <div key={article.id} className="w-[82%] sm:w-[48%] md:w-[31%] lg:w-[23.5%] flex-shrink-0 snap-item">
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
