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
    heroRightMobile: "/hero-right-mobile.png",
    showSkylineBanner: false,
    heroBannerDesktop: "",
    heroBannerMobile: ""
  } } = useHomepageImages();
  
  const priorityArticle = articles.find((a) => a.isHero) || articles.find((a) => a.isHighlight) || articles[0];
  const fallbackImage = priorityArticle?.imageUrl || "";
  const desktopBanner = homeImages.heroBannerDesktop || fallbackImage;
  const mobileBanner = homeImages.heroBannerMobile || homeImages.heroBannerDesktop || fallbackImage;

  return (
    <section className="relative w-full bg-sortd-off-white overflow-hidden border-b border-gray-200 flex flex-col">
      {homeImages.showSkylineBanner && (<>
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

      </>)}

      {/* HERO BANNER — image only. Desktop (xl+) and mobile/tablet images are set independently in Admin → Banner Images. */}
      {desktopBanner && (
        <div className="hidden xl:block relative w-full h-[436px] overflow-hidden border-t border-gray-200">
          <img src={desktopBanner} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      )}
      {mobileBanner && (
        <div className="xl:hidden relative w-full h-[238px] sm:h-[320px] md:h-[380px] overflow-hidden border-b border-gray-200">
          <img src={mobileBanner} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      )}
    </section>
  );
}
