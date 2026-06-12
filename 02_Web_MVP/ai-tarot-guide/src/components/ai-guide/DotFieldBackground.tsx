"use client";

import { useEffect, useState } from "react";

import { DotField } from "@/components/ai-guide/DotField/DotField";

type DotFieldBackgroundProps = {
  className?: string;
};

export function DotFieldBackground({ className = "" }: DotFieldBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 639px)");

    function syncPreferences() {
      setPrefersReducedMotion(motionQuery.matches);
      setIsMobile(mobileQuery.matches);
    }

    syncPreferences();
    motionQuery.addEventListener("change", syncPreferences);
    mobileQuery.addEventListener("change", syncPreferences);

    return () => {
      motionQuery.removeEventListener("change", syncPreferences);
      mobileQuery.removeEventListener("change", syncPreferences);
    };
  }, []);

  const opacity = prefersReducedMotion ? 0.055 : isMobile ? 0.08 : 0.12;

  return (
    <div
      aria-hidden="true"
      className={`dot-field-background pointer-events-none absolute inset-0 ${className}`}
      style={{ opacity }}
    >
      <DotField
        cursorForce={0}
        cursorRadius={0}
        dotRadius={isMobile ? 1 : 1.15}
        dotSpacing={isMobile ? 30 : 24}
        glowColor="rgba(28, 22, 12, 0.16)"
        glowRadius={isMobile ? 80 : 96}
        gradientFrom="rgba(138, 106, 47, 0.28)"
        gradientTo="rgba(191, 167, 106, 0.18)"
        interactive={false}
        maxDevicePixelRatio={isMobile ? 1 : 1.5}
        paused={prefersReducedMotion}
        sparkle={false}
        waveAmplitude={0}
      />
    </div>
  );
}
