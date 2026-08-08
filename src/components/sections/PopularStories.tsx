"use client";

import React, { useRef } from "react";
import SectionHeader from "@/components/common/SectionHeader";
import ArticleCard from "@/components/common/ArticleCard";
import CarouselControls from "@/components/common/CarouselControls";
import { useArticles } from "@/hooks/useArticles";

export default function PopularStories() {
  const { data: articles = [] } = useArticles();
  const popularItems = articles.filter((a) => a.isPopular).slice(0, 6);
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
    <section id="popular" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Row */}
      <SectionHeader
        title="POPULAR STORIES"
        accentColor="pink"
        viewAllHref="/news"
        accentOnlyOnDesktop={true}
      />

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar snap-rail -mx-4 px-4 py-2"
      >
        {popularItems.map((article) => (
          <div key={article.id} className="w-[82%] sm:w-[48%] md:w-[31%] lg:w-[23.5%] flex-shrink-0 snap-item">
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
