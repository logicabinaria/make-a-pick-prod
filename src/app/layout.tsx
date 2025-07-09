import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { ADSENSE_CONFIG, EZOIC_CONFIG, MONETAG_CONFIG } from "@/config/ads";
import "./globals.css";

export const metadata: Metadata = {
  title: "Make a Pick - Random Decision Maker",
  description: "A privacy-focused app to help you make random decisions from your custom options. Available in English and Bangla.",
  keywords: "decision maker, random picker, choice selector, privacy-focused",
  authors: [{ name: "Make a Pick" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Make a Pick",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "google-adsense-account": "ca-pub-6150853912343151",
    ...(MONETAG_CONFIG.isActive && { "monetag": MONETAG_CONFIG.metaContent }),
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Make a Pick",
    "application-name": "Make a Pick",
    "msapplication-TileColor": "#16a34a",
    "theme-color": "#16a34a",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BQ0B5JQXSG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BQ0B5JQXSG');
          `}
        </Script>

        {/* Ezoic Privacy Scripts - Load first for GDPR compliance */}
        {EZOIC_CONFIG.isActive && (
          <>
            {EZOIC_CONFIG.privacyScripts.map((src, index) => (
              <Script
                key={`ezoic-privacy-${index}`}
                src={src}
                strategy="beforeInteractive"
                data-cfasync="false"
              />
            ))}
          </>
        )}
        
        {/* Ezoic Header Script */}
        {EZOIC_CONFIG.isActive && (
          <>
            <Script
              async
              src={EZOIC_CONFIG.headerScript}
              strategy="afterInteractive"
            />
            <Script
              id="ezoic-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.ezstandalone = window.ezstandalone || {};
                  ezstandalone.cmd = ezstandalone.cmd || [];
                `
              }}
            />
          </>
        )}

        {/* Google AdSense - Only load if configured and active */}
        {ADSENSE_CONFIG.isActive && (
          <Script
            async
            src={ADSENSE_CONFIG.scriptUrl}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        
        {/* Service Worker for mobile performance */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
