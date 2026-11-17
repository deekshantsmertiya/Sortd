"use client";

import React, { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Tag, X } from "lucide-react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ArticleCard from "@/components/common/ArticleCard";
import EmptyState from "@/components/common/EmptyState";
import { useArticles } from "@/hooks/useArticles";
import { useCategories } from "@/hooks/categoryStyles";
import { usePageSeo } from "@/lib/siteSettings";
import type { Article } from "@/types";

const PER_PAGE = 10;

/** Newest first: real publish time when known, otherwise keep the stored order (newest are stored first). */
function sortNewest(list: Article[]): Article[] {
  return list
    .map((a, i) => ({ a, i, t: a.publishedAtIso ? Date.parse(a.publishedAtIso) : NaN }))
    .sort((x, y) => {
      if (!isNaN(x.t) && !isNaN(y.t)) return y.t - x.t;
      if (!isNaN(x.t)) return -1;
      if (!isNaN(y.t)) return 1;
      return x.i - y.i;
    })
    .map((x) => x.a);
}

/** Page numbers with ellipses, e.g. 1 … 4 5 6 … 12 */
function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const from = Math.max(2, current - 1);
  const to = Math.min(total - 1, current + 1);
  if (from > 2) out.push("…");
  for (let p = from; p <= to; p++) out.push(p);
  if (to < total - 1) out.push("…");
  out.push(total);
  return out;
}

function LatestContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { data: articles = [] } = useArticles();
  const { data: categories = [] } = useCategories();

  usePageSeo("latest", {
    title: "Latest Stories",
    description: "The newest stories from Dubai — news, culture and community in 60 seconds.",
  });

  const tag = params.get("tag") || "";
  const category = (params.get("category") || "").toUpperCase();

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of articles) for (const t of a.tags || []) counts.set(t, (counts.get(t) || 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [articles]);

  const filtered = useMemo(() => {
    let list = sortNewest(articles);
    if (category) list = list.filter((a) => a.category.toUpperCase() === category);
    if (tag) list = list.filter((a) => (a.tags || []).some((t) => t.toLowerCase() === tag.toLowerCase()));
    return list;
  }, [articles, category, tag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const requested = parseInt(params.get("page") || "1", 10);
  const page = Number.isFinite(requested) ? Math.min(Math.max(1, requested), totalPages) : 1;
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const go = (patch: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined || v === "" || (k === "page" && v === 1)) next.delete(k);
      else next.set(k, String(v));
    }
    const qs = next.toString();
    router.push(`/latest${qs ? `?${qs}` : ""}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const from = filtered.length ? (page - 1) * PER_PAGE + 1 : 0;
  const to = Math.min(page * PER_PAGE, filtered.length);

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex flex-col justify-between selection:bg-sortd-yellow selection:text-sortd-black">
      <Header />

      <main className="flex-grow py-10 sm:py-12 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-gray-200/60 pb-6">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl text-sortd-black tracking-wider uppercase leading-none">Latest Stories</h1>
            <p className="text-sm font-medium text-sortd-grey mt-2">
              {filtered.length ? `Showing ${from}–${to} of ${filtered.length} stories` : "No stories match these filters"}
              {tag && <> tagged <span className="font-bold text-sortd-black">“{tag}”</span></>}
              {category && <> in <span className="font-bold text-sortd-black">{category}</span></>}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <label className="flex flex-col gap-1 min-w-[180px]">
              <span className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider">Category</span>
              <select
                value={category}
                onChange={(e) => go({ category: e.target.value || undefined, page: 1 })}
                className="h-11 px-3 bg-white border-2 border-gray-200 focus:border-sortd-black text-xs font-bold uppercase tracking-wider text-sortd-black focus:outline-none"
              >
                <option value="">All categories</option>
                {categories.map((c) => <option key={c.id} value={c.name.toUpperCase()}>{c.name}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 min-w-[200px]">
              <span className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider inline-flex items-center gap-1"><Tag className="w-3 h-3" />Tag</span>
              <select
                value={tag}
                onChange={(e) => go({ tag: e.target.value || undefined, page: 1 })}
                disabled={!allTags.length}
                className="h-11 px-3 bg-white border-2 border-gray-200 focus:border-sortd-black text-xs font-bold text-sortd-black focus:outline-none disabled:opacity-50"
              >
                <option value="">{allTags.length ? "All tags" : "No tags yet"}</option>
                {allTags.map(([t, n]) => <option key={t} value={t}>{t} ({n})</option>)}
              </select>
            </label>
            {(tag || category) && (
              <button type="button" onClick={() => go({ tag: undefined, category: undefined, page: 1 })} className="self-start sm:self-end h-11 px-4 border-2 border-gray-200 bg-white text-xs font-bold uppercase tracking-wider text-sortd-grey hover:text-sortd-black inline-flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" />Clear
              </button>
            )}
          </div>
        </div>

        {pageItems.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {pageItems.map((article) => (
              <div key={article.id} className="h-[285px]">
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => go({ page: page - 1 })}
              disabled={page === 1}
              className="h-10 px-3 inline-flex items-center gap-1 border-2 border-gray-200 bg-white text-xs font-bold uppercase tracking-wider disabled:opacity-40 hover:border-sortd-black"
            >
              <ChevronLeft className="w-4 h-4" /><span className="hidden sm:inline">Prev</span>
            </button>
            {pageList(page, totalPages).map((p, i) =>
              p === "…" ? (
                <span key={`e${i}`} className="w-8 text-center text-sortd-grey font-bold">…</span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => go({ page: p })}
                  aria-current={p === page ? "page" : undefined}
                  className={`h-10 min-w-10 px-3 border-2 text-xs font-bold tabular-nums ${p === page ? "bg-sortd-yellow border-sortd-yellow text-sortd-black" : "bg-white border-gray-200 text-sortd-grey hover:border-sortd-black"}`}
                >
                  {p}
                </button>
              )
            )}
            <button
              type="button"
              onClick={() => go({ page: page + 1 })}
              disabled={page === totalPages}
              className="h-10 px-3 inline-flex items-center gap-1 border-2 border-gray-200 bg-white text-xs font-bold uppercase tracking-wider disabled:opacity-40 hover:border-sortd-black"
            >
              <span className="hidden sm:inline">Next</span><ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function LatestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F7F8]" />}>
      <LatestContent />
    </Suspense>
  );
}
