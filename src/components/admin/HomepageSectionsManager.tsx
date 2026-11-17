"use client";

import React, { useEffect, useState } from "react";
import { GripVertical, Monitor, Smartphone, ArrowUp, ArrowDown, RotateCcw, MapPin, Save } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import TagInput from "@/components/admin/TagInput";
import {
  HOME_SECTIONS, DEFAULT_HOME_SECTIONS, SECTION_TEXT_DEFAULTS, getHomeSections, saveHomeSections, type HomeSectionConfig,
  PAGE_SEO_META, getPageSeo, savePageSeo, type PageKey, type PageSeo,
} from "@/lib/siteSettings";

function Toggle({ checked, onChange, label, icon }: { checked: boolean; onChange: (v: boolean) => void; label: string; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-1.5 h-8 pl-2 pr-1 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-colors ${checked ? "bg-sortd-black text-white border-sortd-black" : "bg-white text-sortd-grey border-gray-200 hover:border-gray-400"}`}
    >
      {icon}
      <span className="hidden sm:inline">{label.split(" ")[0]}</span>
      <span className={`w-9 h-5 rounded-full relative transition-colors ${checked ? "bg-sortd-yellow" : "bg-gray-200"}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? "left-[18px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

export default function HomepageSectionsManager({ onSaved }: { onSaved?: (msg: string) => void }) {
  const queryClient = useQueryClient();
  const [list, setList] = useState<HomeSectionConfig[]>(DEFAULT_HOME_SECTIONS);
  const [dirty, setDirty] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  /** Only the grip handle starts a drag, so text in the row stays selectable. */
  const [armedId, setArmedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [seo, setSeo] = useState<Record<PageKey, PageSeo>>({ home: {}, latest: {}, news: {} });
  const [seoDirty, setSeoDirty] = useState(false);

  useEffect(() => {
    setList(getHomeSections());
    setSeo(getPageSeo());
  }, []);

  const update = (next: HomeSectionConfig[]) => { setList(next); setDirty(true); };
  const move = (from: number, to: number) => {
    if (to < 0 || to >= list.length || from === to) return;
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    update(next);
  };

  const save = () => {
    try {
      saveHomeSections(list);
      queryClient.invalidateQueries({ queryKey: ["home_sections"] });
      setDirty(false);
      setError("");
      onSaved?.("Homepage sections saved.");
    } catch (e) {
      setError(`Couldn't save: ${(e as Error).message}`);
    }
  };

  const saveSeo = () => {
    try {
      savePageSeo(seo);
      queryClient.invalidateQueries({ queryKey: ["page_seo"] });
      setSeoDirty(false);
      onSaved?.("Page SEO saved.");
    } catch (e) {
      setError(`Couldn't save SEO: ${(e as Error).message}`);
    }
  };

  const setPage = (key: PageKey, patch: Partial<PageSeo>) => {
    setSeo((s) => ({ ...s, [key]: { ...s[key], ...patch } }));
    setSeoDirty(true);
  };

  return (
    <div className="flex flex-col gap-10">
      {/* ---------------- Sections ---------------- */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-heading font-normal text-3xl uppercase tracking-wider">Homepage Sections</h2>
            <p className="text-xs text-sortd-grey font-medium mt-1 max-w-xl">
              Drag the handle (or use the arrows) to change the order from top to bottom. Show or hide each section separately on desktop (1024px and wider) and on mobile &amp; tablet.
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => update(DEFAULT_HOME_SECTIONS)} className="h-10 px-4 rounded-[8px] border border-gray-200 hover:bg-gray-100 text-sortd-grey text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" />Reset</button>
            <button type="button" onClick={save} disabled={!dirty} className="h-10 px-5 rounded-[8px] bg-sortd-black text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 disabled:opacity-40"><Save className="w-3.5 h-3.5" />{dirty ? "Save order & visibility" : "Saved"}</button>
          </div>
        </div>
        {error && <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">{error}</div>}

        <ol className="flex flex-col gap-2">
          {list.map((cfg, idx) => {
            const meta = HOME_SECTIONS[cfg.id];
            const hiddenEverywhere = !cfg.showDesktop && !cfg.showMobile;
            return (
              <li
                key={cfg.id}
                draggable={armedId === cfg.id}
                onDragStart={(e) => { setDragId(cfg.id); e.dataTransfer.effectAllowed = "move"; }}
                onDragOver={(e) => { e.preventDefault(); setOverId(cfg.id); }}
                onDragLeave={() => setOverId((o) => (o === cfg.id ? null : o))}
                onDrop={(e) => {
                  e.preventDefault();
                  const from = list.findIndex((s) => s.id === dragId);
                  if (from >= 0) move(from, idx);
                  setDragId(null); setOverId(null);
                }}
                onDragEnd={() => { setDragId(null); setOverId(null); setArmedId(null); }}
                className={`bg-white rounded-xl border p-3 sm:p-4 flex items-start gap-3 transition-all ${dragId === cfg.id ? "opacity-40" : ""} ${overId === cfg.id && dragId !== cfg.id ? "border-sortd-black ring-2 ring-sortd-yellow" : "border-gray-100"} ${hiddenEverywhere ? "bg-gray-50" : ""}`}
              >
                <div className="flex flex-col items-center gap-1 pt-0.5">
                  <span onMouseDown={() => setArmedId(cfg.id)} onMouseUp={() => setArmedId(null)} onTouchStart={() => setArmedId(cfg.id)} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-sortd-black" title="Drag to reorder"><GripVertical className="w-5 h-5" /></span>
                  <span className="text-[10px] font-bold text-sortd-grey tabular-nums">{idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`font-heading text-xl uppercase tracking-wider ${hiddenEverywhere ? "text-gray-400" : ""}`}>{meta.name}</h3>
                    {hiddenEverywhere && <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-[9px] font-bold uppercase tracking-wider">Hidden</span>}
                  </div>
                  <p className="text-xs text-sortd-grey font-medium mt-0.5">{meta.description}</p>
                  <p className="text-[11px] text-sortd-black font-semibold mt-1.5 inline-flex items-center gap-1"><MapPin className="w-3 h-3 text-sortd-pink" />{meta.location}</p>
                  <p className="text-[10px] text-sortd-grey font-medium mt-0.5">Content managed in: {meta.managedIn}</p>
                  {SECTION_TEXT_DEFAULTS[cfg.id] && (
                    <details className="mt-2 group/text">
                      <summary className="cursor-pointer select-none text-[10px] font-bold uppercase tracking-wider text-sortd-pink hover:underline w-fit">Edit heading &amp; intro text</summary>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2" draggable={false} onDragStart={(e) => e.preventDefault()}>
                        <label className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider">Heading</span>
                          <input
                            value={cfg.title ?? ""}
                            placeholder={SECTION_TEXT_DEFAULTS[cfg.id]!.title}
                            maxLength={40}
                            onChange={(e) => update(list.map((s) => (s.id === cfg.id ? { ...s, title: e.target.value } : s)))}
                            className="px-3 py-2 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-semibold uppercase focus:outline-none"
                          />
                        </label>
                        <label className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider">Intro text (optional)</span>
                          <input
                            value={cfg.subtitle ?? SECTION_TEXT_DEFAULTS[cfg.id]!.subtitle ?? ""}
                            placeholder="Shown under the heading. Leave empty for none."
                            maxLength={200}
                            onChange={(e) => update(list.map((s) => (s.id === cfg.id ? { ...s, subtitle: e.target.value } : s)))}
                            className="px-3 py-2 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium focus:outline-none"
                          />
                        </label>
                      </div>
                    </details>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                  <Toggle checked={cfg.showDesktop} onChange={(v) => update(list.map((s) => (s.id === cfg.id ? { ...s, showDesktop: v } : s)))} label="Desktop visibility" icon={<Monitor className="w-3.5 h-3.5" />} />
                  <Toggle checked={cfg.showMobile} onChange={(v) => update(list.map((s) => (s.id === cfg.id ? { ...s, showMobile: v } : s)))} label="Mobile visibility" icon={<Smartphone className="w-3.5 h-3.5" />} />
                  <div className="flex gap-1">
                    <button type="button" aria-label={`Move ${meta.name} up`} disabled={idx === 0} onClick={() => move(idx, idx - 1)} className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                    <button type="button" aria-label={`Move ${meta.name} down`} disabled={idx === list.length - 1} onClick={() => move(idx, idx + 1)} className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ---------------- Page SEO ---------------- */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-heading font-normal text-3xl uppercase tracking-wider">Page SEO</h2>
            <p className="text-xs text-sortd-grey font-medium mt-1">Search-engine title, description and keywords for the main pages. Each article has its own SEO settings in the article editor.</p>
          </div>
          <button type="button" onClick={saveSeo} disabled={!seoDirty} className="h-10 px-5 rounded-[8px] bg-sortd-black text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 disabled:opacity-40"><Save className="w-3.5 h-3.5" />{seoDirty ? "Save page SEO" : "Saved"}</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {(Object.keys(PAGE_SEO_META) as PageKey[]).map((key) => {
            const v = seo[key] || {};
            return (
              <div key={key} className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-3">
                <div>
                  <h3 className="font-heading text-xl uppercase tracking-wider">{PAGE_SEO_META[key].name}</h3>
                  <p className="text-[11px] text-sortd-grey font-semibold">URL: sortd.ae{PAGE_SEO_META[key].path}</p>
                </div>
                <div>
                  <div className="flex justify-between mb-1"><label className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider">Meta Title</label><span className={`text-[10px] font-bold ${(v.metaTitle?.length || 0) > 60 ? "text-red-600" : "text-sortd-grey"}`}>{v.metaTitle?.length || 0}/60</span></div>
                  <input value={v.metaTitle || ""} onChange={(e) => setPage(key, { metaTitle: e.target.value })} className="w-full px-3 py-2 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-semibold focus:outline-none" />
                </div>
                <div>
                  <div className="flex justify-between mb-1"><label className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider">Meta Description</label><span className={`text-[10px] font-bold ${(v.metaDescription?.length || 0) > 160 ? "text-red-600" : "text-sortd-grey"}`}>{v.metaDescription?.length || 0}/160</span></div>
                  <textarea rows={3} value={v.metaDescription || ""} onChange={(e) => setPage(key, { metaDescription: e.target.value })} className="w-full px-3 py-2 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium focus:outline-none resize-y" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1">Keywords</label>
                  <TagInput value={v.keywords || []} onChange={(k) => setPage(key, { keywords: k })} placeholder="Add keyword + Enter" ariaLabel={`${PAGE_SEO_META[key].name} keywords`} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
