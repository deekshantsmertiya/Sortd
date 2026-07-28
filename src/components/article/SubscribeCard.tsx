"use client";

import React, { useState } from "react";
import { Gift, CheckCircle, ArrowRight } from "lucide-react";

export default function SubscribeCard() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-sortd-yellow border border-sortd-black/10 p-6 sm:p-8 text-sortd-black relative overflow-hidden shadow-sortd-md">
      <div className="max-w-xl mx-auto flex flex-col items-center text-center">
        {/* Gift Icon Badge */}
        <div className="w-12 h-12 rounded-full bg-sortd-black text-sortd-yellow flex items-center justify-center mb-4 shadow-md">
          <Gift className="w-6 h-6" />
        </div>

        <h3 className="font-heading font-extrabold text-2xl sm:text-3xl uppercase tracking-wider mb-2">
          STAY SORTD. SUBSCRIBE NOW
        </h3>

        <p className="text-xs sm:text-sm font-medium text-sortd-black/85 mb-6 max-w-md">
          Get Dubai&apos;s 60-second news highlights, hidden dining spots, and cultural drops straight to your inbox every morning.
        </p>

        {subscribed ? (
          <div className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-sortd-black text-white font-heading font-bold text-sm">
            <CheckCircle className="w-5 h-5 text-sortd-yellow" />
            <span>YOU&apos;RE IN! WELCOME TO SORTD DUBAI.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-grow">
              <Gift className="w-4 h-4 text-sortd-grey absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white border border-sortd-black/10 text-xs sm:text-sm font-medium text-sortd-black placeholder:text-sortd-grey focus:outline-none focus:ring-2 focus:ring-sortd-black"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-full bg-sortd-black text-white font-heading font-extrabold text-xs tracking-wider uppercase hover:bg-sortd-pink transition-colors shadow-md flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              <span>SUBSCRIBE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-[11px] font-medium text-sortd-black/70 mt-4">
          No spam, ever. Unsubscribe with one click anytime.
        </p>
      </div>
    </div>
  );
}
