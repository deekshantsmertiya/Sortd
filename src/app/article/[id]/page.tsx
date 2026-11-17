"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Share2, Check, ChevronRight, Zap, Globe, Users } from "lucide-react";
import DOMPurify from "dompurify";
import { articleToHtml } from "@/lib/articleContent";
import { useSeo } from "@/lib/siteSettings";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import SubscribeCard from "@/components/article/SubscribeCard";
import ArticleCard from "@/components/common/ArticleCard";
import ListItemCard from "@/components/common/ListItemCard";
import { useArticleBySlug, useArticles } from "@/hooks/useArticles";

const sanitizeArticleHtml = (html: string) => {
  if (typeof window === "undefined") return "";
  const clean = DOMPurify.sanitize(html, { ADD_ATTR: ["target"] });
  // Lazy-load inline images and keep external links safe.
  return clean
    .replace(/<img /g, '<img loading="lazy" ')
    .replace(/<a ([^>]*target="_blank"[^>]*)>/g, (m, attrs) => (/rel=/.test(attrs) ? m : `<a ${attrs} rel="noopener noreferrer">`));
};

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = (params?.id as string) || "dubai-golden-visa-rules";

  const { data: article, isLoading } = useArticleBySlug(slug);
  const { data: allArticles = [] } = useArticles();

  // Audio Player State handled by custom useSpeechSynthesis hook

  // Share Notification State
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  // Article HTML is sanitized in the browser (DOMPurify needs the DOM), so render it after mount to avoid a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Article SEO (meta title/description/keywords), falling back to headline + summary.
  useSeo(article?.seo, { title: article?.title, description: article?.excerpt });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleShare = async () => {
    if (!article || !shareUrl) return;

    const shareData = {
      title: article.title,
      text: article.excerpt,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.log("Clipboard write failed:", err);
      }
    }
  };

  // Unknown or unpublished address: say so instead of showing a different story.
  if (mounted && !isLoading && !article) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] flex flex-col justify-between">
        <Header />
        <main className="flex-grow max-w-2xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-4">
          <p className="font-body font-bold text-[11px] tracking-[3px] uppercase text-sortd-grey">Error 404</p>
          <h1 className="font-heading text-4xl sm:text-5xl uppercase tracking-wider text-sortd-black leading-none">Story not found</h1>
          <p className="font-body text-sm sm:text-base text-sortd-grey max-w-md">
            This story may have been moved, unpublished or never existed. Try the latest stories instead.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            <Link href="/latest" className="h-11 px-5 inline-flex items-center bg-sortd-yellow text-sortd-black font-body font-bold text-xs uppercase tracking-wider rounded-[4px]">Latest stories</Link>
            <Link href="/" className="h-11 px-5 inline-flex items-center border-2 border-gray-200 bg-white text-sortd-black font-body font-bold text-xs uppercase tracking-wider rounded-[4px]">Homepage</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading || !article) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] flex flex-col justify-between">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-12 h-12 border-4 border-sortd-yellow border-t-sortd-black rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body font-bold text-lg">Loading 60-Second Story...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Render exactly what the editor wrote (no filler text is appended any more).
  const articleHtml = !mounted ? "" : sanitizeArticleHtml(article.contentHtml ? article.contentHtml : articleToHtml({ content: article.content }));
  const authorName = article.author?.name?.trim() || "Sortd Dubai";

  // Calculate Next & Related articles
  const currentIndex = allArticles.findIndex((a) => a.id === article.id || a.slug === article.slug);
  const upNextArticle = allArticles[(currentIndex + 1) % allArticles.length] || allArticles[0];
  const relatedArticles = allArticles.filter((a) => a.id !== article.id).slice(0, 8);

  const categoryConfig = {
    NEWS: {
      bg: "bg-sortd-yellow text-sortd-black",
      icon: <Zap className="w-3 h-3 text-sortd-black fill-sortd-black" />,
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
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-[#F7F7F8] flex flex-col justify-between">
      <Header />

      <main className="flex-grow w-full max-w-full overflow-x-clip min-w-0">
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
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Column: Main Content */}
            <div className="flex-1 min-w-0 flex flex-col">
              
              {/* Category Tag Pill Below Image */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`h-[22px] px-2.5 rounded-[4px] font-body font-bold text-[9px] uppercase tracking-wider inline-flex items-center justify-center gap-1 select-none ${currentCategory.bg}`}
                >
                  {currentCategory.icon}
                  <span>{article.category}</span>
                </span>
              </div>

              {/* Bold Multi-line Headline */}
              <h1 className="font-heading uppercase tracking-normal font-normal text-3xl sm:text-4xl lg:text-[48px] leading-[1.0] text-sortd-black mb-6">
                {article.title}
              </h1>

              {/* Byline + Share */}
              <div className="flex flex-wrap items-center gap-3 mb-0">
                <div className="inline-flex items-center gap-2.5 pr-1">
                  {article.author?.avatarUrl ? (
                    <img src={article.author.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-sortd-yellow text-sortd-black font-body font-extrabold text-xs flex items-center justify-center uppercase">
                      {authorName.charAt(0)}
                    </span>
                  )}
                  <span className="font-body text-xs text-[#555] leading-tight">
                    By <span className="font-extrabold text-sortd-black uppercase tracking-wider">{authorName}</span>
                    {article.publishedAt && <span className="block text-[10px] uppercase tracking-wider text-[#999]">{article.publishedAt}</span>}
                  </span>
                </div>

                {/* Share Pill (Figma Exact Spec: 86x33px, rounded-4px, border-#999999, text-#999999, gap-8px) */}
                <button
                  onClick={handleShare}
                  className="w-[86px] h-[33px] rounded-[4px] border border-[#999999] bg-transparent text-[#999999] hover:border-sortd-black hover:text-sortd-black flex items-center justify-center gap-[8px] font-body font-medium text-xs transition-colors focus:outline-none"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Share"}</span>
                </button>
              </div>

              {/* Article body (rich text, sanitized) */}
              <div
                className="article-body px-2 pt-4 pb-0 mb-4"
                dangerouslySetInnerHTML={{ __html: articleHtml }}
              />



              {/* Social Share Buttons — centred, phones only (the newsletter card shows them from md up) */}
              <p className="md:hidden text-center font-body font-bold text-[10px] tracking-[2px] uppercase text-[#999999] mt-4 mb-2">Share this story</p>
              <div className="flex md:hidden items-center justify-center gap-2 px-2 mb-8">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + " " + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:bg-sortd-yellow hover:text-sortd-black hover:border-sortd-yellow flex items-center justify-center transition-colors bg-white shadow-sm cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:bg-sortd-yellow hover:text-sortd-black hover:border-sortd-yellow flex items-center justify-center transition-colors bg-white shadow-sm cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.861-.173.746-.511 1.002-.756 1.023-.533.048-.938-.352-1.454-.69-.808-.53-1.264-.858-2.051-1.376-.91-.599-.32-.928.198-1.467.135-.14.249-.267.362-.387 1.222-1.127 1.833-1.69 1.833-1.69.13-.122.18-.184.093-.274-.087-.09-.239-.03-.342.003L11.5 10.3c-.927.604-1.854 1.208-2.781 1.812-.511.341-.95.511-1.317.511-.476 0-1.393-.257-2.073-.483-.836-.277-1.503-.423-1.445-.893.03-.244.368-.493 1.014-.748 3.968-1.724 6.613-2.861 7.935-3.411 3.78-1.573 4.566-1.846 5.077-1.854.113-.002.365.026.529.159.138.113.176.267.191.385-.008.081-.004.22-.008.309z"/>
                  </svg>
                </a>
                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:bg-sortd-yellow hover:text-sortd-black hover:border-sortd-yellow flex items-center justify-center transition-colors bg-white shadow-sm cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:bg-sortd-yellow hover:text-sortd-black hover:border-sortd-yellow flex items-center justify-center transition-colors bg-white shadow-sm cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:bg-sortd-yellow hover:text-sortd-black hover:border-sortd-yellow flex items-center justify-center transition-colors bg-white shadow-sm cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>

              {/* Subscribe Block (Article Variant) */}
              <div className="mb-4">
                <SubscribeCard variant="article" shareUrl={shareUrl} articleTitle={article.title} />
              </div>
            </div>

            {/* 
              TEMPORARILY HIDDEN: Ads Sidebar section is hidden as requested
              <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col lg:sticky lg:top-24 mt-4 lg:mt-0">
                <div className="w-full h-[400px] lg:h-[1217px] bg-[#CE3939] flex items-center justify-center text-white font-heading font-black text-6xl sm:text-7xl tracking-wider uppercase select-none p-[10px]">
                  ADS
                </div>
              </div>
            */}

          </div>

          {/* Related Stories Grid Section */}
          <div className="mt-2 lg:mt-8 pt-6 lg:pt-10 border-t border-gray-200">
            <div className="flex items-center justify-between mb-5 lg:mb-6">
              <h3 className="font-heading font-extrabold text-[28px] uppercase tracking-wider text-sortd-black">
                <span className="hidden sm:inline">RELATED NEWS</span>
                <span className="sm:hidden">RELATED</span>
              </h3>
              <Link
                href={`/news?category=${encodeURIComponent(article.category)}`}
                className="text-[12px] font-body font-bold leading-[18px] uppercase tracking-[2px] text-[#999999] hover:text-sortd-pink transition-colors whitespace-nowrap flex items-center gap-0.5 select-none"
              >
                <span>VIEW ALL</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#999999] stroke-[2.5px] relative" />
              </Link>
            </div>

            {/* Mobile View: Horizontal List Layout (second image Figma style) */}
            <div className="block sm:hidden space-y-3">
              {relatedArticles.slice(0, 5).map((rel) => (
                <ListItemCard key={rel.id} article={rel} />
              ))}
            </div>

            {/* Tablet & Desktop View: Standard Grid Layout */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
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
