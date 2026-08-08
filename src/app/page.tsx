"use client";

import React, { useState } from "react";
import Header from "@/components/header/Header";
import HeroBanner from "@/components/hero/HeroBanner";
import LatestStories from "@/components/sections/LatestStories";
import CultureCommunity from "@/components/sections/CultureCommunity";
import CultureSection from "@/components/sections/CultureSection";
import CommunitySection from "@/components/sections/CommunitySection";
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
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-sortd-yellow selection:text-sortd-black">
      {/* Sticky Header with Logo & Navigation */}
      <Header onSubscribeClick={() => setSubscribeModalOpen(true)} />

      {/* Main Homepage Body */}
      <main className="flex-grow">
        {/* 1. Hero Banner (Red placeholder band skipped as requested) */}
        <HeroBanner />

        {/* 2. Latest Stories Grid / Rail */}
        <LatestStories />

        {/* 3. Culture & Community - Desktop split / Mobile separated */}
        {/* Desktop-only: 2-column split */}
        <div className="hidden lg:block">
          <CultureCommunity />
        </div>
        {/* Mobile-only: Separate Culture Section */}
        <div className="block lg:hidden">
          <CultureSection />
        </div>

        {/* 4. Videos Carousel */}
        <VideosSection />

        {/* 5. Highlight Editorial Spotlight Block */}
        <HighlightBlock />

        {/* 6. Popular Stories Grid */}
        <PopularStories />

        {/* 7. Community section (Mobile-only) */}
        <div className="block lg:hidden">
          <CommunitySection />
        </div>

        {/* 8. Sortd People (Desktop-only) */}
        <div className="hidden lg:block">
          <SortdPeople />
        </div>

        {/* 9. Locations Landmark Cards */}
        <LocationsSection />
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
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-sortd-off-white hover:bg-gray-200 text-sortd-black transition-colors"
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
