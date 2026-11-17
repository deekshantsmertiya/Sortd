"use client";

import React from "react";
import Link from "next/link";
import SafeImage from "@/components/common/SafeImage";
import { motion } from "framer-motion";
import { useArticles } from "@/hooks/useArticles";
import { getCategoryBadgeStyle } from "@/hooks/categoryStyles";

export default function HighlightBlock() {
  const { data: articles = [] } = useArticles();
  const highlightArticle = articles.find((a) => a.isHighlight) || articles[0];

  if (!highlightArticle) return null;

  const badgeStyle = getCategoryBadgeStyle(highlightArticle.category);

  return (
    <section className="bg-transparent w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative w-full overflow-hidden py-2 lg:py-8">
        {/* Flex layout to match Figma exact specs on large screens */}
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 lg:gap-12 items-stretch lg:items-center">
          {/* Left Column: Large Image */}
          <div className="relative w-full lg:w-[550px] aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:h-[426px] rounded-none overflow-hidden bg-gray-200 shadow-md flex-shrink-0">
            <SafeImage
              src={highlightArticle.imageUrl}
              alt={highlightArticle.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 550px"
              priority
            />
          </div>

          {/* Right Column: Editorial Text Content */}
          <div className="flex flex-col items-start justify-center w-full min-w-0 flex-1 lg:max-w-[637px] gap-3 sm:gap-4 lg:gap-6">
            {/* Category Pill */}
            <span
              className={`h-[26.5px] px-3 rounded-[4px] font-body font-bold text-[10px] uppercase tracking-wider inline-flex items-center justify-center select-none ${badgeStyle.textColorClass}`}
              style={{ backgroundColor: badgeStyle.bgColor }}
            >
              {highlightArticle.category}
            </span>

            {/* Bold Multi-line Headline */}
            <h2 className="font-heading text-[30px] leading-[32px] sm:text-[36px] sm:leading-[38px] lg:text-[42px] lg:leading-[44px] text-[#0A0A0A] uppercase tracking-[1px] break-words">
              {highlightArticle.title}
            </h2>

            {/* Description Paragraph */}
            <p className="font-body text-[15px] leading-[22px] lg:text-[16px] lg:leading-[24px] font-normal text-[#555555]">
              {highlightArticle.excerpt}
            </p>

            {/* Solid Black "READ THE ARTICLE" Button */}
            <Link href={`/article/${highlightArticle.slug}`} className="self-start mt-1 lg:mt-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-[22px] py-[10px] h-[40px] rounded-none bg-[#0A0A0A] text-white font-body font-bold text-[13px] leading-[19.5px] tracking-[1px] uppercase hover:bg-sortd-pink transition-colors duration-200"
              >
                READ THE ARTICLE
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
