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
  showBorder?: boolean;
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
  showBorder = true,
}: SectionHeaderProps) {
  const accentClasses = {
    yellow: "bg-[#FFD100]",
    navy: "bg-[#1B2F6E]",
    pink: "bg-[#E8185A]",
    black: "bg-[#0A0A0A]",
  };

  return (
    <div className={`w-full flex flex-col gap-1 ${showBorder ? "border-b border-gray-100 pb-3 mb-6" : "mb-2.5 sm:mb-4"} ${className}`}>
      <div className="w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-[6px] min-w-0">
          {/* Vertical Accent Bar */}
          {showAccentBar && (
            <div className={`w-[8px] h-[30px] md:w-[12px] md:h-[45px] rounded-[3px] md:rounded-[4px] flex-shrink-0 ${accentClasses[accentColor]} ${accentOnlyOnDesktop ? "hidden md:block" : ""}`} />
          )}
          
          <h2 className="font-heading font-normal uppercase select-none text-[#0A0A0A] min-w-0 truncate text-[24px] sm:text-[28px] leading-[28px] tracking-[2px]">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-[12px] font-body font-bold leading-[18px] uppercase tracking-[2px] text-[#999999] hover:text-sortd-pink transition-colors whitespace-nowrap flex items-center gap-0.5 select-none"
            >
              <span>VIEW ALL</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#999999] stroke-[2.5px] relative" />
            </Link>
          )}
          {children}
        </div>
      </div>

      {subtitle && <p className="text-xs sm:text-sm text-sortd-grey font-medium pl-4">{subtitle}</p>}
    </div>
  );
}
