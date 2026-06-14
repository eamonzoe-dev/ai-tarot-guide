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
      <section className="border-t border-[#3d3020] pt-5">
        <h2 className="font-serif text-2xl text-[#f6ecd8]">Email</h2>
        <p className="mt-3 text-sm leading-7 text-[#c8bca6]">
          Contact us at{" "}
          <a
            className="text-[#d9bd80] underline-offset-4 transition hover:text-[#f6ecd8] hover:underline"
            href="mailto:support@oraarcana.com"
          >
            support@oraarcana.com
          </a>
          .
        </p>
      </section>

      <section className="border-t border-[#3d3020] pt-5">
        <h2 className="font-serif text-2xl text-[#f6ecd8]">You can contact us about</h2>
        <ul className="mt-3 grid gap-2 text-sm leading-7 text-[#c8bca6]">
          <li>Account questions</li>
          <li>Deck code issues</li>
          <li>Data deletion requests</li>
          <li>Product feedback</li>
        </ul>
      </section>

      <section className="border-t border-[#3d3020] pt-5">
        <h2 className="font-serif text-2xl text-[#f6ecd8]">No contact form yet</h2>
        <p className="mt-3 text-sm leading-7 text-[#c8bca6]">
          A dedicated support form may be added later. For now, email is the
          simplest way to reach Ora Arcana.
        </p>
      </section>
    </TrustPageShell>
  );
}
