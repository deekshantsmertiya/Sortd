"use client";

import React from "react";
import SectionHeader from "@/components/common/SectionHeader";
import ListItemCard from "@/components/common/ListItemCard";
import { useArticles } from "@/hooks/useArticles";

export default function NewsSection() {
  const { data: newsArticles = [] } = useArticles("NEWS");
  const visibleNews = newsArticles.slice(0, 3);

  return (
    <section id="news-mobile" className="bg-transparent max-w-[1440px] mx-auto px-4">
      <SectionHeader
        title="NEWS"
        accentColor="yellow"
        viewAllHref="/news?category=NEWS"
        showAccentBar={true}
      />
      <div className="flex flex-col gap-5">
        {visibleNews.map((article) => (
          <ListItemCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
