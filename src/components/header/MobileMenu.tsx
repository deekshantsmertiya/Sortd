"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, Mail, MapPin, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LogoMark from "@/components/common/LogoMark";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribeClick?: () => void;
}

const NAV_ITEMS = [
  { label: "NEWS", href: "/#news" },
  { label: "CULTURE", href: "/#culture" },
  { label: "COMMUNITY", href: "/#community" },
  { label: "ABOUT", href: "/#about" },
];

export default function MobileMenu({ isOpen, onClose, onSubscribeClick }: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        />
      )}

      {isOpen && (
        <motion.div
          key="mobile-menu-panel"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl flex flex-col justify-between p-6 lg:hidden"
          style={{ backgroundColor: "#ffffff" }}
        >
          {/* Header Top Row */}
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <LogoMark variant="header" />
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-sortd-off-white text-sortd-black hover:bg-gray-200 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 rounded-xl font-heading font-extrabold text-lg text-sortd-black hover:bg-sortd-off-white transition-all tracking-wider"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-sortd-grey" />
                </Link>
              ))}
            </nav>

            {/* Location Switcher */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="text-xs font-bold text-sortd-grey uppercase tracking-wider mb-2">
                Selected City
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-sortd-off-white border border-gray-200">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <MapPin className="w-4 h-4 text-sortd-black fill-sortd-yellow" />
                  <span>Dubai, UAE</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-sortd-yellow px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Subscribe CTA */}
          <div className="pt-6 border-t border-gray-100">
            <button
              onClick={() => {
                onClose();
                if (onSubscribeClick) onSubscribeClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-sortd-yellow text-sortd-black font-heading font-extrabold text-sm tracking-wider uppercase shadow-sortd-sm hover:bg-sortd-yellow-hover transition-all"
            >
              <Mail className="w-4 h-4" />
              Subscribe Now
            </button>
            <p className="text-center text-[11px] text-sortd-grey mt-3">
              Dubai&apos;s unfiltered take on news, culture & community. Read in 60s.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
