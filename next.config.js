/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Trailing slash for consistent URL handling
  trailingSlash: true,

  // Optimize images using Next.js built-in image optimization
  images: {
    domains: ["localhost"],
  },

  // Configure output for server-side rendering
  output: "standalone",

  // Experimental features
  experimental: {
    // These are the default experimental features in Next.js 14
    webpackBuildWorker: true,
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
  },
}

module.exports = nextConfig
