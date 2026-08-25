"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Menu } from "lucide-react";
import LogoMark from "@/components/common/LogoMark";
import LocationDropdown from "@/components/header/LocationDropdown";
import MobileMenu from "@/components/header/MobileMenu";

import { useCategories } from "@/hooks/categoryStyles";

interface HeaderProps {
  onSubscribeClick?: () => void;
  onClickLogo?: () => void;
}

export default function Header({ onSubscribeClick, onClickLogo }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: categories = [] } = useCategories();

  const navLinks = [
    ...categories.map((c) => ({
      label: c.name.toUpperCase(),
      href: `/news?category=${c.name}`,
    })),
    { label: "ABOUT", href: "/#about" },
  ];

  return (
    <header className="relative z-40 bg-[#F7F9FC] w-full max-w-full min-w-0">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Logo Mark */}
        <div className="flex items-center">
          <LogoMark variant="header" onClick={onClickLogo} />
        </div>

        {/* Desktop Navigation & Actions (Hidden on Mobile/Tablet <1024px) */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Nav Links */}
          <nav className="flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-body font-bold text-[12px] leading-[18px] tracking-[3px] text-[#0A0A0A] hover:text-sortd-pink transition-colors relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sortd-yellow transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="h-[16px] w-[1px] bg-[#F7ECBB]" />

          {/* Subscribe Button */}
          <button
            onClick={onSubscribeClick}
            className="w-[119px] h-[30px] rounded-[6px] border-2 border-sortd-yellow bg-transparent hover:bg-sortd-yellow/5 text-sortd-yellow font-body font-semibold text-[12px] leading-none tracking-normal transition-all duration-200 flex items-center justify-center px-[10px] gap-[10px] flex-shrink-0"
          >
            <Mail className="w-[18px] h-[18px] text-sortd-yellow flex-shrink-0" />
            <span>Subscribe</span>
          </button>

          {/* Divider */}
          <div className="h-[16px] w-[1px] bg-[#F7ECBB]" />

          {/* Location Dropdown */}
          <LocationDropdown />
        </div>

        {/* Mobile/Tablet Controls (Visible on <1024px) */}
        <div className="flex lg:hidden items-center gap-3 flex-shrink-0">
          {/* Mobile Subscribe Button */}
          <button
            onClick={onSubscribeClick}
            className="w-[119px] h-[30px] rounded-[6px] border-2 border-sortd-yellow bg-transparent hover:bg-sortd-yellow/5 text-sortd-yellow font-body font-bold text-[11px] tracking-wider transition-all duration-200 flex items-center justify-center px-[10px] gap-[10px] flex-shrink-0"
          >
            <Mail className="w-5 h-5 text-sortd-yellow flex-shrink-0" />
            <span>Subscribe</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-[38px] h-[38px] flex items-center justify-center bg-transparent text-sortd-black hover:opacity-80 transition-opacity duration-200 focus:outline-none flex-shrink-0"
            aria-label="Open navigation menu"
          >
            <svg
              width="24"
              height="18"
              viewBox="0 0 24 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-sortd-black"
            >
              <line x1="0" y1="1.5" x2="24" y2="1.5" stroke="currentColor" strokeWidth="2.5" />
              <line x1="0" y1="6.5" x2="24" y2="6.5" stroke="currentColor" strokeWidth="2.5" />
              <line x1="0" y1="11.5" x2="24" y2="11.5" stroke="currentColor" strokeWidth="2.5" />
              <line x1="0" y1="16.5" x2="24" y2="16.5" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onSubscribeClick={onSubscribeClick}
      />
    </header>
  );
}
