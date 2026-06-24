import type { ReactNode } from "react";
import Link from "next/link";

import { ThemeToggle } from "@/components/ai-guide/ThemeToggle";

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
    <main className="ora-page-shell relative min-h-svh overflow-hidden px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
      <section className="ritual-room-container relative mx-auto min-h-svh w-full max-w-4xl px-5 py-6 sm:min-h-0 sm:px-6 sm:py-8">
        <header className="flex items-center justify-between gap-4">
          <Link
            className="btn btn--text text-xs"
            href="/ai-guide"
          >
            Back to Reading Room
          </Link>
          <div className="flex items-center gap-3">
            <p className="wordmark text-lg text-[var(--c-text)]">Ora Arcana</p>
            <ThemeToggle />
          </div>
        </header>

        <section className="mx-auto mt-12 w-full max-w-3xl border-b border-[var(--c-border)] pb-8 sm:mt-16">
          <p className="eyebrow mb-3">
            {eyebrow}
          </p>
          <h1 className="t-h1">
            {title}
          </h1>
          <p className="caption mt-4 max-w-2xl sm:text-base sm:leading-8">
            {description}
          </p>
          <p className="micro mt-4 uppercase">
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
