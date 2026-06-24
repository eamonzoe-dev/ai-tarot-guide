import type { Metadata } from "next";

import { TrustPageShell } from "@/components/ai-guide/TrustPageShell";

export const metadata: Metadata = {
  title: "Terms of Use | Ora Arcana",
  description: "Terms for using Ora Arcana tarot readings, deck codes, credits, and account features.",
};

export default function TermsPage() {
  return (
    <TrustPageShell
      eyebrow="Terms"
      title="Terms of Use"
      description="By using Ora Arcana, you agree to use the service responsibly and understand its reflective nature."
    >
      <section className="border-t border-[var(--c-border)] pt-5">
        <h2 className="t-h3">Acceptance</h2>
        <p className="caption mt-3">
          By accessing or using Ora Arcana, you accept these terms. If you do
          not agree, please do not use the service.
        </p>
      </section>

      <section className="border-t border-[var(--c-border)] pt-5">
        <h2 className="t-h3">Purpose of the service</h2>
        <p className="caption mt-3">
          Ora Arcana provides tarot-based reflection, entertainment, and
          personal insight. It does not promise predictive accuracy or
          guaranteed future outcomes.
        </p>
      </section>

      <section className="border-t border-[var(--c-border)] pt-5">
        <h2 className="t-h3">No professional advice</h2>
        <p className="caption mt-3">
          Readings should not be used as medical, legal, financial, mental
          health, or other professional advice. Please consult qualified
          professionals for those matters.
        </p>
      </section>

      <section className="border-t border-[var(--c-border)] pt-5">
        <h2 className="t-h3">Credits and deck codes</h2>
        <p className="caption mt-3">
          AI readings may consume credits. Deck activation codes are intended
          for legitimate use by the recipient and should not be shared, resold,
          abused, or used to bypass service limits.
        </p>
      </section>

      <section className="border-t border-[var(--c-border)] pt-5">
        <h2 className="t-h3">Service changes</h2>
        <p className="caption mt-3">
          We may modify, suspend, or discontinue parts of Ora Arcana as the
          product evolves. We may also take action against abuse, API attacks,
          unauthorized access, or attempts to circumvent limits.
        </p>
      </section>
    </TrustPageShell>
  );
}
