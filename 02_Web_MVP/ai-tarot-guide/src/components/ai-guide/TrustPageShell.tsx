import type { ReactNode } from "react";
import Link from "next/link";

import { GalaxyBackground } from "@/components/ai-guide/GalaxyBackground";

type TrustPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function TrustPageShell({
  eyebrow,
  title,
  description,
  children,
}: TrustPageShellProps) {
  return (
    <main className="atelier-page relative min-h-svh overflow-hidden px-0 py-0 text-[#eee8dd] sm:px-6 sm:py-6 lg:px-8">
      <GalaxyBackground opacity={0.18} />
      <div className="atelier-grain pointer-events-none absolute inset-0" />

      <section className="ritual-room-container relative mx-auto min-h-svh w-full max-w-4xl px-5 py-6 sm:min-h-0 sm:px-6 sm:py-8">
        <header className="flex items-center justify-between gap-4">
          <Link
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9f947f] transition hover:text-[#f6ecd8]"
            href="/ai-guide"
          >
            Back to Reading Room
          </Link>
          <p className="font-serif text-lg text-[#f6ecd8]">Ora Arcana</p>
        </header>

        <section className="mx-auto mt-12 w-full max-w-3xl border-b border-[#3d3020] pb-8 sm:mt-16">
          <p className="atelier-label mb-3 text-[0.68rem] font-semibold">
            {eyebrow}
          </p>
          <h1 className="font-serif text-4xl leading-tight text-[#f6ecd8] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b7aa94] sm:text-base sm:leading-8">
            {description}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[#7d7466]">
            Last updated: 2026
          </p>
        </section>

        <article className="mx-auto mt-8 grid w-full max-w-3xl gap-6 pb-12">
          {children}
        </article>
      </section>
    </main>
  );
}
