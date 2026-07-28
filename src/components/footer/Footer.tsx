"use client";

import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import LogoMark from "@/components/common/LogoMark";

export default function Footer() {
  return (
    <footer className="bg-sortd-black text-white pt-12 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Centered Logo Lockup */}
        <div className="mb-4">
          <LogoMark variant="footer" />
        </div>

        {/* Centered One-line Tagline */}
        <p className="text-xs sm:text-sm text-gray-400 font-medium max-w-lg mb-6 leading-relaxed">
          Dubai&apos;s unfiltered take on news, culture & community. Read in 60 seconds.
        </p>

        {/* Centered Nav Links Row */}
        <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-heading font-extrabold text-xs sm:text-sm tracking-widest uppercase mb-8">
          <Link href="/#news" className="hover:text-sortd-yellow transition-colors">
            NEWS
          </Link>
          <span className="text-gray-600 font-normal">·</span>
          <Link href="/#culture" className="hover:text-sortd-yellow transition-colors">
            CULTURE
          </Link>
          <span className="text-gray-600 font-normal">·</span>
          <Link href="/#community" className="hover:text-sortd-yellow transition-colors">
            COMMUNITY
          </Link>
          <span className="text-gray-600 font-normal">·</span>
          <Link href="/#about" className="hover:text-sortd-yellow transition-colors">
            ABOUT
          </Link>
        </nav>

        {/* Horizontal Divider */}
        <div className="w-full max-w-4xl h-[1px] bg-white/10 mb-8" />

        {/* Centered Social Icons Row */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-sortd-yellow hover:text-sortd-black text-white flex items-center justify-center transition-all duration-200"
            aria-label="Facebook"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-sortd-yellow hover:text-sortd-black text-white flex items-center justify-center transition-all duration-200"
            aria-label="YouTube"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-sortd-yellow hover:text-sortd-black text-white flex items-center justify-center transition-all duration-200"
            aria-label="Instagram"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </div>

        {/* Bottom Row */}
        <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-gray-400 border-t border-white/5">
          {/* Copyright Text */}
          <div className="font-medium text-center sm:text-left">
            © 2026 Sortd Dubai. All rights reserved.
          </div>


          {/* Location Tag Right */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white font-semibold text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-sortd-yellow fill-sortd-yellow" />
            <span>Dubai, UAE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
