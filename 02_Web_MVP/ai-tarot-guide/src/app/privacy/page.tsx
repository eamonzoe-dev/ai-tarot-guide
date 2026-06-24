import type { Metadata } from "next";

import { TrustPageShell } from "@/components/ai-guide/TrustPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy | Ora Arcana",
  description: "How Ora Arcana handles account, deck code, credit, and reading log data.",
};

export default function PrivacyPage() {
  return (
    <TrustPageShell
      eyebrow="Trust"
      title="Privacy Policy"
      description="This page explains the basic information Ora Arcana may collect and how it is used to provide the reading experience."
    >
      <section className="border-t border-[var(--c-border)] pt-5">
        <h2 className="t-h3">What we collect</h2>
        <p className="caption mt-3">
          Ora Arcana uses email-based sign in. We may store your account
          identifier, email address, deck activation status, AI reading credit
          balance, and related credit events.
        </p>
      </section>

      <section className="border-t border-[var(--c-border)] pt-5">
        <h2 className="t-h3">Reading logs</h2>
        <p className="caption mt-3">
          If you generate an AI reading, Ora Arcana may save a reading log for
          your account. Reading logs can include your question, the card drawn,
          the reading mode, language, and the AI reading result.
        </p>
      </section>

      <section className="border-t border-[var(--c-border)] pt-5">
        <h2 className="t-h3">How data is used</h2>
        <p className="caption mt-3">
          We use this information to keep you signed in, redeem deck codes,
          track available AI readings, show your saved reading history, improve
          reliability, and protect the service from abuse.
        </p>
      </section>

      <section className="border-t border-[var(--c-border)] pt-5">
        <h2 className="t-h3">Third-party services</h2>
        <p className="caption mt-3">
          Ora Arcana may rely on third-party infrastructure such as hosting,
          database, authentication, analytics, and AI service providers. These
          providers process data only as needed to operate the product.
        </p>
      </section>

      <section className="border-t border-[var(--c-border)] pt-5">
        <h2 className="t-h3">Your choices</h2>
        <p className="caption mt-3">
          We do not sell personal data. You can contact us to request account
          or data deletion. Some records may be retained temporarily if needed
          for security, fraud prevention, or legal obligations.
        </p>
      </section>
    </TrustPageShell>
  );
}
