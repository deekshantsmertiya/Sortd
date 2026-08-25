"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white pt-8 md:pt-12 pb-5 md:pb-8 border-t border-white/5 select-none w-full max-w-full overflow-x-hidden min-w-0">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* DESKTOP & TABLET FOOTER: Centered Brand Layout (>= 768px) */}
        <div className="hidden md:flex flex-col items-center text-center gap-6">
          {/* Logo Mark */}
          <div className="w-[79.5px] h-[111px] relative">
            <img
              src="/Footer.png"
              alt="Sortd Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Description tagline */}
          <p className="text-[11px] sm:text-xs text-[#9E9E9E] font-medium leading-relaxed max-w-sm mt-1">
            Dubai&apos;s unfiltered take on news, culture & community. Read in 60 seconds.
          </p>

          {/* Horizontal Navigation links */}
          <nav className="flex items-center gap-8 font-body font-bold text-sm text-white mt-2">
            <Link href="/#news" className="hover:text-sortd-yellow transition-colors">
              News
            </Link>
            <Link href="/#culture" className="hover:text-sortd-yellow transition-colors">
              Culture
            </Link>
            <Link href="/#community" className="hover:text-sortd-yellow transition-colors">
              Community
            </Link>
            <Link href="/#about" className="hover:text-sortd-yellow transition-colors">
              About
            </Link>
          </nav>

          {/* Divider Line */}
          <div className="w-full h-[1px] bg-white/10 mt-6" />

          {/* Bottom Bar: Copyright (Left), Socials (Center), Location (Right) */}
          <div className="w-full pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright column */}
            <div className="text-[11px] text-[#555555] font-medium w-full md:w-1/3 text-center md:text-left order-3 md:order-1">
              © 2026 Sortd Dubai. All rights reserved.
            </div>

            {/* Social Media column */}
            <div className="flex items-center justify-center gap-2 w-full md:w-1/3 order-1 md:order-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white text-black hover:bg-sortd-yellow hover:text-black flex items-center justify-center transition-all duration-200"
                aria-label="Facebook"
              >
                <svg className="w-[20px] h-[20px] fill-current" viewBox="0 0 24 24">
                  <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white text-black hover:bg-sortd-yellow hover:text-black flex items-center justify-center transition-all duration-200"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white text-black hover:bg-sortd-yellow hover:text-black flex items-center justify-center transition-all duration-200"
                aria-label="Instagram"
              >
                <svg className="w-[20px] h-[20px] fill-current" viewBox="0 0 24 24">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                </svg>
              </a>
            </div>

            {/* Location column */}
            <div className="text-[11px] text-[#555555] font-medium w-full md:w-1/3 flex items-center justify-center md:justify-end gap-1.5 order-2 md:order-3">
              <MapPin className="w-3.5 h-3.5 text-gray-550 fill-sortd-yellow" />
              <span>Dubai, UAE</span>
            </div>
          </div>
        </div>

        {/* MOBILE FOOTER: Left-aligned list layout (< 768px) */}
        <div className="flex md:hidden flex-col gap-5 w-full">
          <div className="flex flex-row justify-between items-start w-full gap-4">
            
            {/* Left Column (Sections & Socials) */}
            <div className="flex flex-col gap-6 flex-shrink-0">
              {/* Sections Nav */}
              <div>
                <h3 className="font-body font-bold text-[10px] leading-[15px] tracking-[3px] text-white/30 mb-3 select-none">
                  SECTIONS
                </h3>
                <nav className="flex flex-col gap-[12px] font-body font-bold text-[14px] leading-[21px] text-white/60">
                  <Link href="/#news" className="hover:text-sortd-yellow transition-colors">
                    News
                  </Link>
                  <Link href="/#culture" className="hover:text-sortd-yellow transition-colors">
                    Culture
                  </Link>
                  <Link href="/#community" className="hover:text-sortd-yellow transition-colors">
                    Community
                  </Link>
                  <Link href="/#about" className="hover:text-sortd-yellow transition-colors">
                    About
                  </Link>
                </nav>
              </div>

              {/* Social Sections */}
              <div>
                <h3 className="font-body font-bold text-[10px] leading-[15px] tracking-[3px] text-white/30 mb-3 select-none">
                  SECTIONS
                </h3>
                <div className="flex items-center gap-[8px]">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white text-black hover:bg-sortd-yellow hover:text-black flex items-center justify-center transition-all duration-200"
                    aria-label="Facebook"
                  >
                    <svg className="w-[20px] h-[20px] fill-current" viewBox="0 0 24 24">
                      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
                    </svg>
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white text-black hover:bg-sortd-yellow hover:text-black flex items-center justify-center transition-all duration-200"
                    aria-label="YouTube"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white text-black hover:bg-sortd-yellow hover:text-black flex items-center justify-center transition-all duration-200"
                    aria-label="Instagram"
                  >
                    <svg className="w-[20px] h-[20px] fill-current" viewBox="0 0 24 24">
                      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column (Logo & Tagline) */}
            <div className="flex flex-col items-start w-[211px] flex-shrink-0">
              <div className="w-[79.5px] h-[111px] mb-4 relative select-none">
                <img
                  src="/Footer.png"
                  alt="Sortd Logo"
                  className="w-full h-full object-contain object-left"
                />
              </div>
              <p className="font-body font-normal text-[14px] leading-[19.5px] text-white/40">
                Dubai&apos;s unfiltered take on news, culture & community. Read in 60 seconds.
              </p>
            </div>
          </div>

          {/* Copyright Centered at Bottom */}
          <div className="w-full text-center pt-4 border-t border-white/5 font-body font-medium text-[11px] text-[#555555]">
            © 2026 Sortd Dubai. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
