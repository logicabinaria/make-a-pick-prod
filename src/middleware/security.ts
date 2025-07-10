import { NextResponse } from 'next/server';

// Ad provider domains that need to be allowed in CSP
const AD_DOMAINS = {
  ADSENSE: [
    'https://pagead2.googlesyndication.com',
    'https://googleads.g.doubleclick.net',
    'https://tpc.googlesyndication.com',
    'https://www.google.com',
    'https://www.gstatic.com',
    'https://www.googletagmanager.com',
    'https://ep1.adtrafficquality.google',
    'https://ep2.adtrafficquality.google',
    'https://www.google-analytics.com'
  ],
  EZOIC: [
    'https://www.ezoic.com',
    'https://go.ezoic.net',
    'https://g.ezoic.net'
  ],
  MONETAG: [
    'https://d2l1w2l8g4kswv.cloudfront.net',
    'https://monetag.com'
  ],
  ADSTERRA: [
    'https://pl20424136.profitablegatecpm.com',
    'https://adsterra.com'
  ]
};

// Get active ad provider from environment
function getActiveAdProvider(): string {
  return process.env.NEXT_PUBLIC_AD_PROVIDER || 'none';
}

// Generate CSP header based on active ad provider
function generateCSPHeader(): string {
  const activeProvider = getActiveAdProvider().toUpperCase();
  let allowedDomains: string[] = [];

  // Add domains based on active provider
  if (activeProvider === 'ADSENSE' && AD_DOMAINS.ADSENSE) {
    allowedDomains = [...allowedDomains, ...AD_DOMAINS.ADSENSE];
  } else if (activeProvider === 'EZOIC' && AD_DOMAINS.EZOIC) {
    allowedDomains = [...allowedDomains, ...AD_DOMAINS.EZOIC];
  } else if (activeProvider === 'MONETAG' && AD_DOMAINS.MONETAG) {
    allowedDomains = [...allowedDomains, ...AD_DOMAINS.MONETAG];
  } else if (activeProvider === 'ADSTERRA' && AD_DOMAINS.ADSTERRA) {
    allowedDomains = [...allowedDomains, ...AD_DOMAINS.ADSTERRA];
  }

  // Base CSP policy
  const basePolicy = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for ad scripts
      "'unsafe-eval'", // Some ad providers require eval
      ...allowedDomains
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for ad styles
      ...allowedDomains
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      ...allowedDomains
    ],
    'connect-src': [
      "'self'",
      ...allowedDomains
    ],
    'frame-src': [
      "'self'",
      ...allowedDomains
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"]
  };

  // Convert to CSP string
  return Object.entries(basePolicy)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
}

export function securityMiddleware() {
  const response = NextResponse.next();

  // Only apply CSP in production or when explicitly enabled
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_CSP === 'true') {
    const cspHeader = generateCSPHeader();
    response.headers.set('Content-Security-Policy', cspHeader);
  }

  // Additional security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}