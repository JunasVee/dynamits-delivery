import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // This will bypass ESLint checks during build
  },
  typescript: {
    ignoreBuildErrors: true, // This will bypass TypeScript errors during build
  },
};

export default nextConfig;