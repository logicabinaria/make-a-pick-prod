import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { ADSENSE_CONFIG, EZOIC_CONFIG, MONETAG_CONFIG } from "@/config/ads";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAKE A PICK - Random Decision Maker",
  description: "A privacy-focused app to help you make random decisions from your custom options. Available in English and Bangla.",
  keywords: "decision maker, random picker, choice selector, privacy-focused",
  authors: [{ name: "MAKE A PICK" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MAKE A PICK",
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
    "apple-mobile-web-app-title": "MAKE A PICK",
    "application-name": "MAKE A PICK",
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
            {EZOIC_CONFIG.privacyScripts?.map((src, index) => (
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
            id="google-adsense"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  var script = document.createElement('script');
                  script.async = true;
                  script.src = '${ADSENSE_CONFIG.scriptUrl}';
                  script.crossOrigin = 'anonymous';
                  document.head.appendChild(script);
                })();
              `
            }}
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
        
        {/* Ad Refresh Manager Initialization */}
        <Script
          id="ad-refresh-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize ad refresh manager when page loads
              window.addEventListener('load', function() {
                // Import and setup ad refresh manager
                import('/src/utils/adRefresh').then(module => {
                  if (module.setupAdAutoRefresh) {
                    module.setupAdAutoRefresh();
                    console.log('Ad refresh manager initialized');
                  }
                }).catch(err => {
                  console.warn('Failed to load ad refresh manager:', err);
                });
              });
            `
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
