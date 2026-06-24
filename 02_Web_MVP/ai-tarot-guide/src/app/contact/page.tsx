import type { Metadata } from "next";

import { TrustPageShell } from "@/components/ai-guide/TrustPageShell";

export const metadata: Metadata = {
  title: "Contact | Ora Arcana",
  description: "Contact Ora Arcana for support, deck code issues, data requests, and feedback.",
};

export default function ContactPage() {
  return (
    <TrustPageShell
      eyebrow="Contact"
      title="Contact Ora Arcana"
      description="For now, this address is used for product support and data requests."
    >
      <section className="border-t border-[var(--c-border)] pt-5">
        <h2 className="t-h3">Email</h2>
        <p className="caption mt-3">
          Contact us at{" "}
          <a
            className="text-[var(--c-accent-text)] underline-offset-4 transition hover:underline"
            href="mailto:support@oraarcana.com"
          >
            support@oraarcana.com
          </a>
          .
        </p>
      </section>

      <section className="border-t border-[var(--c-border)] pt-5">
        <h2 className="t-h3">You can contact us about</h2>
        <ul className="caption mt-3 grid gap-2">
          <li>Account questions</li>
          <li>Deck code issues</li>
          <li>Data deletion requests</li>
          <li>Product feedback</li>
        </ul>
      </section>

      <section className="border-t border-[var(--c-border)] pt-5">
        <h2 className="t-h3">No contact form yet</h2>
        <p className="caption mt-3">
          A dedicated support form may be added later. For now, email is the
          simplest way to reach Ora Arcana.
        </p>
      </section>
    </TrustPageShell>
  );
}
