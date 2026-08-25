"use client";

import React from "react";
import SectionHeader from "@/components/common/SectionHeader";
import ListItemCard from "@/components/common/ListItemCard";
import { useArticles } from "@/hooks/useArticles";

export default function CultureCommunity() {
  const { data: cultureArticles = [] } = useArticles("CULTURE");
  const { data: communityArticles = [] } = useArticles("COMMUNITY");
  const { data: newsArticles = [] } = useArticles("NEWS");

  const visibleCulture = cultureArticles.slice(0, 3);
  const visibleCommunity = communityArticles.slice(0, 3);
  const visibleNews = newsArticles.slice(0, 3);

  return (
    <section id="culture-community" className="py-8 bg-sortd-off-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Three Column Grid Split (Desktop: 3 Columns, Mobile/Tablet: 1 Column Stacked) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 xl:gap-12">
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

          {/* Middle Column: COMMUNITY (Pink Accent) */}
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

          {/* Right Column: NEWS (Yellow Accent) */}
          <div id="news" className="flex flex-col justify-between">
            <div>
              <SectionHeader title="NEWS" accentColor="yellow" viewAllHref="/news?category=NEWS" />
              <div className="flex flex-col gap-5">
                {visibleNews.map((article) => (
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
