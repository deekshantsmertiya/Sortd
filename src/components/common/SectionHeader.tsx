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
}

export default function SectionHeader({
  title,
  viewAllHref = "#",
  accentColor = "yellow",
  subtitle,
  className = "",
  children,
}: SectionHeaderProps) {
  const accentClasses = {
    yellow: "bg-sortd-yellow",
    navy: "bg-sortd-navy",
    pink: "bg-sortd-pink",
    black: "bg-sortd-black",
  };

  return (
    <div className={`flex flex-col gap-1 border-b border-gray-100 pb-3 mb-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Vertical Accent Bar */}
          <div className={`w-1.5 h-6 rounded-full ${accentClasses[accentColor]}`} />
          
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-sortd-black tracking-wider uppercase">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-5 sm:gap-6">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-xs sm:text-sm font-heading font-bold uppercase tracking-wider text-sortd-black hover:text-sortd-pink transition-colors whitespace-nowrap"
            >
              VIEW ALL
            </Link>
          )}
          {children}
        </div>
      </div>

      {subtitle && <p className="text-xs sm:text-sm text-sortd-grey font-medium pl-4">{subtitle}</p>}
    </div>
  );
}
