"use client";

import React, { useRef } from "react";
import SectionHeader from "@/components/common/SectionHeader";
import ArticleCard from "@/components/common/ArticleCard";
import CarouselControls from "@/components/common/CarouselControls";
import { useArticles } from "@/hooks/useArticles";
import { useSectionText } from "@/lib/siteSettings";

export default function LatestStories() {
  const sectionText = useSectionText("latest");
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
    <section id="latest" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
      {/* Header Row */}
      <SectionHeader
        title={sectionText.title}
        subtitle={sectionText.subtitle}
        accentColor="yellow"
        viewAllHref="/latest"
        showAccentBar={false}
        showBorder={false}
        size="sm"
      />

      {isLoading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[306px] bg-gray-100 rounded-[10px]" />
          ))}
        </div>
      ) : (
        <>
          {/* Mobile & Tablet layout (<lg): Slidable/Draggable horizontal scroll container (248px card + peek) */}
          <div
            ref={scrollRef}
            className="flex xl:hidden gap-4 lg:gap-6 overflow-x-auto no-scrollbar snap-rail w-[calc(100%+2rem)] -mx-4 px-4 sm:w-[calc(100%+3rem)] sm:-mx-6 sm:px-6 lg:w-full lg:mx-0 lg:px-0 py-2 -my-2 min-w-0"
          >
            {latestItems.map((article) => (
              <div
                key={article.id}
                className="w-[248px] lg:w-[280px] h-[306px] flex-shrink-0 snap-item"
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>

          {/* Desktop layout (lg+): Fixed grid of 4 columns */}
          <div className="hidden xl:grid grid-cols-4 gap-6">
            {latestItems.map((article) => (
              <div
                key={article.id}
                className="w-full h-[306px]"
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
