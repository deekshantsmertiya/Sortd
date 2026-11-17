"use client";

import React from "react";
import SectionHeader from "@/components/common/SectionHeader";
import ListItemCard from "@/components/common/ListItemCard";
import EmptyState from "@/components/common/EmptyState";
import { useArticles } from "@/hooks/useArticles";
import { useCategories } from "@/hooks/categoryStyles";

export default function CultureCommunity() {
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

  return (
    <section id="culture-community" className="py-8 bg-sortd-off-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Three Column Grid Split (Desktop: 3 Columns, Mobile/Tablet: 1 Column Stacked) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 xl:gap-12">
          {/* Left Column: NEWS (Yellow Accent) */}
          <div id="news" className="flex flex-col justify-between">
            <div>
              <SectionHeader title={NEWS_NAME} accentColor="yellow" viewAllHref={`/news?category=${encodeURIComponent(NEWS_NAME)}`} />
              <div className="flex flex-col gap-5">
                {visibleNews.length === 0 ? (
                  <EmptyState />
                ) : (
                  visibleNews.map((article) => <ListItemCard key={article.id} article={article} />)
                )}
              </div>
            </div>
          </div>

          {/* Middle Column: CULTURE (Navy Accent) */}
          <div id="culture" className="flex flex-col justify-between">
            <div>
              <SectionHeader title={CULTURE_NAME} accentColor="navy" viewAllHref={`/news?category=${encodeURIComponent(CULTURE_NAME)}`} />
              <div className="flex flex-col gap-5">
                {visibleCulture.length === 0 ? (
                  <EmptyState />
                ) : (
                  visibleCulture.map((article) => <ListItemCard key={article.id} article={article} />)
                )}
              </div>
            </div>
          </div>

          {/* Right Column: COMMUNITY (Pink Accent) */}
          <div id="community" className="flex flex-col justify-between">
            <div>
              <SectionHeader title={COMMUNITY_NAME} accentColor="pink" viewAllHref={`/news?category=${encodeURIComponent(COMMUNITY_NAME)}`} />
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
      </div>
    </section>
  );
}
