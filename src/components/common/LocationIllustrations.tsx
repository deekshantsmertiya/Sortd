"use client";

import React from "react";

// Symmetrical hand-drawn sketch-style black line illustrations of UAE landmarks

export function AtlantisIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Ground/Water line */}
      <line x1="10" y1="120" x2="290" y2="120" stroke="#111111" strokeWidth="2.5" />
      
      {/* Water ripples under the ground line */}
      <path d="M 20 125 C 40 123, 60 127, 80 125 C 100 123, 120 127, 140 125 C 160 123, 180 127, 200 125 C 220 123, 240 127, 260 125" stroke="#111111" strokeWidth="1" strokeLinecap="round" />
      <path d="M 40 129 C 65 128, 90 130, 115 129 C 140 128, 165 130, 190 129 C 215 128, 240 130, 265 129" stroke="#111111" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
      
      {/* Main Bridge/Base structure */}
      <path d="M 30 120 L 30 115 L 270 115 L 270 120 Z" fill="#111111" opacity="0.1" />
      <line x1="30" y1="115" x2="270" y2="115" stroke="#111111" strokeWidth="1.5" />
      
      {/* Central Arch Portal */}
      <path d="M 132 115 L 132 75 C 132 60, 168 60, 168 75 L 168 115 Z" stroke="#111111" strokeWidth="2" fill="none" />
      <path d="M 137 115 L 137 78 C 137 66, 163 66, 163 78 L 163 115" stroke="#111111" strokeWidth="1" opacity="0.6" />
      <rect x="141" y="55" width="18" height="10" stroke="#111111" strokeWidth="1.5" />
      <line x1="150" y1="55" x2="150" y2="65" stroke="#111111" strokeWidth="1" />
      
      {/* Central Tower cap */}
      <path d="M 125 50 L 175 50 L 170 38 L 130 38 Z" stroke="#111111" strokeWidth="2" fill="#111111" fillOpacity="0.05" />
      <line x1="125" y1="50" x2="175" y2="50" stroke="#111111" strokeWidth="2" />
      <path d="M 140 38 L 150 20 L 160 38 Z" stroke="#111111" strokeWidth="1.5" />
      
      {/* Left Wing (Stepped Towers) */}
      <rect x="108" y="60" width="24" height="55" stroke="#111111" strokeWidth="1.8" />
      <line x1="114" y1="65" x2="114" y2="110" stroke="#111111" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="120" y1="65" x2="120" y2="110" stroke="#111111" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="126" y1="65" x2="126" y2="110" stroke="#111111" strokeWidth="1" strokeDasharray="2 3" />
      
      <rect x="86" y="68" width="22" height="47" stroke="#111111" strokeWidth="1.8" />
      <line x1="92" y1="73" x2="92" y2="110" stroke="#111111" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="97" y1="73" x2="97" y2="110" stroke="#111111" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="102" y1="73" x2="102" y2="110" stroke="#111111" strokeWidth="1" strokeDasharray="2 3" />
      
      <rect x="62" y="78" width="24" height="37" stroke="#111111" strokeWidth="1.8" />
      <rect x="42" y="88" width="20" height="27" stroke="#111111" strokeWidth="1.8" />
      
      {/* Right Wing (Symmetrical) */}
      <rect x="168" y="60" width="24" height="55" stroke="#111111" strokeWidth="1.8" />
      <line x1="174" y1="65" x2="174" y2="110" stroke="#111111" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="180" y1="65" x2="180" y2="110" stroke="#111111" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="186" y1="65" x2="186" y2="110" stroke="#111111" strokeWidth="1" strokeDasharray="2 3" />
      
      <rect x="192" y="68" width="22" height="47" stroke="#111111" strokeWidth="1.8" />
      <line x1="198" y1="73" x2="198" y2="110" stroke="#111111" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="203" y1="73" x2="203" y2="110" stroke="#111111" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="208" y1="73" x2="208" y2="110" stroke="#111111" strokeWidth="1" strokeDasharray="2 3" />
      
      <rect x="214" y="78" width="24" height="37" stroke="#111111" strokeWidth="1.8" />
      <rect x="238" y="88" width="20" height="27" stroke="#111111" strokeWidth="1.8" />
      
      {/* Tower roofs (domes/spires) */}
      <path d="M 112 60 L 120 48 L 128 60 Z" stroke="#111111" strokeWidth="1.5" />
      <path d="M 90 68 L 97 58 L 104 68 Z" stroke="#111111" strokeWidth="1.5" />
      <path d="M 66 78 L 74 70 L 82 78 Z" stroke="#111111" strokeWidth="1.5" />
      
      <path d="M 172 60 L 180 48 L 188 60 Z" stroke="#111111" strokeWidth="1.5" />
      <path d="M 196 68 L 203 58 L 210 68 Z" stroke="#111111" strokeWidth="1.5" />
      <path d="M 218 78 L 226 70 L 234 78 Z" stroke="#111111" strokeWidth="1.5" />
    </svg>
  );
}

export function MosqueIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Ground/Floor line */}
      <line x1="10" y1="120" x2="290" y2="120" stroke="#111111" strokeWidth="2.5" />
      
      {/* Water reflection ripples */}
      <path d="M 30 124 C 60 123, 90 126, 120 124 C 150 123, 180 126, 210 124 C 240 123, 270 126, 280 124" stroke="#111111" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      
      {/* Left Main Minaret */}
      <line x1="45" y1="120" x2="45" y2="25" stroke="#111111" strokeWidth="2" />
      <line x1="49" y1="120" x2="49" y2="25" stroke="#111111" strokeWidth="2" />
      <rect x="43" y="110" width="8" height="10" fill="#111111" />
      <rect x="44" y="80" width="6" height="5" stroke="#111111" strokeWidth="1.5" />
      <rect x="44" y="50" width="6" height="5" stroke="#111111" strokeWidth="1.5" />
      <path d="M 43 25 L 47 12 L 51 25 Z" stroke="#111111" strokeWidth="1.5" fill="#111111" />
      
      {/* Right Main Minaret */}
      <line x1="251" y1="120" x2="251" y2="25" stroke="#111111" strokeWidth="2" />
      <line x1="255" y1="120" x2="255" y2="25" stroke="#111111" strokeWidth="2" />
      <rect x="249" y="110" width="8" height="10" fill="#111111" />
      <rect x="250" y="80" width="6" height="5" stroke="#111111" strokeWidth="1.5" />
      <rect x="250" y="50" width="6" height="5" stroke="#111111" strokeWidth="1.5" />
      <path d="M 249 25 L 253 12 L 257 25 Z" stroke="#111111" strokeWidth="1.5" fill="#111111" />
      
      {/* Central Main Dome */}
      <path d="M 120 120 L 120 85 C 120 50, 180 50, 180 85 L 180 120 Z" stroke="#111111" strokeWidth="2" fill="none" />
      <path d="M 120 85 C 120 40, 150 32, 150 20 C 150 32, 180 40, 180 85" stroke="#111111" strokeWidth="1.5" />
      <circle cx="150" cy="15" r="2.5" stroke="#111111" strokeWidth="1" fill="#111111" />
      <line x1="150" y1="15" x2="150" y2="20" stroke="#111111" strokeWidth="1.5" />
      
      {/* Left Dome */}
      <path d="M 80 120 L 80 95 C 80 75, 115 75, 115 95 L 115 120" stroke="#111111" strokeWidth="1.8" />
      <path d="M 80 95 C 80 65, 97.5 60, 97.5 50 C 97.5 60, 115 65, 115 95" stroke="#111111" strokeWidth="1.2" />
      <circle cx="97.5" cy="47" r="1.5" stroke="#111111" strokeWidth="0.8" fill="#111111" />
      
      {/* Right Dome */}
      <path d="M 185 120 L 185 95 C 185 75, 220 75, 220 95 L 220 120" stroke="#111111" strokeWidth="1.8" />
      <path d="M 185 95 C 185 65, 202.5 60, 202.5 50 C 202.5 60, 220 65, 220 95" stroke="#111111" strokeWidth="1.2" />
      <circle cx="202.5" cy="47" r="1.5" stroke="#111111" strokeWidth="0.8" fill="#111111" />
      
      {/* Arcade / Pillars arches along the bottom */}
      <path d="M 58 120 L 58 102 C 58 97, 68 97, 68 102 L 68 120" stroke="#111111" strokeWidth="1.2" />
      <path d="M 68 120 L 68 102 C 68 97, 78 97, 78 102 L 78 120" stroke="#111111" strokeWidth="1.2" />
      <path d="M 222 120 L 222 102 C 222 97, 232 97, 232 102 L 232 120" stroke="#111111" strokeWidth="1.2" />
      <path d="M 232 120 L 232 102 C 232 97, 242 97, 242 102 L 242 120" stroke="#111111" strokeWidth="1.2" />
      
      {/* Central main arches */}
      <path d="M 125 120 L 125 105 C 125 97, 137 97, 137 105 L 137 120" stroke="#111111" strokeWidth="1.5" />
      <path d="M 137 120 L 137 102 C 137 94, 149 94, 149 102 L 149 120" stroke="#111111" strokeWidth="1.5" />
      <path d="M 151 120 L 151 102 C 151 94, 163 94, 163 102 L 163 120" stroke="#111111" strokeWidth="1.5" />
      <path d="M 163 120 L 163 105 C 163 97, 175 97, 175 105 L 175 120" stroke="#111111" strokeWidth="1.5" />
    </svg>
  );
}

export function SoukIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Ground/Water line */}
      <line x1="10" y1="120" x2="290" y2="120" stroke="#111111" strokeWidth="2.5" />
      
      {/* Ground reflection */}
      <path d="M 40 124 C 70 123, 100 125, 130 124 C 160 123, 190 125, 220 124" stroke="#111111" strokeWidth="0.8" opacity="0.6" />
      
      {/* Central Vault Section */}
      <path d="M 110 120 L 110 80 C 110 50, 190 50, 190 80 L 190 120 Z" stroke="#111111" strokeWidth="2.2" fill="none" />
      <path d="M 120 80 C 120 60, 180 60, 180 80" stroke="#111111" strokeWidth="1" strokeDasharray="3 3" />
      <path d="M 130 80 C 130 68, 170 68, 170 80" stroke="#111111" strokeWidth="1.2" />
      
      {/* Central Clock / Window Motif */}
      <circle cx="150" cy="78" r="10" stroke="#111111" strokeWidth="1.5" />
      <line x1="150" y1="68" x2="150" y2="88" stroke="#111111" strokeWidth="1" />
      <line x1="140" y1="78" x2="160" y2="78" stroke="#111111" strokeWidth="1" />
      
      {/* Left Wind Tower (Barjeel) */}
      <rect x="70" y="50" width="28" height="70" stroke="#111111" strokeWidth="2.2" fill="none" />
      <rect x="75" y="60" width="4" height="25" stroke="#111111" strokeWidth="1" fill="#111111" />
      <rect x="82" y="60" width="4" height="25" stroke="#111111" strokeWidth="1" fill="#111111" />
      <rect x="89" y="60" width="4" height="25" stroke="#111111" strokeWidth="1" fill="#111111" />
      <path d="M 66 50 L 102 50 L 98 42 L 70 42 Z" stroke="#111111" strokeWidth="2" fill="#111111" />
      <path d="M 80 42 L 84 25 L 88 42" stroke="#111111" strokeWidth="1.5" />
      
      {/* Right Wind Tower (Barjeel) */}
      <rect x="202" y="50" width="28" height="70" stroke="#111111" strokeWidth="2.2" fill="none" />
      <rect x="207" y="60" width="4" height="25" stroke="#111111" strokeWidth="1" fill="#111111" />
      <rect x="214" y="60" width="4" height="25" stroke="#111111" strokeWidth="1" fill="#111111" />
      <rect x="221" y="60" width="4" height="25" stroke="#111111" strokeWidth="1" fill="#111111" />
      <path d="M 198 50 L 234 50 L 230 42 L 202 42 Z" stroke="#111111" strokeWidth="2" fill="#111111" />
      <path d="M 212 42 L 216 25 L 220 42" stroke="#111111" strokeWidth="1.5" />
      
      {/* Left Wing building */}
      <rect x="30" y="85" width="40" height="35" stroke="#111111" strokeWidth="1.8" />
      <path d="M 38 120 L 38 100 C 38 95, 48 95, 48 100 L 48 120" stroke="#111111" strokeWidth="1.2" />
      <path d="M 52 120 L 52 100 C 52 95, 62 95, 62 100 L 62 120" stroke="#111111" strokeWidth="1.2" />
      
      {/* Right Wing building */}
      <rect x="230" y="85" width="40" height="35" stroke="#111111" strokeWidth="1.8" />
      <path d="M 238 120 L 238 100 C 238 95, 248 95, 248 100 L 248 120" stroke="#111111" strokeWidth="1.2" />
      <path d="M 252 120 L 252 100 C 252 95, 262 95, 262 100 L 262 120" stroke="#111111" strokeWidth="1.2" />
      
      {/* Central arched entryway */}
      <path d="M 135 120 L 135 98 C 135 88, 165 88, 165 98 L 165 120 Z" stroke="#111111" strokeWidth="1.8" fill="#111111" fillOpacity="0.05" />
      <path d="M 140 120 L 140 102 C 140 94, 160 94, 160 102 L 160 120" stroke="#111111" strokeWidth="1" />
    </svg>
  );
}

export function FortIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Mountains in background */}
      <path d="M 15 110 L 80 50 L 130 85 L 190 35 L 250 90 L 285 110" stroke="#111111" strokeWidth="1" strokeLinejoin="round" opacity="0.4" />
      <path d="M 50 110 L 110 70 L 160 95 L 210 55 L 260 110" stroke="#111111" strokeWidth="0.8" strokeLinejoin="round" opacity="0.3" />
      
      {/* Ground/Rock hill */}
      <path d="M 10 120 C 80 120, 120 100, 200 100 C 240 100, 260 120, 290 120" stroke="#111111" strokeWidth="2.5" fill="none" />
      
      {/* Fort Tower sitting on the hill */}
      <rect x="135" y="48" width="30" height="52" stroke="#111111" strokeWidth="2" fill="none" />
      <path d="M 133 48 L 133 42 L 138 42 L 138 48 L 143 48 L 143 42 L 148 42 L 148 48 L 153 48 L 153 42 L 158 42 L 158 48 L 163 48 L 163 42 L 168 42 L 168 48 L 173 48 L 173 42 L 177 42 L 177 48" stroke="#111111" strokeWidth="1.8" />
      
      {/* Watchtower windows / loopholes */}
      <rect x="142" y="58" width="4" height="8" stroke="#111111" strokeWidth="1" fill="#111111" />
      <rect x="154" y="58" width="4" height="8" stroke="#111111" strokeWidth="1" fill="#111111" />
      <rect x="148" y="76" width="4" height="8" stroke="#111111" strokeWidth="1" fill="#111111" />
      
      {/* Steps leading up the hill */}
      <path d="M 115 110 L 125 110 M 117 106 L 127 106 M 119 102 L 129 102 M 121 98 L 131 98 M 123 94 L 133 94 M 125 90 L 135 90" stroke="#111111" strokeWidth="1.2" />
      
      {/* Outer Fort Walls */}
      <path d="M 105 108 L 135 85" stroke="#111111" strokeWidth="2" />
      <path d="M 105 108 L 105 113" stroke="#111111" strokeWidth="1.5" />
      <path d="M 165 85 L 195 98 L 210 110" stroke="#111111" strokeWidth="2" />
      
      {/* Flag pole */}
      <line x1="168" y1="42" x2="168" y2="20" stroke="#111111" strokeWidth="1.5" />
      <path d="M 168 20 L 178 24 L 168 28 Z" fill="#111111" stroke="#111111" strokeWidth="1" />
    </svg>
  );
}
