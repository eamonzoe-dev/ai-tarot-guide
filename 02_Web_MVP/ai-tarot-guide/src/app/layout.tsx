import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://oraarcana.com"),
  title: {
    default: "Ora Arcana",
    template: "%s | Ora Arcana",
  },
  description:
    "Ora Arcana is a mobile tarot reading companion for physical decks and online single-card readings.",
  openGraph: {
    title: "Ora Arcana",
    description:
      "A quiet tarot reading companion for physical decks and online single-card readings.",
    url: "https://oraarcana.com",
    siteName: "Ora Arcana",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Ora Arcana",
    description:
      "A quiet tarot reading companion for physical decks and online single-card readings.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
