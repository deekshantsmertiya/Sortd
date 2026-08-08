"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Article } from "@/types";
import { getCategoryBadgeStyle } from "@/hooks/categoryStyles";

interface ListItemCardProps {
  article: Article;
  className?: string;
}

export default function ListItemCard({ article, className = "" }: ListItemCardProps) {
  const badgeStyle = getCategoryBadgeStyle(article.category);

  return (
    <Link href={`/article/${article.slug}`} className={`group block ${className}`}>
      <div className="flex gap-[15px] sm:gap-[20px] items-start w-full min-h-[110px] sm:min-h-[145px] py-1 select-none">
        {/* Left Square Thumbnail Image (responsive, Radius 15.34px) */}
        <div className="relative w-[110px] h-[110px] sm:w-[145px] sm:h-[145px] flex-shrink-0 rounded-[15px] overflow-hidden bg-gray-100">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 110px, 145px"
          />
        </div>

        {/* Right Content Stack */}
        <div className="flex flex-col gap-1.5 min-w-0 flex-grow py-0.5">
          {/* Tag & Time Row */}
          <div className="flex items-center gap-2">
            {article.category === "COMMUNITY" ? (
              <span className="font-body font-extrabold text-[10px] uppercase tracking-wider text-[#FFB800] select-none h-[22px] inline-flex items-center">
                {article.subCategory || article.category}
              </span>
            ) : (
              <span
                className={`h-[22px] px-2.5 rounded-[4px] font-body font-bold text-[9px] uppercase tracking-wider inline-flex items-center justify-center ${badgeStyle.textColorClass}`}
                style={{ backgroundColor: badgeStyle.bgColor }}
              >
                {article.category}
              </span>
            )}
            <span className="hidden md:inline text-[10px] font-semibold text-sortd-grey uppercase tracking-wider">
              {article.publishedAt}
            </span>
          </div>

          {/* Bebas Neue Headline Title */}
          <h4 className="font-heading font-normal text-xl sm:text-[23px] leading-[1.1] text-[#0A0A0A] uppercase tracking-[0.02em] line-clamp-2 group-hover:text-sortd-pink transition-colors">
            {article.title}
          </h4>

          {/* Description Excerpt */}
          <p className="text-[11px] sm:text-[13px] leading-[1.4] text-sortd-grey line-clamp-2 font-medium">
            {article.excerpt}
          </p>

          {/* Bottom Yellow Read-time Button */}
          <div className="mt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#FFD100] text-sortd-black font-body font-bold text-[8.5px] uppercase tracking-wider group-hover:bg-[#E0B800] transition-colors shadow-sm">
              <Clock className="w-3.5 h-3.5 text-sortd-black" />
              <span>READ IN {article.readTime}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
