"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Share2, Volume2, ArrowLeft, ArrowRight, Check, ChevronRight, Zap, Globe, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import SubscribeCard from "@/components/article/SubscribeCard";
import ArticleCard from "@/components/common/ArticleCard";
import { useArticleBySlug, useArticles } from "@/hooks/useArticles";

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = (params?.id as string) || "dubai-golden-visa-rules";

  const { data: article, isLoading } = useArticleBySlug(slug);
  const { data: allArticles = [] } = useArticles();

  // Audio Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(35);

  // Share Notification State
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (isLoading || !article) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-12 h-12 border-4 border-sortd-yellow border-t-sortd-black rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body font-bold text-lg">Loading 60-Second Story...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Define default paragraphs to append if article content is short
  const defaultParagraphs = [
    "Beyond the immediate policy updates, this move represents a broader strategic shift. City planners and economic experts note that lowering the threshold is directly aimed at attracting long-term residents rather than transient contract workers.",
    "Furthermore, local businesses and tech startups have welcomed the news. By making it easier for skilled professionals and creative minds to secure long-term residency, the emirate is positioning itself as a primary global hub for talent, competing directly with major European and North American tech capitals.",
    "QUOTE_START The vision is clear: to build a sustainable, knowledge-based economy that thrives on innovation and community integration. This is the new standard. QUOTE_END",
    "As residency requirements continue to evolve, experts recommend that eligible candidates prepare their documentation early. Keeping track of qualifications, certified translations, and professional accreditations remains key to navigating the new fast-track digital portals successfully."
  ];

  const articleContent = article.content.length >= 5
    ? article.content
    : [...article.content, ...defaultParagraphs];

  // Calculate Next & Related articles
  const currentIndex = allArticles.findIndex((a) => a.id === article.id || a.slug === article.slug);
  const upNextArticle = allArticles[(currentIndex + 1) % allArticles.length] || allArticles[0];
  const relatedArticles = allArticles.filter((a) => a.id !== article.id).slice(0, 8);

  const categoryConfig = {
    NEWS: {
      bg: "bg-sortd-yellow text-sortd-black",
      icon: <Zap className="w-3 h-3 text-white fill-white" />,
    },
    CULTURE: {
      bg: "bg-sortd-navy text-white",
      icon: <Globe className="w-3 h-3 text-white" />,
    },
    COMMUNITY: {
      bg: "bg-sortd-pink text-white",
      icon: <Users className="w-3 h-3 text-white" />,
    },
  };

  const currentCategory = categoryConfig[article.category as keyof typeof categoryConfig] || {
    bg: "bg-sortd-yellow text-sortd-black",
    icon: <Zap className="w-3 h-3 text-white fill-white" />,
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Header />

      <main className="flex-grow">
        {/* Full-width Hero Image */}
        <div className="relative w-full h-[250px] sm:h-[380px] md:h-[440px] lg:h-[485.71px] bg-gray-100 mb-8">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* 2-Column Split Layout Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Column: Main Content */}
            <div className="flex-1 min-w-0 flex flex-col">
              
              {/* Back Link Breadcrumb */}
              <div className="mb-6">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-body font-bold text-sortd-grey hover:text-sortd-black uppercase tracking-wider transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>BACK TO HOME</span>
                </Link>
              </div>

              {/* Category Tag Pill & Timestamp Below Image */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`h-[22px] px-2.5 rounded-[4px] font-body font-bold text-[9px] uppercase tracking-wider inline-flex items-center justify-center gap-1 select-none ${currentCategory.bg}`}
                >
                  {currentCategory.icon}
                  <span>{article.category}</span>
                </span>
                <span className="text-xs font-semibold text-sortd-grey uppercase tracking-wider">
                  {article.publishedAt} · READ IN {article.readTime}
                </span>
              </div>

              {/* Bold Multi-line Headline */}
              <h1 className="font-heading uppercase tracking-normal font-normal text-3xl sm:text-4xl lg:text-[48px] leading-[1.0] text-sortd-black mb-6">
                {article.title}
              </h1>

              {/* Action Buttons Row: Pink "Listen to the Article" + Grey-outlined "Share" */}
              <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-gray-200 mb-8">
                {/* Listen Pill (Pink/Red) */}
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-sortd-pink hover:bg-sortd-pink-hover text-white font-body font-extrabold text-xs tracking-wider uppercase transition-all shadow-sm"
                >
                  {isPlayingAudio ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
                      <Play className="w-2.5 h-2.5 text-white fill-white ml-[0.5px]" />
                    </div>
                  )}
                  <span>{isPlayingAudio ? "PAUSE AUDIO" : "LISTEN TO THE ARTICLE"}</span>
                </button>

                {/* Share Pill (Grey Outlined) */}
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] border border-gray-200 hover:border-sortd-black bg-white text-gray-400 hover:text-black font-body font-medium text-xs transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5 text-gray-400" />}
                  <span>{copied ? "Link Copied!" : "Share"}</span>
                </button>
              </div>

              {/* Audio Player Bar (If Active) */}
              <AnimatePresence>
                {isPlayingAudio && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8 p-4 rounded-xl bg-sortd-off-white border border-sortd-black/10 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-sortd-black">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-sortd-pink animate-pulse" />
                        <span>AUDIO NARRATION — READ IN 60 SECONDS</span>
                      </div>
                      <span>0:21 / 0:60</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden cursor-pointer" onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      setAudioProgress((clickX / rect.width) * 100);
                    }}>
                      <div className="h-full bg-sortd-pink rounded-full" style={{ width: `${audioProgress}%` }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Excerpt Lead Paragraph */}
              <p className="text-lg sm:text-xl font-bold text-sortd-black leading-relaxed mb-6">
                {article.excerpt}
              </p>

              {/* Formatted Body Copy with highlight blockquotes */}
              <div className="prose prose-lg max-w-none text-sortd-black/90 font-normal leading-relaxed space-y-5 mb-10">
                {articleContent.map((paragraph, idx) => {
                  if (paragraph.startsWith("QUOTE_START")) {
                    const quoteText = paragraph.replace("QUOTE_START", "").replace("QUOTE_END", "").trim();
                    return (
                      <blockquote key={idx} className="my-8 py-4 border-y border-gray-100 text-lg sm:text-xl font-body font-bold text-sortd-pink leading-relaxed">
                        &ldquo;{quoteText}&rdquo;
                      </blockquote>
                    );
                  }
                  return <p key={idx}>{paragraph}</p>;
                })}
              </div>



              {/* Subscribe Block (Article Variant) */}
              <div className="mb-12">
                <SubscribeCard variant="article" />
              </div>
            </div>

            {/* Right Column: Ads Sidebar */}
            <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col lg:sticky lg:top-24 mt-4 lg:mt-0">
              <div className="w-full h-[400px] lg:h-[1217px] bg-[#CE3939] flex items-center justify-center text-white font-heading font-black text-6xl sm:text-7xl tracking-wider uppercase select-none p-[10px]">
                ADS
              </div>
            </div>

          </div>

          {/* Related Stories Grid Section */}
          <div className="pt-12 border-t border-gray-200 mt-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-heading font-extrabold text-[28px] uppercase tracking-wider text-sortd-black">
                RELATED NEWS
              </h3>
              <Link
                href="/#news"
                className="text-[11px] font-body font-extrabold uppercase tracking-widest text-[#9E9E9E] hover:text-sortd-pink transition-colors whitespace-nowrap flex items-center gap-0.5 select-none"
              >
                <span>VIEW ALL</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#9E9E9E] stroke-[2.5] relative" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedArticles.map((rel) => (
                <ArticleCard key={rel.id} article={rel} />
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
