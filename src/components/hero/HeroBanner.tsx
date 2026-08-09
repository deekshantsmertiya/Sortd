"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useArticles } from "@/hooks/useArticles";
import { useHomepageImages } from "@/hooks/useData";

export default function HeroBanner() {
  const { data: articles = [] } = useArticles();
  const { data: homeImages = {
    heroLeftDesktop: "/hero-left.png",
    heroCenterDesktop: "/hero-center.png",
    heroRightDesktop: "/hero-right.png",
    heroLeftMobile: "/hero-left-mobile.png",
    heroCenterMobile: "/hero-center-mobile.png",
    heroRightMobile: "/hero-right-mobile.png"
  } } = useHomepageImages();
  
  const priorityArticle = articles.find((a) => a.isHero) || articles.find((a) => a.isHighlight) || articles[0];

  return (
    <section className="relative w-full bg-sortd-off-white overflow-hidden border-b border-gray-200 flex flex-col">
      {/* DESKTOP TOP HERO BANNER (md+) */}
      <div className="hidden md:flex relative w-full md:h-[220px] lg:h-[274px] bg-[#F7F9FC] border-b border-gray-200 overflow-hidden items-center justify-between px-6 md:px-12 lg:px-16 select-none">
        {/* Left Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative h-full w-[35%] xl:w-[38%] max-w-[450px]"
        >
          <Image
            src={homeImages.heroLeftDesktop}
            alt="Dubai Skyline Illustration"
            fill
            sizes="(max-width: 1200px) 35vw, 450px"
            className="object-contain object-left-bottom pointer-events-none"
            priority
          />
        </motion.div>

        {/* Center Logo */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="relative h-[80%] lg:h-[90%] w-[28%] lg:w-[24%] flex items-center justify-center"
        >
          <div className="relative w-full h-full">
            <Image
              src={homeImages.heroCenterDesktop}
              alt="sortd DUBAI Logo"
              fill
              sizes="(max-width: 1200px) 30vw, 320px"
              className="object-contain pointer-events-none"
              priority
            />
          </div>
        </motion.div>

        {/* Right Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="relative h-full w-[35%] xl:w-[38%] max-w-[450px]"
        >
          <Image
            src={homeImages.heroRightDesktop}
            alt="Dubai Frame Illustration"
            fill
            sizes="(max-width: 1200px) 35vw, 450px"
            className="object-contain object-right-bottom pointer-events-none"
            priority
          />
        </motion.div>
      </div>

      {/* MOBILE TOP HERO BANNER (<md) */}
      <div className="flex md:hidden relative w-full h-[102px] bg-[#F7F9FC] border-b border-gray-200 overflow-hidden items-center justify-between px-3 select-none">
        {/* Left Illustration Mobile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative h-full w-[28%]"
        >
          <Image
            src={homeImages.heroLeftMobile}
            alt="Dubai Skyline Illustration"
            fill
            sizes="30vw"
            className="object-contain object-left-bottom pointer-events-none"
            priority
          />
        </motion.div>

        {/* Center Logo Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="relative h-[65%] w-[40%] flex items-center justify-center"
        >
          <div className="relative w-full h-full">
            <Image
              src={homeImages.heroCenterMobile}
              alt="sortd DUBAI Logo"
              fill
              sizes="40vw"
              className="object-contain pointer-events-none"
              priority
            />
          </div>
        </motion.div>

        {/* Right Illustration Mobile */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
          className="relative h-full w-[28%]"
        >
          <Image
            src={homeImages.heroRightMobile}
            alt="Dubai Food/Karak Illustration"
            fill
            sizes="30vw"
            className="object-contain object-right-bottom pointer-events-none"
            priority
          />
        </motion.div>
      </div>

      {/* DESKTOP BANNER (hidden on mobile) - Full Width, Square Corners */}
      {priorityArticle && (
        <Link href={`/article/${priorityArticle.slug}`} className="hidden xl:block w-full">
          <motion.div
            className="relative w-full h-[436px] overflow-hidden border-t border-gray-200 group"
          >
            {/* Background Image */}
            <Image
              src={priorityArticle.imageUrl}
              alt={priorityArticle.title}
              fill
              className="object-cover group-hover:scale-[1.01] transition-transform duration-700"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Curved Overlay */}
            <div className="absolute bottom-0 left-0 w-[55%] h-[85%] bg-black/35 backdrop-blur-sm rounded-tr-[300px] border-t border-r border-white/20 flex flex-col justify-end items-start text-left gap-4 pb-8 pr-20 z-10 hero-banner-content-align pl-6">
              <h2 className="font-heading text-3xl lg:text-[38px] text-white leading-[1.1] uppercase tracking-[0.04em] max-w-lg">
                {priorityArticle.title}
              </h2>
              <div className="bg-[#FFD100] text-sortd-black font-body font-bold text-[9px] uppercase tracking-wider w-[170px] h-[26px] rounded-none inline-flex items-center gap-[5.5px] px-[8.8px] py-[4.4px] shadow-sm transition-colors group-hover:opacity-95">
                <Clock className="w-3.5 h-3.5 text-sortd-black flex-shrink-0" />
                <span>READ IN 60 SECONDS</span>
              </div>
            </div>
          </motion.div>
        </Link>
      )}

      {/* MOBILE/TABLET BANNER (hidden on desktop) - Full Width, Square Corners */}
      {priorityArticle && (
        <Link href={`/article/${priorityArticle.slug}`} className="xl:hidden block w-full">
          <motion.div
            className="relative w-full h-[238px] overflow-hidden border-b border-gray-200 group"
          >
            {/* Background Image */}
            <Image
              src={priorityArticle.imageUrl}
              alt={priorityArticle.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
            {/* Soft dark tint overlay for readability */}
            <div className="absolute inset-0 bg-black/15" />

            {/* Stacked Rectangular Overlay (Figma Mobile Design) */}
            <div className="absolute inset-0 flex flex-col justify-end items-start pl-4 sm:pl-6 pb-5 gap-[5.26px]">
              {/* Yellow Title Block */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-[#FFD100] text-sortd-black px-4 py-2.5 font-heading text-base sm:text-lg uppercase tracking-[0.03em] max-w-[85%] shadow-md leading-[1.2]"
              >
                {priorityArticle.title}
              </motion.div>

              {/* Navy Accent Info Block */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-[#1B2F6E] text-white px-3.5 py-1.5 font-body font-bold text-[9px] sm:text-[10px] tracking-widest uppercase flex items-center gap-1.5 shadow-md"
              >
                <Clock className="w-3.5 h-3.5 text-white flex-shrink-0" />
                <span>READ IN 60 SECONDS</span>
              </motion.div>
            </div>
          </motion.div>
        </Link>
      )}
    </section>
  );
}
