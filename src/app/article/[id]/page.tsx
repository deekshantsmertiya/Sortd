"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Share2, Volume2, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import SubscribeCard from "@/components/article/SubscribeCard";
import ArticleCard from "@/components/common/ArticleCard";
import CarouselControls from "@/components/common/CarouselControls";
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
          <p className="font-heading font-bold text-lg">Loading 60-Second Story...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate Next & Related articles
  const currentIndex = allArticles.findIndex((a) => a.id === article.id || a.slug === article.slug);
  const upNextArticle = allArticles[(currentIndex + 1) % allArticles.length] || allArticles[0];
  const relatedArticles = allArticles.filter((a) => a.id !== article.id).slice(0, 4);

  const categoryStyles = {
    NEWS: "bg-sortd-yellow text-sortd-black",
    CULTURE: "bg-sortd-navy text-white",
    COMMUNITY: "bg-sortd-pink text-white",
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Header />

      <main className="flex-grow">
        {/* Back Link Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-sortd-grey hover:text-sortd-black uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO HOME</span>
          </Link>
        </div>

        {/* Article Hero Container */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          {/* Full-width Hero Image */}
          <div className="relative w-full h-72 sm:h-96 lg:h-[420px] rounded-3xl overflow-hidden bg-gray-100 shadow-sortd-md mb-6">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
            />
          </div>

          {/* Category Tag Pill & Timestamp Below Image */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-3.5 py-1 rounded-full text-xs font-heading font-extrabold uppercase tracking-widest ${
                categoryStyles[article.category]
              }`}
            >
              {article.category}
            </span>
            <span className="text-xs font-semibold text-sortd-grey uppercase tracking-wider">
              {article.publishedAt} · READ IN {article.readTime}
            </span>
          </div>

          {/* Bold Multi-line Headline */}
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-sortd-black leading-tight mb-6">
            {article.title}
          </h1>

          {/* Action Buttons Row: Pink "Listen to the Article" + Grey-outlined "Share" */}
          <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-gray-200 mb-8">
            {/* Listen Pill (Pink/Red) */}
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sortd-pink hover:bg-sortd-pink-hover text-white font-heading font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-sm"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlayingAudio ? "PAUSE AUDIO" : "LISTEN TO THE ARTICLE"}</span>
            </button>

            {/* Share Pill (Grey Outlined) */}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 hover:border-sortd-black bg-sortd-off-white text-sortd-black font-heading font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? "LINK COPIED!" : "SHARE"}</span>
            </button>
          </div>

          {/* Audio Player Bar (If Active) */}
          <AnimatePresence>
            {isPlayingAudio && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-4 rounded-2xl bg-sortd-off-white border border-sortd-black/10 flex flex-col gap-2"
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

          {/* Formatted Body Copy */}
          <div className="prose prose-lg max-w-none text-sortd-black/90 font-normal leading-relaxed space-y-5 mb-10">
            {article.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Prev/Next Circular Arrow Navigation */}
          <div className="flex items-center justify-between py-6 border-y border-gray-200 mb-10">
            <span className="font-heading font-extrabold text-xs tracking-wider uppercase text-sortd-grey">
              NAVIGATE STORIES
            </span>
            <CarouselControls
              onPrev={() => {
                const prevIndex = (currentIndex - 1 + allArticles.length) % allArticles.length;
                window.location.href = `/article/${allArticles[prevIndex].slug}`;
              }}
              onNext={() => {
                window.location.href = `/article/${upNextArticle.slug}`;
              }}
            />
          </div>

          {/* "Up Next" Preview Card */}
          <div className="mb-12">
            <span className="font-heading font-extrabold text-xs tracking-widest text-sortd-grey uppercase block mb-3">
              UP NEXT
            </span>
            <Link
              href={`/article/${upNextArticle.slug}`}
              className="flex items-center gap-4 p-4 rounded-2xl bg-sortd-off-white border border-gray-200 hover:border-sortd-black transition-all group"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                <Image src={upNextArticle.imageUrl} alt={upNextArticle.title} fill className="object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex-grow">
                <span className="text-[10px] font-bold text-sortd-pink uppercase tracking-wider block mb-1">
                  {upNextArticle.category} · NEXT STORY
                </span>
                <h4 className="font-heading font-extrabold text-sm sm:text-base text-sortd-black line-clamp-2 leading-snug group-hover:text-sortd-pink transition-colors">
                  {upNextArticle.title}
                </h4>
                <span className="text-xs text-sortd-grey font-medium mt-1 block">
                  {upNextArticle.publishedAt}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-sortd-black group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>
          </div>

          {/* Subscribe Block */}
          <div className="mb-16">
            <SubscribeCard />
          </div>

          {/* Related Stories Grid Section */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-extrabold text-2xl uppercase tracking-wider text-sortd-black">
                RELATED STORIES
              </h3>
              <Link href="/" className="text-xs font-heading font-bold uppercase text-sortd-black hover:text-sortd-pink">
                VIEW ALL HOMEPAGE
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedArticles.map((rel) => (
                <ArticleCard key={rel.id} article={rel} />
              ))}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
