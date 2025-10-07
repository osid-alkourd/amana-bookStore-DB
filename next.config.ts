import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  eslint: {
    // ✅ Allows Vercel to build even if ESLint errors exist
    ignoreDuringBuilds: true,
  },
  /* config options here */
};

export default nextConfig;
