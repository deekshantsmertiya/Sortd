"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ArticleCard from "@/components/common/ArticleCard";
import { CategoryType } from "@/types";
import { useArticles } from "@/hooks/useArticles";
import { useCategories } from "@/hooks/categoryStyles";
import { usePageSeo } from "@/lib/siteSettings";

function NewsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category") as CategoryType | null;
  const tagParam = searchParams.get("tag") || "";

  const { data: articles = [] } = useArticles();
  const { data: dynamicCategories = [] } = useCategories();
  const categoriesList = [
    { label: "ALL STORIES", value: "ALL" as const },
    ...dynamicCategories.map((c) => ({
      label: c.name.toUpperCase(),
      value: c.name.toUpperCase() as CategoryType,
    })),
  ];

  // Derived straight from the URL, so the right pill is highlighted from the first paint.
  const validValues = dynamicCategories.map((c) => c.name.toUpperCase());
  const activeCategory: CategoryType | "ALL" =
    categoryParam && validValues.includes(categoryParam.toUpperCase()) ? (categoryParam.toUpperCase() as CategoryType) : "ALL";
  const popularOnly = searchParams.get("popular") === "1";

  const handleCategoryChange = (category: CategoryType | "ALL") => {
    if (category === "ALL") {
      router.push(tagParam ? `/news?tag=${encodeURIComponent(tagParam)}` : "/news");
    } else {
      router.push(`/news?category=${category}${tagParam ? `&tag=${encodeURIComponent(tagParam)}` : ""}`);
    }
  };

  const allTags = Array.from(new Set(articles.flatMap((a) => a.tags || []))).sort((x, y) => x.localeCompare(y));
  const setTag = (t: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (t) next.set("tag", t); else next.delete("tag");
    const qs = next.toString();
    router.push(`/news${qs ? `?${qs}` : ""}`);
  };
  usePageSeo("news", {
    title: popularOnly ? "Popular Stories" : activeCategory === "ALL" ? "All Stories" : `${activeCategory} Stories`,
    description: "Explore the latest updates, street culture, and neighborhood news from Dubai.",
  });

  const filteredArticles = (activeCategory === "ALL"
    ? articles
    : articles.filter((article) => article.category.toUpperCase() === activeCategory.toUpperCase())
  ).filter((a) => !tagParam || (a.tags || []).some((t) => t.toLowerCase() === tagParam.toLowerCase()))
   .filter((a) => !popularOnly || a.isPopular);

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex flex-col justify-between selection:bg-sortd-yellow selection:text-sortd-black">
      {/* Sticky Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow py-12 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Page title and filter controls */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-gray-200/60 pb-6">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl text-sortd-black tracking-wider uppercase leading-none">
              {popularOnly ? "Popular Stories" : activeCategory === "ALL" ? "All Stories" : `${activeCategory} Stories`}
            </h1>
            <p className="text-sm font-medium text-sortd-grey mt-2">
              Explore the latest updates, street culture, and neighborhood news from Dubai.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {categoriesList.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-4 py-2 rounded-[4px] font-body font-bold text-xs tracking-wider uppercase transition-all border-2 ${
                  activeCategory === cat.value
                    ? "bg-sortd-yellow border-sortd-yellow text-sortd-black shadow-sm"
                    : "bg-white border-gray-200/80 text-sortd-grey hover:border-sortd-yellow/50"
                }`}
              >
                {cat.label}
              </button>
            ))}
            <select
              aria-label="Filter by tag"
              value={tagParam}
              onChange={(e) => setTag(e.target.value)}
              disabled={!allTags.length}
              className="h-[36px] px-3 bg-white border-2 border-gray-200/80 text-xs font-bold text-sortd-grey focus:border-sortd-black focus:outline-none disabled:opacity-50"
            >
              <option value="">{allTags.length ? "All tags" : "No tags yet"}</option>
              {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-sortd-grey font-medium">No articles found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArticles.map((article) => (
              <div key={article.id} className="h-[285px]">
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-between selection:bg-sortd-yellow selection:text-sortd-black">
        <Header />
        <main className="flex-grow py-12 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-center">
          <div className="text-center font-medium text-sortd-grey">Loading stories...</div>
        </main>
        <Footer />
      </div>
    }>
      <NewsPageContent />
    </Suspense>
  );
}
