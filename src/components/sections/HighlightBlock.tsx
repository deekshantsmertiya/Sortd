"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useArticles } from "@/hooks/useArticles";
import { getCategoryBadgeStyle } from "@/hooks/categoryStyles";

export default function HighlightBlock() {
  const { data: articles = [] } = useArticles();
  const highlightArticle = articles.find((a) => a.isHighlight) || articles[0];

  if (!highlightArticle) return null;

  const badgeStyle = getCategoryBadgeStyle(highlightArticle.category);

  return (
    <section className="bg-transparent max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative w-full overflow-hidden py-6 lg:p-12">
        {/* Flex layout to match Figma exact specs on large screens */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-between">
          {/* Left Column: Large Image */}
          <div className="relative w-full lg:w-[550.5px] h-[278px] sm:h-80 lg:h-[426.12px] rounded-none overflow-hidden bg-gray-200 shadow-md flex-shrink-0">
            <Image
              src={highlightArticle.imageUrl}
              alt={highlightArticle.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 550px"
              priority
            />
          </div>

          {/* Right Column: Editorial Text Content */}
          <div className="flex flex-col items-start justify-center flex-grow lg:max-w-[637.5px] gap-[24px]">
            {/* Category Pill */}
            <span
              className={`h-[26.5px] px-3 rounded-none font-body font-bold text-[10px] uppercase tracking-wider inline-flex items-center justify-center select-none ${badgeStyle.textColorClass}`}
              style={{ backgroundColor: badgeStyle.bgColor }}
            >
              {highlightArticle.category}
            </span>

            {/* Bold Multi-line Headline */}
            <h2 className="font-heading text-[42px] leading-[44.04px] text-[#0A0A0A] uppercase tracking-[1px]">
              {highlightArticle.title}
            </h2>

            {/* Description Paragraph */}
            <p className="text-[16px] font-normal leading-[24px] text-[#555555]">
              {highlightArticle.excerpt}
            </p>

            {/* Solid Black "READ THE ARTICLE" Button */}
            <Link href={`/article/${highlightArticle.slug}`} className="self-center lg:self-start">
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
