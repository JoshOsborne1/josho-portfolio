import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ESLint runs in CI — skip during `next build` for faster deploys
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type errors caught in IDE — skip redundant build-time check
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
