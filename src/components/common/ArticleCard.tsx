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
        <div className="relative w-full h-[155px] overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 248px, 298px"
          />
        </div>

        {/* Content Section (Lower part, rounded at bottom) */}
        <div className="pt-[12px] px-[12px] pb-[14px] flex flex-col justify-between flex-grow bg-white">
          <div className="flex flex-col">
            {/* Category Tag (Inline, below image) */}
            <div
              className={`self-start h-[21px] px-2.5 rounded-none font-body font-bold text-[9px] uppercase tracking-wider inline-flex items-center justify-center gap-1 select-none mb-[8px] ${badgeStyle.textColorClass}`}
              style={{ backgroundColor: badgeStyle.bgColor }}
            >
              {icon}
              <span>{article.category}</span>
            </div>

            {/* Uppercase Headline */}
            <h3 className="font-heading text-[20px] leading-[21px] tracking-[0.02em] uppercase text-sortd-black line-clamp-1 group-hover:text-sortd-pink transition-colors mb-[6px]">
              {article.title}
            </h3>

            {/* Published time */}
            <span className="text-[10px] font-semibold text-sortd-grey uppercase tracking-wider block mb-[10px]">
              {article.publishedAt}
            </span>
          </div>

          {/* Bottom Yellow Read-time Button */}
          <div className="self-start">
            <span className="inline-flex items-center gap-[5px] px-[8px] py-[4px] h-[23px] rounded-none bg-[#FFD100] text-sortd-black font-body font-bold text-[9px] uppercase tracking-wider group-hover:bg-[#E0B800] transition-colors shadow-sm">
              <Clock className="w-3.5 h-3.5 text-sortd-black" />
              <span>READ IN {article.readTime}</span>
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
