/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Cloudflare Pages
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },
  
  // Configure trailing slash behavior
  trailingSlash: true,
  
  // Skip build-time type checking (will be done in CI/CD)
  typescript: {
    ignoreBuildErrors: false
  },
  
  // Skip ESLint during build (will be done in CI/CD)
  eslint: {
    ignoreDuringBuilds: false
  },
  
  // Configure asset prefix for CDN if needed
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
  
  // Experimental features for better performance
  // experimental: {
  //   optimizeCss: true // Disabled due to critters dependency issue
  // }
};

export default nextConfig;
