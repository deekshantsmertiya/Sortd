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
      <div className="relative w-full overflow-hidden">
        {/* Flex layout to match Figma exact specs on all screens (Figma node #930:1307) */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-stretch lg:items-center">
          {/* Left Column: Large Image (exact 278px height on mobile, 426px on desktop) */}
          <div className="relative w-full lg:w-[550px] h-[278px] sm:h-[320px] lg:h-[426px] rounded-none overflow-hidden bg-gray-200 flex-shrink-0">
            <SafeImage
              src={highlightArticle.imageUrl}
              alt={highlightArticle.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 550px"
              priority
            />
          </div>

          {/* Right Column: Editorial Text Content (exact Figma 12px and 20px spacing) */}
          <div className="flex flex-col items-start justify-center w-full min-w-0 flex-1 lg:max-w-[637px]">
            {/* Category Pill: 26px height, 4px radius, 11px bold uppercase */}
            <span
              className={`h-[26px] px-[10px] rounded-[4px] font-body font-bold text-[11px] leading-[16.5px] uppercase tracking-[0.09em] inline-flex items-center justify-center select-none ${badgeStyle.textColorClass}`}
              style={{ backgroundColor: badgeStyle.bgColor }}
            >
              {highlightArticle.category}
            </span>

            {/* Bold Headline: exact 42px Bebas Neue, 44px line height, uppercase */}
            <h2 className="mt-[12px] font-heading font-normal text-[36px] sm:text-[42px] leading-[38px] sm:leading-[44px] text-[#0A0A0A] uppercase tracking-[1px] break-words">
              {highlightArticle.title}
            </h2>

            {/* Description Excerpt: 16px DM Sans, 24px line height, #555555 */}
            <p className="mt-[12px] font-body text-[16px] leading-[24px] font-normal text-[#555555]">
              {highlightArticle.excerpt}
            </p>

            {/* Solid Black "READ THE ARTICLE" Button: exact 178px x 40px, 4px radius */}
            <Link href={`/article/${highlightArticle.slug}`} className="mt-[20px] self-start">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center w-[178px] h-[40px] rounded-[4px] bg-[#0A0A0A] text-white font-body font-bold text-[13px] leading-[19.5px] tracking-[0.08em] uppercase hover:bg-sortd-pink transition-colors duration-200"
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
