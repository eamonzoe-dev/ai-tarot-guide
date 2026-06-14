import type { Metadata } from "next";

import { TrustPageShell } from "@/components/ai-guide/TrustPageShell";

export const metadata: Metadata = {
  title: "AI / Entertainment Disclaimer | Ora Arcana",
  description: "Important limits for Ora Arcana AI-assisted tarot readings.",
};

export default function DisclaimerPage() {
  return (
    <TrustPageShell
      eyebrow="Disclaimer"
      title="AI / Entertainment Disclaimer"
      description="Ora Arcana readings are designed as symbolic prompts for reflection, not instructions or guarantees."
    >
      <section className="border-t border-[#3d3020] pt-5">
        <h2 className="font-serif text-2xl text-[#f6ecd8]">Reflection and entertainment</h2>
        <p className="mt-3 text-sm leading-7 text-[#c8bca6]">
          Ora Arcana provides AI-assisted tarot readings for reflection,
          entertainment, and personal insight. A reading can help you notice a
          pattern, but it should not be treated as a command.
        </p>
      </section>

      <section className="border-t border-[#3d3020] pt-5">
        <h2 className="font-serif text-2xl text-[#f6ecd8]">Not professional advice</h2>
        <p className="mt-3 text-sm leading-7 text-[#c8bca6]">
          Ora Arcana is not medical advice, legal advice, financial advice, or
          mental health treatment. It is not a substitute for qualified
          professional support.
        </p>
      </section>

      <section className="border-t border-[#3d3020] pt-5">
        <h2 className="font-serif text-2xl text-[#f6ecd8]">Not a guarantee</h2>
        <p className="mt-3 text-sm leading-7 text-[#c8bca6]">
          Tarot readings and AI responses are interpretive. They do not
          guarantee future outcomes, relationship results, career events, or
          any other specific result.
        </p>
      </section>

      <section className="border-t border-[#3d3020] pt-5">
        <h2 className="font-serif text-2xl text-[#f6ecd8]">Crisis and safety</h2>
        <p className="mt-3 text-sm leading-7 text-[#c8bca6]">
          If you are in immediate danger, experiencing a crisis, or considering
          harming yourself or others, contact local emergency services or a
          qualified crisis support professional immediately.
        </p>
      </section>

      <section className="border-t border-[#3d3020] pt-5">
        <h2 className="font-serif text-2xl text-[#f6ecd8]">Use your judgment</h2>
        <p className="mt-3 text-sm leading-7 text-[#c8bca6]">
          Treat a reading as a reflective lens. Your choices should still be
          grounded in real-world information, personal responsibility, and
          appropriate professional guidance when needed.
        </p>
      </section>
    </TrustPageShell>
  );
}
