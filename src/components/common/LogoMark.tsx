"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoMarkProps {
  variant?: "header" | "hero" | "footer";
  className?: string;
}

export default function LogoMark({ variant = "header", className = "" }: LogoMarkProps) {
  const isFooter = variant === "footer";
  
  // Select the appropriate logo image
  const logoSrc = isFooter ? "/Footer.png" : "/header.png";
  const logoAlt = isFooter ? "Sortd Footer Logo" : "Sortd Logo";

  // Define dimensions and styles based on the component variant
  let width = 160;
  let height = 48;
  let imageClassName = "h-8 md:h-10 w-auto object-contain";

  if (variant === "hero") {
    width = 320;
    height = 96;
    imageClassName = "h-16 md:h-20 lg:h-24 w-auto object-contain";
  } else if (variant === "footer") {
    width = 320;
    height = 96;
    imageClassName = "h-12 md:h-16 lg:h-20 w-auto object-contain";
  }

  return (
    <Link href="/" className={`inline-flex items-center group ${className}`}>
      <Image
        src={logoSrc}
        alt={logoAlt}
        width={width}
        height={height}
        className={imageClassName}
        priority
      />
    </Link>
  );
}

