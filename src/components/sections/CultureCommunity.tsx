"use client";

import React, { useState } from "react";
import SectionHeader from "@/components/common/SectionHeader";
import ListItemCard from "@/components/common/ListItemCard";
import CarouselControls from "@/components/common/CarouselControls";
import { useArticles } from "@/hooks/useArticles";

export default function CultureCommunity() {
  const { data: cultureArticles = [] } = useArticles("CULTURE");
  const { data: communityArticles = [] } = useArticles("COMMUNITY");

  const [culturePage, setCulturePage] = useState(0);
  const [communityPage, setCommunityPage] = useState(0);

  const pageSize = 3;

  const visibleCulture = cultureArticles.slice(culturePage * pageSize, (culturePage + 1) * pageSize);
  const visibleCommunity = communityArticles.slice(communityPage * pageSize, (communityPage + 1) * pageSize);

  const maxCulturePages = Math.ceil(cultureArticles.length / pageSize) || 1;
  const maxCommunityPages = Math.ceil(communityArticles.length / pageSize) || 1;

  return (
    <section id="culture-community" className="py-12 bg-sortd-off-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two Column Grid Split (Desktop: 2 Columns, Mobile/Tablet: 1 Column Stacked) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Left Column: CULTURE (Navy Accent) */}
          <div id="culture" className="flex flex-col justify-between">
            <div>
              <SectionHeader title="CULTURE" accentColor="navy" viewAllHref="/#culture" />
              <div className="flex flex-col gap-4">
                {visibleCulture.map((article) => (
                  <ListItemCard key={article.id} article={article} />
                ))}
              </div>
            </div>

            {/* Pagination Controls at Bottom */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <span className="text-xs font-semibold text-sortd-grey">
                Page {culturePage + 1} of {maxCulturePages}
              </span>
              <CarouselControls
                onPrev={() => setCulturePage((prev) => (prev > 0 ? prev - 1 : maxCulturePages - 1))}
                onNext={() => setCulturePage((prev) => (prev < maxCulturePages - 1 ? prev + 1 : 0))}
              />
            </div>
          </div>

          {/* Right Column: COMMUNITY (Pink Accent) */}
          <div id="community" className="flex flex-col justify-between">
            <div>
              <SectionHeader title="COMMUNITY" accentColor="pink" viewAllHref="/#community" />
              <div className="flex flex-col gap-4">
                {visibleCommunity.map((article) => (
                  <ListItemCard key={article.id} article={article} />
                ))}
              </div>
            </div>

            {/* Pagination Controls at Bottom */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <span className="text-xs font-semibold text-sortd-grey">
                Page {communityPage + 1} of {maxCommunityPages}
              </span>
              <CarouselControls
                onPrev={() => setCommunityPage((prev) => (prev > 0 ? prev - 1 : maxCommunityPages - 1))}
                onNext={() => setCommunityPage((prev) => (prev < maxCommunityPages - 1 ? prev + 1 : 0))}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
