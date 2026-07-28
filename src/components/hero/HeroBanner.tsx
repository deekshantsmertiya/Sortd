"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import LogoMark from "@/components/common/LogoMark";
import { MuseumOfTheFutureArt, DubaiFrameArt, BurjKhalifaSkylineArt } from "@/components/hero/DubaiSkylineIllustrations";

export default function HeroBanner() {
  return (
    <section className="relative w-full bg-sortd-off-white overflow-hidden border-b border-gray-200">
      {/* DESKTOP LAYOUT (1280px+) - 3 Zone Split */}
      <div className="hidden xl:grid grid-cols-12 max-w-7xl mx-auto px-6 py-12 items-center gap-6 min-h-[380px]">
        {/* Left Zone: Museum of the Future Scene */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-3 flex flex-col items-center justify-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm relative group hover:shadow-md transition-all"
        >
          <div className="w-full h-44 relative flex items-center justify-center">
            <MuseumOfTheFutureArt className="w-full h-full object-contain" />
          </div>
          <span className="font-heading font-extrabold text-xs tracking-wider uppercase text-sortd-black mt-2">
            MUSEUM OF THE FUTURE
          </span>
          <span className="text-[11px] font-semibold text-sortd-grey">Future City Hub</span>
        </motion.div>

        {/* Center Zone: Large Logo & DUBAI Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="col-span-6 flex flex-col items-center justify-center text-center py-8 px-4"
        >
          {/* Overlapping Geometric Mark & Wordmark */}
          <LogoMark variant="hero" />

          {/* Intro Tagline Pill */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sortd-yellow border border-sortd-black/10 text-sortd-black font-heading font-extrabold text-xs tracking-widest uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-sortd-black animate-pulse" />
            Dubai&apos;s Unfiltered Take on News & Culture
          </div>

          <p className="mt-4 text-sm font-medium text-sortd-grey max-w-md">
            Unfiltered coverage of news, street culture, food, and neighborhood communities. Delivered in 60 seconds.
          </p>
        </motion.div>

        {/* Right Zone: Dubai Frame Scene */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="col-span-3 flex flex-col items-center justify-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm relative group hover:shadow-md transition-all"
        >
          <div className="w-full h-44 relative flex items-center justify-center">
            <DubaiFrameArt className="w-full h-full object-contain" />
          </div>
          <span className="font-heading font-extrabold text-xs tracking-wider uppercase text-sortd-black mt-2">
            THE DUBAI FRAME
          </span>
          <span className="text-[11px] font-semibold text-sortd-grey">Zabeel Landmark</span>
        </motion.div>
      </div>

      {/* MOBILE & TABLET LAYOUT (<1280px) - Stacked with Overlapping Headline Blocks */}
      <div className="xl:hidden relative w-full pt-8 pb-6 px-4 sm:px-6">
        {/* Top Centered Logo & DUBAI Subtitle */}
        <div className="flex flex-col items-center justify-center text-center mb-6">
          <LogoMark variant="hero" />
        </div>

        {/* Illustration Art Container */}
        <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-gradient-to-b from-amber-50 to-orange-100 border border-gray-200 flex items-center justify-center p-4">
          <BurjKhalifaSkylineArt className="w-full h-full object-contain" />

          {/* Overlapping Stacked Headline Blocks at Bottom Left (Figma Pixel Reference) */}
          <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-lg flex flex-col gap-1.5 z-10">
            {/* Top Yellow Headline Pill */}
            <Link href="/article/dubai-golden-visa-rules">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-sortd-yellow text-sortd-black px-4 py-2.5 rounded-xl font-heading font-extrabold text-sm sm:text-base leading-tight border border-sortd-black/10 shadow-sortd-md hover:bg-sortd-yellow-hover transition-colors"
              >
                Dubai Just Changed the Golden Visa Rules: Everything You Need to Know
              </motion.div>
            </Link>

            {/* Bottom Navy Accent Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-sortd-navy text-white px-3.5 py-1.5 rounded-lg font-heading font-bold text-xs tracking-wider uppercase inline-flex items-center gap-2 self-start border border-white/10"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sortd-pink" />
              <span>Read in 60 Seconds · Latest News</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
