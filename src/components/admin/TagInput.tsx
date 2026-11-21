"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  /** Existing values to suggest (e.g. all tags used across articles). */
  suggestions?: string[];
  max?: number;
  ariaLabel?: string;
}

const normalize = (s: string) => s.trim().replace(/\s+/g, " ");

export default function TagInput({ value, onChange, placeholder, suggestions = [], max = 20, ariaLabel }: TagInputProps) {
  const [draft, setDraft] = useState("");
  const listId = React.useId();

  const add = (raw: string) => {
    const parts = raw.split(",").map(normalize).filter(Boolean);
    if (!parts.length) return;
    const next = [...value];
    for (const p of parts) {
      if (next.length >= max) break;
      if (!next.some((t) => t.toLowerCase() === p.toLowerCase())) next.push(p);
    }
    onChange(next);
    setDraft("");
  };

  return (
    <div className="w-full min-h-[44px] px-2 py-1.5 bg-gray-55 border border-gray-200 focus-within:border-sortd-black rounded-[8px] flex flex-wrap items-center gap-1.5">
      {value.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full bg-sortd-black text-white text-[11px] font-semibold">
          {t}
          <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((x) => x !== t))} className="w-4 h-4 rounded-full hover:bg-white/20 flex items-center justify-center">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        list={suggestions.length ? listId : undefined}
        aria-label={ariaLabel}
        value={draft}
        placeholder={value.length >= max ? `Maximum ${max}` : placeholder}
        disabled={value.length >= max}
        onChange={(e) => {
          const v = e.target.value;
          if (v.endsWith(",")) add(v);
          else setDraft(v);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(draft);
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => draft && add(draft)}
        className="flex-1 min-w-[120px] bg-transparent px-1 py-1 text-xs font-semibold text-sortd-black placeholder:text-gray-400 focus:outline-none"
      />
      {suggestions.length > 0 && (
        <datalist id={listId}>
          {suggestions.filter((s) => !value.includes(s)).map((s) => <option key={s} value={s} />)}
        </datalist>
      )}
    </div>
  );
}
