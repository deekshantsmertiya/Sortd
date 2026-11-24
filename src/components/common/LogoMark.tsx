"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoMarkProps {
  variant?: "header" | "hero" | "footer";
  className?: string;
  onClick?: () => void;
}

export default function LogoMark({ variant = "header", className = "", onClick }: LogoMarkProps) {
  const isFooter = variant === "footer";
  
  // Select the appropriate logo image
  const logoSrc = isFooter ? "/Footer.png" : "/header.png";
  const logoAlt = isFooter ? "Sortd Footer Logo" : "Sortd Logo";

  // Define dimensions and styles based on the component variant
  let width = 48;
  let height = 48;
  let imageClassName = "h-[46px] w-[46px] md:h-10 md:w-auto object-contain flex-shrink-0";

  if (variant === "hero") {
    width = 320;
    height = 96;
    imageClassName = "h-16 md:h-20 lg:h-24 w-auto object-contain";
  } else if (variant === "footer") {
    width = 280;
    height = 391;
    imageClassName = "h-12 md:h-16 lg:h-20 w-auto object-contain";
  }

  return (
    <Link href="/" onClick={onClick} className={`inline-flex items-center group ${className}`}>
      <img
        src={logoSrc}
        alt={logoAlt}
        width={width}
        height={height}
        className={imageClassName}
        loading="eager"
      />
    </Link>
  );
}

