"use client";

import React from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { DEFAULT_SITE_SETTINGS, useSiteSettings, useSeo } from "@/lib/siteSettings";

/** About page — title and text are edited in Admin › Site Settings › About page. */
export default function AboutPage() {
  const { data: settings = DEFAULT_SITE_SETTINGS } = useSiteSettings();
  const about = settings.about || DEFAULT_SITE_SETTINGS.about;
  const paragraphs = about.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  useSeo(undefined, { title: about.title, description: paragraphs[0] });

  return (
    <div className="min-h-screen w-full bg-[#F7F7F8] flex flex-col justify-between">
      <Header />
      <main className="flex-grow w-full max-w-[860px] mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <h1 className="font-heading text-4xl sm:text-5xl text-sortd-black tracking-wider uppercase leading-none mb-6">
          {about.title}
        </h1>
        <div className="flex flex-col gap-4 font-body text-base sm:text-[18px] leading-[1.6] text-[#333]">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
