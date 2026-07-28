"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useArticles } from "@/hooks/useArticles";

export default function HighlightBlock() {
  const { data: articles = [] } = useArticles();
  const highlightArticle = articles.find((a) => a.isHighlight) || articles[0];

  return (
    <section className="py-12 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative w-full rounded-3xl bg-sortd-off-white border border-gray-200 overflow-hidden p-6 sm:p-8 lg:p-12 shadow-sortd-sm">
        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Large Image */}
          <div className="lg:col-span-7 relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden bg-gray-200 shadow-md">
            <Image
              src={highlightArticle.imageUrl}
              alt={highlightArticle.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
            />
            {/* Top Left Eyebrow Badge */}
            <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sortd-yellow text-sortd-black font-heading font-extrabold text-xs uppercase tracking-wider shadow-md">
              <Sparkles className="w-3.5 h-3.5 fill-sortd-black text-sortd-black" />
              <span>HIGHLIGHT OF THE DAY</span>
            </div>
          </div>

          {/* Right Column: Editorial Text Content */}
          <div className="lg:col-span-5 flex flex-col items-start justify-center">
            {/* Category Pill (Navy CULTURE Accent) */}
            <span className="px-3 py-1 rounded-full bg-sortd-navy text-white font-heading font-extrabold text-xs uppercase tracking-widest mb-4">
              {highlightArticle.category}
            </span>

            {/* Bold Multi-line Headline */}
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-sortd-black leading-tight mb-4">
              {highlightArticle.title}
            </h2>

            {/* Description Paragraph */}
            <p className="text-sm sm:text-base text-sortd-grey font-normal leading-relaxed mb-6">
              {highlightArticle.excerpt}
            </p>

            {/* Solid Black "READ THE ARTICLE" Button */}
            <Link href={`/article/${highlightArticle.slug}`}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-sortd-black text-white font-heading font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-sortd-md hover:bg-sortd-pink transition-all duration-200"
              >
                <span>READ THE ARTICLE</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
