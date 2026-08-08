"use client";

import React, { useRef } from "react";
import SectionHeader from "@/components/common/SectionHeader";
import ArticleCard from "@/components/common/ArticleCard";
import CarouselControls from "@/components/common/CarouselControls";
import { useArticles } from "@/hooks/useArticles";

export default function LatestStories() {
  const { data: articles = [], isLoading } = useArticles();
  const latestItems = articles.filter((a) => a.isLatest).slice(0, 4);
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
      <SectionHeader
        title="LATEST STORIES"
        accentColor="yellow"
        viewAllHref="/news?category=NEWS"
        accentOnlyOnDesktop={true}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[285px] bg-gray-100 rounded-[10px]" />
          ))}
        </div>
      ) : (
        <>
          {/* Mobile & Tablet layout (<lg): Slidable/Draggable horizontal scroll container */}
          <div
            ref={scrollRef}
            className="flex lg:hidden gap-6 overflow-x-auto no-scrollbar snap-rail -mx-4 px-4 py-2"
          >
            {latestItems.map((article) => (
              <div
                key={article.id}
                className="w-[248px] h-[285px] flex-shrink-0 snap-item"
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>

          {/* Desktop layout (lg+): Fixed grid of 4 columns */}
          <div className="hidden lg:grid grid-cols-4 gap-6">
            {latestItems.map((article) => (
              <div
                key={article.id}
                className="w-full h-[285px]"
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
