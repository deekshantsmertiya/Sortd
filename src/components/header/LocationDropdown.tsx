"use client";

import React, { useState, useEffect } from "react";
import { MapPin, ChevronDown, Check, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const LOCATIONS = [
  { id: "dubai", name: "Dubai", isCurrent: true },
  { id: "abu-dhabi", name: "Abu Dhabi", isCurrent: false },
  { id: "sharjah", name: "Sharjah", isCurrent: false },
  { id: "ras-al-khaimah", name: "Ras Al Khaimah", isCurrent: false },
];

export default function LocationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(LOCATIONS[0]);
  const [comingSoonLocation, setComingSoonLocation] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="min-w-[100px] h-[30px] rounded-[6px] border-2 border-sortd-yellow bg-transparent hover:bg-sortd-yellow/5 text-sortd-yellow font-body font-bold text-[12px] tracking-[1px] transition-all flex items-center justify-between px-[10px] gap-[6px] flex-shrink-0"
        aria-expanded={isOpen}
      >
        <MapPin className="w-4 h-4 text-sortd-yellow flex-shrink-0" />
        <span className="truncate">{selected.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-sortd-yellow transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div key="dropdown-backdrop" className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
        )}

        {isOpen && (
          <motion.div
            key="dropdown-menu"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-[6px] shadow-sortd-md p-1.5 z-50"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-sortd-grey border-b border-gray-100 mb-1">
              Select City
            </div>
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  if (loc.id !== "dubai") {
                    setComingSoonLocation(loc.name);
                  } else {
                    setSelected(loc);
                  }
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-none transition-colors ${
                  selected.id === loc.id
                    ? "bg-sortd-off-white font-bold text-sortd-black"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-sortd-grey" />
                  {loc.name}
                </span>
                {selected.id === loc.id && <Check className="w-3.5 h-3.5 text-sortd-navy" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coming Soon Modal Popup */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {comingSoonLocation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setComingSoonLocation(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl p-2 select-none"
              >
                <div className="w-full rounded-2xl bg-sortd-yellow border border-sortd-black/10 p-6 sm:p-8 text-sortd-black relative overflow-hidden flex flex-col items-center text-center">
                  {/* Close Button */}
                  <button
                    onClick={() => setComingSoonLocation(null)}
                    className="absolute top-4 right-4 z-20 w-9 h-9 bg-white text-sortd-black hover:bg-gray-100 shadow-md flex items-center justify-center transition-colors rounded-lg focus:outline-none cursor-pointer"
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  {/* MapPin Icon Badge */}
                  <div className="w-12 h-12 rounded-full bg-sortd-black text-sortd-yellow flex items-center justify-center mb-4 shadow-md">
                    <MapPin className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl uppercase tracking-wider mb-2">
                    COMING SOON
                  </h3>
                  
                  <h4 className="font-body font-extrabold text-xs uppercase tracking-[2px] text-sortd-black/70 mb-4">
                    TO {comingSoonLocation}
                  </h4>

                  {/* Description */}
                  <p className="text-xs sm:text-sm font-medium text-sortd-black/85 mb-6 max-w-md leading-relaxed">
                    We are currently curating the absolute best local guides, stories, and cultural highlights for {comingSoonLocation}. Stay tuned!
                  </p>

                  {/* Action Button styled like the subscribe submit button */}
                  <button
                    onClick={() => setComingSoonLocation(null)}
                    className="px-8 py-3.5 rounded-none bg-sortd-black text-white font-body font-bold text-xs tracking-wider uppercase hover:bg-sortd-pink transition-colors shadow-md flex items-center justify-center gap-1.5 flex-shrink-0 focus:outline-none cursor-pointer"
                  >
                    <span>GOT IT</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
