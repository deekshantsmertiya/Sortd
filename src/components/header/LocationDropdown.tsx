"use client";

import React, { useState } from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOCATIONS = [
  { id: "dubai", name: "Dubai", isCurrent: true },
  { id: "abu-dhabi", name: "Abu Dhabi", isCurrent: false },
  { id: "sharjah", name: "Sharjah", isCurrent: false },
  { id: "ras-al-khaimah", name: "Ras Al Khaimah", isCurrent: false },
];

export default function LocationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(LOCATIONS[0]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-sortd-black bg-sortd-off-white text-xs font-semibold text-sortd-black transition-all"
        aria-expanded={isOpen}
      >
        <MapPin className="w-3.5 h-3.5 text-sortd-black fill-sortd-yellow" />
        <span>{selected.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
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
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-sortd-md p-1.5 z-50"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-sortd-grey border-b border-gray-100 mb-1">
              Select City
            </div>
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  setSelected(loc);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
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
    </div>
  );
}
