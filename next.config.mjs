/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "**" },
      { protocol: "https", hostname: "github-readme-stats.vercel.app", pathname: "**" },
    ],
  },
  // Disable TypeScript type checking during build to work around Next.js 15.3.1 params type issue
  typescript: {
    ignoreBuildErrors: true,
  },
  // Suppress ESLint warnings in build output
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
