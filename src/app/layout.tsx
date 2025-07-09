import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { ADSENSE_CONFIG } from "@/config/adsense";
import "./globals.css";

export const metadata: Metadata = {
  title: "Make a Pick - Random Decision Maker",
  description: "A privacy-focused app to help you make random decisions from your custom options. Available in English and Bangla.",
  keywords: "decision maker, random picker, choice selector, privacy-focused",
  authors: [{ name: "Make a Pick" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google AdSense - Only load if configured */}
        {ADSENSE_CONFIG.isConfigured && (
          <Script
            async
            src={ADSENSE_CONFIG.scriptUrl}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
