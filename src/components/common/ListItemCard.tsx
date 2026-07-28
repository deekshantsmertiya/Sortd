"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Article } from "@/types";

interface ListItemCardProps {
  article: Article;
  className?: string;
}

export default function ListItemCard({ article, className = "" }: ListItemCardProps) {
  const categoryStyles = {
    NEWS: "bg-sortd-yellow text-sortd-black",
    CULTURE: "bg-sortd-navy text-white",
    COMMUNITY: "bg-sortd-pink text-white",
  };

  return (
    <Link href={`/article/${article.slug}`} className={`group block ${className}`}>
      <div className="flex gap-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-gray-100 shadow-sortd-sm group-hover:shadow-sortd-hover transition-all duration-300">
        {/* Left Square Thumbnail Image */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 96px, 112px"
          />
        </div>

        {/* Right Content */}
        <div className="flex flex-col justify-between flex-grow min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {/* Category Pill */}
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-heading font-extrabold uppercase tracking-wider ${
                  categoryStyles[article.category]
                }`}
              >
                {article.category}
              </span>
              <span className="text-[10px] font-semibold text-sortd-grey">
                {article.publishedAt}
              </span>
            </div>

            {/* Bold Headline (2 lines max) */}
            <h4 className="font-heading font-extrabold text-sm sm:text-base text-sortd-black line-clamp-2 leading-snug group-hover:text-sortd-pink transition-colors mb-1">
              {article.title}
            </h4>

            {/* 2-line Description */}
            <p className="text-xs text-sortd-grey line-clamp-2 font-normal hidden sm:block">
              {article.excerpt}
            </p>
          </div>

          {/* Yellow Read-Time Pill */}
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sortd-yellow text-sortd-black font-heading font-extrabold text-[10px] uppercase tracking-wider shadow-sm group-hover:bg-sortd-yellow-hover transition-colors">
              <Clock className="w-2.5 h-2.5 text-sortd-black" />
              <span>{article.readTime}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
