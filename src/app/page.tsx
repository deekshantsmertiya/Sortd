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
import { DEFAULT_HOME_SECTIONS, DEFAULT_SITE_SETTINGS, useHomeSections, useSiteSettings, usePageSeo, type HomeSectionId } from "@/lib/siteSettings";

// One element per section; the same element on both = one shared component.
const LATEST = <LatestStories />;
const VIDEOS = <VideosSection />;
const HIGHLIGHT = <HighlightBlock />;
const POPULAR = <PopularStories />;
const PEOPLE = <SortdPeople />;
const LOCATIONS = <LocationsSection />;
const HERO = <HeroBanner />;
const DESKTOP_SECTIONS: Record<HomeSectionId, React.ReactNode> = {
  hero: HERO, latest: LATEST, categories: <CultureCommunity />, videos: VIDEOS,
  highlight: HIGHLIGHT, popular: POPULAR, people: PEOPLE, locations: LOCATIONS,
};
const MOBILE_SECTIONS: Record<HomeSectionId, React.ReactNode> = {
  hero: HERO, latest: LATEST, categories: <CultureCommunityNewsMobile />, videos: VIDEOS,
  highlight: HIGHLIGHT, popular: POPULAR, people: PEOPLE, locations: LOCATIONS,
};
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const { data: sections = DEFAULT_HOME_SECTIONS } = useHomeSections();
  const { data: site = DEFAULT_SITE_SETTINGS } = useSiteSettings();
  usePageSeo("home", {
    title: "News, Culture & Community in 60 Seconds",
    description: "Dubai's unfiltered take on news, culture & community. Read in 60 seconds.",
  });

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-[#F7F7F8] flex flex-col justify-between selection:bg-sortd-yellow selection:text-sortd-black">
      {/* Sticky Header with Logo & Navigation */}
      <Header onSubscribeClick={() => setSubscribeModalOpen(true)} />

      {/* Main Homepage Body */}
      <main className="flex-grow w-full max-w-full overflow-x-clip min-w-0 flex flex-col gap-8 sm:gap-10 lg:gap-14 pb-8 sm:pb-10 lg:pb-14">
        {/* Sections render in the order and visibility set in Admin › Homepage & SEO */}
        {sections.map((sec) => {
          const desktop = DESKTOP_SECTIONS[sec.id];
          const mobile = MOBILE_SECTIONS[sec.id];
          if (!sec.showDesktop && !sec.showMobile) return null;
          // Site-wide switch in Admin › Site Settings.
          if (sec.id === "locations" && !site.locationsEnabled) return null;
          // Same component on both: render once and hide by breakpoint.
          if (desktop === mobile) {
            const cls = sec.showDesktop && sec.showMobile ? "" : sec.showDesktop ? "hidden lg:block" : "lg:hidden";
            return (
              <div key={sec.id} data-section={sec.id} className={`w-full min-w-0 ${cls}`}>
                {desktop}
              </div>
            );
          }
          return (
            <React.Fragment key={sec.id}>
              {sec.showDesktop && desktop && <div data-section={sec.id} className="hidden lg:block w-full min-w-0">{desktop}</div>}
              {sec.showMobile && mobile && <div data-section={sec.id} className="lg:hidden w-full min-w-0">{mobile}</div>}
            </React.Fragment>
          );
        })}
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
