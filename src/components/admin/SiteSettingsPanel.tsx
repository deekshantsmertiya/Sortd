"use client";

import React, { useEffect, useState } from "react";
import { Save, RotateCcw, MapPin, Palette, Link2, FileText } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { DEFAULT_SITE_SETTINGS, getSiteSettings, saveSiteSettings, type SiteSettings, type SocialLinks } from "@/lib/siteSettings";

const SOCIAL_FIELDS: { key: keyof SocialLinks; label: string; placeholder: string }[] = [
  { key: "instagram", label: "Instagram", placeholder: "https://www.instagram.com/sortd.dubai" },
  { key: "facebook", label: "Facebook", placeholder: "https://www.facebook.com/sortddubai" },
  { key: "youtube", label: "YouTube", placeholder: "https://www.youtube.com/@sortddubai" },
  { key: "tiktok", label: "TikTok", placeholder: "https://www.tiktok.com/@sortd.dubai" },
  { key: "x", label: "X (Twitter)", placeholder: "https://x.com/sortddubai" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://www.linkedin.com/company/sortd" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "+971 50 000 0000 or https://wa.me/…" },
  { key: "email", label: "Contact email", placeholder: "hello@sortd.ae" },
];

function validateSocial(key: keyof SocialLinks, v: string): string | null {
  if (!v.trim()) return null;
  if (key === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : "Enter a valid email address.";
  if (key === "whatsapp" && /^\+?\d[\d\s-]{6,}$/.test(v.trim())) return null;
  return /^https?:\/\/\S+\.\S+/.test(v.trim()) ? null : "Enter a full link starting with https://";
}

function Card({ icon, title, where, children }: { icon: React.ReactNode; title: string; where: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <div>
        <h3 className="font-heading text-xl uppercase tracking-wider inline-flex items-center gap-2">{icon}{title}</h3>
        <p className="text-[11px] text-sortd-grey font-medium mt-0.5"><span className="font-bold text-sortd-black">Where it appears:</span> {where}</p>
      </div>
      {children}
    </section>
  );
}

export default function SiteSettingsPanel({ onSaved }: { onSaved: (msg: string) => void }) {
  const queryClient = useQueryClient();
  const [v, setV] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setV(getSiteSettings()), []);
  const patch = (p: Partial<SiteSettings>) => { setV((s) => ({ ...s, ...p })); setDirty(true); };
  const patchSocial = (k: keyof SocialLinks, val: string) => { setV((s) => ({ ...s, social: { ...s.social, [k]: val } })); setDirty(true); };

  const socialErrors = SOCIAL_FIELDS.map((f) => [f.key, validateSocial(f.key, v.social[f.key] || "")] as const).filter(([, e]) => e);
  const colorOk = /^#[0-9a-f]{6}$/i.test(v.articleLineColor);

  const save = () => {
    if (!colorOk) return setError("The article line colour must be a hex value like #E8185A.");
    if (!v.about.title.trim() || !v.about.body.trim()) return setError("The About page needs a title and some text.");
    if (socialErrors.length) return setError(`Fix the ${socialErrors.length} highlighted link${socialErrors.length > 1 ? "s" : ""} before saving.`);
    try {
      saveSiteSettings({ ...v, social: Object.fromEntries(Object.entries(v.social).map(([k, x]) => [k, (x || "").trim()])) as SocialLinks });
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      setDirty(false);
      setError("");
      onSaved("Site settings saved. Changes are live on the website.");
    } catch (e) {
      setError(`Couldn't save settings: ${(e as Error).message}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading font-normal text-3xl uppercase tracking-wider">Site Settings</h2>
          <p className="text-xs text-sortd-grey font-medium mt-1">Design colours, footer links and the Locations feature. Click Save to apply.</p>
        </div>
        <button type="button" onClick={save} disabled={!dirty} className="h-10 px-5 rounded-[8px] bg-sortd-black text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 disabled:opacity-40">
          <Save className="w-3.5 h-3.5" />{dirty ? "Save site settings" : "Saved"}
        </button>
      </div>
      {error && <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">{error}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card icon={<Palette className="w-5 h-5" />} title="Article line colour" where="the vertical line (and text) beside pull-quotes inside every article page.">
          <div className="flex flex-wrap items-center gap-3">
            <input type="color" value={colorOk ? v.articleLineColor : "#E8185A"} onChange={(e) => patch({ articleLineColor: e.target.value })} aria-label="Article line colour" className="w-11 h-11 rounded-[8px] border border-gray-200 cursor-pointer p-0" />
            <input value={v.articleLineColor} onChange={(e) => patch({ articleLineColor: e.target.value })} maxLength={7} aria-label="Article line colour hex" className={`w-28 px-3 py-2.5 bg-gray-55 border ${colorOk ? "border-gray-200" : "border-red-400"} rounded-[8px] text-xs font-mono font-bold uppercase focus:outline-none focus:border-sortd-black`} />
            <button type="button" onClick={() => patch({ articleLineColor: DEFAULT_SITE_SETTINGS.articleLineColor })} className="text-[10px] font-bold uppercase tracking-wider text-sortd-pink hover:underline inline-flex items-center gap-1"><RotateCcw className="w-3 h-3" />Reset to pink</button>
          </div>
          {/* Live preview */}
          <blockquote className="pl-4 py-1 font-body font-bold text-[15px] leading-snug" style={{ borderLeft: `4px solid ${colorOk ? v.articleLineColor : "#E8185A"}`, color: colorOk ? v.articleLineColor : "#E8185A" }}>
            “Preview: this is how a pull-quote looks in an article.”
          </blockquote>
        </Card>

        <Card icon={<MapPin className="w-5 h-5" />} title="Locations" where="the Locations section (city cards) near the bottom of the homepage. The city picker has been removed from the header and mobile menu.">
          <label className="flex items-center justify-between gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer">
            <span className="text-xs font-semibold text-sortd-black">{v.locationsEnabled ? "Locations section is enabled" : "Locations section is disabled (hidden everywhere)"}</span>
            <input type="checkbox" checked={v.locationsEnabled} onChange={(e) => patch({ locationsEnabled: e.target.checked })} className="w-5 h-5 accent-sortd-black" />
          </label>
          <p className="text-[10px] text-sortd-grey font-medium">Tip: to show it on only desktop or only mobile, keep this enabled and use the switches in Homepage Sections below.</p>
        </Card>
      </div>

      <Card icon={<FileText className="w-5 h-5" />} title="About page" where="the page at /about, opened by “About” in the header menu, the mobile menu and the footer.">
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider">Page title</span>
          <input value={v.about.title} onChange={(e) => patch({ about: { ...v.about, title: e.target.value } })} maxLength={60} className="w-full px-3 py-2.5 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-semibold focus:outline-none" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider">Text</span>
          <textarea rows={7} value={v.about.body} onChange={(e) => patch({ about: { ...v.about, body: e.target.value } })} className="w-full px-3 py-2.5 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium leading-relaxed focus:outline-none resize-y" />
          <span className="text-[10px] text-sortd-grey font-medium">Leave a blank line between paragraphs.</span>
        </label>
        <a href="/about" target="_blank" rel="noopener noreferrer" className="self-start text-[10px] font-bold uppercase tracking-wider text-sortd-pink hover:underline">Open the About page ↗</a>
      </Card>

      <Card icon={<Link2 className="w-5 h-5" />} title="Footer › Connect links" where="the CONNECT icons in the website footer (desktop and mobile). Leave a field empty to hide that icon.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SOCIAL_FIELDS.map((f) => {
            const err = validateSocial(f.key, v.social[f.key] || "");
            return (
              <label key={f.key} className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider">{f.label}</span>
                <input value={v.social[f.key] || ""} onChange={(e) => patchSocial(f.key, e.target.value)} placeholder={f.placeholder} className={`w-full px-3 py-2.5 bg-gray-55 border ${err ? "border-red-400" : "border-gray-200"} focus:border-sortd-black rounded-[8px] text-xs font-semibold focus:outline-none`} />
                {err && <span className="text-[10px] font-semibold text-red-600">{err}</span>}
              </label>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
