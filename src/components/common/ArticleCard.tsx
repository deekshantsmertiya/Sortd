"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Zap, Globe, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Article } from "@/types";
import { getCategoryBadgeStyle } from "@/hooks/categoryStyles";

interface ArticleCardProps {
  article: Article;
  className?: string;
}

export default function ArticleCard({ article, className = "" }: ArticleCardProps) {
  const badgeStyle = getCategoryBadgeStyle(article.category);

  const getIcon = (catName: string) => {
    switch (catName.toUpperCase()) {
      case "NEWS":
        return <Zap className="w-3 h-3 text-current fill-current" />;
      case "CULTURE":
        return <Globe className="w-3 h-3 text-current" />;
      case "COMMUNITY":
        return <Users className="w-3 h-3 text-current" />;
      default:
        return <Zap className="w-3 h-3 text-current" />;
    }
  };

  const icon = getIcon(article.category);

  return (
    <Link href={`/article/${article.slug}`} className={`group flex flex-col h-full w-full ${className}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col h-full w-full bg-white rounded-[10px] border-2 border-[#F0F0F0] hover:shadow-sortd-hover transition-all duration-300 overflow-hidden"
      >
        {/* Image Container (Upper part, rounded at top) */}
        <div className="relative w-full h-[135px] overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 248px, 298px"
          />
        </div>

        {/* Content Section (Lower part, rounded at bottom) */}
        <div className="p-3 flex flex-col justify-between flex-grow bg-white">
          <div className="flex flex-col gap-1.5">
            {/* Category Tag (Inline, below image) */}
            <div
              className={`self-start h-[22px] px-2.5 rounded-[4px] font-body font-bold text-[9px] uppercase tracking-wider inline-flex items-center justify-center gap-1 select-none ${badgeStyle.textColorClass}`}
              style={{ backgroundColor: badgeStyle.bgColor }}
            >
              {icon}
              <span>{article.category}</span>
            </div>

            {/* Uppercase Headline */}
            <h3 className="font-heading text-lg sm:text-[19px] leading-[1.1] uppercase tracking-[0.02em] text-sortd-black line-clamp-2 group-hover:text-sortd-pink transition-colors">
              {article.title}
            </h3>

            {/* Published time */}
            <span className="text-[10px] font-semibold text-sortd-grey uppercase tracking-wider block">
              {article.publishedAt}
            </span>
          </div>

          {/* Bottom Yellow Read-time Button */}
          <div className="mt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#FFD100] text-sortd-black font-body font-bold text-[8.5px] uppercase tracking-wider group-hover:bg-[#E0B800] transition-colors shadow-sm">
              <Clock className="w-3.5 h-3.5 text-sortd-black" />
              <span>READ IN {article.readTime}</span>
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
