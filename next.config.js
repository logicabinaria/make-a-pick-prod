/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better mobile support
  experimental: {
    // optimizeCss: true, // Disabled due to missing critters dependency
  },
  
  // Optimize for mobile performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Headers for better mobile browser compatibility
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Mobile-specific headers
          {
            key: 'format-detection',
            value: 'telephone=no',
          },
        ],
      },
    ];
  },
  
  // PWA and mobile optimization
  async rewrites() {
    return [
      {
        source: '/manifest.json',
        destination: '/api/manifest',
      },
    ];
  },
};

module.exports = nextConfig;