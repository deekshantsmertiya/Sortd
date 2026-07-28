"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
  className?: string;
}

export default function ArticleCard({ article, className = "" }: ArticleCardProps) {
  // Category Pill styling
  const categoryStyles = {
    NEWS: "bg-sortd-yellow text-sortd-black",
    CULTURE: "bg-sortd-navy text-white",
    COMMUNITY: "bg-sortd-pink text-white",
  };

  return (
    <Link href={`/article/${article.slug}`} className={`group flex flex-col h-full ${className}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sortd-sm group-hover:shadow-sortd-hover transition-all duration-300 overflow-hidden"
      >
        {/* Image Container with Tag Pill */}
        <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-gray-100">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          {/* Top-Left Category Tag Pill */}
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-heading font-extrabold uppercase tracking-wider shadow-sm ${
                categoryStyles[article.category] || "bg-sortd-black text-white"
              }`}
            >
              {article.category}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow">
          <div>
            {/* Timestamp */}
            <span className="text-[11px] font-semibold text-sortd-grey uppercase tracking-wider block mb-1.5">
              {article.publishedAt}
            </span>

            {/* Bold Headline (2 lines max) */}
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-sortd-black line-clamp-2 leading-snug group-hover:text-sortd-pink transition-colors">
              {article.title}
            </h3>
          </div>

          {/* Bottom Yellow Read-time Pill */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sortd-yellow text-sortd-black font-heading font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider group-hover:bg-sortd-yellow-hover transition-colors shadow-sm">
              <Clock className="w-3 h-3 text-sortd-black" />
              <span>READ IN {article.readTime}</span>
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
