"use client";

import React from "react";
import SectionHeader from "@/components/common/SectionHeader";
import ListItemCard from "@/components/common/ListItemCard";
import { useArticles } from "@/hooks/useArticles";

export default function CultureCommunity() {
  const { data: cultureArticles = [] } = useArticles("CULTURE");
  const { data: communityArticles = [] } = useArticles("COMMUNITY");

  const visibleCulture = cultureArticles.slice(0, 3);
  const visibleCommunity = communityArticles.slice(0, 3);

  return (
    <section id="culture-community" className="py-12 bg-sortd-off-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two Column Grid Split (Desktop: 2 Columns, Mobile/Tablet: 1 Column Stacked) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Left Column: CULTURE (Navy Accent) */}
          <div id="culture" className="flex flex-col justify-between">
            <div>
              <SectionHeader title="CULTURE" accentColor="navy" viewAllHref="/news?category=CULTURE" />
              <div className="flex flex-col gap-5">
                {visibleCulture.map((article) => (
                  <ListItemCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: COMMUNITY (Pink Accent) */}
          <div id="community" className="flex flex-col justify-between">
            <div>
              <SectionHeader title="COMMUNITY" accentColor="pink" viewAllHref="/news?category=COMMUNITY" />
              <div className="flex flex-col gap-5">
                {visibleCommunity.map((article) => (
                  <ListItemCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
