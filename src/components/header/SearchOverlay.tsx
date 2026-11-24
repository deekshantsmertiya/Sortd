"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useArticles } from "@/hooks/useArticles";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: articles = [] } = useArticles();

  useEffect(() => {
    if (!isOpen) return;
    setQuery("");
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return articles
      .filter((a) => {
        const hay = [a.title, a.excerpt, a.category, a.subCategory, ...(a.content || [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return terms.every((t) => hay.includes(t));
      })
      .slice(0, 12);
  }, [query, articles]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col" role="dialog" aria-modal="true" aria-label="Search articles">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#FFCC00] w-full">
        <div className="max-w-[900px] mx-auto px-5 py-5 lg:py-7 flex items-center gap-3">
          <Search className="w-6 h-6 text-[#0A0A0A] shrink-0" strokeWidth={2.5} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories, culture, community…"
            className="flex-1 min-w-0 bg-transparent border-b-2 border-[#0A0A0A] py-2 font-body font-bold text-[18px] lg:text-[22px] text-[#0A0A0A] placeholder:text-[#0A0A0A]/50 focus:outline-none"
          />
          <button onClick={onClose} aria-label="Close search" className="w-[38px] h-[38px] flex items-center justify-center text-[#0A0A0A] hover:opacity-70 shrink-0">
            <X className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-[900px] mx-auto px-5 mt-3 flex-1 min-h-0 overflow-y-auto pb-6">
        {query.trim() && (
          <div className="bg-white rounded-xl shadow-sortd-md overflow-hidden">
            {results.length === 0 ? (
              <p className="p-6 text-sm text-sortd-grey font-medium">No stories match “{query.trim()}”.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {results.map((a) => (
                  <li key={a.id}>
                    <Link href={`/article/${a.id}`} onClick={onClose} className="flex gap-4 p-4 hover:bg-gray-50 transition-colors">
                      {a.imageUrl && (
                        <img src={a.imageUrl} alt="" className="w-20 h-16 rounded-lg object-cover shrink-0" />
                      )}
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold tracking-[2px] uppercase text-sortd-pink">{a.category}</span>
                        <p className="font-heading font-normal text-[18px] leading-[1.1] uppercase tracking-[0.02em] text-[#0A0A0A] line-clamp-2">{a.title}</p>
                        <p className="text-xs text-sortd-grey line-clamp-1 mt-0.5">{a.excerpt}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
