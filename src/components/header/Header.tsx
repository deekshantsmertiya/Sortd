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
}

export default function Header({ onSubscribeClick }: HeaderProps) {
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
    <header className="sticky top-0 z-40 bg-[#F7F9FC] border-b border-gray-200/60 transition-shadow duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Logo Mark */}
        <div className="flex items-center">
          <LogoMark variant="header" />
        </div>

        {/* Desktop Navigation & Actions (Hidden on Mobile/Tablet <1024px) */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Nav Links */}
          <nav className="flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-body font-bold text-xs tracking-widest text-sortd-black hover:text-sortd-pink transition-colors relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sortd-yellow transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="h-5 w-[1.5px] bg-gray-200" />

          {/* Subscribe Button */}
          <button
            onClick={onSubscribeClick}
            className="flex items-center gap-2 px-4 py-2 rounded-[10px] border-2 border-sortd-yellow bg-transparent hover:bg-sortd-yellow/5 text-sortd-yellow font-body font-bold text-xs tracking-wider transition-all duration-200"
          >
            <Mail className="w-4 h-4 text-sortd-yellow" />
            <span>Subscribe</span>
          </button>

          {/* Divider */}
          <div className="h-5 w-[1.5px] bg-gray-200" />

          {/* Location Dropdown */}
          <LocationDropdown />
        </div>

        {/* Mobile/Tablet Controls (Visible on <1024px) */}
        <div className="flex lg:hidden items-center gap-3">
          {/* Mobile Subscribe Button */}
          <button
            onClick={onSubscribeClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border-2 border-sortd-yellow bg-transparent hover:bg-sortd-yellow/5 text-sortd-yellow font-body font-bold text-[11px] tracking-wider transition-all duration-200"
          >
            <Mail className="w-3.5 h-3.5 text-sortd-yellow" />
            <span>Subscribe</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 text-sortd-black transition-colors"
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
