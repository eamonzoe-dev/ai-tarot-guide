import type { Metadata } from "next";
import Script from "next/script";
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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <Script
          id="ora-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='ora-theme',s=localStorage.getItem(k),sys=matchMedia('(prefers-color-scheme: dark)').matches?'night':'day';document.documentElement.setAttribute('data-theme',s||sys);}catch(e){document.documentElement.setAttribute('data-theme','day');}})();`,
          }}
        />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- app/layout.tsx applies site-wide, unlike pages/_document.js */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=Spectral:ital,wght@0,400;1,400&family=Noto+Serif+SC:wght@400;500;600&family=Noto+Sans+SC:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
