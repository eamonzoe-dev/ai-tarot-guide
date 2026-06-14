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
      <section className="border-t border-[#3d3020] pt-5">
        <h2 className="font-serif text-2xl text-[#f6ecd8]">Acceptance</h2>
        <p className="mt-3 text-sm leading-7 text-[#c8bca6]">
          By accessing or using Ora Arcana, you accept these terms. If you do
          not agree, please do not use the service.
        </p>
      </section>

      <section className="border-t border-[#3d3020] pt-5">
        <h2 className="font-serif text-2xl text-[#f6ecd8]">Purpose of the service</h2>
        <p className="mt-3 text-sm leading-7 text-[#c8bca6]">
          Ora Arcana provides tarot-based reflection, entertainment, and
          personal insight. It does not promise predictive accuracy or
          guaranteed future outcomes.
        </p>
      </section>

      <section className="border-t border-[#3d3020] pt-5">
        <h2 className="font-serif text-2xl text-[#f6ecd8]">No professional advice</h2>
        <p className="mt-3 text-sm leading-7 text-[#c8bca6]">
          Readings should not be used as medical, legal, financial, mental
          health, or other professional advice. Please consult qualified
          professionals for those matters.
        </p>
      </section>

      <section className="border-t border-[#3d3020] pt-5">
        <h2 className="font-serif text-2xl text-[#f6ecd8]">Credits and deck codes</h2>
        <p className="mt-3 text-sm leading-7 text-[#c8bca6]">
          AI readings may consume credits. Deck activation codes are intended
          for legitimate use by the recipient and should not be shared, resold,
          abused, or used to bypass service limits.
        </p>
      </section>

      <section className="border-t border-[#3d3020] pt-5">
        <h2 className="font-serif text-2xl text-[#f6ecd8]">Service changes</h2>
        <p className="mt-3 text-sm leading-7 text-[#c8bca6]">
          We may modify, suspend, or discontinue parts of Ora Arcana as the
          product evolves. We may also take action against abuse, API attacks,
          unauthorized access, or attempts to circumvent limits.
        </p>
      </section>
    </TrustPageShell>
  );
}
