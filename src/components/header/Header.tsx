"use client";

import React, { useCallback, useState } from "react";
import SearchOverlay from "@/components/header/SearchOverlay";
import Link from "next/link";
import { Mail, Search } from "lucide-react";
import MobileMenu from "@/components/header/MobileMenu";

import { useCategories } from "@/hooks/categoryStyles";

interface HeaderProps {
  onSubscribeClick?: () => void;
  onClickLogo?: () => void;
}

function HeaderLogo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2 lg:gap-3 flex-shrink-0" aria-label="Sortd Dubai home">
      <span className="flex items-center justify-center rounded-full bg-white w-[38px] h-[38px] lg:w-[48px] lg:h-[48px] flex-shrink-0">
        <img src="/header.png" alt="" className="w-[22px] h-[22px] lg:w-[28px] lg:h-[28px] object-contain" />
      </span>
      {/* Official "sortd DUBAI" wordmark (multiply blend drops any white background on the yellow bar) */}
      <img
        src="/hero-center.png"
        alt="sortd Dubai"
        className="h-[36px] lg:h-[44px] w-auto object-contain mix-blend-multiply"
      />
    </Link>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
      <line x1="0" y1="1.5" x2="24" y2="1.5" stroke="currentColor" strokeWidth="2.5" />
      <line x1="0" y1="6.5" x2="24" y2="6.5" stroke="currentColor" strokeWidth="2.5" />
      <line x1="0" y1="11.5" x2="24" y2="11.5" stroke="currentColor" strokeWidth="2.5" />
      <line x1="0" y1="16.5" x2="24" y2="16.5" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

export default function Header({ onSubscribeClick, onClickLogo }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const { data: categories = [] } = useCategories();

  const navLinks = [
    ...categories.map((c) => ({
      label: c.name.toUpperCase(),
      href: `/news?category=${c.name}`,
    })),
    { label: "ABOUT", href: "/about" },
  ];

  const iconBtn =
    "w-[38px] h-[38px] flex items-center justify-center text-[#0A0A0A] hover:opacity-70 transition-opacity flex-shrink-0 focus:outline-none";

  return (
    <header className="sticky top-0 z-40 bg-[#FFCC00] shadow-[0_1px_0_rgba(0,0,0,0.06)] w-full max-w-full min-w-0">
      <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-10 h-[102px] lg:h-[96px] flex items-center justify-between gap-6">
        <HeaderLogo onClick={onClickLogo} />

        {/* Laptop / desktop nav */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8 min-w-0">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-body font-bold text-[12px] leading-[18px] tracking-[2px] xl:tracking-[3px] text-[#0A0A0A] relative py-1 group whitespace-nowrap"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0A0A0A] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
          <button onClick={() => setSearchOpen(true)} className={iconBtn} aria-label="Search">
            <Search className="w-[26px] h-[26px]" strokeWidth={2.5} />
          </button>

          {/* Subscribe (laptop / desktop) */}
          <button
            onClick={onSubscribeClick}
            className="hidden lg:flex h-[38px] px-4 rounded-[8px] bg-[#0A0A0A] text-[#FFCC00] hover:bg-[#222] font-body font-bold text-[12px] tracking-[1px] items-center gap-2 transition-colors"
          >
            <Mail className="w-[16px] h-[16px]" />
            SUBSCRIBE
          </button>

          {/* Menu: mobile & tablet only — opens the slide-in drawer */}
          <button onClick={() => setMobileMenuOpen(true)} className={`${iconBtn} lg:hidden`} aria-label="Open navigation menu">
            <MenuIcon />
          </button>
        </div>
      </div>

      <SearchOverlay isOpen={searchOpen} onClose={closeSearch} />

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onSubscribeClick={onSubscribeClick}
      />
    </header>
  );
}
