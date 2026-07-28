"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Menu } from "lucide-react";
import LogoMark from "@/components/common/LogoMark";
import LocationDropdown from "@/components/header/LocationDropdown";
import MobileMenu from "@/components/header/MobileMenu";

const NAV_LINKS = [
  { label: "NEWS", href: "/#news" },
  { label: "CULTURE", href: "/#culture" },
  { label: "COMMUNITY", href: "/#community" },
  { label: "ABOUT", href: "/#about" },
];

interface HeaderProps {
  onSubscribeClick?: () => void;
}

export default function Header({ onSubscribeClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-shadow duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Logo Mark */}
        <div className="flex items-center">
          <LogoMark variant="header" />
        </div>

        {/* Center: Desktop Nav Links (Hidden on Mobile/Tablet <1024px) */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-heading font-extrabold text-sm tracking-widest text-sortd-black hover:text-sortd-pink transition-colors relative py-1 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sortd-yellow transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Subscribe Pill Button */}
          <button
            onClick={onSubscribeClick}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-sortd-yellow bg-white hover:bg-sortd-yellow text-sortd-black font-heading font-extrabold text-xs sm:text-xs tracking-wider transition-all duration-200 shadow-sm"
          >
            <Mail className="w-3.5 h-3.5 text-sortd-black" />
            <span>SUBSCRIBE</span>
          </button>

          {/* Desktop Divider & Location Dropdown (Hidden on Mobile) */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="h-5 w-[1px] bg-gray-200" />
            <LocationDropdown />
          </div>

          {/* Mobile/Tablet Hamburger Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-full hover:bg-sortd-off-white text-sortd-black transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
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
