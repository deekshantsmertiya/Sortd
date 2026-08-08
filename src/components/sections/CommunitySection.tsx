"use client";

import React from "react";
import SectionHeader from "@/components/common/SectionHeader";
import ListItemCard from "@/components/common/ListItemCard";
import { useArticles } from "@/hooks/useArticles";

export default function CommunitySection() {
  const { data: communityArticles = [] } = useArticles("COMMUNITY");
  const { data: cultureArticles = [] } = useArticles("CULTURE");

  // Get the 4 community items (FOOD, WORLD CUP, THINGS TO DO, ART)
  const visibleCommunity = communityArticles.slice(0, 4);
  // Get the 3 culture items
  const visibleCulture = cultureArticles.slice(0, 3);

  // Combine them: first the 4 community items, then the 3 culture items
  const combinedItems = [...visibleCommunity, ...visibleCulture];

  return (
    <section id="community-mobile" className="py-8 bg-white max-w-7xl mx-auto px-4">
      <SectionHeader
        title="COMUNNITY"
        showAccentBar={false}
        viewAllHref=""
      />
      <div className="flex flex-col gap-5">
        {combinedItems.map((article, idx) => (
          <ListItemCard key={`${article.id}-${idx}`} article={article} />
        ))}
      </div>
    </section>
  );
}
