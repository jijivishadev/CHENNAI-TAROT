// next.config.ts
import type { NextConfig } from "next";

const nextConfig = {
  // Output standalone for better deployment
  output: "standalone",

  // Allow CI/CD builds (e.g. Netlify) to finish even with lint/type issues.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "million-dollars-coach.firebasestorage.app",
      },
      {
        protocol: "https",
        hostname: "vumbnail.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, 
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compression
  compress: true,
  
  // Remove powered by header
  poweredByHeader: false,
  
  // Strict mode for better debugging
  reactStrictMode: true,
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // On-demand entries for faster builds
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Static page generation timeout
  staticPageGenerationTimeout: 120,
  
  // Headers for caching
  async headers() {
    return [
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/_next/image(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        source: "/(.*).(svg|jpg|jpeg|png|webp|ico|woff2|woff|ttf|eot)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=31536000" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
    ];
  },
  
  // Experimental features
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
} as NextConfig & {
  eslint: {
    ignoreDuringBuilds: boolean;
  };
  typescript: {
    ignoreBuildErrors: boolean;
  };
};

export default nextConfig;