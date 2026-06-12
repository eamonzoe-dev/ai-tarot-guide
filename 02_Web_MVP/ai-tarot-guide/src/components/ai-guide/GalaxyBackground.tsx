"use client";

import { useEffect, useState } from "react";

import { DotFieldBackground } from "@/components/ai-guide/DotFieldBackground";
import Galaxy from "@/components/ai-guide/Galaxy/Galaxy";

type GalaxyBackgroundProps = {
  className?: string;
  dotField?: boolean;
  opacity?: number;
};

export function GalaxyBackground({
  className = "",
  dotField = true,
  opacity = 0.18,
}: GalaxyBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function syncPreference() {
      setPrefersReducedMotion(mediaQuery.matches);
    }

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => {
      mediaQuery.removeEventListener("change", syncPreference);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className={`galaxy-background pointer-events-none absolute inset-0 ${className}`}
        style={{
          opacity: prefersReducedMotion ? Math.min(opacity, 0.08) : opacity,
        }}
      >
        <Galaxy
          autoCenterRepulsion={0}
          density={0.72}
          disableAnimation={prefersReducedMotion}
          glowIntensity={0.18}
          hueShift={42}
          mouseInteraction={false}
          mouseRepulsion={false}
          repulsionStrength={0}
          rotationSpeed={prefersReducedMotion ? 0 : 0.025}
          saturation={0}
          speed={prefersReducedMotion ? 0 : 0.35}
          starSpeed={prefersReducedMotion ? 0 : 0.16}
          transparent
          twinkleIntensity={prefersReducedMotion ? 0 : 0.12}
        />
      </div>
      {dotField && <DotFieldBackground />}
    </>
  );
}
