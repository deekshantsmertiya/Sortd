"use client";

import React, { useState } from "react";
import Header from "@/components/header/Header";
import HeroBanner from "@/components/hero/HeroBanner";
import LatestStories from "@/components/sections/LatestStories";
import CultureCommunity from "@/components/sections/CultureCommunity";
import CultureCommunityNewsMobile from "@/components/sections/CultureCommunityNewsMobile";
import VideosSection from "@/components/sections/VideosSection";
import HighlightBlock from "@/components/sections/HighlightBlock";
import PopularStories from "@/components/sections/PopularStories";
import SortdPeople from "@/components/sections/SortdPeople";
import LocationsSection from "@/components/sections/LocationsSection";
import Footer from "@/components/footer/Footer";
import SubscribeCard from "@/components/article/SubscribeCard";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F7F7F8] flex flex-col justify-between selection:bg-sortd-yellow selection:text-sortd-black">
      {/* Sticky Header with Logo & Navigation */}
      <Header onSubscribeClick={() => setSubscribeModalOpen(true)} />

      {/* Main Homepage Body */}
      <main className="flex-grow w-full max-w-full overflow-x-hidden min-w-0 flex flex-col gap-8 pb-0 lg:pb-12">
        {/* 1. Hero Banner */}
        <HeroBanner />

        {/* Desktop Layout Sections (lg and above) */}
        <div className="hidden lg:flex flex-col gap-8 w-full min-w-0">
          <LatestStories />
          <CultureCommunity />
          <VideosSection />
          <HighlightBlock />
          <PopularStories />
          <SortdPeople />
          <LocationsSection />
        </div>

        {/* Mobile/Tablet Layout Sections (below lg) */}
        <div className="flex lg:hidden flex-col gap-8 w-full min-w-0">
          {/* 1. Latest Stories */}
          <LatestStories />

          {/* 2. Slidable Culture, Community & News */}
          <CultureCommunityNewsMobile />

          {/* 3. Videos */}
          <VideosSection />

          {/* 4. Read Article Section (Highlight Block) */}
          <HighlightBlock />

          {/* 5. Popular Stories */}
          <PopularStories />

          {/* 6. Locations */}
          <LocationsSection />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Subscription Modal for Header Button */}
      <AnimatePresence>
        {subscribeModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSubscribeModalOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl p-2"
            >
              <button
                onClick={() => setSubscribeModalOpen(false)}
                className="absolute top-4 right-4 z-20 p-2 rounded-none bg-sortd-off-white hover:bg-gray-200 text-sortd-black transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <SubscribeCard />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
