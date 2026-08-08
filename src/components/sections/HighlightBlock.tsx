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
    <section className="py-12 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative w-full lg:rounded-3xl lg:bg-sortd-off-white lg:border lg:border-gray-200 overflow-hidden py-6 lg:p-12 lg:shadow-sortd-sm">
        {/* Flex layout to match Figma exact specs on large screens */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-between">
          {/* Left Column: Large Image */}
          <div className="relative w-full lg:w-[550.5px] h-64 sm:h-80 lg:h-[426.12px] rounded-[10px] overflow-hidden bg-gray-200 shadow-md flex-shrink-0">
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
          <div className="flex flex-col items-start justify-center flex-grow lg:max-w-[637.5px]">
            {/* Category Pill */}
            <span
              className={`h-[26.5px] px-3 rounded-[4px] font-body font-bold text-[10px] uppercase tracking-wider inline-flex items-center justify-center mb-4 select-none ${badgeStyle.textColorClass}`}
              style={{ backgroundColor: badgeStyle.bgColor }}
            >
              {highlightArticle.category}
            </span>

            {/* Bold Multi-line Headline */}
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[42px] leading-[1.05] text-[#0A0A0A] uppercase tracking-[0.02em] mb-4">
              {highlightArticle.title}
            </h2>

            {/* Description Paragraph */}
            <p className="text-sm sm:text-base text-sortd-grey font-medium leading-relaxed mb-6">
              {highlightArticle.excerpt}
            </p>

            {/* Solid Black "READ THE ARTICLE" Button */}
            <Link href={`/article/${highlightArticle.slug}`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-[22px] py-[10px] h-[40px] rounded-[4px] bg-[#0A0A0A] text-white font-body font-bold text-[11px] tracking-wider uppercase hover:bg-sortd-pink transition-colors duration-200"
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
