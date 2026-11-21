"use client";

import React, { useRef, useState } from "react";
import { Upload, Trash2, Loader2, ImageOff } from "lucide-react";

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** Uploads the file and resolves to its URL ("" on failure — the caller shows the error). */
  onUpload: (file: File) => Promise<string>;
  required?: boolean;
  hint?: string;
  /** Tailwind aspect class for the preview box, e.g. "aspect-square". */
  previewClass?: string;
}

/** Image input used across admin forms: preview + upload + paste-a-link + remove. */
export default function ImageField({ label, value, onChange, onUpload, required, hint, previewClass = "aspect-video" }: ImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [broken, setBroken] = useState(false);

  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      const url = await onUpload(file);
      if (url) { setBroken(false); onChange(url); }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider font-body">
        {label}{required && " (Required)"}
      </label>
      <div className="flex gap-3 items-start">
        <div className={`relative w-28 ${previewClass} shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center`}>
          {value && !broken ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" onError={() => setBroken(true)} />
          ) : (
            <span className="flex flex-col items-center gap-1 text-[9px] font-bold uppercase text-gray-400 text-center px-1">
              <ImageOff className="w-4 h-4" />{value ? "Can't load" : "No image"}
            </span>
          )}
          {busy && <span className="absolute inset-0 bg-white/70 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin" /></span>}
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="h-9 px-3 rounded-[8px] bg-sortd-yellow hover:bg-sortd-yellow-hover text-sortd-black text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 disabled:opacity-50">
              <Upload className="w-3.5 h-3.5" />{busy ? "Uploading…" : value ? "Replace" : "Upload"}
            </button>
            {value && (
              <button type="button" onClick={() => { onChange(""); setBroken(false); }} className="h-9 px-3 rounded-[8px] border border-gray-200 hover:bg-red-50 text-red-600 text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" />Remove
              </button>
            )}
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => { setBroken(false); onChange(e.target.value.trim()); }}
            placeholder="…or paste an image link (https://… or /uploads/…)"
            className={`w-full px-3 py-2 bg-gray-55 border ${broken ? "border-red-400" : "border-gray-200"} focus:border-sortd-black rounded-[8px] text-xs font-medium focus:outline-none`}
          />
          {broken && <span className="text-[10px] font-semibold text-red-600">This image link doesn&apos;t load. Check the link or upload the file instead.</span>}
          {hint && !broken && <span className="text-[10px] text-sortd-grey font-medium">{hint}</span>}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
    </div>
  );
}
