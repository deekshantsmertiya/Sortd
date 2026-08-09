"use client";

import React from "react";
import SectionHeader from "@/components/common/SectionHeader";
import ListItemCard from "@/components/common/ListItemCard";
import { useArticles } from "@/hooks/useArticles";

export default function CultureSection() {
  const { data: cultureArticles = [] } = useArticles("CULTURE");
  const visibleCulture = cultureArticles.slice(0, 3);

  return (
    <section id="culture-mobile" className="bg-transparent max-w-7xl mx-auto px-4">
      <SectionHeader
        title="CULTURE"
        accentColor="navy"
        viewAllHref="/news?category=CULTURE"
        showAccentBar={true}
      />
      <div className="flex flex-col gap-5">
        {visibleCulture.map((article) => (
          <ListItemCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
