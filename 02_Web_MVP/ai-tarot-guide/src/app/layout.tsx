import type { Metadata } from "next";
import { OraSymbols } from "@/components/ai-guide/OraSymbols";
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
  const themeScript = `
    (function() {
      try {
        var stored = window.localStorage.getItem("ora-theme");
        var theme = stored === "night" || stored === "day" ? stored : "day";
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme === "night" ? "dark" : "light";
      } catch (error) {
        document.documentElement.dataset.theme = "day";
        document.documentElement.style.colorScheme = "light";
      }
    })();
  `;

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Spectral:ital,wght@0,400;0,500;1,400&family=Noto+Serif+SC:wght@400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <OraSymbols />
        {children}
      </body>
    </html>
  );
}
