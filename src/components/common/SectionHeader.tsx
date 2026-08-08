"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  viewAllHref?: string;
  accentColor?: "yellow" | "navy" | "pink" | "black";
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
  showAccentBar?: boolean;
  accentOnlyOnDesktop?: boolean;
}

export default function SectionHeader({
  title,
  viewAllHref = "#",
  accentColor = "yellow",
  subtitle,
  className = "",
  children,
  showAccentBar = true,
  accentOnlyOnDesktop = false,
}: SectionHeaderProps) {
  const accentClasses = {
    yellow: "bg-[#FFD100]",
    navy: "bg-[#1B2F6E]",
    pink: "bg-[#E8185A]",
    black: "bg-[#0A0A0A]",
  };

  return (
    <div className={`flex flex-col gap-1 border-b border-gray-100 pb-3 mb-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Vertical Accent Bar */}
          {showAccentBar && (
            <div className={`w-[12px] h-[45px] rounded-[4px] flex-shrink-0 ${accentClasses[accentColor]} ${accentOnlyOnDesktop ? "hidden md:block" : ""}`} />
          )}
          
          <h2 className="font-heading font-normal text-[32px] sm:text-[42px] leading-[45px] tracking-[1px] text-[#0A0A0A] uppercase select-none">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-5 sm:gap-6">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-[11px] font-body font-extrabold uppercase tracking-widest text-[#9E9E9E] hover:text-sortd-pink transition-colors whitespace-nowrap flex items-center gap-0.5 select-none"
            >
              <span>VIEW ALL</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#9E9E9E] stroke-[2.5px] relative" />
            </Link>
          )}
          {children}
        </div>
      </div>

      {subtitle && <p className="text-xs sm:text-sm text-sortd-grey font-medium pl-4">{subtitle}</p>}
    </div>
  );
}
