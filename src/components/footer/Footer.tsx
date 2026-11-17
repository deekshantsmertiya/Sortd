"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Mail } from "lucide-react";
import { useSiteSettings, DEFAULT_SITE_SETTINGS, type SocialLinks } from "@/lib/siteSettings";
import { useCategories } from "@/hooks/categoryStyles";

/* Brand icons (simple paths, sized by the parent). */
const ICONS: Record<keyof SocialLinks, { label: string; path: string }> = {
  instagram: { label: "Instagram", path: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" },
  facebook: { label: "Facebook", path: "M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" },
  youtube: { label: "YouTube", path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
  tiktok: { label: "TikTok", path: "M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.59c.27 0 .53.04.77.12V9.77a5.7 5.7 0 1 0 4.91 5.63V9.01a7.3 7.3 0 0 0 4.27 1.37V7.29a4.28 4.28 0 0 1-3.21-1.47z" },
  x: { label: "X (Twitter)", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  linkedin: { label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
  whatsapp: { label: "WhatsApp", path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.464 3.488A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.88 11.88 0 0 0 5.71 1.455h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" },
  email: { label: "Email", path: "" },
};

function hrefFor(key: keyof SocialLinks, value: string) {
  if (key === "email") return value.startsWith("mailto:") ? value : `mailto:${value}`;
  if (key === "whatsapp" && /^\+?\d[\d\s-]+$/.test(value)) return `https://wa.me/${value.replace(/\D/g, "")}`;
  return value;
}

function ConnectLinks({ links, className = "" }: { links: SocialLinks; className?: string }) {
  const entries = (Object.keys(ICONS) as (keyof SocialLinks)[]).filter((k) => links[k]?.trim());
  if (!entries.length) return null;
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {entries.map((k) => (
        <a
          key={k}
          href={hrefFor(k, links[k]!.trim())}
          target={k === "email" ? undefined : "_blank"}
          rel={k === "email" ? undefined : "noopener noreferrer"}
          aria-label={ICONS[k].label}
          title={ICONS[k].label}
          className="w-10 h-10 rounded-full bg-white text-black hover:bg-sortd-yellow flex items-center justify-center transition-colors duration-200"
        >
          {k === "email" ? (
            <Mail className="w-[18px] h-[18px]" />
          ) : (
            <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d={ICONS[k].path} /></svg>
          )}
        </a>
      ))}
    </div>
  );
}

export default function Footer() {
  const { data: settings = DEFAULT_SITE_SETTINGS } = useSiteSettings();
  const { data: categories = [] } = useCategories();
  const year = new Date().getFullYear();

  // Real destinations instead of homepage anchors.
  const navLinks = [
    { label: "Latest", href: "/latest" },
    ...categories.slice(0, 4).map((c) => ({
      label: c.name.charAt(0) + c.name.slice(1).toLowerCase(),
      href: `/news?category=${encodeURIComponent(c.name)}`,
    })),
    { label: "About", href: "/about" },
  ];
  // Mobile design lists just the categories + About.
  const mobileLinks = navLinks.filter((l) => l.href !== "/latest");

  return (
    <footer className="bg-[#0A0A0A] text-white pt-8 md:pt-12 pb-5 md:pb-8 border-t border-white/5 w-full max-w-full overflow-x-clip min-w-0">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">

        {/* DESKTOP & TABLET (>= 768px) */}
        <div className="hidden md:flex flex-col items-center text-center gap-5">
          <img src="/Footer.png" alt="Sortd" className="w-[52px] h-auto object-contain" />

          <p className="text-xs text-[#9E9E9E] font-medium leading-relaxed max-w-sm">
            Dubai&apos;s unfiltered take on news, culture &amp; community. Read in 60 seconds.
          </p>

          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 font-body font-bold text-sm text-white">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-sortd-yellow transition-colors">{l.label}</Link>
            ))}
          </nav>

          <div className="w-full h-px bg-white/10 mt-4" />

          <div className="w-full pt-6 grid grid-cols-3 items-center gap-6">
            <div className="text-[11px] text-[#777] font-medium text-left">© {year} Sortd Dubai. All rights reserved.</div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-body font-bold text-[10px] tracking-[3px] text-white/40">CONNECT</span>
              <ConnectLinks links={settings.social} className="justify-center" />
            </div>
            <div className="text-[11px] text-[#777] font-medium flex items-center justify-end gap-1.5">
              <MapPin className="w-3.5 h-3.5 fill-sortd-yellow text-[#0A0A0A]" />
              <span>Dubai, UAE</span>
            </div>
          </div>
        </div>

        {/* MOBILE (< 768px): links + Connect on the left, logo + tagline on the right */}
        <div className="flex md:hidden flex-col gap-6 w-full">
          <div className="flex items-start justify-between gap-4 w-full">
            <div className="flex flex-col gap-6 shrink-0">
              <div>
                <h3 className="font-body font-bold text-[10px] leading-[15px] tracking-[3px] text-white/30 mb-3">SECTIONS</h3>
                <nav aria-label="Footer sections" className="flex flex-col gap-3 font-body font-bold text-[14px] leading-[21px] text-white/60">
                  {mobileLinks.map((l) => (
                    <Link key={l.href} href={l.href} className="hover:text-sortd-yellow transition-colors">{l.label}</Link>
                  ))}
                </nav>
              </div>
              <div>
                <h3 className="font-body font-bold text-[10px] leading-[15px] tracking-[3px] text-white/30 mb-3">CONNECT</h3>
                <ConnectLinks links={settings.social} />
              </div>
            </div>

            <div className="flex flex-col items-start flex-1 min-w-0 max-w-[211px]">
              <img src="/Footer.png" alt="Sortd" className="w-[80px] h-auto object-contain mb-3" />
              <p className="font-body text-[14px] leading-[19.5px] text-white/40">
                Dubai&apos;s unfiltered take on news, culture &amp; community. Read in 60 seconds.
              </p>
            </div>
          </div>

          <div className="w-full text-center pt-4 border-t border-white/5 font-body font-medium text-[11px] text-[#555555]">
            © {year} Sortd Dubai. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
