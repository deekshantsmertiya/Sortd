"use client";

import React from "react";

// Hand-drawn sketch-style yellow/black line illustrations of Dubai landmarks
export function MuseumOfTheFutureArt({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background yellow subtle aura */}
      <ellipse cx="150" cy="110" rx="100" ry="60" fill="#F5C518" opacity="0.35" />
      
      {/* Toroid Ring outline (Museum of the Future shape) */}
      <ellipse cx="150" cy="100" rx="90" ry="55" stroke="#111111" strokeWidth="4" strokeDasharray="3 3" />
      <ellipse cx="150" cy="100" rx="50" ry="30" stroke="#111111" strokeWidth="3" />
      
      {/* Arabic Calligraphy Lines effect */}
      <path d="M 90 90 Q 120 75 150 95 T 210 90" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 80 110 Q 130 125 180 105 T 220 115" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
      <path d="M 100 80 Q 150 65 200 85" stroke="#1C2B6B" strokeWidth="2.5" />
      
      {/* Ground support pedestals */}
      <path d="M 70 145 L 85 180 M 230 145 L 215 180" stroke="#111111" strokeWidth="3" />
      <line x1="40" y1="180" x2="260" y2="180" stroke="#111111" strokeWidth="4" />
      
      {/* Decorative sunburst rays */}
      <circle cx="150" cy="100" r="6" fill="#F5C518" stroke="#111111" strokeWidth="2" />
    </svg>
  );
}

export function DubaiFrameArt({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background yellow subtle aura */}
      <rect x="80" y="30" width="140" height="130" fill="#F5C518" opacity="0.3" rx="10" />
      
      {/* Outer Golden Frame border */}
      <rect x="90" y="25" width="120" height="150" stroke="#111111" strokeWidth="4" rx="4" />
      <rect x="105" y="40" width="90" height="120" stroke="#111111" strokeWidth="3" />
      
      {/* Cladding Geometric pattern lines */}
      <line x1="90" y1="25" x2="105" y2="40" stroke="#111111" strokeWidth="2" />
      <line x1="210" y1="25" x2="195" y2="40" stroke="#111111" strokeWidth="2" />
      <line x1="90" y1="175" x2="105" y2="160" stroke="#111111" strokeWidth="2" />
      <line x1="210" y1="175" x2="195" y2="160" stroke="#111111" strokeWidth="2" />
      
      {/* Skywalk glass bridge top */}
      <line x1="105" y1="50" x2="195" y2="50" stroke="#E8447C" strokeWidth="3" />
      
      {/* Ground line */}
      <line x1="40" y1="180" x2="260" y2="180" stroke="#111111" strokeWidth="4" />
    </svg>
  );
}

export function BurjKhalifaSkylineArt({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Yellow background sun */}
      <circle cx="200" cy="90" r="70" fill="#F5C518" opacity="0.4" />
      
      {/* Burj Khalifa Spire (Center) */}
      <path d="M 195 10 L 205 10 L 203 50 L 210 50 L 208 90 L 215 90 L 212 180 L 188 180 L 192 90 L 190 90 L 197 50 L 195 50 Z" fill="#111111" />
      
      {/* Surrounding High Rises */}
      {/* Left Tower */}
      <rect x="130" y="80" width="35" height="100" fill="#1C2B6B" opacity="0.9" />
      <polygon points="130,80 147,60 165,80" fill="#1C2B6B" />
      
      {/* Far Left Tower */}
      <rect x="80" y="110" width="30" height="70" fill="#111111" opacity="0.8" />
      
      {/* Right Tower */}
      <rect x="235" y="70" width="40" height="110" fill="#E8447C" opacity="0.8" />
      <polygon points="235,70 255,45 275,70" fill="#E8447C" />
      
      {/* Far Right Tower */}
      <rect x="295" y="100" width="30" height="80" fill="#111111" opacity="0.7" />
      
      {/* Ground horizon */}
      <line x1="20" y1="180" x2="380" y2="180" stroke="#111111" strokeWidth="4" />
    </svg>
  );
}
