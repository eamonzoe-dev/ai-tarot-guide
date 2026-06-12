"use client";

import { useEffect, useState } from "react";

type ReadingThinkingStateProps = {
  title: string;
  subtitle: string;
};

export function ReadingThinkingState({
  title,
  subtitle,
}: ReadingThinkingStateProps) {
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function syncPreference() {
      setReducedMotion(mediaQuery.matches);
    }

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => {
      mediaQuery.removeEventListener("change", syncPreference);
    };
  }, []);

  return (
    <div className="mt-6 rounded-[1.25rem] border border-[#d9bd80]/24 bg-[linear-gradient(180deg,rgba(12,10,8,0.96),rgba(5,5,6,0.98))] p-5 sm:p-6">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div
          aria-hidden="true"
          className={`relative h-28 w-20 rounded-[1rem] border border-[#d9bd80]/30 bg-[linear-gradient(180deg,rgba(24,18,12,0.96),rgba(8,7,6,0.98))] shadow-[0_0_36px_rgba(217,189,128,0.12)] ${reducedMotion ? "" : "animate-[ritual-card-float_6s_ease-in-out_infinite]"}`}
        >
          <div className="absolute inset-2 rounded-[0.75rem] border border-[#8c724b]/60" />
          <div className="absolute inset-0 rounded-[1rem] bg-[radial-gradient(circle_at_50%_20%,rgba(217,189,128,0.12),transparent_42%),radial-gradient(circle_at_50%_80%,rgba(169,133,82,0.08),transparent_52%)]" />
          <div
            className={`absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d9bd80]/18 ${reducedMotion ? "" : "animate-[ritual-breathe_8s_ease-in-out_infinite]"}`}
          />
          <div
            className={`absolute inset-0 rounded-[1rem] bg-[radial-gradient(circle_at_50%_40%,rgba(217,189,128,0.12),transparent_55%)] ${reducedMotion ? "opacity-50" : "animate-[ritual-breathe_10s_ease-in-out_infinite]"}`}
          />
        </div>

        <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[#bca77f]">
          {title}
        </p>
        <p className="mt-3 max-w-sm text-sm leading-7 text-[#d7d0c5]">
          {subtitle}
        </p>
        <div className="mt-5 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.18em] text-[#8f846f]">
          <span className={`h-1.5 w-1.5 rounded-full bg-[#d9bd80] ${reducedMotion ? "" : "animate-pulse"}`} />
          <span>{title}</span>
          <span className={`h-1.5 w-1.5 rounded-full bg-[#d9bd80] ${reducedMotion ? "" : "animate-pulse"}`} />
        </div>
      </div>
    </div>
  );
}
