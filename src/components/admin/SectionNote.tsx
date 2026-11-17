import React from "react";
import { MapPin, Info } from "lucide-react";

/** Standard "what is this / where does it show" note under each admin heading. */
export default function SectionNote({ purpose, where, tip }: { purpose: string; where: string; tip?: string }) {
  return (
    <div className="mt-1.5 flex flex-col gap-1 max-w-3xl">
      <p className="text-xs text-sortd-grey font-medium">{purpose}</p>
      <p className="text-[11px] text-sortd-black font-semibold inline-flex items-start gap-1">
        <MapPin className="w-3.5 h-3.5 text-sortd-pink shrink-0 mt-px" />
        <span><span className="text-sortd-grey">Appears on the website:</span> {where}</span>
      </p>
      {tip && (
        <p className="text-[11px] text-sortd-grey font-medium inline-flex items-start gap-1">
          <Info className="w-3.5 h-3.5 shrink-0 mt-px" />
          <span>{tip}</span>
        </p>
      )}
    </div>
  );
}
