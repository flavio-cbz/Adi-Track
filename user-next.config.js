/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Trailing slash for consistent URL handling
  trailingSlash: true,

  // Optimize images using Next.js built-in image optimization
  images: {
    domains: ["localhost"],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Configure output for server-side rendering
  output: "standalone",

  // Optimize package imports for better performance
  optimizePackageImports: ["lucide-react"],

  // Experimental features
  experimental: {
    // These are the default experimental features in Next.js 14
    webpackBuildWorker: true,
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
    // Add optimizations for production builds
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Enable SWC minification for faster builds
  swcMinify: true,
}

module.exports = nextConfig
